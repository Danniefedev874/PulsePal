from healthapp import create_app
from healthapp.chatbot_engine import predict_disease

app = create_app()

# Test route to verify app is working
@app.route('/test')
def test():
    return "Test route working!"

# Debug route to show all routes
@app.route('/routes')
def list_routes():
    import urllib
    output = []
    for rule in app.url_map.iter_rules():
        methods = ','.join(rule.methods)
        line = urllib.parse.unquote("{:50s} {:20s} {}".format(rule.endpoint, methods, rule))
        output.append(line)
    return '<br>'.join(output)

if __name__ == '__main__':
    print("Starting Flask app...")
    print("Available routes:")
    for rule in app.url_map.iter_rules():
        print(f"  {rule.endpoint}: {rule.rule} {list(rule.methods)}")
    
    app.run(debug=True, host='0.0.0.0', port=5000)