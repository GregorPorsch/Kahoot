from flask import Blueprint

def register_routes(app):
    from .questions import questions_bp
    from .answers import answers_bp
    from .games import games_bp

    app.register_blueprint(questions_bp)
    app.register_blueprint(answers_bp)
    app.register_blueprint(games_bp)