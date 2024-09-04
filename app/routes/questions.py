from flask import Blueprint, jsonify, request
from ..models import Question, Quiz
from app import db

questions_bp = Blueprint('questions', __name__)

@questions_bp.route('/questions/get', methods=['GET'])
def get_question():
    try:
        data = request.json
        quiz_id = data.get('quiz_id')
        question_index = data.get('question_index')

        if not quiz_id or question_index is None:
            return jsonify({'status': 'error', 'message': 'Missing quiz_id or question_index'}), 400

        question = Question.query.filter_by(quiz_id=str(quiz_id), question_index=question_index).first()
        if not question:
            return jsonify({'status': 'error', 'message': 'Question not found'}), 404

        question_data = {
            "id": question.id,
            "quiz_id": question.quiz_id,
            "question_index": question.question_index,
            "question": question.question,
            "option1": question.option1,
            "option2": question.option2,
            "option3": question.option3,
            "option4": question.option4,
            "answer": question.answer
        }
        return jsonify({'status': 'success', 'data': question_data})
    except Exception as e:
        print(f"Error in get_question: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500


@questions_bp.route('/questions/all', methods=['GET'])
def get_all():
    try:
        questions = Question.query.all()
        question_data = [
            {
                "id": question.id,
                "quiz_id": question.quiz_id,
                "question_index": question.question_index,
                "question": question.question,
                "option1": question.option1,
                "option2": question.option2,
                "option3": question.option3,
                "option4": question.option4,
                "answer": question.answer
            }
            for question in questions
        ]
        return jsonify({'status': 'success', 'data': question_data})
    except Exception as e:
        print(f"Error in get_all: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@questions_bp.route('/questions/add', methods=['POST'])
def add_question():
    try:
        data = request.json
        quiz_id = data.get('quiz_id')
        question_index = data.get('question_index')
        question_text = data.get('question')
        option1 = data.get('option1')
        option2 = data.get('option2')
        option3 = data.get('option3')
        option4 = data.get('option4')
        answer = data.get('answer')

        if not all([quiz_id, question_index, question_text, option1, option2, option3, option4, answer]):
            return jsonify({'status': 'error', 'message': 'Missing data'}), 400

        new_question = Question(
            quiz_id=quiz_id,
            question_index=question_index,
            question=question_text,
            option1=option1,
            option2=option2,
            option3=option3,
            option4=option4,
            answer=answer
        )
        db.session.add(new_question)
        db.session.commit()

        return jsonify({'status': 'success', 'message': 'Question added successfully'})
    except Exception as e:
        print(f"Error in add_question: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500
    
@questions_bp.route('/questions/delete', methods=['POST'])
def delete_question():
    try:
        data = request.json
        quiz_id = data.get('quiz_id')
        question_index = data.get('question_index')

        if not quiz_id or question_index is None:
            return jsonify({'status': 'error', 'message': 'Missing quiz_id or question_index'}), 400

        question = Question.query.filter_by(quiz_id=quiz_id, question_index=question_index).first()
        if not question:
            return jsonify({'status': 'error', 'message': 'Question not found'}), 404

        db.session.delete(question)
        db.session.commit()
        return jsonify({'status': 'success', 'message': 'Question deleted successfully'})
    except Exception as e:
        print(f"Error in delete_question: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@questions_bp.route('/questions/add_quiz', methods=['POST'])
def add_quiz():
    try:
        data = request.json
        name = data.get('name')
        image = data.get('image')

        if not name or not image:
            return jsonify({'status': 'error', 'message': 'Missing name or image'}), 400

        new_quiz = Quiz(name=name, image=image)
        db.session.add(new_quiz)
        db.session.commit()
        return jsonify({'status': 'success', 'message': 'Quiz added successfully'})
    except Exception as e:
        print(f"Error in add_quiz: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500
  
@questions_bp.route('/questions/all_quizzes', methods=['GET'])
def get_all_quizzes():
    try:
        quizzes = Quiz.query.all()
        quiz_data = [
            {
                "id": quiz.id,
                "name": quiz.name,
                "image": quiz.image,
            }
            for quiz in quizzes
        ]
        return jsonify({'status': 'success', 'data': quiz_data})
    except Exception as e:
        print(f"Error in get_all_quizzes: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500