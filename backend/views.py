from flask import Blueprint, jsonify, request

views = Blueprint(__name__, 'views')

nickname = ""  # Global variable to store the nickname

@views.route("/game", methods=["GET", "POST"])
def game():
    global nickname
    if request.method == "POST":
        # Handle the POST request here
        data = request.get_json()
        nickname = data.get("nickname", "")
        return jsonify({
            "nickname": nickname,
        }), 200

    else:
        # Handle the GET request here
        return jsonify({
            "board": [[0]*3 for _ in range(3)],
            "turns": [[0]*3 for _ in range(3)],
            "turn": -1,
            "nickname": nickname,
        }), 200