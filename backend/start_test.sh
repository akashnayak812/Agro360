#!/bin/bash
cd /Users/akashdegavath/Projects/Agro360/backend
pkill -9 -f "python.*app.py" 2>/dev/null
sleep 1
python3 app.py &
SERVER_PID=$!
echo "Server PID: $SERVER_PID"
sleep 4
echo "Testing API..."
curl -s http://localhost:5001/api/crop/recommend -X POST -H "Content-Type: application/json" -d '{"N":90,"P":42,"K":43,"temperature":20.8,"humidity":82,"ph":6.5,"rainfall":202.9}'
echo ""
echo "Check /tmp/flask_server.log for server logs"
