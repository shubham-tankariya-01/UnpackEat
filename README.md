# UnPackEat

UnPackEat is a smart food and product scanning platform designed to help users understand what they are buying. The goal is simple: scan a product, fetch the relevant information, and get instant insights about nutrition, ingredients, health impact, and safer alternatives.

## Objective

The project focuses on making food information easy to access and understand by:

- Scanning a barcode or product input
- Retrieving product details from available data sources
- Extracting key nutrition and ingredient information
- Analyzing health relevance and quality
- Presenting a clear summary to the user

This helps users make more informed choices about food products, especially when they want to check ingredients, nutrition values, or health warnings quickly.

## Key Features

- Barcode-based product lookup
- Product information retrieval from APIs and local datasets
- Ingredient and nutrition extraction
- Health analysis and risk evaluation
- Personalized recommendations based on overall product quality
- Clean API response structure for frontend integration

## How It Works

1. User provides product input
   - Barcode scan
   - Manual search
   - Product image or label

2. Product data is retrieved
   - Local dataset is checked first
   - External product information is fetched when needed

3. Data is processed
   - Nutritional values are extracted
   - Ingredients are evaluated
   - Claims and product quality are reviewed

4. Result is generated
   - Summary of health impact
   - Key product details
   - Suggestions or warnings

## Tech Stack

- Node.js + Express for the web/server side
- MongoDB for user and application data
- Python + FastAPI for product analysis engine
- EJS for server-side templates
- External product APIs and local JSON data samples

## Project Structure

```text
UnPackEat/
├── README.md
├── Server/
│   ├── app.js
│   ├── models/
│   ├── middlewares/
│   ├── complete_data/
│   ├── node_modules/
│   └── backend/
│       └── app/
│           ├── main.py
│           ├── requirements.txt
│           └── services/
│               ├── fetcher.py
│               ├── extractor.py
│               └── analyzer.py
├── client/
└── .vscode/
```

## Backend API

The core product analysis API is built with FastAPI and exposes product information using a barcode.

### Example endpoint

```http
GET /product/{barcode}
```

Example:

```http
GET /product/8906010501570
```

This returns a structured JSON response containing:

- `summary`: analyzed result and health assessment
- `details`: product metadata, ingredients, and extracted information

## Local Setup

### 1) Install Node dependencies

```bash
cd Server
npm install
```

### 2) Run the Node server

```bash
node app.js
```

The Express server runs on:

```text
http://localhost:8080
```

### 3) Set up the Python API

```bash
cd Server/backend/app
python -m venv venv
```

Activate the virtual environment:

- Windows:

```bash
venv\Scripts\activate
```

- macOS/Linux:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the API:

```bash
fastapi dev app/main.py
```

or:

```bash
uvicorn main:app --reload
```

The FastAPI app runs on:

```text
http://localhost:8000
```

API docs are available at:

```text
http://localhost:8000/docs
```

## Example Response

```json
{
  "summary": {
    "health_score": "Good",
    "warnings": ["High sugar content"],
    "recommendation": "Consume in moderation"
  },
  "details": {
    "product_name": "Sample Product",
    "brand": "Sample Brand",
    "ingredients": {
      "ingredients_text": "Sugar, flour, palm oil",
      "total_count": 3
    },
    "nutrition": {
      "energy": "250 kcal",
      "sugar": "14g"
    }
  }
}
```

## Purpose Summary

UnPackEat is built to scan and fetch product information quickly, making it easier for people to understand what they eat. It combines product scanning, information retrieval, and health analysis into one simple system that turns raw product data into useful, readable insights.

## License

This project is currently maintained for educational and prototype use.

## Contributors

This project was developed as a hackathon-style solution focused on product awareness and healthier food decisions.
