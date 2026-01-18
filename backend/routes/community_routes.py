from flask import Blueprint, request, jsonify
from datetime import datetime
import uuid

community_bp = Blueprint('community_bp', __name__)

# In-memory mock storage for demo purposes
# In production, replace this with MongoDB calls
posts = [
    {
        "id": "1",
        "author": "Ramesh Kumar",
        "content": "My potato leaves are turning yellow. What should I do?",
        "timestamp": "2023-10-25 10:30:00",
        "replies": [
            {"author": "AgroExpert AI", "content": "This could be Early Blight. Try using Mancozeb."}
        ]
    }
]

@community_bp.route('/posts', methods=['GET'])
def get_posts():
    return jsonify({"success": True, "posts": posts})

@community_bp.route('/posts', methods=['POST'])
def create_post():
    data = request.json
    new_post = {
        "id": str(uuid.uuid4()),
        "author": data.get("author", "Farmer"),
        "content": data.get("content"),
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "replies": []
    }
    
    # AI Response
    from services.gemini_service import gemini_service
    prompt = f"A farmer asks: '{new_post['content']}'. Provide a helpful, concise expert answer."
    ai_response = gemini_service.generate_response(prompt)
    
    if ai_response:
        new_post["replies"].append({
            "author": "AgroExpert AI",
            "content": ai_response
        })
        
    posts.insert(0, new_post)
    return jsonify({"success": True, "post": new_post})

@community_bp.route('/posts/<post_id>/reply', methods=['POST'])
def add_reply(post_id):
    data = request.json
    reply = {
        "author": data.get("author", "User"),
        "content": data.get("content")
    }
    
    for post in posts:
        if post["id"] == post_id:
            post["replies"].append(reply)
            return jsonify({"success": True, "post": post})
            
    return jsonify({"success": False, "message": "Post not found"}), 404
