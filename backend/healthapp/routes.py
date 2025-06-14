from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from flask_login import login_user, logout_user, login_required, current_user
from .chatbot_engine import predict_disease
from .forms import LoginForm
from .models import User  # Make sure this exists and works with Flask-Login
from flask import Flask, request, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)  # Allow CORS for local frontend testing

@app.route('/chatbot', methods=['POST'])
def chatbot():
    data = request.get_json()
    message = data.get('message')

    # Process symptoms
    symptoms = [s.strip() for s in message.split(',')]
    result = predict_disease(symptoms, 2)

    return jsonify({'response': result})

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return redirect(url_for('main.login'))  # or use 'main.chatbot' as default

@main.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and user.password == form.password.data:  # WARNING: plain text — replace with hashing later
            login_user(user)
            return redirect(url_for('main.chatbot'))
        flash('Invalid email or password')
    return render_template('login.html', form=form)

@main.route('/chatbot', methods=['GET', 'POST'])
@login_required
def chatbot():
    if 'messages' not in session:
        session['messages'] = []

    messages = session['messages']

    if request.method == 'POST':
        user_msg = request.form['message']
        messages.append({'sender': 'user', 'text': user_msg})

        symptoms = [s.strip() for s in user_msg.split(',')]
        response = predict_disease(symptoms, 2)

        messages.append({'sender': 'bot', 'text': response})
        session['messages'] = messages
        return redirect(url_for('main.chatbot'))

    return render_template('chatbot.html', messages=messages, loading=False)
