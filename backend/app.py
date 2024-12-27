from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from podcastfy.content_parser.content_extractor import ContentExtractor
from gtts import gTTS
from transformers import pipeline
import os

app = Flask(__name__)
CORS(app)

# Load the summarization model
summarizer = pipeline("summarization")

@app.route('/generate-podcast', methods=['POST'])
def generate():
    urls = request.json.get('urls')
    if not urls or not isinstance(urls, list):
        return jsonify({"error": "Invalid input, please provide a list of URLs."}), 400

    try:
        # Initialize the content extractor
        content_extractor = ContentExtractor()
        
        # Extract content from the provided URL
        extracted_content = content_extractor.extract_content(urls[0])  # Assuming single URL for simplicity
        
        # Check if extracted content is valid
        if not extracted_content or len(extracted_content) == 0:
            return jsonify({"error": "No content extracted from the URL."}), 400
        
        # Summarize the extracted content
        summary = summarizer(extracted_content, max_length=150, min_length=30, do_sample=False)
        
        # Check if summary is valid and has text
        if not summary or len(summary) == 0:
            return jsonify({"error": "Failed to summarize the content."}), 400
        
        # Extract text from summary (assuming it's a list of dictionaries)
        summarized_text = summary[0]['summary_text']
        
        # Generate audio from summarized content using gTTS
        tts = gTTS(text=summarized_text, lang='en')
        audio_file_path = 'podcast.mp3'
        tts.save(audio_file_path)

        return send_file(audio_file_path, mimetype='audio/mpeg', as_attachment=True)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
