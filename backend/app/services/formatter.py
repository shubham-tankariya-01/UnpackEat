# formatter.py

def format_response(normalized, analyzed):
    """
    Force EXACT key order for frontend.
    """

    return {
        "barcode": normalized["product"]["code"],
        "product": normalized["product"],
        "highlights": analyzed["highlights"],
        "nutrients": analyzed["nutrients"],
        "nutrient_radar": analyzed["nutrient_radar"],
        "ingredients": {
            "text": normalized["ingredients"]["text"],
            "ingredients": normalized["ingredients"]["ingredients"],
            "additives": normalized["ingredients"]["additives"],
            "dominant": normalized["ingredients"]["dominant"],
            "contains_palm_oil": normalized["ingredients"]["contains_palm_oil"],
            "complexity": (
                "Highly complex"
                if normalized["ingredients"]["total_count"] > 20 else
                "Moderately complex"
                if normalized["ingredients"]["total_count"] > 10 else
                "Simple formulation"
            )
        },
        "additives_full": analyzed["additives_full"],
        "allergens": normalized["metadata"]["allergens"],
        "serving": analyzed["serving"],
        "environment": {
            "ecoscore": normalized["metadata"]["ecoscore"],
            "packaging": normalized["metadata"]["packaging"]
        }
    }
