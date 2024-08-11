from app import db

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.String(255), nullable=False)
    question_index = db.Column(db.Integer, nullable=False)
    question = db.Column(db.String(255), nullable=False)
    option1 = db.Column(db.String(255), nullable=False)
    option2 = db.Column(db.String(255), nullable=False)
    option3 = db.Column(db.String(255), nullable=False)
    option4 = db.Column(db.String(255), nullable=False)
    answer = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return f"Question('{self.question}', '{self.answer}')"