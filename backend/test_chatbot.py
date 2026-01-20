#!/usr/bin/env python3
from dotenv import load_dotenv
load_dotenv()

from services.gemini_service import gemini_service

print("=" * 60)
print("Testing Gemini Chatbot Service")
print("=" * 60)

# Test 1: English farming query
print("\n1. Testing English Query:")
print("-" * 60)
result = gemini_service.process_farming_intent("What is the best fertilizer for rice?", "en")
print(f"Response: {result.get('response')}")
print(f"Intent: {result.get('intent')}")
print(f"Language: {result.get('language_detected')}")

# Test 2: Non-farming query (should be refused)
print("\n2. Testing Non-Farming Query (should refuse):")
print("-" * 60)
result = gemini_service.process_farming_intent("Who is the president?", "en")
print(f"Response: {result.get('response')}")
print(f"Intent: {result.get('intent')}")

# Test 3: Hindi query
print("\n3. Testing Hindi Query:")
print("-" * 60)
result = gemini_service.process_farming_intent("धान के लिए सबसे अच्छा उर्वरक क्या है?", "hi")
print(f"Response: {result.get('response')}")
print(f"Language: {result.get('language_detected')}")

print("\n" + "=" * 60)
print("✅ All tests completed!")
print("=" * 60)
