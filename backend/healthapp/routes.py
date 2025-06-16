from flask import Blueprint, render_template, request, redirect, url_for, session, flash, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from flask_cors import CORS
from .chatbot_engine import predict_disease
from .forms import LoginForm
from .models import User
from . import db

main = Blueprint('main', __name__)

# API Routes for frontend integration
@main.route('/api/chatbot', methods=['POST'])
def api_chatbot():
    try:
        data = request.get_json()
        message = data.get('message', '')
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Process symptoms
        symptoms = [s.strip() for s in message.split(',')]
        result = predict_disease(symptoms, 2)
        
        return jsonify({
            'response': result,
            'status': 'success'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@main.route('/api/register', methods=['POST'])
def api_register():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        role = data.get('role', 'patient')
        
        if not all([email, password, name]):
            return jsonify({'error': 'All fields are required'}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'error': 'User already exists'}), 400
        
        # Create new user
        new_user = User(email=email, password=password, name=name, role=role)
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            'message': 'User created successfully',
            'user_id': new_user.id,
            'status': 'success'
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@main.route('/api/login', methods=['POST'])
def api_login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not all([email, password]):
            return jsonify({'error': 'Email and password are required'}), 400
        
        user = User.query.filter_by(email=email).first()
        if user and user.password == password:  # Note: In production, use proper password hashing
            login_user(user)
            return jsonify({
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'name': user.name,
                    'role': user.role
                },
                'status': 'success'
            })
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@main.route('/api/appointments', methods=['GET', 'POST'])
@login_required
def api_appointments():
    if request.method == 'POST':
        try:
            data = request.get_json()
            # Add appointment logic here
            return jsonify({
                'message': 'Appointment booked successfully',
                'status': 'success'
            })
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    # GET appointments
    try:
        # Add logic to fetch appointments
        appointments = []  # Replace with actual query
        return jsonify({
            'appointments': appointments,
            'status': 'success'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@main.route('/api/medications', methods=['GET', 'POST'])
@login_required
def api_medications():
    if request.method == 'POST':
        try:
            data = request.get_json()
            # Add medication logic here
            return jsonify({
                'message': 'Medication added successfully',
                'status': 'success'
            })
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    # GET medications
    try:
        # Add logic to fetch medications
        medications = []  # Replace with actual query
        return jsonify({
            'medications': medications,
            'status': 'success'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@main.route('/api/chat', methods=['GET', 'POST'])
@login_required
def api_chat():
    if request.method == 'POST':
        try:
            data = request.get_json()
            # Add chat logic here
            return jsonify({
                'message': 'Message sent successfully',
                'status': 'success'
            })
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    # GET chat messages
    try:
        # Add logic to fetch chat messages
        messages = []  # Replace with actual query
        return jsonify({
            'messages': messages,
            'status': 'success'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Traditional web routes (for backend-only access)
@main.route('/')
def index():
    return redirect(url_for('main.login'))

@main.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and user.password == form.password.data:
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

@main.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.login'))