import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

# 1. Load and clean data
df = pd.read_csv('dataset.csv')
df = df.loc[:, ~df.columns.str.contains('^Unnamed')]

# 2. Separate features and target
X = df.drop('Diagnosis', axis=1)
y = df['Diagnosis']

# 3. Encode symptoms (X) and diagnosis (y)
X = X.notnull().astype(int)
le = LabelEncoder()
y_encoded = le.fit_transform(y)

# 4. Train model
clf = RandomForestClassifier(n_estimators=100)
clf.fit(X, y_encoded)

# 5. Save model and encoder for later use
joblib.dump(clf, 'model.joblib')
joblib.dump(le, 'label_encoder.joblib')
