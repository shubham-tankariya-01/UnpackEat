# main.py

from fastapi import FastAPI
from services.extractor import extract_product_data
from services.normalizer import normalize
from services.analyzer import analyze
from services.formatter import format_response
from services.fetcher import fetch_product_from_api

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Food Analyzer running"}

@app.get("/product/{barcode}")
async def get_product(barcode: str, debug: bool = False):

    raw = await fetch_product_from_api(barcode)
    extracted = extract_product_data(raw)
    normalized = normalize(extracted)
    analyzed = analyze(normalized)

    final = format_response(normalized, analyzed)

    return final

# To test barcodes

# Everest
# 8901786060504

# Crunchex
# 8906010501570
# 8906010500511
# 8901058023800
# 8904004400779
# 8901719130144
# 8906105030039
# 8901595971220
# 7622202818516
# 8908005144632
# 8901063367319
# 8903363010209 
# 8903363002921 
# 8903363006820 
# 8903363010339 
# 8901262130325 
# 8903363001092 
# 8903363010711