from flask import Flask
from flask_sqlalchemy import SQLAlchemy

#db connection
application = Flask(__name__)
application.config['SECRET_KEY'] = 'tx\xf3\xb1\xc6\x81X&\xdb\x8a\x02Q\xf7yl\x88\xa5\x12B\xe2~1XN'
application.config['SQLALCHEMY_DATABASE_URI']='sqlite:///database.db'
db = SQLAlchemy(application)

from project import routes