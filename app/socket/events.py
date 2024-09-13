from app.models import Question
from app.routes.games import games, scores
from flask_socketio import join_room, leave_room, emit
from flask import request

def on_create(data):
    game_id = data['game_id']
    join_room(game_id)
    print(f'Host hat den Raum {game_id} erstellt.')

# Aufgerufen vom Player Client
# "user_joined" wird an alle Clients (Lobby/Player) gesendet
def on_join(data):
    username = data['username']
    game_id = data['game_id']
    join_room(game_id)
    emit('user_joined', {'username': username, 'game_id': game_id}, broadcast=True)
    print(f'{username} ist erfolgreich dem Spiel {game_id} beigetreten.')

# Aufgerufen vom Player Client oder Lobby Client
# "user_left" wird an alle Clients (Lobby/Player) gesendet
# Falls Nutzer Host ist, wird das Spiel gelöscht
# Falls Nutzer Player ist, wird er aus der Liste der Spieler entfernt
def on_leave(data):
    username = data['username']
    game_id = data['game_id']
    if username == "host":
            emit('game_ended', room=game_id)
            for player in games[game_id]:
                leave_room(game_id, sid=player)
            leave_room(game_id)
            del games[game_id]
            del scores[game_id]
            emit('user_left', {'username': 'host'}, room=game_id)
            print(f'Der Host hat das Spiel {game_id} verlassen.')
    else:
        leave_room(game_id)
        emit('user_left', {'username': username, 'game_id': game_id}, broadcast=True)
        print(f'{username} hat das Spiel {game_id} verlassen.')

def on_host_leave(data):
    game_id = data['game_id']
    if game_id in games:
        for player in games[game_id]:
            leave_room(game_id, sid=player)
        del games[game_id]
        emit('game_ended', room=game_id)

# Aufgerufen vom Lobby Client
# "game_started" wird an die Player Clients gesendet
def on_start(data):
    print(f'Start game: {data}')
    game_id = data['game_id']
    quiz_id = data['quiz_id']
    question_index = data['question_index']
    if game_id in games:
        emit('game_started', {"quiz_id": quiz_id, "question_index": question_index }, room=game_id)
    else:
        print(f'Game not found: {game_id}')

# Aufgerufen vom Lobby Client
# "next_question" wird (nur) an die Player Clients gesendet
def on_next_question(data):
    print(f'Next question: {data}')
    game_id = data['game_id']
    emit('next_question', data, room=game_id, broadcast=True)
