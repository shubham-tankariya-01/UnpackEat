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

def is_additive_id(id_value):
    if not id_value:
        return False
    return bool(re.match(r"en:e\d+", id_value.lower()))

def normalize(extracted):

    nutrients = extracted["nutrients_raw"]

    # ingredients split into two groups
    all_ingredients = extracted["ingredients_raw"]["structured"]
    ingredient_objects = []
    additive_objects = []

    for ing in all_ingredients:
        obj = normalize_ingredient(ing)
        if is_additive_id(obj["id"]):
            additive_objects.append(obj)
        else:
            ingredient_objects.append(obj)

    # dominant top 4 by percent if exists
    dom = []
    for ing in all_ingredients:
        pct = ing.get("percent_estimate") or ing.get("percent")
        if pct:
            dom.append({
                "ingredient": ing.get("text"),
                "percent": pct
            })
    dom = sorted(dom, key=lambda x: x["percent"], reverse=True)[:4]

    return {
        "product": extracted["product"],
        "nutrients": nutrients,
        "ingredients": {
            "text": extracted["ingredients_raw"]["text"],
            "ingredients": ingredient_objects,
            "additives": additive_objects,
            "dominant": dom,
            "contains_palm_oil": any(
                "palm" in (i.get("id") or "") or
                "palm" in (i.get("text") or "").lower()
                for i in all_ingredients
            ),
            "total_count": len(all_ingredients),
        },
        "additives_raw": extracted["additives_raw"],
        "allergens_raw": extracted["metadata_raw"]["allergens"],
        "serving": extracted["serving_raw"],
        "metadata": extracted["metadata_raw"]
    }
