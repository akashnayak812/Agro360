"""
Schemes Routes — API endpoints for government schemes.
"""
from flask import Blueprint, request, jsonify
from services.schemes_service import ask_scheme_question

schemes_bp = Blueprint('schemes', __name__)


@schemes_bp.route('/ai-help', methods=['POST'])
def ai_help():
    """Gemini-powered Q&A about a specific scheme."""
    try:
        data = request.get_json()
        scheme_id = data.get('scheme_id', '')
        scheme_name = data.get('scheme_name', '')
        scheme_details = data.get('scheme_details', '{}')
        question = data.get('question', '')
        language = data.get('language', 'en')

        if not question:
            return jsonify({'success': False, 'error': 'Question is required'}), 400

        result = ask_scheme_question(scheme_id, scheme_name, scheme_details, question, language)
        return jsonify(result)
    except Exception as e:
        print(f"Schemes AI Help Error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


@schemes_bp.route('/all', methods=['GET'])
def get_all_schemes():
    """Return confirmation that schemes are loaded (data is on frontend)."""
    return jsonify({
        'success': True,
        'message': 'Schemes data is maintained on the frontend for offline access.',
        'central_count': 8,
        'states_with_schemes': ['Telangana', 'Maharashtra', 'Punjab', 'Andhra Pradesh', 'Karnataka']
    })


@schemes_bp.route('/health', methods=['GET'])
def health():
    """Health check for schemes API."""
    return jsonify({'success': True, 'status': 'Schemes API is running'})
