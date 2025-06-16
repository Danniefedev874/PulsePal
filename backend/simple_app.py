from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

# Simple in-memory storage
users = {}
health_records = []

@app.route('/')
def home():
    return jsonify({"message": "PulsePal Backend is running!"})

@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    try:
        data = request.get_json()
        message = data.get('message', '').lower()
        
        # Simple symptom analysis without ML dependencies
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        response = analyze_symptoms(message)
        
        return jsonify({
            'response': response,
            'status': 'success'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def analyze_symptoms(message):
    # Simple keyword-based symptom analysis
    common_symptoms = {
        'fever': {
            'advice': 'Rest, stay hydrated, and monitor your temperature. Consider over-the-counter fever reducers.',
            'severity': 'medium'
        },
        'headache': {
            'advice': 'Try rest in a quiet, dark room. Stay hydrated and consider mild pain relief.',
            'severity': 'low'
        },
        'cough': {
            'advice': 'Stay hydrated, use a humidifier, and avoid irritants. Honey can help soothe throat.',
            'severity': 'medium'
        },
        'fatigue': {
            'advice': 'Ensure adequate sleep, maintain good nutrition, and manage stress levels.',
            'severity': 'low'
        },
        'nausea': {
            'advice': 'Try small, frequent meals, ginger tea, and avoid strong odors.',
            'severity': 'medium'
        },
        'stomach pain': {
            'advice': 'Avoid solid foods temporarily, stay hydrated, and consider rest.',
            'severity': 'medium'
        },
        'chest pain': {
            'advice': 'URGENT: Chest pain can be serious. Please seek immediate medical attention.',
            'severity': 'high'
        },
        'difficulty breathing': {
            'advice': 'URGENT: Breathing difficulties require immediate medical attention.',
            'severity': 'high'
        }
    }
    
    detected_symptoms = []
    high_severity = False
    
    for symptom, info in common_symptoms.items():
        if symptom in message:
            detected_symptoms.append({
                'symptom': symptom,
                'advice': info['advice'],
                'severity': info['severity']
            })
            if info['severity'] == 'high':
                high_severity = True
    
    if not detected_symptoms:
        return "I understand you're not feeling well. Could you describe your symptoms more specifically? For example: fever, headache, cough, fatigue, nausea, or stomach pain."
    
    response = "🩺 **Health Assessment Based on Your Symptoms:**\n\n"
    
    for i, symptom_info in enumerate(detected_symptoms, 1):
        response += f"{i}. **{symptom_info['symptom'].title()}:** {symptom_info['advice']}\n\n"
    
    if high_severity:
        response += "🚨 **URGENT:** Some of your symptoms require immediate medical attention. Please contact emergency services or visit the nearest emergency room.\n\n"
    else:
        response += "💡 **General Recommendations:**\n"
        response += "• Monitor your symptoms closely\n"
        response += "• Stay hydrated and get adequate rest\n"
        response += "• Consult a healthcare professional if symptoms worsen\n\n"
    
    response += "⚕️ **Important:** This is AI-generated guidance for informational purposes only. Always consult healthcare professionals for medical advice."
    
    return response

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        role = data.get('role', 'patient')
        
        if email in users:
            return jsonify({'error': 'User already exists'}), 400
        
        users[email] = {
            'email': email,
            'password': password,
            'name': name,
            'role': role,
            'id': len(users) + 1
        }
        
        return jsonify({
            'message': 'User created successfully',
            'user_id': users[email]['id'],
            'status': 'success'
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if email in users and users[email]['password'] == password:
            user = users[email]
            return jsonify({
                'message': 'Login successful',
                'user': {
                    'id': user['id'],
                    'email': user['email'],
                    'name': user['name'],
                    'role': user['role']
                },
                'status': 'success'
            })
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/appointments', methods=['GET', 'POST'])
def appointments():
    if request.method == 'POST':
        return jsonify({
            'message': 'Appointment booking feature coming soon!',
            'status': 'success'
        })
    
    return jsonify({
        'appointments': [],
        'message': 'No appointments yet',
        'status': 'success'
    })

@app.route('/api/medications', methods=['GET', 'POST'])
def medications():
    if request.method == 'POST':
        return jsonify({
            'message': 'Medication tracking feature coming soon!',
            'status': 'success'
        })
    
    return jsonify({
        'medications': [],
        'message': 'No medications yet',
        'status': 'success'
    })

@app.route('/api/chat', methods=['GET', 'POST'])
def chat():
    if request.method == 'POST':
        return jsonify({
            'message': 'Doctor-patient chat feature coming soon!',
            'status': 'success'
        })
    
    return jsonify({
        'messages': [],
        'message': 'No messages yet',
        'status': 'success'
    })

@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'Backend is running properly',
        'users_count': len(users),
        'records_count': len(health_records)
    })

if __name__ == '__main__':
    print("🏥 Starting PulsePal Simple Backend...")
    print("📡 CORS enabled for http://localhost:3000")
    print("🚀 Server starting on http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)