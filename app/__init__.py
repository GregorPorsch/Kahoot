from flask import Flask
from flask_cors import CORS
from .extensions import db, migrate, socketio

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    CORS(app, resources={r"/*": {"origins": "*"}})
    db.init_app(app)
    migrate.init_app(app, db)
    socketio.init_app(app)

    from .routes import register_routes
    register_routes(app)

    return app
