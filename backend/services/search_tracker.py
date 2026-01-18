"""
Service to track user searches across different modules
"""
from models.user import UserModel

class SearchTracker:
    def __init__(self, db):
        self.user_model = UserModel(db)
    
    def track_search(self, user_id, search_type, query_params, result_summary=None):
        """
        Track a search made by the user
        
        Args:
            user_id: The user's ID
            search_type: Type of search (crop, disease, fertilizer, soil, yield)
            query_params: The parameters used in the search
            result_summary: Optional summary of the results
        """
        search_data = {
            'type': search_type,
            'query': query_params,
            'result': result_summary
        }
        return self.user_model.add_recent_search(user_id, search_data)
