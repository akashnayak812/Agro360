import requests
try:
    api_key = "579b464db66ec23bdd000001c7e1e45ebbd846ca6ab16ff56074f14e"
    url = f"https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key={api_key}&format=json&limit=5"
    response = requests.get(url, timeout=10)
    print(response.json())
except Exception as e:
    print(e)
