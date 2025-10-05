from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from schema import Payment, search_user
from datetime import datetime

payments_bp = Blueprint('payments', __name__, template_folder='templates')


def transfer_money(sender, reciever, amount):
    try:
        sender.balance -= amount
        sender.save()

        reciever.balance += amount
        reciever.save()
    except Exception as e:
        print(e)
        return False

    return True


@payments_bp.route('/inbox', methods=['GET'])
@jwt_required()
def inbox():
    in_progress = Payment.objects(acknowledge=False)

    if not in_progress:
        return jsonify({"message": "No transactions!"}), 200
    
    transactions = []
    for i in in_progress:
        transactions.append({
            "transaction_id": i.id,
            "sender": i.sender_username,
            "reciever": i.reciever_username,
            "amount": i.amount
        })
    
    return jsonify({"message": "Found transactions!", "transactions": str(transactions)}), 200


@payments_bp.route('/confirm', methods=['POST'])
@jwt_required()
def confirm_transaction():
    if request.method != 'POST':
        return jsonify({"message": "POST only!"}), 405
    
    if "transaction_id" not in request.json or "confirm" not in request.json:
        return jsonify({"message": "Provide a transaction ID and a confirm status!"}), 403
    
    transaction_id = request.json["transaction_id"]
    confirm = request.json["confirm"]
    username = get_jwt_identity()

    # Make sure the one requesting confirm is the sender
    try:
        transaction = Payment.objects.get(id=transaction_id, sender_username=username)
    except:
        return jsonify({"message": "nuh!"}), 403

    if not transaction:
        return jsonify({"message": "Invalid transaction ID!"}), 403
    
    if confirm == "true":
        sender = search_user(transaction.sender_username)
        reciever = search_user(transaction.reciever_username)
        status = transfer_money(sender, reciever, transaction.amount)
        if not status:
            return jsonify({"message": "Error sending transaction!"}), 405
        
        transaction.completed = True


    transaction.acknowledge = True
    transaction.save()

    return jsonify({"message": "Transaction acknowledged!", "transaction_id": transaction_id}), 200


@payments_bp.route('/send', methods=['POST'])
@jwt_required()
def send():
    if request.method != 'POST':
        return jsonify({"message": "POST only!"}), 405
    
    send_username = None

    # Validate input
    if "send_username" in request.json and "amount" in request.json:
        send_username = request.json.get("send_username")
    elif "receive_from" in request.json and "amount" in request.json:
        send_username = request.json.get("receive_from")

    if not send_username:
        return jsonify({"message": "Missing send_username/receive_from or amount!"}), 400
    
    try:
        amount = float(request.json.get("amount"))
        if amount <= 0:
            raise ValueError
    except ValueError:
        return jsonify({"message": "Amount must be a positive number!"}), 400
    
    # Get sender and receiver
    username = get_jwt_identity()

    sender = None
    receive = None
    if "receive_from" in request.json:
        sender = search_user(send_username)
        receive = search_user(username)
    else:
        sender = search_user(username)
        receive = search_user(send_username)
    
    if not sender or not receive:
        return jsonify({"message": "Sender or receiver not found!"}), 404
    
    if sender.username == receive.username:
        return jsonify({"message": "Can't send money to yourself silly :)"}), 403
    
    
    # Simulate money movement
    payment = Payment(sender_username=sender.username, reciever_username=receive.username, amount=amount, completed=False)
    payment.save()

    sender.transactions.append(payment)
    sender.save()

    receive.transactions.append(payment)
    receive.save()

    return jsonify({"message": "Transaction created!", "transaction_id": str(payment.id)}), 200