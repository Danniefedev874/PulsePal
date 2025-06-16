import pandas as pd
import numpy as np
import re
import csv
import os
from sklearn import preprocessing, tree
from sklearn.model_selection import train_test_split

# Define absolute paths to data
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Global variables
MODEL_LOADED = False
clf = None
le = None
cols = None
reduced_data = None
severity_dict = {}
description_dict = {}
precaution_dict = {}

# Common symptom mappings to dataset columns
SYMPTOM_MAPPINGS = {
    'fever': ['high_fever', 'mild_fever'],
    'headache': ['headache'],
    'cough': ['cough'],
    'fatigue': ['fatigue'],
    'tired': ['fatigue'],
    'nausea': ['nausea'],
    'vomiting': ['vomiting'],
    'stomach pain': ['stomach_pain', 'abdominal_pain'],
    'belly pain': ['belly_pain', 'abdominal_pain', 'stomach_pain'],
    'chest pain': ['chest_pain'],
    'back pain': ['back_pain'],
    'joint pain': ['joint_pain'],
    'muscle pain': ['muscle_pain'],
    'neck pain': ['neck_pain'],
    'diarrhea': ['diarrhoea'],
    'diarrhoea': ['diarrhoea'],
    'constipation': ['constipation'],
    'itching': ['itching'],
    'skin rash': ['skin_rash'],
    'rash': ['skin_rash'],
    'breathing': ['breathlessness'],
    'shortness of breath': ['breathlessness'],
    'sweating': ['sweating'],
    'chills': ['chills'],
    'shivering': ['shivering'],
    'dizziness': ['dizziness'],
    'weakness': ['weakness_in_limbs', 'muscle_weakness'],
    'loss of appetite': ['loss_of_appetite'],
    'weight loss': ['weight_loss'],
    'weight gain': ['weight_gain'],
    'anxiety': ['anxiety'],
    'depression': ['depression'],
    'mood swings': ['mood_swings'],
    'runny nose': ['runny_nose'],
    'sore throat': ['throat_irritation'],
    'throat pain': ['throat_irritation'],
    'sinus': ['sinus_pressure'],
    'congestion': ['congestion'],
    'sneezing': ['continuous_sneezing'],
    'bloody stool': ['bloody_stool'],
    'dark urine': ['dark_urine'],
    'yellow urine': ['yellow_urine'],
    'knee pain': ['knee_pain'],
    'hip pain': ['hip_joint_pain'],
    'stiff neck': ['stiff_neck'],
    'blurred vision': ['blurred_and_distorted_vision'],
    'red eyes': ['redness_of_eyes'],
    'swollen legs': ['swollen_legs'],
    'fast heart rate': ['fast_heart_rate'],
    'palpitations': ['palpitations'],
    'indigestion': ['indigestion'],
    'acidity': ['acidity'],
    'dehydration': ['dehydration'],
    'lethargy': ['lethargy'],
    'restlessness': ['restlessness'],
    'burning urination': ['burning_micturition'],
    'frequent urination': ['spotting_ urination'],
    'cold hands': ['cold_hands_and_feets'],
    'cold feet': ['cold_hands_and_feets'],
    'yellowish skin': ['yellowish_skin'],
    'yellow skin': ['yellowish_skin'],
    'muscle wasting': ['muscle_wasting'],
    'patches throat': ['patches_in_throat'],
    'sunken eyes': ['sunken_eyes'],
    'pain behind eyes': ['pain_behind_the_eyes'],
    'swelling stomach': ['swelling_of_stomach'],
    'swollen lymph nodes': ['swelled_lymph_nodes'],
    'phlegm': ['phlegm'],
    'bruising': ['bruising'],
    'obesity': ['obesity'],
    'puffy face': ['puffy_face_and_eyes'],
    'enlarged thyroid': ['enlarged_thyroid'],
    'brittle nails': ['brittle_nails'],
    'excessive hunger': ['excessive_hunger'],
    'slurred speech': ['slurred_speech'],
    'stiff joints': ['movement_stiffness'],
    'spinning': ['spinning_movements'],
    'loss of balance': ['loss_of_balance'],
    'loss of smell': ['loss_of_smell'],
    'bladder discomfort': ['bladder_discomfort'],
    'foul urine smell': ['foul_smell_of urine'],
    'gases': ['passage_of_gases'],
    'internal itching': ['internal_itching'],
    'red spots': ['red_spots_over_body'],
    'abnormal menstruation': ['abnormal_menstruation'],
    'watering eyes': ['watering_from_eyes'],
    'increased appetite': ['increased_appetite'],
    'polyuria': ['polyuria'],
    'bloody sputum': ['blood_in_sputum'],
    'prominent veins': ['prominent_veins_on_calf'],
    'painful walking': ['painful_walking'],
    'pimples': ['pus_filled_pimples'],
    'blackheads': ['blackheads'],
    'skin peeling': ['skin_peeling'],
    'small nail dents': ['small_dents_in_nails'],
    'inflammatory nails': ['inflammatory_nails'],
    'blister': ['blister'],
    'red sore nose': ['red_sore_around_nose'],
    'yellow crust': ['yellow_crust_ooze']
}

def load_model():
    global MODEL_LOADED, clf, le, cols, reduced_data, severity_dict, description_dict, precaution_dict
    
    try:
        print("Loading ML model...")
        
        # Load training data
        training_path = os.path.join(BASE_DIR, 'Data', 'Training.csv')
        testing_path = os.path.join(BASE_DIR, 'Data', 'Testing.csv')
        
        print(f"Training data path: {training_path}")
        print(f"File exists: {os.path.exists(training_path)}")
        
        training = pd.read_csv(training_path)
        testing = pd.read_csv(testing_path)
        
        print(f"Training data shape: {training.shape}")
        print(f"Columns: {list(training.columns[:5])}...")
        
        cols = training.columns[:-1]
        x = training[cols]
        y = training['prognosis']
        
        print(f"Features: {len(cols)}")
        print(f"Unique diseases: {len(y.unique())}")
        
        # Label encoding
        le = preprocessing.LabelEncoder()
        y_encoded = le.fit_transform(y)
        
        # Train/test split
        x_train, x_test, y_train, y_test = train_test_split(x, y_encoded, test_size=0.33, random_state=42)
        
        # Train model
        clf = tree.DecisionTreeClassifier()
        clf.fit(x_train, y_train)
        
        print(f"Model accuracy: {clf.score(x_test, y_test):.2f}")
        
        reduced_data = training.groupby(training['prognosis']).max()
        
        # Load additional data files
        load_severity_dict()
        load_description_dict()
        load_precaution_dict()
        
        MODEL_LOADED = True
        print("ML model loaded successfully!")
        
    except Exception as e:
        print(f"Error loading ML model: {e}")
        import traceback
        traceback.print_exc()
        MODEL_LOADED = False

def load_severity_dict():
    global severity_dict
    try:
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
            print(f"Loaded {len(severity_dict)} severity mappings")
    except Exception as e:
        print(f"Error loading severity dict: {e}")

def load_description_dict():
    global description_dict
    try:
        description_file = os.path.join(BASE_DIR, 'Data', 'symptom_Description.csv')
        if os.path.exists(description_file):
            with open(description_file) as f:
                reader = csv.reader(f)
                next(reader, None)  # Skip header if present
                for rows in reader:
                    if len(rows) >= 2:
                        description_dict[rows[0]] = rows[1]
            print(f"Loaded {len(description_dict)} descriptions")
    except Exception as e:
        print(f"Error loading description dict: {e}")

def load_precaution_dict():
    global precaution_dict
    try:
        precaution_file = os.path.join(BASE_DIR, 'Data', 'symptom_precaution.csv')
        if os.path.exists(precaution_file):
            with open(precaution_file) as f:
                reader = csv.reader(f)
                next(reader, None)  # Skip header if present
                for rows in reader:
                    if len(rows) >= 2:
                        precautions = [p.strip() for p in rows[1:] if p.strip()]
                        if precautions:
                            precaution_dict[rows[0]] = precautions
            print(f"Loaded {len(precaution_dict)} precaution sets")
    except Exception as e:
        print(f"Error loading precaution dict: {e}")

def map_symptoms_to_columns(symptoms):
    """Map user symptoms to dataset column names"""
    mapped_columns = []
    user_text = ' '.join(symptoms).lower()
    
    # First try exact mappings
    for user_symptom in symptoms:
        user_symptom_lower = user_symptom.lower().strip()
        if user_symptom_lower in SYMPTOM_MAPPINGS:
            mapped_columns.extend(SYMPTOM_MAPPINGS[user_symptom_lower])
    
    # Then try partial mappings
    for mapped_symptom, column_names in SYMPTOM_MAPPINGS.items():
        if mapped_symptom in user_text and mapped_symptom not in [s.lower() for s in symptoms]:
            mapped_columns.extend(column_names)
    
    # Finally try direct column matches
    for symptom in symptoms:
        clean_symptom = symptom.lower().replace(' ', '_')
        if clean_symptom in cols:
            mapped_columns.append(clean_symptom)
    
    return list(set(mapped_columns))  # Remove duplicates

def predict_disease(symptom_list, days=1):
    global MODEL_LOADED, clf, le, cols, reduced_data, severity_dict, description_dict, precaution_dict
    
    # Load model if not already loaded
    if not MODEL_LOADED:
        load_model()
    
    if not MODEL_LOADED:
        return "❌ The AI model failed to load. Please check the data files and try again."
    
    if not symptom_list:
        return "⚠️ Please provide some symptoms to analyze."
    
    try:
        print(f"Analyzing symptoms: {symptom_list}")
        
        # Map symptoms to dataset columns
        mapped_columns = map_symptoms_to_columns(symptom_list)
        
        print(f"Mapped columns: {mapped_columns}")
        
        if not mapped_columns:
            # Try fuzzy matching as fallback
            matched_symptoms = []
            for symptom in symptom_list:
                clean_symptom = symptom.lower().replace(' ', '_')
                for col in cols:
                    if clean_symptom in col.lower() or any(word in col.lower() for word in clean_symptom.split('_')):
                        matched_symptoms.append(col)
                        break
            
            if not matched_symptoms:
                common_symptoms = ['fever', 'headache', 'cough', 'fatigue', 'nausea', 'stomach pain', 'chest pain', 'back pain', 'joint pain', 'diarrhea']
                return f"⚠️ Could not match your symptoms to our database.\n\nYou mentioned: {', '.join(symptom_list)}\n\nTry using common terms like: {', '.join(common_symptoms)}"
            
            mapped_columns = matched_symptoms
        
        # Create input vector
        input_vector = np.zeros(len(cols))
        final_matched_symptoms = []
        
        for symptom_col in mapped_columns:
            if symptom_col in cols:
                idx = list(cols).index(symptom_col)
                input_vector[idx] = 1
                final_matched_symptoms.append(symptom_col)
        
        print(f"Final matched symptoms: {final_matched_symptoms}")
        
        if not final_matched_symptoms:
            return "⚠️ No symptoms could be matched to our medical database. Please try using different medical terminology."
        
        # Make prediction
        input_df = pd.DataFrame([input_vector], columns=cols)
        prediction = clf.predict(input_df)[0]
        predicted_disease = le.inverse_transform([prediction])[0]
        
        print(f"Predicted disease: {predicted_disease}")
        
        # Build response
        response = f"🩺 **Medical Analysis Results**\n\n"
        response += f"**Possible Condition:** {predicted_disease}\n\n"
        response += f"**Symptoms Analyzed:** {', '.join([s.replace('_', ' ').title() for s in final_matched_symptoms])}\n\n"
        
        # Add description
        if predicted_disease in description_dict:
            response += f"**About this condition:** {description_dict[predicted_disease]}\n\n"
        
        # Add precautions
        if predicted_disease in precaution_dict:
            response += "**Recommended Actions:**\n"
            for i, precaution in enumerate(precaution_dict[predicted_disease], 1):
                if precaution.strip():
                    response += f"{i}. {precaution.strip()}\n"
            response += "\n"
        
        # Calculate severity
        severity_score = sum(severity_dict.get(sym.replace('_', ' '), 1) for sym in final_matched_symptoms)
        risk_level = (severity_score * max(days, 1)) / (len(final_matched_symptoms) + 1)
        
        if risk_level > 10:
            response += "🚨 **URGENT:** Based on symptom severity and duration, please seek immediate medical attention."
        elif risk_level > 5:
            response += "⚠️ **RECOMMENDATION:** Consider consulting a healthcare professional if symptoms persist or worsen."
        else:
            response += "ℹ️ **ADVICE:** Monitor your symptoms and follow the recommended actions. Seek medical care if symptoms worsen."
        
        response += "\n\n⚕️ **Medical Disclaimer:** This AI analysis is for informational purposes only and should not replace professional medical diagnosis or treatment. Always consult qualified healthcare professionals for medical concerns."
        
        print("Response generated successfully")
        return response
        
    except Exception as e:
        print(f"Error in predict_disease: {e}")
        import traceback
        traceback.print_exc()
        return f"❌ An error occurred during medical analysis: {str(e)}. Please try again or consult a healthcare professional immediately."

# Initialize on import
load_model()

if __name__ == "__main__":
    print("Testing enhanced chatbot engine...")
    
    test_cases = [
        ["fever", "headache"],
        ["cough", "chest pain"],
        ["stomach pain", "nausea"],
        ["fatigue", "joint pain"],
        ["itching", "skin rash"],
        ["diarrhea", "dehydration"]
    ]
    
    for symptoms in test_cases:
        print(f"\nTesting: {symptoms}")
        result = predict_disease(symptoms)
        print(f"Result: {result[:300]}...")
        print("-" * 50)