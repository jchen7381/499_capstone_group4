from flask import Flask, request, jsonify, render_template, session
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Mapped, mapped_column
from flask_login import UserMixin, LoginManager
from flask_cors import CORS

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key_here'
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///users.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)
CORS(app)

login_manager = LoginManager()

class Users(db.Model, UserMixin):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)

@app.route('/api/register', methods=["GET", "POST"])
def register_user():
    if request.method == "POST":
        data = request.get_json()
        if (Users.query.filter_by(email=data['email']).first()):
            return jsonify({'message': 'User already exists'})
        newUser = Users(email=data['email'], password=data['password'])
        db.session.add(newUser)
        db.session.commit()
        return jsonify({'message': 'Success'})
    return jsonify({'message': 'Fail'})

@app.route('/api/login', methods=["GET", "POST"])
def login_user():
    if request.method == "POST":
        return

@app.route('/api/users', methods=["GET", "POST"])
def users():
    user_list = Users.query.all()
    return render_template('users.html', users = user_list)
    
with app.app_context():
    db.create_all()
app.run(debug=False)