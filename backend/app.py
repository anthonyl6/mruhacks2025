from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
from auth import auth_bp
from account_details import account_bp
from payments import payments_bp
from os import getenv
from datetime import timedelta
from schema import check_db_connection

ACCESS_EXPIRES = timedelta(hours=1)


load_dotenv()

app = Flask(__name__)
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(account_bp, url_prefix="/account")
app.register_blueprint(payments_bp, url_prefix="/payments")
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"], "allow_headers": "*"}})


app.config["JWT_SECRET_KEY"] = getenv("SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = ACCESS_EXPIRES

jwt = JWTManager(app)

check_db_connection()

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

if __name__ == "__main__":
    app.run(debug=True)