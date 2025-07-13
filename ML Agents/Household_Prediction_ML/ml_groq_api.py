from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import os
import re
from dotenv import load_dotenv  

load_dotenv()  

# Load Groq API key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Initialize FastAPI app
app = FastAPI()

# Input schema
class ReorderPredictionRequest(BaseModel):
    productName: str
    brand: str
    quantityRemaining: float
    pricePerUnit: float
    familySize: int
    monthlyBudget: float
    festivalFlag: bool
    consumptionRate: float

# Output schema
class ReorderPredictionResponse(BaseModel):
    predictedQuantity: int

@app.post("/predict-reorder-groq", response_model=ReorderPredictionResponse)
def predict_reorder(request: ReorderPredictionRequest):
    # Prompt to send to Groq
    prompt = (
        f"You are a reorder quantity predictor. Predict only the reorder quantity (as an integer).\n"
        f"Do not include any product ID or explanation. Just return the quantity as a number.\n\n"
        f"- Product: {request.productName} ({request.brand})\n"
        f"- Quantity remaining: {request.quantityRemaining} units\n"
        f"- Price per unit: ₹{request.pricePerUnit}\n"
        f"- Family size: {request.familySize}\n"
        f"- Monthly budget: ₹{request.monthlyBudget}\n"
        f"- Festival month: {'Yes' if request.festivalFlag else 'No'}\n"
        f"- Consumption rate: {request.consumptionRate} units/day\n\n"
        f"Only output the reorder quantity as a number for next month considering Consumption rate, nothing else."
    )

    try:
        # Call Groq API
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama3-8b-8192",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.3
            }
        )
        response.raise_for_status()
        result = response.json()
        content = result['choices'][0]['message']['content']

        # Extract the first integer using regex
        match = re.search(r'\b\d+\b', content)
        if not match:
            raise ValueError("No valid integer found in model response")

        quantity = int(match.group())

        return ReorderPredictionResponse(predictedQuantity=quantity)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
