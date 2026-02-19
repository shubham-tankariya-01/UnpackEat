# analyzer.py

ADDITIVE_INFO = {
    "E150D": {"name": "Caramel Color IV", "risk": "high", "explanation": "May contain 4-MEI."},
    "E412": {"name": "Guar Gum", "risk": "low", "explanation": "Safe thickener."},
    "E500I": {"name": "Sodium Carbonate", "risk": "low", "explanation": "Basic regulator."},
    "E501I": {"name": "Potassium Carbonate", "risk": "low", "explanation": "Stabilizer."},
    "E508": {"name": "Potassium Chloride", "risk": "moderate", "explanation": "Salt substitute."},
    "E451I": {"name": "Sodium Triphosphate", "risk": "moderate", "explanation": "Phosphate imbalance risk."},
    "E330": {"name": "Citric Acid", "risk": "low", "explanation": "Common regulator."},
}

def rating_color(metric, value):
    if value is None: return "neutral"
    if metric == "salt": return "red" if value > 1 else "orange" if value > 0.5 else "green"
    if metric == "saturated_fat": return "red" if value > 5 else "orange" if value > 3 else "green"
    if metric == "sugars": return "orange" if value > 10 else "green"
    if metric == "fiber": return "green" if value >= 3 else "orange" if value > 1 else "red"
    return "neutral"

def analyze(normalized):

    n = normalized["nutrients"]
    ing = normalized["ingredients"]
    m = normalized["metadata"]
    s = normalized["serving"]

    score = 100
    likes = []
    concerns = []

    # scoring
    if n["salt"] and n["salt"] > 1: score -= 20; concerns.append("High salt")
    else: likes.append("Low salt")

    if n["saturated_fat"] and n["saturated_fat"] > 5:
        score -= 20
        concerns.append("High saturated fat")
    else:
        likes.append("Low saturated fat")

    if n["fiber"] and n["fiber"] >= 3: likes.append("Good fiber content")
    if n["protein"] and n["protein"] >= 10: likes.append("High protein")
    if ing["contains_palm_oil"]: concerns.append("Contains palm oil")

    if m["nova_group"] == 4:
        score -= 15
        concerns.append("Ultra-processed food")

    score = max(0, min(score, 100))

    # RDA
    RDA = {
        "salt": 5,
        "saturated_fat": 20,
        "sugars": 50,
        "fiber": 25,
        "protein": 50,
        "fat": 70,
        "energy_kcal": 2000
    }

    nutrients_list = []
    for key, val in n.items():
        if val is not None:
            nutrients_list.append({
                "name": key,
                "amount_100g": val,
                "unit": "g" if key != "energy_kcal" else "kcal",
                "rda_percent": round((val / RDA.get(key, 100)) * 100, 1),
                "rating": rating_color(key, val),
            })

    per_serv = {}
    sg = s.get("serving_size_g")
    if sg:
        for k, val in n.items():
            if val is not None:
                per_serv[k] = round((val * sg) / 100, 2)
    else:
        per_serv = None

    radar = {
        "salt": min(1, (n["salt"] or 0) / 2),
        "saturated_fat": min(1, (n["saturated_fat"] or 0) / 10),
        "sugars": min(1, (n["sugars"] or 0) / 20),
        "energy": min(1, (n["energy_kcal"] or 0) / 600),
        "fiber": min(1, (n["fiber"] or 0) / 10),
        "protein": min(1, (n["protein"] or 0) / 20),
    }

    additives_full = []
    for a in ing["additives"]:
        code = (a["id"] or "").replace("en:", "").upper()
        info = ADDITIVE_INFO.get(code, {
            "name": a.get("text") or code,
            "risk": "unknown",
            "explanation": "No reliable information."
        })
        additives_full.append({
            "code": code,
            "name": info["name"],
            "risk": info["risk"],
            "explanation": info["explanation"]
        })

    return {
        "highlights": {
            "health_score": score,
            "verdict": (
                "Healthy choice" if score >= 70 else
                "Moderate consumption recommended" if score >= 40 else
                "Limit consumption"
            ),
            "likes": likes,
            "concerns": concerns,
            "nova_group": m["nova_group"]
        },
        "nutrients": nutrients_list,
        "nutrient_radar": radar,
        "additives_full": additives_full,
        "serving": {
            "per_100g": n,
            "per_serving": per_serv,
            "serving_size_g": sg
        }
    }
