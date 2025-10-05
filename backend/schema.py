from mongoengine import Document, StringField, FloatField, DateTimeField, ReferenceField, BooleanField, ListField, connect
from datetime import datetime
from os import getenv

# Connect to MongoDB
connect(db="mojo", host=getenv("MONGODB_URL"))

class Payment(Document):
    sender_username = StringField(required=True)
    reciever_username = StringField(required=True)
    amount = FloatField(required=True)
    completed = BooleanField(required=True, default=False)
    acknowledge = BooleanField(required=True, default=False)

class User(Document):
    username = StringField(required=True, max_length=100)
    password = StringField(required=True, max_length=100)
    balance = FloatField(required=True)
    sessions = ListField(StringField())
    transactions = ListField(ReferenceField(Payment))
    contacts = ListField(StringField())
    created_at = DateTimeField(default=datetime.now)

def create_user(username, password) -> User:
    user = User(username=username, password=password, balance=0.0)
    return user.save()

def search_user(username) -> User:
    try:
        return User.objects.get(username=username)
    except:
        return None
    
def create_session(username, access_token):
    try:
        user = User.objects.get(username=username)
        user.sessions.append(access_token)
        user.save()

        return access_token
    except Exception as e:
        print(e)
        return None
    
def get_user_details(username):
    user = search_user(username)

    if not user:
        return None

    return {
        "username": user.username,
        "balance": user.balance,
        "transactions": user.transactions
    }