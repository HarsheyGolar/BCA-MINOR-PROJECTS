import sys
import subprocess
from flask import Flask, request, jsonify, send_from_directory

app = Flask(__name__)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('.', filename)

@app.route('/generate')
def generate():
    length = request.args.get('length', default=8, type=int)
    if length < 1:
        return jsonify({'error': 'length must be at least 1'}), 400

    proc = subprocess.Popen(
        [sys.executable, 'main.py'],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    stdout, stderr = proc.communicate(input=str(length) + '\n')

    if proc.returncode != 0:
        return jsonify({'error': 'Scripts failed', 'details': stderr}), 500

    lines = stdout.strip().splitlines()
    password = lines[-1] if lines else ''

    return jsonify({'password': password, 'length': length})

if __name__=='__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)