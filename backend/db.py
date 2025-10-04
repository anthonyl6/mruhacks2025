from os import getenv
from pymongo import MongoClient


# def get_block_list():
#    client = MongoClient(CONNECTION_STRING)
#    return client["blocklist"]


# Main database
def get_database():
   client = MongoClient(getenv("MONGODB_URL"))
   return client["users"]

# Collections
def get_auth_collection():
   dbname = get_database()
   collection_name = dbname["auth"]
   return collection_name

def get_details_collection():
   dbname = get_database()
   collection_name = dbname["details"]
   return collection_name

# Actions
def init_new_user(user):
   return get_details_collection().insert_one({
      "username": user,
      "balance": 0
   })

def create_session(user, access_token):
   # TODO: Revoke previous session
   
   status = get_auth_collection().insert_one({"username": user["username"], "password": user["password"], "session": access_token})
   if status:
      return access_token
   else:
      return None

def get_user(username):
   return get_auth_collection().find_one({"username": username})

def insert_user(username, hash):
   return get_auth_collection().insert_one({"username": username, "password": hash, "session": None})

def get_user_details(user):
   return get_details_collection().find_one({"username": user})