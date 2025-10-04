from pymongo import MongoClient

CONNECTION_STRING = "mongodb://localhost:27017/"

# def get_block_list():
#    client = MongoClient(CONNECTION_STRING)
#    return client["blocklist"]


def get_database():
   client = MongoClient(CONNECTION_STRING)
   return client["users"]
  
# This is added so that many files can reuse the function get_database()

def get_auth_collection():
    dbname = get_database()
    collection_name = dbname["auth"]
    return collection_name

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