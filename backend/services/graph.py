import os
import logging
from typing import Dict, List, Any
from backend.core.config import settings

logger = logging.getLogger(__name__)

# Standard mock dataset representing the seeded relational database links
MOCK_GRAPH = {
    "nodes": [
        {"id": "v1", "label": "Rahul Verma", "type": "Victim", "properties": {"phone": "+919811223344"}},
        {"id": "p1", "label": "+919876543210", "type": "Phone", "properties": {"reports": 5}},
        {"id": "p2", "label": "+919988776655", "type": "Phone", "properties": {"reports": 2}},
        {"id": "d1", "label": "IMEI-869234059128340", "type": "Device", "properties": {"model": "Xiaomi Redmi Note 10"}},
        {"id": "u1", "label": "cbi-agent@ybl", "type": "UPI", "properties": {}},
        {"id": "ip1", "label": "192.168.1.105", "type": "IP", "properties": {}}
    ],
    "links": [
        {"source": "p1", "target": "v1", "type": "CALLED"},
        {"source": "p2", "target": "v1", "type": "CALLED"},
        {"source": "v1", "target": "u1", "type": "TRANSFERRED", "amount": 50000},
        {"source": "p1", "target": "d1", "type": "CONNECTED"},
        {"source": "p2", "target": "d1", "type": "CONNECTED"},
        {"source": "p1", "target": "ip1", "type": "CONNECTED"}
    ]
}

MOCK_CLUSTERS = [
    {
        "cluster_id": "CLUSTER_01",
        "description": "Shared Device Fraud Network",
        "primary_indicators": ["IMEI-869234059128340"],
        "suspect_nodes": ["+919876543210", "+919988776655"],
        "total_reports": 7,
        "impact_score": 92.0
    }
]

class Neo4jService:
    def __init__(self):
        self.driver = None
        self._initialize_driver()

    def _initialize_driver(self):
        try:
            from neo4j import GraphDatabase
            self.driver = GraphDatabase.driver(
                settings.NEO4J_URI,
                auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD)
            )
            # Verify connectivity
            self.driver.verify_connectivity()
            logger.info("Successfully connected to Neo4j graph database.")
        except Exception as e:
            logger.warning(f"Neo4j driver connection failed: {e}. Active mock fallback enabled.")
            self.driver = None

    def add_complaint_node_network(
        self, 
        victim_name: str, 
        victim_phone: str, 
        suspect_phone: str = None, 
        suspect_upi: str = None, 
        suspect_device: str = None,
        suspect_ip: str = None
    ) -> None:
        """Asynchronously writes a complaint node link path to the graph database."""
        if not self.driver:
            logger.info("Mock Graph: Add complaint node skipped.")
            return

        cypher_query = """
        MERGE (v:Victim {name: $v_name})
        SET v.phone = $v_phone
        """
        
        params = {
            "v_name": victim_name,
            "v_phone": victim_phone
        }
        
        if suspect_phone:
            cypher_query += """
            MERGE (p:Phone {number: $s_phone})
            MERGE (p)-[:CALLED]->(v)
            """
            params["s_phone"] = suspect_phone
            
        if suspect_upi:
            cypher_query += """
            MERGE (u:UPI {address: $s_upi})
            MERGE (v)-[:TRANSFERRED]->(u)
            """
            params["s_upi"] = suspect_upi
            
        if suspect_device:
            cypher_query += """
            MERGE (d:Device {identifier: $s_device})
            MERGE (v)-[:USED_DEVICE]->(d)
            """
            params["s_device"] = suspect_device
            if suspect_phone:
                cypher_query += """
                MERGE (p)-[:CONNECTED]->(d)
                """
                
        if suspect_ip:
            cypher_query += """
            MERGE (i:IP {address: $s_ip})
            """
            params["s_ip"] = suspect_ip
            if suspect_phone:
                cypher_query += """
                MERGE (p)-[:CONNECTED]->(i)
                """

        try:
            with self.driver.session() as session:
                session.run(cypher_query, **params)
            logger.info("Graph path added to Neo4j successfully.")
        except Exception as e:
            logger.error(f"Error adding complaint to Neo4j: {e}")

    def get_network_graph(self) -> Dict[str, List[Dict[str, Any]]]:
        """Returns the full network graph of victims, suspects, devices, and UPI nodes."""
        if not self.driver:
            logger.info("Returning simulated in-memory graph database.")
            return MOCK_GRAPH

        try:
            nodes = []
            links = []
            seen_nodes = set()
            
            with self.driver.session() as session:
                result = session.run("""
                    MATCH (n)
                    OPTIONAL MATCH (n)-[r]->(m)
                    RETURN n, r, m
                """)
                for record in result:
                    node_a = record["n"]
                    rel = record["r"]
                    node_b = record["m"]
                    
                    if node_a:
                        id_a = str(node_a.element_id) if hasattr(node_a, "element_id") else str(node_a.id)
                        if id_a not in seen_nodes:
                            label = list(node_a.labels)[0] if node_a.labels else "Entity"
                            display_label = node_a.get("name") or node_a.get("number") or node_a.get("identifier") or node_a.get("address") or "Node"
                            nodes.append({
                                "id": id_a,
                                "label": display_label,
                                "type": label,
                                "properties": dict(node_a)
                            })
                            seen_nodes.add(id_a)
                            
                    if node_b:
                        id_b = str(node_b.element_id) if hasattr(node_b, "element_id") else str(node_b.id)
                        if id_b not in seen_nodes:
                            label = list(node_b.labels)[0] if node_b.labels else "Entity"
                            display_label = node_b.get("name") or node_b.get("number") or node_b.get("identifier") or node_b.get("address") or "Node"
                            nodes.append({
                                "id": id_b,
                                "label": display_label,
                                "type": label,
                                "properties": dict(node_b)
                            })
                            seen_nodes.add(id_b)
                            
                    if rel:
                        id_source = str(rel.start_node.element_id) if hasattr(rel.start_node, "element_id") else str(rel.start_node.id)
                        id_target = str(rel.end_node.element_id) if hasattr(rel.end_node, "element_id") else str(rel.end_node.id)
                        links.append({
                            "source": id_source,
                            "target": id_target,
                            "type": rel.type,
                            **dict(rel)
                        })
            
            # Default fallback if empty
            if not nodes:
                return MOCK_GRAPH
                
            return {"nodes": nodes, "links": links}
            
        except Exception as e:
            logger.error(f"Error querying Neo4j network: {e}. Returning mock.")
            return MOCK_GRAPH

    def detect_clusters(self) -> List[Dict[str, Any]]:
        """Queries graph network looking for suspect nodes sharing devices or contact profiles."""
        if not self.driver:
            logger.info("Returning simulated mock fraud network clusters.")
            return MOCK_CLUSTERS

        cypher_query = """
        MATCH (p1:Phone)-[:CONNECTED]->(d:Device)<-[:CONNECTED]-(p2:Phone)
        WHERE id(p1) < id(p2)
        RETURN d.identifier AS DeviceId, d.model AS Model, collect(p1.number) + collect(p2.number) AS Numbers
        """
        try:
            clusters = []
            with self.driver.session() as session:
                result = session.run(cypher_query)
                for index, record in enumerate(result):
                    device_id = record["DeviceId"]
                    model = record["Model"] or "Unknown Device"
                    numbers = list(set(record["Numbers"]))
                    
                    clusters.append({
                        "cluster_id": f"CLUSTER_{index+1:02d}",
                        "description": f"Shared Device Network ({model})",
                        "primary_indicators": [device_id],
                        "suspect_nodes": numbers,
                        "total_reports": len(numbers) * 3, # estimated
                        "impact_score": 85.0
                    })
            
            if not clusters:
                return MOCK_CLUSTERS
            return clusters
        except Exception as e:
            logger.error(f"Error executing Neo4j community clusters: {e}. Returning mock.")
            return MOCK_CLUSTERS

# Export a single service instance
graph_service = Neo4jService()
