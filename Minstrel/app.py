from langchain_community.llms import Ollama
from flask import Flask, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app) # allow CORS for all domains on all routes.

cached_llm = Ollama(model="minstrel:latest")


generatedAudio = {}

#API endpoint to send prompt query to the LLM
@app.route("/ai", methods = ["POST"])
@cross_origin()
def query_llm():
    print("Post /ai called")
    json_content = request.json
    print(json_content)
    query = json_content.get("query")
    print(f"query: {query}")

    response = cached_llm.invoke(query)

    return f"Answer: {response}"

@app.route("/callback", methods = ["POST"])
@cross_origin()
def generateMusic():
    print("Post /callback called")
    json_content = request.json
    if(json_content.get("code") == 200):
        generatedAudio = json_content.get("data")
        return {"code": 200}
    else:
        return {"code": 400}


def start_app():
    app.run(host="0.0.0.0", port=8080, debug=True);

if __name__ == "__main__":
    start_app()