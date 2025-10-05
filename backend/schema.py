from mongoengine import Document, StringField, FloatField, DateTimeField, ReferenceField, BooleanField, ListField, connect
from datetime import datetime
from os import getenv

# Connect to MongoDB
connect(db="mojo", host=getenv("MONGODB_URL"))

# Plaid class
class PlaidItems(Document):
    username = StringField(required=True)
    item_id = StringField()
    access_token = StringField()
    institution_id = StringField()
    institution_name = StringField()
    status = BooleanField()
    #products = ListField()
    date_connected = DateTimeField(default=datetime.now)

class User(Document):
    username = StringField(required=True, max_length=100)
    password = StringField(required=True, max_length=100)
    balance = FloatField(required=True)
    sessions = ListField(StringField())
    created_at = DateTimeField(default=datetime.now)
    link_tokens = ListField(StringField())
    plaid_items = ListField(ReferenceField(PlaidItems))

class Payment(Document):
    sender_username = User()
    reciever_username = User()
    amount = FloatField(required=True)
    completed = BooleanField(required=True)
    asccount = PlaidItems()

def check_db_connection():
    print(getenv("MONGODB_URL"))
    print(User.objects)


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
        "balance": user.balance
    }

def check_plaid_item_id(user, item_id):
    try:
        plaid_items = user.plaid_items
        for p in plaid_items:
            if p.item_id == item_id:
                return True
    except:
        pass

    return False