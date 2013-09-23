from flask import Flask
from flask import json, jsonify, render_template
import urllib2

app = Flask(__name__)

DEBUG = True
API_AUTH_TOKEN = '9tGyEQGvSfBb375iXkaVgq66g'
API_URL = 'http://data.sfgov.org/resource/rqzj-sfat.json'

@app.route('/')
def index():
    """main index page for backbone app"""
    return render_template('index.html')

@app.route('/truck-locations')
def truck_locations():
    url = '%(api_url)s' % {'api_url': API_URL}
    response = urllib2.urlopen(url)
    json_response = json.load(response)
    return jsonify(json_response)


if __name__ == '__main__':
    app.run(debug=DEBUG)
