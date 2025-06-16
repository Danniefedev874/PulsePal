import pandas as pd
import numpy as np
import re
import csv
import os
from sklearn import preprocessing, tree
from sklearn.model_selection import train_test_split

# Define absolute paths to data
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

try:
    training = pd.read_csv(os.path.join(BASE_DIR, 'Data', 'Training.csv'))
    testing = pd.read_csv(os.path.join(BASE_DIR, 'Data', 'Testing.csv'))
    cols = training.columns[:-1]
    x = training[cols]
    y = training['prognosis']

    # Label encoding
    le = preprocessing.LabelEncoder()
    y_encoded = le.fit_transform(y)

    # Train/test split
    x_train, x_test, y_train, y_test = train_test_split(x, y_encoded, test_size=0.33, random_state=42)
    clf = tree.DecisionTreeClassifier().fit(x_train, y_train)
    reduced_data = training.groupby(training['prognosis']).max()

    # Initialize dictionaries
    severity_dict = {}
    description_dict = {}
    precaution_dict = {}

    # Load severity dictionary
    severity_file = os.path.join(BASE_DIR, 'Data', 'Symptom_severity.csv')
    if os.path.exists(severity_file):
        with open(severity_file) as f:
            reader = csv.reader(f)
            next(reader, None)  # Skip header if present
            for rows in reader:
                if len(rows) >= 2:
                    try:
                        severity_dict[rows[0]] = int(rows[1])
                    except ValueError:
                        severity_dict[rows[0]] = 1

    # Load description dictionary
    description_file = os.path.join(BASE_DIR, 'Data', 'symptom_Description.csv')
    if os.path.exists(description_file):
        with open(description_file) as f:
            reader = csv.reader(f)
            next(reader, None)  # Skip header if present
            for rows in reader:
                if len(rows) >= 2:
                    description_dict[rows[0]] = rows[1]

    # Load precaution dictionary
    precaution_file = os.path.join(BASE_DIR, 'Data', 'symptom_precaution.csv')
    if os.path.exists(precaution_file):
        with open(precaution_file) as f:
            reader = csv.reader(f)
            next(reader, None)  # Skip header if present
            for rows in reader:
                if len(rows) >= 2:
                    precautions = [p for p in rows[1:] if p.strip()]
                    if precautions:
                        precaution_dict[rows[0]] = precautions

    MODEL_LOADED = True

except Exception as e:
    print(f"Error loading model data: {e}")
    MODEL_LOADED = False
    cols = []
    clf = None
    le = None
    reduced_data = None
    severity_dict = {}
    description_dict = {}
    precaution_dict = {}

def predict_disease(symptom_list, days=1):
    if not MODEL_LOADED:
        return "❌ The AI model is currently unavailable. Please try again later or consult a healthcare professional."
    
    if not symptom_list:
        return "⚠️ Please provide some symptoms to analyze."
    
    try:
        # Clean and process symptoms
        cleaned_symptoms = []
        for symptom in symptom_list:
            if isinstance(symptom, str):
                cleaned = symptom.strip().lower().replace(' ', '_')
                if cleaned:
                    cleaned_symptoms.append(cleaned)
        
        if not cleaned_symptoms:
            return "⚠️ No valid symptoms provided. Please describe your symptoms clearly."
        
        # Create input vector
        input_vector = np.zeros(len(cols))
        matched_symptoms = []
        
        for symptom in cleaned_symptoms:
            for i, feature in enumerate(cols):
                if re.search(symptom, feature.lower(), re.IGNORECASE):
                    input_vector[i] = 1
                    matched_symptoms.append(feature)
                    break
        
        if not matched_symptoms:
            # Fallback: try partial matching
            for symptom in cleaned_symptoms:
                for i, feature in enumerate(cols):
                    if symptom in feature.lower() or feature.lower() in symptom:
                        input_vector[i] = 1
                        matched_symptoms.append(feature)
                        break
        
        if not matched_symptoms:
            return f"⚠️ Could not match your symptoms to our database. You mentioned: {', '.join(symptom_list)}. Please try using more common medical terms like 'fever', 'headache', 'cough', etc."
        
        # Make prediction
        input_df = pd.DataFrame([input_vector], columns=cols)
        prediction = clf.predict(input_df)[0]
        predicted_disease = le.inverse_transform([prediction])[0]
        
        # Build response
        response = f"🩺 **Based on your symptoms, this could be:** {predicted_disease}\n\n"
        
        # Add description
        if predicted_disease in description_dict:
            response += f"📋 **About this condition:** {description_dict[predicted_disease]}\n\n"
        
        # Add precautions
        if predicted_disease in precaution_dict:
            response += "✅ **Recommended actions:**\n"
            for i, precaution in enumerate(precaution_dict[predicted_disease], 1):
                if precaution.strip():
                    response += f"{i}. {precaution}\n"
            response += "\n"
        
        # Calculate severity
        severity_score = sum(severity_dict.get(sym.replace('_', ' '), 1) for sym in matched_symptoms)
        risk_level = (severity_score * max(days, 1)) / (len(matched_symptoms) + 1)
        
        if risk_level > 10:
            response += "🚨 **IMPORTANT:** Based on symptom severity and duration, please consult a healthcare professional immediately."
        elif risk_level > 5:
            response += "⚠️ **Recommendation:** Consider consulting a healthcare professional if symptoms persist or worsen."
        else:
            response += "ℹ️ **General advice:** Monitor your symptoms and follow basic care. Consult a doctor if symptoms worsen."
        
        response += "\n\n⚕️ **Disclaimer:** This is AI-generated information for educational purposes only. Always consult healthcare professionals for medical advice."
        
        return response
        
    except Exception as e:
        return f"❌ An error occurred while analyzing your symptoms: {str(e)}. Please try again or consult a healthcare professional."

# Fallback function if model fails
def simple_symptom_advice(symptoms):
    common_advice = {
        'fever': 'Rest, stay hydrated, and monitor temperature. Consult a doctor if fever persists or exceeds 101.3°F (38.5°C).',
        'headache': 'Try rest, hydration, and over-the-counter pain relievers. See a doctor for severe or persistent headaches.',
        'cough': 'Stay hydrated, use a humidifier, and avoid irritants. Consult a doctor if cough persists or produces blood.',
        'fatigue': 'Ensure adequate sleep, maintain good nutrition, and manage stress. See a doctor if fatigue is severe or persistent.',
        'nausea': 'Try small, frequent meals and stay hydrated. Consult a doctor if accompanied by severe symptoms.',
    }
    
    advice_given = []
    for symptom in symptoms:
        symptom_lower = symptom.lower()
        for key, advice in common_advice.items():
            if key in symptom_lower:
                advice_given.append(f"For {key}: {advice}")
                break
    
    if advice_given:
        return "Based on your symptoms:\n\n" + "\n\n".join(advice_given) + "\n\n⚕️ Always consult healthcare professionals for proper medical advice."
    else:
        return "⚠️ Please consult a healthcare professional for proper evaluation of your symptoms."

if __name__ == "__main__":
    if MODEL_LOADED:
        print("Model loaded successfully!")
        print("Train/Test Split Accuracy:", clf.score(x_test, y_test) if 'x_test' in globals() else "N/A")
        
        # Test prediction
        test_symptoms = ['fever', 'headache']
        result = predict_disease(test_symptoms)
        print("\nTest prediction:")
        print(result)
    else:
        print("Model failed to load.")