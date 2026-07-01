import asyncio
import logging
import sys
import os
from datetime import datetime

# Ensure root folder is in python path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from backend.database.session import async_session_maker, engine
from backend.database.init_db import init_db
from backend.core.security import get_password_hash
from backend.models import User, Location, ScamPattern, Complaint, Evidence, Transaction, PhoneNumber, Device

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

async def seed_relational_data(session: AsyncSession) -> None:
    logger.info("Seeding locations...")
    locations = [
        Location(name="Mumbai Cyber Cell", state="Maharashtra", district_code="MUM-CC", latitude=19.0760, longitude=72.8777),
        Location(name="Delhi Cyber Cell", state="Delhi", district_code="DEL-CC", latitude=28.7041, longitude=77.1025),
        Location(name="Bengaluru Cyber Crime", state="Karnataka", district_code="BLR-CC", latitude=12.9716, longitude=77.5946),
        Location(name="Hyderabad Crime Branch", state="Telangana", district_code="HYD-CC", latitude=17.3850, longitude=78.4867),
        Location(name="Pune Cyber Cell", state="Maharashtra", district_code="PUN-CC", latitude=18.5204, longitude=73.8567),
    ]
    for loc in locations:
        q = await session.execute(select(Location).filter_by(name=loc.name))
        if not q.scalars().first():
            session.add(loc)

    logger.info("Seeding scam patterns...")
    patterns = [
        ScamPattern(name="Digital Arrest", description="Scammers impersonating police/government agents over video calls claiming the victim is under digital arrest.", severity_level="high"),
        ScamPattern(name="Bank Fraud", description="Phishing links and text messages designed to look like official bank alerts to siphon login credentials.", severity_level="high"),
        ScamPattern(name="UPI Fraud", description="Collect-request scams where victims are tricked into typing their UPI PIN to receive money.", severity_level="medium"),
        ScamPattern(name="OTP Scam", description="Social engineering to extract login or transaction OTPs under false pretenses.", severity_level="high"),
        ScamPattern(name="Lottery Scam", description="Spam messages offering cash awards or lucky draws that require processing fees.", severity_level="low"),
    ]
    for pattern in patterns:
        q = await session.execute(select(ScamPattern).filter_by(name=pattern.name))
        if not q.scalars().first():
            session.add(pattern)

    logger.info("Seeding users...")
    users = [
        User(email="admin@fraudshield.ai", hashed_password=get_password_hash("AdminPassword123"), full_name="System Administrator", role="admin"),
        User(email="officer@fraudshield.ai", hashed_password=get_password_hash("PolicePassword123"), full_name="Inspector Amit Sharma", role="police", district="Mumbai Cyber Cell"),
        User(email="citizen@fraudshield.ai", hashed_password=get_password_hash("CitizenPassword123"), full_name="Rahul Verma", role="citizen"),
    ]
    for u in users:
        q = await session.execute(select(User).filter_by(email=u.email))
        if not q.scalars().first():
            session.add(u)
            
    await session.commit()

    # Re-fetch models to link them
    q_loc = await session.execute(select(Location).filter_by(name="Mumbai Cyber Cell"))
    mumbai_loc = q_loc.scalars().first()
    
    q_pattern = await session.execute(select(ScamPattern).filter_by(name="Digital Arrest"))
    digital_arrest_pattern = q_pattern.scalars().first()
    
    q_pattern_bank = await session.execute(select(ScamPattern).filter_by(name="Bank Fraud"))
    bank_fraud_pattern = q_pattern_bank.scalars().first()

    q_user = await session.execute(select(User).filter_by(email="citizen@fraudshield.ai"))
    citizen_user = q_user.scalars().first()

    logger.info("Seeding complaints and evidence...")
    # Complaint 1: Digital Arrest Scam
    q_comp = await session.execute(select(Complaint).filter_by(title="Digital Arrest Threat Call"))
    if not q_comp.scalars().first():
        complaint1 = Complaint(
            user_id=citizen_user.id if citizen_user else None,
            title="Digital Arrest Threat Call",
            description="Received a call on WhatsApp from a person claiming to be a CBI officer. He said my Aadhaar card was linked to a money laundering case in Mumbai and threatened to arrest me unless I transferred money. He kept me on camera for 3 hours in a 'digital arrest'.",
            scam_pattern_id=digital_arrest_pattern.id if digital_arrest_pattern else None,
            location_id=mumbai_loc.id if mumbai_loc else None,
            status="investigating",
            reporter_phone="+919811223344",
            reporter_email="rahul.verma@example.com",
            suspect_phone="+919876543210",
            suspect_upi="cbi-agent@ybl",
            suspect_bank_account="9988771122",
            suspect_device_id="IMEI-869234059128340",
            suspect_ip="192.168.1.105",
            risk_score=92.5
        )
        session.add(complaint1)
        await session.commit()

        # Add evidence
        evidence1 = Evidence(
            complaint_id=complaint1.id,
            file_type="audio",
            file_path="/uploads/digital_arrest_recording.mp3",
            extracted_text="You are under digital arrest. Do not call anyone or look away from the camera. Transfer fifty thousand rupees to the verification account now.",
            analysis_results={"silero_vad": "voice_detected", "whisper_confidence": 0.94}
        )
        session.add(evidence1)

        # Add transaction
        transaction1 = Transaction(
            complaint_id=complaint1.id,
            amount=50000.00,
            sender_bank="HDFC Bank",
            receiver_bank="State Bank of India",
            receiver_upi="cbi-agent@ybl",
            transaction_time=datetime.utcnow(),
            transaction_reference="TXN102938475"
        )
        session.add(transaction1)
        await session.commit()

    # Complaint 2: Bank Phishing SMS
    q_comp2 = await session.execute(select(Complaint).filter_by(title="Fake SBI Bank Alert Phishing"))
    if not q_comp2.scalars().first():
        complaint2 = Complaint(
            user_id=citizen_user.id if citizen_user else None,
            title="Fake SBI Bank Alert Phishing",
            description="Received an SMS stating that my bank account is blocked. It asked me to update my PAN card details by clicking on the link http://secure-sbi-login.net.",
            scam_pattern_id=bank_fraud_pattern.id if bank_fraud_pattern else None,
            location_id=mumbai_loc.id if mumbai_loc else None,
            status="pending",
            reporter_phone="+919811223344",
            reporter_email="rahul.verma@example.com",
            suspect_phone="+919988776655",
            suspect_device_id="IMEI-869234059128340", # shared device
            risk_score=85.0
        )
        session.add(complaint2)
        await session.commit()

        # Add evidence
        evidence2 = Evidence(
            complaint_id=complaint2.id,
            file_type="image",
            file_path="/uploads/sbi_phishing_sms.jpg",
            extracted_text="Dear Customer, Your SBI Account has been blocked today. Please click http://secure-sbi-login.net to update PAN Card.",
            analysis_results={"ocr_engine": "paddleocr", "phishing_links": ["http://secure-sbi-login.net"]}
        )
        session.add(evidence2)
        await session.commit()

    logger.info("Seeding phone numbers and devices indices...")
    phones = [
        PhoneNumber(phone_number="+919876543210", risk_level="critical", is_scam=True, reported_count=5),
        PhoneNumber(phone_number="+919988776655", risk_level="high", is_scam=True, reported_count=2),
    ]
    for p in phones:
        q = await session.execute(select(PhoneNumber).filter_by(phone_number=p.phone_number))
        if not q.scalars().first():
            session.add(p)

    devices = [
        Device(device_identifier="IMEI-869234059128340", device_model="Xiaomi Redmi Note 10", is_scam=True, reported_count=3)
    ]
    for d in devices:
        q = await session.execute(select(Device).filter_by(device_identifier=d.device_identifier))
        if not q.scalars().first():
            session.add(d)

    await session.commit()

def seed_neo4j_data() -> None:
    """Attempts to connect to Neo4j and seed nodes and relationships."""
    from neo4j import GraphDatabase
    
    uri = os.environ.get("NEO4J_URI", "bolt://localhost:7687")
    user = os.environ.get("NEO4J_USER", "neo4j")
    password = os.environ.get("NEO4J_PASSWORD", "password123")
    
    logger.info(f"Attempting to seed Neo4j at {uri}...")
    try:
        driver = GraphDatabase.driver(uri, auth=(user, password))
        with driver.session() as session:
            # Clear graph
            session.run("MATCH (n) DETACH DELETE n")
            
            # Create Victims
            session.run("CREATE (:Victim {name: 'Rahul Verma', phone: '+919811223344', email: 'rahul.verma@example.com'})")
            
            # Create Suspect Phones, Devices, UPIs, IPs
            session.run("CREATE (:Phone {number: '+919876543210', reports: 5})")
            session.run("CREATE (:Phone {number: '+919988776655', reports: 2})")
            session.run("CREATE (:Device {identifier: 'IMEI-869234059128340', model: 'Xiaomi Redmi Note 10'})")
            session.run("CREATE (:UPI {address: 'cbi-agent@ybl'})")
            session.run("CREATE (:IP {address: '192.168.1.105'})")
            
            # Create Relationships
            # Victim was called by phone numbers
            session.run("MATCH (p:Phone {number: '+919876543210'}), (v:Victim {name: 'Rahul Verma'}) CREATE (p)-[:CALLED]->(v)")
            session.run("MATCH (p:Phone {number: '+919988776655'}), (v:Victim {name: 'Rahul Verma'}) CREATE (p)-[:CALLED]->(v)")
            
            # Victim transferred to UPI
            session.run("MATCH (v:Victim {name: 'Rahul Verma'}), (u:UPI {address: 'cbi-agent@ybl'}) CREATE (v)-[:TRANSFERRED {amount: 50000}]->(u)")
            
            # Phones are connected to the same device
            session.run("MATCH (p:Phone {number: '+919876543210'}), (d:Device {identifier: 'IMEI-869234059128340'}) CREATE (p)-[:CONNECTED]->(d)")
            session.run("MATCH (p:Phone {number: '+919988776655'}), (d:Device {identifier: 'IMEI-869234059128340'}) CREATE (p)-[:CONNECTED]->(d)")
            
            # Victim logged in/transferred from IP or connected from IP
            session.run("MATCH (p:Phone {number: '+919876543210'}), (i:IP {address: '192.168.1.105'}) CREATE (p)-[:CONNECTED]->(i)")
            
        logger.info("Neo4j database seeded successfully.")
        driver.close()
    except Exception as e:
        logger.warning(f"Skipping Neo4j seed because connection failed: {e}")
        logger.warning("This is expected if the Neo4j container is not running.")

async def main():
    logger.info("Starting relational database migration & schema setup...")
    await init_db()
    
    logger.info("Starting database seeding...")
    async with async_session_maker() as session:
        await seed_relational_data(session)
    logger.info("PostgreSQL database seeded successfully.")
    
    # Run Neo4j Seeding
    seed_neo4j_data()

if __name__ == "__main__":
    asyncio.run(main())
