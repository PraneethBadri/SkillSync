from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import PyPDF2
import os
import re

app = Flask(__name__)
CORS(app)


# A predefined dictionary of skills we can look out for in tech resumes
TECH_SKILLS_DB = {
    "python", "java", "javascript", "react", "node.js", "express", "mongodb", "sql", 
    "docker", "kubernetes", "aws", "azure", "machine learning", "nlp", "flask", 
    "django", "c++", "c#", "typescript", "figma", "ui/ux", "design systems", 
    "agile", "scrum", "html", "css", "tailwind", "rest api", "graphql"
}

def extract_text_from_pdf(filepath):
    try:
        with open(filepath, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + " "
            return text
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return ""

def identify_skills(text):
    text_lower = text.lower()
    found_skills = set()
    
    # Raw text matching
    for skill in TECH_SKILLS_DB:
        # simple bounds matching
        if re.search(r'\b' + re.escape(skill) + r'\b', text_lower):
            if skill == 'ui/ux': found_skills.add('UI/UX')
            else: found_skills.add(skill.title())
                
    return list(found_skills)


@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "SkillSync AI Microservice"})


@app.route('/parse', methods=['POST'])
def parse_resume():
    """
    Endpoint for extracting skills from a raw PDF document or text.
    Handles multiparty form data file uploads!
    """
    extracted_text = ""
    
    # Check if a file is explicitly uploaded in the request (multipart/form-data)
    if 'file' in request.files:
        file = request.files['file']
        if file.filename != '':
            filename = secure_filename(file.filename)
            temp_path = os.path.join(os.getcwd(), filename)
            file.save(temp_path)
            extracted_text = extract_text_from_pdf(temp_path)
            # Clean up the file after parsing
            if os.path.exists(temp_path):
                os.remove(temp_path)
    
    # Fallback if text or specific filepath string is sent
    if not extracted_text and request.is_json:
        data = request.json
        filepath = data.get('filepath')
        raw_text = data.get('text', '')
        extracted_text = raw_text
        if filepath and os.path.exists(filepath):
             extracted_text = extract_text_from_pdf(filepath)
         
    if not extracted_text:
        return jsonify({"error": "No valid text or filepath provided"}), 400
        
    skills = identify_skills(extracted_text)
    
    # Calculate a mock profile strength based on length of resume and skills found
    strength = min(100, int((len(extracted_text) / 2000) * 40 + (len(skills) / 10) * 60))
    if strength < 20: strength = 20 # baseline
    
    return jsonify({
        "skills": skills,
        "profileStrength": strength,
        "wordCount": len(extracted_text.split())
    })


@app.route('/match', methods=['POST'])
def match_jobs():
    """
    Endpoint for rating how well a candidate's skills match job requirements.
    Expects json: { "candidate_skills": [...], "job_requirements": [...] }
    """
    data = request.json
    candidate_skills = [s.lower() for s in data.get('candidate_skills', [])]
    job_reqs = [r.lower() for r in data.get('job_requirements', [])]
    
    if not job_reqs:
        return jsonify({"match_score": 0, "missing_skills": []})
        
    matched = 0
    missing = []
    
    for req in job_reqs:
        # Check direct inclusion
        if req in candidate_skills:
            matched += 1
        else:
            missing.append(req.title())
            
    # Simple ratio
    score = int((matched / len(job_reqs)) * 100)
    
    return jsonify({
        "match_score": score,
        "matched_count": matched,
        "missing_skills": missing
    })


if __name__ == '__main__':
    # Run on port 8000
    app.run(host='0.0.0.0', port=8000, debug=True)
