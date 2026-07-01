import logging
from backend.services.graph import graph_service
from backend.schemas.analyze import AgentPrediction

logger = logging.getLogger(__name__)

async def analyze_fraud_network_node(suspect_identifier: str) -> AgentPrediction:
    """Agent 4 checks the graph DB to evaluate if a suspect node belongs to a fraud network."""
    logger.info(f"Agent 4 (Network Agent) checking graph connections for: {suspect_identifier}")
    
    # Retrieve full graph context
    graph = graph_service.get_network_graph()
    
    # Scan connections for the suspect identifier
    connections = []
    shared_devices = []
    associated_victims = []
    
    # Search nodes
    suspect_node_id = None
    for node in graph["nodes"]:
        if node["label"] == suspect_identifier:
            suspect_node_id = node["id"]
            break
            
    if suspect_node_id:
        # Find links connected to this suspect
        for link in graph["links"]:
            if link["source"] == suspect_node_id or link["target"] == suspect_node_id:
                other_node_id = link["target"] if link["source"] == suspect_node_id else link["source"]
                # Look up node type
                other_node = next((n for n in graph["nodes"] if n["id"] == other_node_id), None)
                if other_node:
                    connections.append(other_node)
                    if other_node["type"] == "Victim":
                        associated_victims.append(other_node["label"])
                    elif other_node["type"] == "Device":
                        shared_devices.append(other_node["label"])
                        
    # If the suspect exists in the database and has multiple links
    if connections:
        total_reports = len(associated_victims)
        # Degree centrality risk multiplier
        risk_score = 50.0 + (len(connections) * 15.0)
        risk_score = min(risk_score, 99.0)
        
        reasoning = (
            f"Graph analysis determined suspect identifier '{suspect_identifier}' has high node degree centrality. "
            f"Connected to {len(associated_victims)} victims: {', '.join(associated_victims)}. "
        )
        if shared_devices:
            reasoning += f"Shares physical device(s) {', '.join(shared_devices)} with other flagged scam lines."
            
        recommendation = (
            "Flag this identifier across all bank and telecom gateway filters. "
            "Initiate immediate police investigation to trace the shared device IMEI/MAC address."
        )
        
        return AgentPrediction(
            risk_score=risk_score,
            confidence=0.90,
            reasoning=reasoning,
            recommendation=recommendation,
            evidence={
                "suspect": suspect_identifier,
                "connections_count": len(connections),
                "associated_victims": associated_victims,
                "shared_devices": shared_devices
            },
            category="Fraud Network"
        )
        
    # Return default low risk prediction if identifier is clean or not found
    return AgentPrediction(
        risk_score=15.0,
        confidence=0.70,
        reasoning=f"No graph intelligence records found linking '{suspect_identifier}' to active scam complaints or shared suspect devices.",
        recommendation="Continue to monitor this entity during standard verification procedures.",
        evidence={"suspect": suspect_identifier, "connections_count": 0},
        category="Legitimate"
    )
