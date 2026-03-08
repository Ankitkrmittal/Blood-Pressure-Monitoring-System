from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib

# create FastAPI app
app = FastAPI()

# load trained model
model = joblib.load("hypertension_model.pkl")


# Request schema
class HealthData(BaseModel):
    age: int
    weight: float
    systolic: int
    diastolic: int
    smoking: int
    exercise: int


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


@app.get("/")
def home():
    return {"message": "Hypertension ML API running"}


@app.post("/predict")
def predict(data: HealthData):

    # convert input to dataframe (removes sklearn warning)
    input_data = pd.DataFrame([{
        "age": data.age,
        "weight": data.weight,
        "systolic": data.systolic,
        "diastolic": data.diastolic,
        "smoking": data.smoking,
        "exercise": data.exercise
    }])

    # prediction
    prediction = model.predict(input_data)

    risk = int(prediction[0])

    recommendations = generate_recommendations(risk)

    return {
        "risk_level": risk,
        "recommendations": recommendations
    }