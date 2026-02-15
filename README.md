# CropAdvisor 🌾

CropAdvisor is an intelligent agricultural recommendation system designed to help farmers make data-driven decisions. By analyzing soil composition, weather patterns, and market trends, CropAdvisor suggests the most suitable crops to grow and predicts their potential profitability.

## 🚀 Features

- **AI-Powered Crop Recommendation**: Uses machine learning to analyze soil (N, P, K, pH) and climatic conditions (temperature, humidity, rainfall) to recommend the best crops.
- **Market Price Prediction**: Estimates crop prices based on location (State, District, Market) and historical data to help farmers maximize profit.
- **Real-time Insights**: Provides actionable insights tailored to specific seasons (Rabi, Kharif, Summer).
- **Multilingual Support**: Accessible to a wider audience with internationalization support.
- **Modern UI/UX**: A beautiful, responsive interface built with React, Tailwind CSS, and Shadcn UI.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **State Management**: React Query
- **Icons**: Lucide React
- **Animations**: Tailwind Animate / Framer Motion (implied)

### Backend
- **Framework**: FastAPI (Python)
- **Machine Learning**: 
  - Scikit-learn (Random Forest/Decision Trees for suitability)
  - TensorFlow/Keras (Neural Networks for price prediction)
- **Data Processing**: Pandas, NumPy
- **Serialization**: Joblib

## 📂 Project Structure

```
CropAdvisor/
├── backend/               # FastAPI backend and ML models
│   ├── main.py            # API entry point
│   ├── ml_model_tf.py     # TensorFlow model definitions
│   ├── all_models.pkl     # Serialized ML models
│   ├── ...                # Other model files (.keras, .csv)
│
├── front/                 # React frontend
│   ├── src/               # Source code
│   ├── public/            # Static assets
│   ├── index.html         # Entry HTML
│   └── ...                # Config files (vite, tailwind, etc.)
```

## ⚡ Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Python (v3.8+ recommended)

### 1. Backend Setup

Navigate to the `backend` directory:
```bash
cd backend
```

Create a virtual environment (optional but recommended):
```bash
python -m venv venv
# Windows
.\venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Run the server:
```bash
python main.py
```
The API will be available at `http://localhost:8000`. You can view the API docs at `http://localhost:8000/docs`.

### 2. Frontend Setup

Navigate to the `front` directory:
```bash
cd front
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```
The application will run at `http://localhost:5173` (or the port shown in your terminal).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
