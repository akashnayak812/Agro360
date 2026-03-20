"""
Schemes Service — Handles Gemini AI integration for scheme questions.
"""
import json
from services.gemini_service import gemini_service


def ask_scheme_question(scheme_id, scheme_name, scheme_details, question, language='en'):
    """
    Ask a question about a specific government scheme using Gemini AI.
    Returns a structured answer with key points and next steps.
    """
    system_prompt = f"""
You are Kisaan Mitra — a friendly government scheme advisor for Indian farmers.
Your job is to explain government schemes in very simple language.

Rules:
- Use simple Hindi/Telugu words mixed with English when helpful
- Always mention the official website and helpline
- If farmer is not eligible, suggest alternative schemes
- Keep answers under 100 words
- Always end with: "Call [helpline] for free help"
- Current scheme context: {scheme_details}

Answer the farmer's question about {scheme_name} in {language} language.
Provide your response as a JSON object with these keys:
- "answer": your main response text
- "key_points": array of 2-3 bullet points
- "next_step": one action the farmer should take next
- "helpline": the scheme's helpline number

Only return valid JSON, no markdown fences.
"""

    full_prompt = f"{system_prompt}\n\nFarmer's question: {question}"

    try:
        response_text = gemini_service.generate_response(full_prompt)
        if not response_text:
            return _fallback_response(scheme_name, question)

        # Clean up response
        text = response_text.strip()
        if text.startswith('```json'):
            text = text[7:]
        if text.startswith('```'):
            text = text[3:]
        if text.endswith('```'):
            text = text[:-3]
        text = text.strip()

        result = json.loads(text)
        return {
            'success': True,
            'answer': result.get('answer', ''),
            'key_points': result.get('key_points', []),
            'next_step': result.get('next_step', ''),
            'helpline': result.get('helpline', ''),
        }
    except Exception as e:
        print(f"Scheme AI Error: {e}")
        return _fallback_response(scheme_name, question)


def _fallback_response(scheme_name, question):
    """Fallback when AI is unavailable."""
    return {
        'success': True,
        'answer': f"I'm having trouble connecting right now. For questions about {scheme_name}, please call the free helpline or visit the official website.",
        'key_points': [
            'Call the toll-free helpline for personal guidance',
            'Visit your nearest Common Service Centre (CSC)',
        ],
        'next_step': 'Call the helpline number shown above',
        'helpline': '1800-180-1551',
    }
