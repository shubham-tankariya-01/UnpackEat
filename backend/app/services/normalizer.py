# normalizer.py

import re

def normalize_ingredient(item):
    return {
        "id": item.get("id"),
        "text": item.get("text"),
        "percent_estimate": item.get("percent_estimate"),
        "percent_min": item.get("percent_min"),
        "percent_max": item.get("percent_max"),
        "vegan": item.get("vegan"),
        "vegetarian": item.get("vegetarian"),
        "ciqual_proxy_food_code": item.get("ciqual_proxy_food_code"),
        "ciqual_food_code": item.get("ciqual_food_code"),
        "ecobalyse_code": item.get("ecobalyse_code"),
        "from_palm_oil": item.get("from_palm_oil"),
        "is_in_taxonomy": item.get("is_in_taxonomy"),
    }

def is_additive(item):
    idv = item.get("id") or ""
    return bool(re.match(r"en:e\d+", idv.lower()))

def normalize(extracted):

    raw_ing = extracted["ingredients_raw"]["structured"]

    ingredients = []
    additives = []
    for ing in raw_ing:
        n = normalize_ingredient(ing)
        if is_additive(ing):
            additives.append(n)
        else:
            ingredients.append(n)

    # Deduplicate additives (same code repeated)
    uniq = {}
    for a in additives:
        code = (a["id"] or "").replace("en:", "").upper()
        if code not in uniq:
            uniq[code] = a
    additives = list(uniq.values())

    # Dominant ingredients
    dom = []
    for ing in raw_ing:
        pct = ing.get("percent_estimate") or ing.get("percent")
        if pct:
            dom.append({"ingredient": ing.get("text"), "percent": pct})
    dom = sorted(dom, key=lambda x: x["percent"], reverse=True)[:4]

    return {
        "product": extracted["product"],
        "nutrients": extracted["nutrients"],
        "ingredients": {
            "text": extracted["ingredients_raw"]["text"],
            "ingredients": ingredients,
            "additives": additives,
            "dominant": dom,
            "contains_palm_oil": any(
                "palm" in (i.get("id") or "")
                or "palm" in (i.get("text") or "").lower()
                for i in raw_ing
            ),
            "total_count": len(raw_ing),
        },
        "allergens": extracted["allergens_raw"],
        "serving": extracted["serving"],
        "metadata": extracted["metadata"]
    }
