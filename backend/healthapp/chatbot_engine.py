import pandas as pd
import numpy as np
import re
import csv
import os
from sklearn import preprocessing, tree
from sklearn.model_selection import train_test_split

# Define absolute paths to data
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

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

# Load dictionaries
severity_dict = {}
description_dict = {}
precaution_dict = {}

def load_dictionaries():
    global severity_dict, description_dict, precaution_dict

    with open(os.path.join(BASE_DIR, 'MasterData', 'symptom_severity.csv')) as f:
        reader = csv.reader(f)
        severity_dict = {rows[0]: int(rows[1]) for rows in reader if len(rows) >= 2}

    with open(os.path.join(BASE_DIR, 'MasterData', 'symptom_Description.csv')) as f:
        reader = csv.reader(f)
        description_dict = {rows[0]: rows[1] for rows in reader if len(rows) >= 2}

    with open(os.path.join(BASE_DIR, 'MasterData', 'symptom_precaution.csv')) as f:
        reader = csv.reader(f)
        precaution_dict = {rows[0]: rows[1:] for rows in reader if len(rows) >= 5}

load_dictionaries()

# Core function
def predict_disease(symptom_list: list[str], days: int = 1) -> str:
    symptom_list = [s.replace(' ', '_') for s in symptom_list]
    input_vector = np.zeros(len(cols))
    matched_symptoms = []

    for symptom in symptom_list:
        matched = False
        for feature in cols:
            if re.search(symptom, feature, re.IGNORECASE):
                idx = list(cols).index(feature)
                input_vector[idx] = 1
                matched_symptoms.append(feature)
                matched = True
                break

    if not matched_symptoms:
        return "⚠️ None of your symptoms matched known entries. Please try again with common medical terms."

    try:
        input_df = pd.DataFrame([input_vector], columns=cols)
        prediction = clf.predict(input_df)[0]
    except Exception as e:
        return f"❌ Prediction failed: {e}"

    predicted_disease = le.inverse_transform([prediction])[0]

    try:
        row = reduced_data.loc[predicted_disease]
        if isinstance(row, pd.Series):
            symptom_vector = row.to_numpy()
        else:
            symptom_vector = row.to_numpy()[0]
        symptom_vector = np.atleast_1d(symptom_vector)
        indices = np.nonzero(symptom_vector)[0]
        symptoms_given = cols[indices]
    except Exception as e:
        return f"❌ Failed to extract symptoms for {predicted_disease}. Error: {e}"

    experienced = [sym for sym in symptoms_given if sym in matched_symptoms]

    response = f"🩺 **Diagnosis:** {predicted_disease}\n\n"
    response += f"🧾 **Description:** {description_dict.get(predicted_disease, 'No description available.')}\n\n"
    response += f"✅ **Recommended Precautions:**\n"
    for i, item in enumerate(precaution_dict.get(predicted_disease, []), 1):
        response += f"{i}. {item}\n"

    severity_score = sum(severity_dict.get(sym, 0) for sym in matched_symptoms)
    risk = (severity_score * days) / (len(matched_symptoms) + 1)
    response += "\n"
    if risk > 13:
        response += "⚠️ Based on symptom severity and duration, consult a doctor immediately."
    else:
        response += "ℹ️ Risk is manageable. Monitor symptoms and follow precautions."

    return response
if __name__ == "__main__":
    print("Evaluating model...")
    print("Train/Test Split Accuracy:", clf.score(x_test, y_test))

    from sklearn.model_selection import cross_val_score
    scores = cross_val_score(clf, x, y_encoded, cv=5)
    print("5-Fold Cross-Validation Accuracy:", scores.mean())
