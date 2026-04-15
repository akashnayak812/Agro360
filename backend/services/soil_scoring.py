"""
Soil Health Scoring Engine
Pure rule-based scoring system — no ML needed, deterministic and explainable.

Scores soil health on a 0-100 scale based on:
  - pH level (weight: 0.30)
  - NPK balance (weight: 0.40)
  - Moisture level (weight: 0.15)
  - Overall balance (weight: 0.15)
"""


def _ph_score(ph: float) -> tuple[float, str]:
    """Score pH on 0-100. Ideal range: 6.0-7.5"""
    if 6.0 <= ph <= 7.5:
        return 100.0, "optimal"
    elif 5.5 <= ph < 6.0 or 7.5 < ph <= 8.0:
        return 70.0, "slightly off"
    elif 5.0 <= ph < 5.5:
        return 40.0, "acidic"
    elif 8.0 < ph <= 8.5:
        return 40.0, "alkaline"
    elif ph < 5.0:
        return 15.0, "highly acidic"
    else:
        return 15.0, "highly alkaline"


def _npk_score(n: float, p: float, k: float) -> tuple[float, list[str]]:
    """Score NPK levels. Returns score and deficiency flags."""
    deficiencies = []
    scores = []
    
    # Nitrogen: ideal 40-80 mg/kg
    if 40 <= n <= 80:
        scores.append(100)
    elif 20 <= n < 40 or 80 < n <= 120:
        scores.append(65)
    else:
        scores.append(25)
        if n < 20:
            deficiencies.append("Nitrogen deficiency")
        else:
            deficiencies.append("Nitrogen excess")
    
    # Phosphorus: ideal 25-60 mg/kg
    if 25 <= p <= 60:
        scores.append(100)
    elif 15 <= p < 25 or 60 < p <= 90:
        scores.append(65)
    else:
        scores.append(25)
        if p < 15:
            deficiencies.append("Phosphorus deficiency")
        else:
            deficiencies.append("Phosphorus excess")
    
    # Potassium: ideal 30-60 mg/kg
    if 30 <= k <= 60:
        scores.append(100)
    elif 20 <= k < 30 or 60 < k <= 90:
        scores.append(65)
    else:
        scores.append(25)
        if k < 20:
            deficiencies.append("Potassium deficiency")
        else:
            deficiencies.append("Potassium excess")
    
    return sum(scores) / len(scores), deficiencies


def _moisture_score(moisture: float) -> float:
    """Score moisture level (%). Ideal: 40-70%"""
    if 40 <= moisture <= 70:
        return 100.0
    elif 25 <= moisture < 40 or 70 < moisture <= 85:
        return 65.0
    else:
        return 30.0


def _balance_score(n: float, p: float, k: float) -> float:
    """Score overall NPK balance. Checks if ratios are reasonable."""
    total = n + p + k
    if total == 0:
        return 0.0
    
    n_ratio = n / total
    p_ratio = p / total
    k_ratio = k / total
    
    # Ideal ratio approximately N:P:K = 4:2:1 (normalized: ~0.57:0.29:0.14)
    # But we just check if no single nutrient dominates > 70% or is < 10%
    score = 100.0
    for ratio in [n_ratio, p_ratio, k_ratio]:
        if ratio > 0.7:
            score -= 30
        if ratio < 0.1:
            score -= 20
    
    return max(0, score)


def compute_soil_health(n: float, p: float, k: float, ph: float, moisture: float = 50.0) -> dict:
    """
    Compute comprehensive soil health score.
    
    Returns:
        dict with: health_score (0-100), classification, ph_status, deficiencies, recommendations
    """
    # Individual scores
    ph_val, ph_status = _ph_score(ph)
    npk_val, deficiencies = _npk_score(n, p, k)
    moisture_val = _moisture_score(moisture)
    balance_val = _balance_score(n, p, k)
    
    # Weighted average
    health_score = round(
        0.30 * ph_val +
        0.40 * npk_val +
        0.15 * moisture_val +
        0.15 * balance_val,
        1
    )
    
    # Classification
    if health_score >= 70:
        classification = "Healthy"
    elif health_score >= 40:
        classification = "Moderate"
    else:
        classification = "Poor"
    
    # Generate recommendations
    recommendations = []
    if ph_status == "acidic" or ph_status == "highly acidic":
        recommendations.append(f"Soil pH is {ph:.1f} (acidic). Apply agricultural lime to raise pH.")
    elif ph_status == "alkaline" or ph_status == "highly alkaline":
        recommendations.append(f"Soil pH is {ph:.1f} (alkaline). Apply sulfur or gypsum to lower pH.")
    
    for d in deficiencies:
        if "Nitrogen" in d and "deficiency" in d:
            recommendations.append("Add nitrogen-rich fertilizer (urea, ammonium sulfate).")
        elif "Phosphorus" in d and "deficiency" in d:
            recommendations.append("Add phosphorus fertilizer (DAP, single super phosphate).")
        elif "Potassium" in d and "deficiency" in d:
            recommendations.append("Add potassium fertilizer (muriate of potash).")
        elif "excess" in d:
            recommendations.append(f"{d} detected. Reduce fertilizer application.")
    
    if moisture < 25:
        recommendations.append("Soil moisture is critically low. Increase irrigation.")
    elif moisture > 85:
        recommendations.append("Soil is waterlogged. Improve drainage.")
    
    if not recommendations:
        recommendations.append("Soil conditions are favorable. Maintain current practices.")
    
    return {
        "health_score": health_score,
        "classification": classification,
        "ph_status": ph_status,
        "deficiencies": deficiencies,
        "recommendations": recommendations,
        "component_scores": {
            "ph": round(ph_val, 1),
            "npk": round(npk_val, 1),
            "moisture": round(moisture_val, 1),
            "balance": round(balance_val, 1),
        }
    }
