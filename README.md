# 🤖 AI-Powered Smart Reordering & Retail Inventory Forecasting System

A full-stack AI-powered platform to automate household product reordering and forecast retail inventory. Combines multiple frontend modules, a Spring Boot backend, and Groq-enhanced machine learning models written in Python and Bun.js (TypeScript).

---

## 📦 Project Structure

````text
Autonomous-Endpoints/
├── backend/                      # Spring Boot backend API
│   └── (Spring Boot project files)
│
├── frontend/                     # All frontend modules
│   ├── Household/               # Vite + React UI for households
│   ├── Retail-Inventory/       # Vite + React UI for store dashboard
│   └── Landing-Page/           # Public landing page (Vite + React)
│
├── ML-Agents/                    # Machine learning modules
│   ├── Household_Prediction_ML/ # Python + Groq API (for household reorder)
│   └── Retail_Inventory_ML/     # Bun.js + TypeScript + Groq API (for inventory forecast)
│
├── .gitignore
├── README.md

---

## 🧠 Project Theme & Features

We developed **Autonomous Endpoints**, a full-stack AI-powered platform that brings predictive intelligence to inventory and households.

- 🧱 **Backend**: Spring Boot + FastAPI, integrated with Groq-powered ML inference
- 🎨 **Frontend**: Vite + React + Tailwind CSS
- 🗃️ **Database**: Spring Data JPA + PostgreSQL

### 🧩 System Modules

1. **Retail Inventory Module**
   Predicts product demand, optimal reorder quantity, and ideal pricing for each store by learning from:

   - Historical sales
   - Seasonality & weather
   - Promotions & festivals
   - Competitor pricing

2. **Smart Household Module**
   Learns individual household consumption and automatically predicts when items (e.g. milk, rice, detergent) will run out:
   - Generates personalized reorder carts
   - Syncs with retail inventory for real-time fulfillment

### 💡 AI Highlights

- Unified AI engine using Groq LLM
- Forecasts with confidence intervals
- Suggests context-aware prices
- Optimizes stock quantity and order timing
- Real-time decisions for better availability

---

## 🛠️ Setup Instructions

```bash
# === Backend (Spring Boot) ===
cd backend/
./mvnw spring-boot:run
# OR
mvn clean install
mvn spring-boot:run
cd ..

# === Frontend - Household ===
cd frontend/Household/
npm install
npm run dev
cd ../..

# === Frontend - Retail Inventory ===
cd frontend/Retail-Inventory/
npm install
npm run dev
cd ../..

# === Frontend - Landing Page ===
cd frontend/Landing-Page/
npm install
npm run dev
cd ../..

# === ML - Household Reordering ===
cd ML-Agents/Household_Prediction_ML/
pip install -r requirements.txt
python app.py
cd ../..

# === ML - Retail Inventory Forecast ===
cd ML-Agents/Retail_Inventory_ML/
bun install
bun run index.ts
cd ../..
````

### 🔐 Environment Variable

Create a `.env` file in both ML modules with:

```env
GROQ_API_KEY=your_groq_api_key

```
