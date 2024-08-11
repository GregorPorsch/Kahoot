from app import app, socketio, db
from app.models import Question

from flask import request, jsonify
from flask_socketio import SocketIO, join_room, leave_room, emit
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

import random

games = {}
scores = {}

# Zahlen sind die eindeutigen Frage-IDs
# -> Gruppierung einer Gruppe von Fragen
questions = {}

# Aufgerunfen vom Lobby Client
@app.route('/create_game', methods=['POST'])
def create_game():
    game_id = ''.join([str(random.randint(0, 9)) for _ in range(6)])
    try:
        # Erstellung einer eindeutigen game_id
        while game_id in games:
            game_id = ''.join([str(random.randint(0, 9)) for _ in range(6)])
        games[game_id] = []
        scores[game_id] = {}
        return {"status": "success", "game_id": game_id}
    except Exception as e:
        print(f"Error in create_game: {e}") 
        return {"status": "error", "message": str(e)}

# Aufgerufen vom Player Client
@app.route('/join_game', methods=['POST'])
def join_game():
    try:
        data = request.json
        game_id = data['game_id']
        username = data['username']
        if game_id in games:
            games[game_id].append(username)
            scores[game_id][username] = 0
            return jsonify({'status': 'success'})
        else:
            return jsonify({'status': 'error', 'message': 'Game not found'})
    except Exception as e:
        print(f"Error in join_game: {e}") 
        return {"status": "error", "message": str(e)}

@app.route('/leave_game', methods=['POST'])
def leave_game():
    data = request.json
    game_id = data['game_id']
    username = data['username']
    if username == "Host":
        socketio.emit('host_leave', {'game_id': game_id})
        return jsonify({'status': 'success'})
    if game_id in games and username in games[game_id]:
        games[game_id].remove(username)
        return jsonify({'status': 'success'})
    return jsonify({'status': 'error', 'message': 'Game or user not found'})

# Aufgerufen vom Lobby Client und Player Client
# Rückgage Status: success, end, error
@app.route('/get_question/<question_id>/<question_index>', methods=['GET'])
def get_question(question_id, question_index):
    print(questions)
    question_id = int(question_id)
    question_index = int(question_index)
    if question_id in questions and question_index < len(questions[question_id]):
        return jsonify({'status': 'success', 'question': questions[question_id][question_index]})
    elif question_id in questions and question_index >= len(questions[question_id]):
        return jsonify({'status': 'end', 'message': 'No more questions'})
    try:
        question_list = Question.query.filter_by(question_id=question_id).order_by(Question.question_index).all()
        if question_list:
            question_data = [
                {
                    "question_index": q.question_index,
                    "question": q.question,
                    "options": [q.option1, q.option2, q.option3, q.option4],
                    "answer": q.answer
                }
                for q in question_list
            ]
            questions[question_id] = question_data
            print(questions)
            return jsonify( {"status": "success", "question": question_data})
        else:
            print("Error loading questions")
    except Exception as e:
        print(f"Error in get_question: {e}")
        return jsonify({'status': 'error', 'message': 'Question not found'})    

# Aufgerufen vom Player Client
@app.route('/check_answer', methods=['POST'])
def check_answer():
    data = request.json
    game_id = data['game_id']
    username = data['username']
    question_id = int(data['question_id'])
    question_index = int(data['question_index'])
    answer = data['answer']
    answer_time = float(data['answer_time'])
    if question_id in questions and question_index < len(questions[question_id]):
        correct_answer = questions[question_id][question_index]['answer']
        if answer == correct_answer:
            points = int((10 - answer_time) * 100)
            scores[game_id][username] += points
            return jsonify({'status': 'success', 'correct': True, 'points': points})
        return jsonify({'status': 'success', 'correct': False, 'points': 0})
    return jsonify({'status': 'error', 'message': 'Invalid question or index'})

@app.route('/get_scores', methods=['POST'])
def get_scores():
    data = request.json
    game_id = data['game_id']
    if game_id in scores:
        return jsonify({'status': 'success', 'scores': scores[game_id]})
    return jsonify({'status': 'error', 'message': 'Game not found'})

@app.route('/get_players', methods=['POST'])
def get_players():
    data = request.json
    game_id = data['game_id']
    if game_id in games:
        return jsonify({'status': 'success', 'players': games[game_id]})
    return jsonify({'status': 'error', 'message': 'Game not found'})

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


"""
Für Testzwecke
"""

@app.route('/get_all_games', methods=['GET'])  
def get_all_games():
    return jsonify(games)