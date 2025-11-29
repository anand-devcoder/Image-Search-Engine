from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

API_KEY = "AIzaSyAjgyBR-Zso_kbCVjpMcHj8aBB_g27n5J8"
CX = "d25ad888936374286"

@app.route("/search")
def search():
    q = request.args.get("q")
    start = request.args.get("start", 1)

    url = f"https://www.googleapis.com/customsearch/v1?q={q}&cx={CX}&searchType=image&key={API_KEY}&start={start}&num=10"

    try:
        r = requests.get(url)
        return jsonify(r.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
