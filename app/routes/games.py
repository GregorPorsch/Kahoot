# app/routes/games.py
from flask_socketio import emit, join_room
from flask import Blueprint, request, jsonify
import random

games_bp = Blueprint('games', __name__)

games = {}
scores = {}

def create_game_id():
    game_id = ''.join([str(random.randint(0, 9)) for _ in range(6)])
    while game_id in games:
        game_id = ''.join([str(random.randint(0, 9)) for _ in range(6)])
    return game_id

@games_bp.route('/create', methods=['GET'])
def create_game():
    try:
        game_id = create_game_id()
        games[game_id] = []
        scores[game_id] = {}
        return jsonify({"status": "success", "game_id": game_id})
    except Exception as e:
        print(f"Error in create_game: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@games_bp.route('/join', methods=['POST'])
def join_game():
    try:
        data = request.json
        game_id = data.get('game_id')
        player_name = data.get('player_name')

        if not game_id or not player_name:
            return jsonify({"status": "error", "message": "Missing game_id or player_name"}), 400

        if game_id not in games:
            return jsonify({"status": "error", "message": "Game not found"}), 404

        games[game_id].append(player_name)
        scores[game_id][player_name] = 0
        return jsonify({"status": "success", "message": f"Player {player_name} joined game {game_id}"})
    except Exception as e:
        print(f"Error in join_game: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@games_bp.route('/leave', methods=['POST'])
def leave_game():
    try:
        data = request.json
        game_id = data.get('game_id')
        player_name = data.get('player_name')

        if not game_id or not player_name:
            return jsonify({"status": "error", "message": "Missing game_id or player_name"}), 400
        
        if player_name == 'host' and game_id in games:
            return jsonify({"status": "success", "message": f"Game {game_id} deleted"})

        if game_id not in games or player_name not in games[game_id]:
            return jsonify({"status": "error", "message": "Game or player not found"}), 404

        games[game_id].remove(player_name)
        del scores[game_id][player_name]
        return jsonify({"status": "success", "data": f"Player {player_name} left game {game_id}"})
    except Exception as e:
        print(f"Error in leave_game: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@games_bp.route('/scores', methods=['POST'])
def get_scores():
    try:
        data = request.json
        game_id = data.get('game_id')

        if not game_id:
            return jsonify({"status": "error", "message": "Missing game_id"}), 400

        if game_id in scores:
            return jsonify({'status': 'success', 'data': scores[game_id]})
        return jsonify({'status': 'error', 'message': 'Game not found'}), 404
    except Exception as e:
        print(f"Error in get_scores: {e}") 
        return jsonify({"status": "error", "message": str(e)}), 500

@games_bp.route('/players', methods=['POST'])
def get_players():
    try:
        data = request.json
        game_id = data.get('game_id')

        if not game_id:
            return jsonify({"status": "error", "message": "Missing game_id"}), 400

        if game_id in games:
            return jsonify({'status': 'success', 'data': games[game_id]})
        return jsonify({'status': 'error', 'message': 'Game not found'}), 404
    except Exception as e:
        print(f"Error in get_players: {e}") 
        return jsonify({"status": "error", "message": str(e)}), 500

@games_bp.route('/exists/player', methods=['POST'])
def exists_player():
    try:
        data = request.json
        game_id = data.get('game_id')
        player_name = data.get('player_name')

        if not game_id or not player_name:
            return jsonify({"status": "error", "message": "Missing game_id or player_name"}), 400

        if game_id in games and player_name in games[game_id]:
            return jsonify({"status": "success", "data": True})
        return jsonify({"status": "success", "data": False})
    except Exception as e:
        print(f"Error in exists_player: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
    
@games_bp.route('/exists/game', methods=['POST'])
def exists_game():
    try:
        data = request.json
        game_id = data.get('game_id')

        if not game_id:
            return jsonify({"status": "error", "message": "Missing game_id"}), 400

        if game_id in games:
            return jsonify({"status": "success", "data": True})
        return jsonify({"status": "success", "data": False})
    except Exception as e:
        print(f"Error in exists_game: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@games_bp.route('/all', methods=['GET'])  
def get_all_games():
    return jsonify(games)
