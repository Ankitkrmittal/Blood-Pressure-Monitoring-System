from fastapi import FastAPI
import joblib

# create FastAPI app
app = FastAPI()

# load trained model
model = joblib.load("hypertension_model.pkl")


def generate_recommendations(risk):

    if risk == 0:
        return [
            "Maintain healthy diet",
            "Exercise regularly",
            "Check BP weekly"
        ]

    elif risk == 1:
        return [
            "Reduce salt intake",
            "Walk 30 minutes daily",
            "Monitor BP daily"
        ]

    elif risk == 2:
        return [
            "Consult doctor",
            "Avoid smoking",
            "Exercise under supervision",
            "Check BP twice daily"
        ]

    else:
        return [
            "Immediate doctor consultation",
            "Strict low sodium diet",
            "Medication required",
            "Continuous BP monitoring"
        ]


@app.post("/predict")
def predict(data: dict):

    age = data["age"]
    weight = data["weight"]
    systolic = data["systolic"]
    diastolic = data["diastolic"]
    smoking = data["smoking"]
    exercise = data["exercise"]

    prediction = model.predict([[
        age, weight, systolic, diastolic, smoking, exercise
    ]])

    risk = int(prediction[0])

    recommendations = generate_recommendations(risk)

    return {
        "risk_level": risk,
        "recommendations": recommendations
    }