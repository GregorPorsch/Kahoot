class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db' + '?check_same_thread=False'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = '5791628bb0b13ce0c676dfde280ba245'