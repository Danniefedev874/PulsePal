from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
import re

# Add the current directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from healthapp.chatbot_engine import predict_disease

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

# Medical symptom keywords that commonly appear in user messages
MEDICAL_KEYWORDS = {
    'pain': ['pain', 'ache', 'aching', 'hurt', 'hurts', 'hurting', 'sore', 'tender'],
    'fever': ['fever', 'temperature', 'hot', 'burning up', 'feverish'],
    'headache': ['headache', 'head pain', 'migraine', 'head hurt'],
    'nausea': ['nausea', 'nauseous', 'sick', 'queasy', 'throw up', 'vomit'],
    'fatigue': ['tired', 'fatigue', 'exhausted', 'weak', 'weakness', 'energy'],
    'cough': ['cough', 'coughing', 'hack'],
    'breathing': ['breathing', 'breath', 'shortness of breath', 'breathless'],
    'stomach': ['stomach', 'belly', 'tummy', 'abdomen'],
    'chest': ['chest', 'heart area'],
    'back': ['back', 'spine'],
    'throat': ['throat', 'sore throat'],
    'diarrhea': ['diarrhea', 'loose stool', 'runny stool'],
    'constipation': ['constipation', 'constipated', 'blocked'],
    'dizziness': ['dizzy', 'dizziness', 'lightheaded', 'spinning'],
    'itching': ['itchy', 'itching', 'scratch'],
    'rash': ['rash', 'spots', 'bumps', 'red spots'],
    'swelling': ['swollen', 'swelling', 'puffy'],
    'joint': ['joint', 'joints', 'knee', 'elbow', 'ankle', 'wrist']
}

def extract_symptoms_from_text(text):
    """Extract medical symptoms from natural language text"""
    text_lower = text.lower()
    extracted_symptoms = []
    
    # Remove common greeting words
    greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening']
    for greeting in greetings:
        text_lower = text_lower.replace(greeting, '')
    
    # Remove common filler phrases
    fillers = ['i have', 'i am', 'i feel', 'i am experiencing', 'i got', 'i have been having', 
               'i am suffering from', 'i think i have', 'i might have', 'i seem to have',
               'experiencing', 'feeling', 'having', 'suffering from']
    for filler in fillers:
        text_lower = text_lower.replace(filler, '')
    
    # Look for medical keywords
    for symptom, keywords in MEDICAL_KEYWORDS.items():
        for keyword in keywords:
            if keyword in text_lower:
                extracted_symptoms.append(symptom)
                break  # Avoid duplicates for the same symptom
    
    # Look for "pain in/at" patterns
    pain_patterns = [
        r'pain in (?:my |the )?(\w+)',
        r'(\w+) pain',
        r'(\w+) hurts?',
        r'(\w+) aches?',
        r'sore (\w+)'
    ]
    
    for pattern in pain_patterns:
        matches = re.findall(pattern, text_lower)
        for match in matches:
            body_part = match.strip()
            if body_part in ['head', 'skull']:
                extracted_symptoms.append('headache')
            elif body_part in ['stomach', 'belly', 'abdomen', 'tummy']:
                extracted_symptoms.append('stomach pain')
            elif body_part in ['chest', 'heart']:
                extracted_symptoms.append('chest pain')
            elif body_part in ['back', 'spine']:
                extracted_symptoms.append('back pain')
            elif body_part in ['throat', 'neck']:
                extracted_symptoms.append('throat pain')
            elif body_part in ['knee', 'knees']:
                extracted_symptoms.append('knee pain')
            elif body_part in ['joint', 'joints']:
                extracted_symptoms.append('joint pain')
    
    # If no symptoms found, try to extract any medical-sounding words
    if not extracted_symptoms:
        # Split the cleaned text and look for potential symptoms
        words = re.findall(r'\b\w+\b', text_lower)
        medical_words = []
        
        # Common medical terms that might be symptoms
        potential_symptoms = [
            'headache', 'migraine', 'fever', 'cough', 'nausea', 'vomiting', 'diarrhea',
            'constipation', 'fatigue', 'weakness', 'dizziness', 'breathlessness',
            'sweating', 'chills', 'rash', 'itching', 'swelling', 'bloating',
            'heartburn', 'indigestion', 'cramps', 'spasms', 'tremor', 'seizure'
        ]
        
        for word in words:
            if word in potential_symptoms:
                medical_words.append(word)
        
        if medical_words:
            extracted_symptoms.extend(medical_words)
    
    # Remove duplicates and return
    return list(set(extracted_symptoms)) if extracted_symptoms else [text.strip()]

@app.route('/')
def home():
    return "Enhanced Flask App with Natural Language Processing is running!"

@app.route('/api/chatbot', methods=['POST'])
def api_chatbot():
    print("API chatbot route called")
    try:
        print("Getting JSON data...")
        data = request.get_json()
        print(f"Received data: {data}")
        
        if not data:
            print("No data received")
            return jsonify({'error': 'No data provided'}), 400
            
        message = data.get('message', '')
        print(f"Message: '{message}'")
        
        if not message:
            print("No message provided")
            return jsonify({'error': 'Message is required'}), 400
        
        # Enhanced symptom extraction
        print("Extracting symptoms from natural language...")
        symptoms = extract_symptoms_from_text(message)
        print(f"Extracted symptoms: {symptoms}")
        
        # Fallback to simple processing if extraction fails
        if not symptoms or (len(symptoms) == 1 and symptoms[0] == message.strip()):
            print("Falling back to simple processing...")
            if ',' in message:
                symptoms = [s.strip() for s in message.split(',')]
            else:
                import re
                symptoms = re.split(r'[,;.]|\s+and\s+|\s+or\s+', message.lower())
                symptoms = [s.strip() for s in symptoms if s.strip()]
                if len(symptoms) <= 1:
                    symptoms = [message.strip()]
        
        print(f"Final symptoms for processing: {symptoms}")
        
        # Call the ML model
        print("Calling predict_disease...")
        result = predict_disease(symptoms, 2)
        print(f"ML result: {result[:100]}...")
        
        response = {
            'response': result,
            'status': 'success'
        }
        print("Returning successful response")
        return jsonify(response)
        
    except Exception as e:
        print(f"API Error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/test')
def test():
    return jsonify({'message': 'Test endpoint working!', 'status': 'success'})

@app.route('/api/extract-symptoms', methods=['POST'])
def test_extraction():
    """Test endpoint to see how symptom extraction works"""
    data = request.get_json()
    message = data.get('message', '')
    
    if not message:
        return jsonify({'error': 'Message is required'}), 400
    
    symptoms = extract_symptoms_from_text(message)
    
    return jsonify({
        'original_message': message,
        'extracted_symptoms': symptoms,
        'status': 'success'
    })

@app.route('/routes')
def list_routes():
    routes = []
    for rule in app.url_map.iter_rules():
        routes.append({
            'endpoint': rule.endpoint,
            'methods': list(rule.methods),
            'rule': rule.rule
        })
    return jsonify(routes)

if __name__ == '__main__':
    print("Starting enhanced Flask app with NLP...")
    print("Available routes:")
    for rule in app.url_map.iter_rules():
        print(f"  {rule.endpoint}: {rule.rule} {list(rule.methods)}")
    
    app.run(debug=True, host='0.0.0.0', port=5000)