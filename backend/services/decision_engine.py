"""
Transparent Crop Decision Engine

A pure service module (no Flask imports) that layers multi-factor
weighted scoring, risk assessment, and explainable AI output on top
of the existing ML crop prediction pipeline.
"""

from typing import TypedDict, Optional

# ──────────────────────────────────────────────────────────────────
# Section 1: Type definitions
# ──────────────────────────────────────────────────────────────────

class CropInputs(TypedDict):
    """Validated input structure for the decision engine."""
    n: float            # Nitrogen (mg/kg)
    p: float            # Phosphorus (mg/kg)
    k: float            # Potassium (mg/kg)
    temperature: float  # °C
    humidity: float     # %
    ph: float           # 0–14
    rainfall: float     # mm
    market_trend: Optional[float]  # 0–1 demand index, optional


# ──────────────────────────────────────────────────────────────────
# Section 2: Constants
# ──────────────────────────────────────────────────────────────────

# Ideal agronomic ranges per crop.
# Each crop maps to a dict of parameter → (min_ideal, max_ideal).
CROP_REQUIREMENTS: dict[str, dict[str, tuple[float, float]]] = {
    "rice":       {"n": (60, 100),  "p": (35, 60),  "k": (35, 55),  "temperature": (22, 32),  "ph": (5.5, 7.0),  "humidity": (75, 95)},
    "wheat":      {"n": (80, 120),  "p": (40, 70),  "k": (30, 50),  "temperature": (12, 25),  "ph": (6.0, 7.5),  "humidity": (50, 70)},
    "maize":      {"n": (60, 100),  "p": (35, 60),  "k": (30, 50),  "temperature": (18, 32),  "ph": (5.5, 7.5),  "humidity": (55, 80)},
    "cotton":     {"n": (80, 130),  "p": (40, 60),  "k": (20, 40),  "temperature": (22, 35),  "ph": (6.0, 8.0),  "humidity": (40, 65)},
    "sugarcane":  {"n": (60, 120),  "p": (30, 55),  "k": (30, 60),  "temperature": (25, 38),  "ph": (5.0, 8.0),  "humidity": (60, 85)},
    "coffee":     {"n": (80, 120),  "p": (20, 40),  "k": (25, 45),  "temperature": (15, 28),  "ph": (5.0, 6.5),  "humidity": (60, 80)},
    "jute":       {"n": (60, 90),   "p": (35, 55),  "k": (35, 55),  "temperature": (25, 37),  "ph": (5.5, 7.0),  "humidity": (75, 95)},
    "lentil":     {"n": (15, 40),   "p": (35, 60),  "k": (15, 30),  "temperature": (15, 28),  "ph": (6.0, 8.0),  "humidity": (40, 65)},
    "chickpea":   {"n": (20, 50),   "p": (50, 80),  "k": (15, 30),  "temperature": (15, 30),  "ph": (6.0, 8.0),  "humidity": (30, 60)},
    "banana":     {"n": (80, 120),  "p": (60, 90),  "k": (40, 70),  "temperature": (25, 35),  "ph": (5.5, 7.0),  "humidity": (70, 90)},
    "mango":      {"n": (20, 40),   "p": (15, 30),  "k": (30, 50),  "temperature": (24, 36),  "ph": (5.5, 7.5),  "humidity": (50, 75)},
    "coconut":    {"n": (20, 40),   "p": (10, 25),  "k": (25, 45),  "temperature": (25, 35),  "ph": (5.5, 7.0),  "humidity": (60, 90)},
    "potato":     {"n": (60, 100),  "p": (50, 80),  "k": (40, 70),  "temperature": (15, 22),  "ph": (5.0, 6.5),  "humidity": (65, 85)},
    "tomato":     {"n": (60, 100),  "p": (50, 80),  "k": (50, 80),  "temperature": (20, 30),  "ph": (6.0, 7.0),  "humidity": (50, 75)},
    "watermelon": {"n": (50, 80),   "p": (40, 60),  "k": (40, 70),  "temperature": (24, 35),  "ph": (6.0, 7.0),  "humidity": (60, 80)},
}

# Relative baseline economic value per crop (0–100).
CROP_BASE_PROFITABILITY: dict[str, float] = {
    "rice":       72,
    "wheat":      68,
    "maize":      65,
    "cotton":     78,
    "sugarcane":  80,
    "coffee":     85,
    "jute":       55,
    "lentil":     70,
    "chickpea":   72,
    "banana":     75,
    "mango":      82,
    "coconut":    76,
    "potato":     60,
    "tomato":     65,
    "watermelon": 62,
}

# Static market demand index (0–1) used when no live market API exists.
STATIC_MARKET_TRENDS: dict[str, float] = {
    "rice":       0.72,
    "wheat":      0.68,
    "maize":      0.75,
    "cotton":     0.70,
    "sugarcane":  0.78,
    "coffee":     0.82,
    "jute":       0.50,
    "lentil":     0.65,
    "chickpea":   0.67,
    "banana":     0.74,
    "mango":      0.80,
    "coconut":    0.73,
    "potato":     0.60,
    "tomato":     0.69,
    "watermelon": 0.58,
}


# ──────────────────────────────────────────────────────────────────
# Section 2: Scoring functions
# ──────────────────────────────────────────────────────────────────

def _parameter_score(value: float, ideal_min: float, ideal_max: float) -> float:
    """
    Score a single parameter against its ideal range.

    Returns 100.0 if the value is within [ideal_min, ideal_max].
    Decays linearly to 0 at ±30% outside the range boundary.
    """
    if ideal_min <= value <= ideal_max:
        return 100.0

    range_span = ideal_max - ideal_min
    tolerance = max(range_span * 0.3, 1.0)  # at least 1 unit tolerance

    if value < ideal_min:
        distance = ideal_min - value
    else:
        distance = value - ideal_max

    score = max(0.0, 100.0 * (1.0 - distance / tolerance))
    return round(score, 2)


def compute_suitability_score(inputs: CropInputs, crop: str) -> float:
    """
    Score how well soil + climate conditions match the predicted crop's
    known agronomic requirements.

    For each parameter (N, P, K, temperature, pH, humidity), the score
    is 100 if within the ideal range and decays linearly to 0 at ±30%
    outside the range. The final suitability is the arithmetic mean of
    all parameter scores.

    Returns 60.0 as a neutral fallback if the crop is not in
    CROP_REQUIREMENTS.
    """
    crop_lower = crop.lower()
    if crop_lower not in CROP_REQUIREMENTS:
        return 60.0

    reqs = CROP_REQUIREMENTS[crop_lower]
    param_map = {
        "n": inputs["n"],
        "p": inputs["p"],
        "k": inputs["k"],
        "temperature": inputs["temperature"],
        "ph": inputs["ph"],
        "humidity": inputs["humidity"],
    }

    scores = []
    for param, value in param_map.items():
        if param in reqs:
            ideal_min, ideal_max = reqs[param]
            scores.append(_parameter_score(value, ideal_min, ideal_max))

    if not scores:
        return 60.0

    return round(sum(scores) / len(scores), 2)


def compute_profitability_score(inputs: CropInputs, crop: str) -> float:
    """
    Score the economic viability of the predicted crop.

    Uses a baseline profitability value per crop. If a market_trend
    value (0–1) is available, adjusts the score:
        profitability = base * 0.7 + (market_trend * 100) * 0.3

    If market_trend is None, falls back to STATIC_MARKET_TRENDS for
    the crop (default 0.5 if the crop is not found), and applies the
    same weighted formula.
    """
    crop_lower = crop.lower()
    base = CROP_BASE_PROFITABILITY.get(crop_lower, 60.0)

    market_trend = inputs.get("market_trend")

    if market_trend is None:
        market_trend = STATIC_MARKET_TRENDS.get(crop_lower, 0.5)

    profitability = base * 0.7 + (market_trend * 100) * 0.3
    return round(min(100.0, max(0.0, profitability)), 2)


def compute_risk_score(inputs: CropInputs) -> tuple[float, str]:
    """
    Assess environmental risk based on rainfall, temperature, and pH.

    Sub-risk scoring:
      - rainfall_risk:    high if rainfall < 50 mm or > 300 mm
      - temperature_risk: high if temperature < 10 °C or > 42 °C
      - ph_risk:          high if pH < 5.0 or > 8.5

    Each sub-risk is 0–100 (0 = no risk, 100 = maximum risk).

    Combined risk = 0.4 * rainfall_risk + 0.35 * temp_risk + 0.25 * ph_risk

    Risk level thresholds:
      score < 30  → "Low"
      30–65       → "Medium"
      score > 65  → "High"
    """
    # --- Rainfall risk ---
    rainfall = inputs["rainfall"]
    if rainfall < 50:
        rainfall_risk = min(100.0, (50 - rainfall) / 50 * 100)
    elif rainfall > 300:
        rainfall_risk = min(100.0, (rainfall - 300) / 200 * 100)
    else:
        rainfall_risk = 0.0

    # --- Temperature risk ---
    temperature = inputs["temperature"]
    if temperature < 10:
        temperature_risk = min(100.0, (10 - temperature) / 10 * 100)
    elif temperature > 42:
        temperature_risk = min(100.0, (temperature - 42) / 10 * 100)
    else:
        temperature_risk = 0.0

    # --- pH risk ---
    ph = inputs["ph"]
    if ph < 5.0:
        ph_risk = min(100.0, (5.0 - ph) / 2.0 * 100)
    elif ph > 8.5:
        ph_risk = min(100.0, (ph - 8.5) / 2.0 * 100)
    else:
        ph_risk = 0.0

    risk_score = round(
        0.4 * rainfall_risk + 0.35 * temperature_risk + 0.25 * ph_risk, 2
    )

    if risk_score < 30:
        risk_level = "Low"
    elif risk_score <= 65:
        risk_level = "Medium"
    else:
        risk_level = "High"

    return risk_score, risk_level


# ──────────────────────────────────────────────────────────────────
# Section 3: Weighted combiner
# ──────────────────────────────────────────────────────────────────

def compute_final_score(
    suitability: float,
    profitability: float,
    risk: float,
) -> float:
    """
    Combine sub-scores into a single final score.

    Formula (hard-coded weights):
        final = 0.4 * suitability
              + 0.3 * profitability
              + 0.3 * (100 - risk)

    The risk term is inverted so that lower risk contributes positively.
    """
    final = (0.4 * suitability) + (0.3 * profitability) + (0.3 * (100 - risk))
    return round(min(100.0, max(0.0, final)), 2)


# ──────────────────────────────────────────────────────────────────
# Section 4: Explanation generator
# ──────────────────────────────────────────────────────────────────

def generate_explanation(
    inputs: CropInputs,
    crop: str,
    scores: dict,
    risk_level: str,
) -> list[str]:
    """
    Generate 3–5 concise, human-readable explanation strings.

    Each string references actual input values so users can understand
    exactly why the crop was recommended and what risk factors exist.
    """
    explanations: list[str] = []
    suitability = scores["suitability"]
    crop_display = crop.capitalize()

    # --- Suitability explanation ---
    if suitability > 75:
        explanations.append(
            f"Soil N/P/K levels ({inputs['n']:.0f}/{inputs['p']:.0f}/{inputs['k']:.0f} mg/kg) "
            f"are well-suited for {crop_display}."
        )
    elif suitability >= 40:
        explanations.append(
            f"Soil conditions partially match {crop_display} requirements "
            f"— pH {inputs['ph']:.1f} may be outside the ideal range."
        )
    else:
        explanations.append(
            f"Soil conditions are a poor match. Consider soil amendment "
            f"before planting {crop_display}."
        )

    # --- Rainfall explanation ---
    rainfall = inputs["rainfall"]
    if rainfall < 50:
        explanations.append(
            f"Rainfall ({rainfall:.0f} mm) is critically low — irrigation "
            f"will be essential for {crop_display}."
        )
    elif rainfall > 300:
        explanations.append(
            f"Rainfall ({rainfall:.0f} mm) is very high — ensure proper "
            f"drainage to prevent waterlogging."
        )
    else:
        explanations.append(
            f"Rainfall ({rainfall:.0f} mm) supports {crop_display} "
            f"cultivation well."
        )

    # --- Temperature explanation ---
    temperature = inputs["temperature"]
    if 18 <= temperature <= 35:
        explanations.append(
            f"Temperature ({temperature:.0f} °C) is within a favorable range."
        )
    else:
        explanations.append(
            f"Temperature ({temperature:.0f} °C) is outside the optimal "
            f"window — monitor crop stress closely."
        )

    # --- Risk summary ---
    risk_score = scores["risk"]
    if risk_level == "Low":
        explanations.append(
            f"Overall environmental risk is low (score: {risk_score:.0f}/100) "
            f"— conditions are favorable."
        )
    elif risk_level == "Medium":
        explanations.append(
            f"Moderate environmental risk detected (score: {risk_score:.0f}/100) "
            f"— some factors need attention."
        )
    else:
        explanations.append(
            f"High environmental risk (score: {risk_score:.0f}/100) — "
            f"consider protective measures or alternative crops."
        )

    # --- Market trend explanation ---
    market_trend = inputs.get("market_trend")
    if market_trend is not None and market_trend > 0.7:
        explanations.append(
            "Strong market demand detected — profitability outlook is favourable."
        )
    elif market_trend is None:
        explanations.append(
            "Market demand index is not available — using baseline profitability."
        )

    return explanations


def get_alternative_crops(inputs: CropInputs, predicted_crop: str) -> list[str]:
    """
    Calculate suitability scores for all crops and return the top 2-3
    alternatives (excluding the predicted crop).
    """
    alternatives = []
    predicted_lower = predicted_crop.lower()
    
    for crop in CROP_REQUIREMENTS.keys():
        if crop == predicted_lower:
            continue
            
        score = compute_suitability_score(inputs, crop)
        # Only consider crops that have a reasonable soil match (score >= 40)
        if score >= 40:
            alternatives.append((crop, score))
            
    # Sort by suitability score descending
    alternatives.sort(key=lambda x: x[1], reverse=True)
    
    # Return top 2 or 3 fallback crops as capitalized strings
    return [crop.capitalize() for crop, _ in alternatives[:3]]

# ──────────────────────────────────────────────────────────────────
# Section 5: Public entry point
# ──────────────────────────────────────────────────────────────────

REQUIRED_KEYS = {"N", "P", "K", "temperature", "humidity", "ph", "rainfall"}


def run_decision_engine(inputs: dict, predicted_crop: str, language: str = 'en') -> dict:
    """
    Orchestrate the full decision pipeline.

    Parameters
    ----------
    inputs : dict
        Raw dict from the Flask request. Must contain keys:
        N, P, K, temperature, humidity, ph, rainfall.
    predicted_crop : str
        The crop predicted by the ML model.

    Returns
    -------
    dict
        Complete decision result with scores, risk level, and explanation.

    Raises
    ------
    ValueError
        If any required key is missing from inputs.
    """
    # Validate required keys
    missing = REQUIRED_KEYS - set(inputs.keys())
    if missing:
        raise ValueError(f"Missing required input keys: {', '.join(sorted(missing))}")

    # Cast to CropInputs
    crop_inputs: CropInputs = {
        "n": float(inputs["N"]),
        "p": float(inputs["P"]),
        "k": float(inputs["K"]),
        "temperature": float(inputs["temperature"]),
        "humidity": float(inputs["humidity"]),
        "ph": float(inputs["ph"]),
        "rainfall": float(inputs["rainfall"]),
        "market_trend": inputs.get("market_trend"),
    }

    # Run scoring functions
    suitability = compute_suitability_score(crop_inputs, predicted_crop)
    profitability = compute_profitability_score(crop_inputs, predicted_crop)
    risk_score, risk_level = compute_risk_score(crop_inputs)
    final_score = compute_final_score(suitability, profitability, risk_score)

    scores = {
        "suitability": suitability,
        "profitability": profitability,
        "risk": risk_score,
    }

    explanation = generate_explanation(
        crop_inputs, predicted_crop, scores, risk_level
    )
    
    alternatives = get_alternative_crops(crop_inputs, predicted_crop)

    if language and language != 'en':
        try:
            from services.gemini_service import gemini_service
            
            # Translate explanations
            translated_expl = []
            for exp in explanation:
                prompt = f"Translate the following explanation. Return ONLY the translated string without quotes:\n\n{exp}"
                trans = gemini_service.generate_response(prompt, language)
                translated_expl.append(trans.strip() if trans else exp)
            explanation = translated_expl
            
            # Translate alternatives
            translated_alts = []
            for alt in alternatives:
                trans_alt = gemini_service.translate_text(alt, language)
                translated_alts.append(trans_alt if trans_alt else alt)
            alternatives = translated_alts
        except Exception as e:
            import logging
            logging.error(f"Translation failed in decision engine: {e}")

    return {
        "recommended_crop": predicted_crop,
        "final_score": final_score,
        "scores": scores,
        "risk_level": risk_level,
        "alternatives": alternatives,
        "explanation": explanation,
    }


# ──────────────────────────────────────────────────────────────────
# Section 6: Smoke test
# ──────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import json

    test_inputs = {
        "N": 80,
        "P": 42,
        "K": 43,
        "temperature": 28,
        "humidity": 82,
        "ph": 6.5,
        "rainfall": 210,
    }

    result = run_decision_engine(test_inputs, "rice")
    print(json.dumps(result, indent=2))
