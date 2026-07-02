from app.database import SessionLocal
from app.user_models import User
from app.auth import hash_password

db = SessionLocal()

users = [
    {
        "username": "admin",
        "email": "admin@test.com",
        "password": "admin123",
        "role": "Admin"
    },
    {
        "username": "security2",
        "email": "security2@test.com",
        "password": "security123",
        "role": "Security"
    },
    {
        "username": "analyst3",
        "email": "analyst3@test.com",
        "password": "analyst123",
        "role": "Analyst"
    }
]

for u in users:

    existing = db.query(User).filter(User.username == u["username"]).first()

    if existing:
        print(f"{u['username']} already exists")
        continue

    user = User(
        username=u["username"],
        email=u["email"],
        password=hash_password(u["password"]),
        role=u["role"]
    )

    db.add(user)

db.commit()
db.close()

print("Users created successfully.")