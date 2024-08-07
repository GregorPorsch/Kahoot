# app.py
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, join_room, leave_room, emit
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

games = {}

@app.route('/get_all_games', methods=['GET'])  
def get_all_games():
    return jsonify(games)

@app.route('/create_game', methods=['POST'])
def create_game():
    game_id = ''.join([str(random.randint(0, 9)) for _ in range(6)])
    games[game_id] = []
    return jsonify({'game_id': game_id})

@app.route('/join_game', methods=['POST'])
def join_game():
    data = request.json
    game_id = data['game_id']
    username = data['username']
    if game_id in games:
        games[game_id].append(username)
        return jsonify({'status': 'joined'})
    return jsonify({'status': 'error', 'message': 'Game not found'})

@app.route('/leave_game', methods=['POST'])
def leave_game():
    data = request.json
    game_id = data['game_id']
    username = data['username']
    if game_id in games and username in games[game_id]:
        games[game_id].remove(username)
        return jsonify({'status': 'left'})
    return jsonify({'status': 'error', 'message': 'Game or user not found'})

@socketio.on('join')
def on_join(data):
    username = data['username']
    game_id = data['game_id']
    join_room(game_id)
    emit('user_joined', {'username': username}, room=game_id)

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    game_id = data['game_id']
    leave_room(game_id)
    emit('user_left', {'username': username}, room=game_id)

@socketio.on('start_timer')
def start_timer(data):
    game_id = data['game_id']
    emit('timer_started', room=game_id)

if __name__ == '__main__':
    socketio.run(app, debug=True)