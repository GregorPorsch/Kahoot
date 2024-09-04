from flask import Blueprint, jsonify, request
from .games import scores
from app.models import Question

answers_bp = Blueprint('answers', __name__)

@answers_bp.route('/answers/check', methods=['POST'])
def check_answer():
    try:
        data = request.json
        game_id = data.get('game_id')
        username = data.get('username')
        quiz_id = data.get('quiz_id')
        question_index = data.get('question_index')
        answer = data.get('answer')
        answer_time = data.get('answer_time')

        if not all([game_id, username, quiz_id, question_index, answer, answer_time]):
            return jsonify({'status': 'error', 'message': 'Missing data'}), 400

        quiz_id = int(quiz_id)
        question_index = int(question_index)
        answer_time = float(answer_time)

        if game_id not in scores:
            return jsonify({'status': 'error', 'message': 'Invalid game id'}), 404
        if username not in scores[game_id]:
            return jsonify({'status': 'error', 'message': 'Invalid username'}), 404

        question = Question.query.filter_by(quiz_id=quiz_id, question_index=question_index).first()
        if not question:
            return jsonify({'status': 'error', 'message': 'Question not found'}), 404

        correct_answer = question.answer
        if answer == correct_answer:
            points = max(0, int((10 - answer_time) * 100))
            scores[game_id][username] += points
            return jsonify({'status': 'success', 'correct': True, 'points': points})
        
        return jsonify({'status': 'success', 'correct': False, 'points': 0})
    except Exception as e:
        print(f"Error in check_answer: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500