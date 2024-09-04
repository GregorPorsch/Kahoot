from app import app, socketio, db
from app.models import Question

from .games import games

from flask import request, jsonify
from flask_socketio import join_room, leave_room, emit

# Zahlen sind die eindeutigen Frage-IDs
# -> Gruppierung einer Gruppe von Fragen
questions = {}

# Aufgerufen vom Player Client
# "user_joined" wird an alle Clients (Lobby/Player) gesendet
@socketio.on('join')
def on_join(data):
    username = data['username']
    game_id = data['game_id']
    join_room(game_id)
    print(f'{username} ist erfolgreich Spiel {game_id} beigetreten.')
    emit('user_joined', {'username': username}, room=game_id)

# Aufgerufen vom Player Client oder Lobby Client
# "user_left" wird an alle Clients (Lobby/Player) gesendet
# Falls Nutzer Host ist, wird das Spiel gelöscht
# Falls Nutzer Player ist, wird er aus der Liste der Spieler entfernt
@socketio.on('leave')
def on_leave(data):
    username = data['username']
    game_id = data['game_id']
    if username == "Host":
        if game_id in games:
            for player in games[game_id]:
                leave_room(game_id, sid=player)
            del games[game_id]
            emit('game_ended', room=game_id)
    else:
        if game_id in games and username in games[game_id]:
            games[game_id].remove(username)
            leave_room(game_id)
    print(f'{username} left {game_id}')
    emit('user_left', {'username': username}, room=game_id)

@socketio.on('host_leave')
def on_host_leave(data):
    game_id = data['game_id']
    if game_id in games:
        for player in games[game_id]:
            leave_room(game_id, sid=player)
        del games[game_id]
        emit('game_ended', room=game_id)

@socketio.on('create')
def on_create(data):
    game_id = data['game_id']
    join_room(game_id)

# Aufgerufen vom Lobby Client
# "game_started" wird an die Player Clients gesendet
@socketio.on('start')
def on_start(data):
    game_id = data['game_id']
    question_id = data['question_id']
    question_index = data['question_index']
    if game_id in games:
        emit('game_started', {"status": "success", "question_id": question_id, "question_index": question_index }, room=game_id)
    else:
        print(f'Game not found: {game_id}')

# Aufgerufen vom Lobby Client
# "next_question" wird (nur) an die Player Clients gesendet
@socketio.on('next_question')
def on_next_question(data):
    print(f'Next question: {data}')
    game_id = data['game_id']
    emit('next_question', data, room=game_id, broadcast=True)
