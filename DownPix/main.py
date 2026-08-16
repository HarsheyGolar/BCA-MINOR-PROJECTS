import requests
import io
from pathlib import Path
from flask import Flask, jsonify, request, send_file

app = Flask(__name__)

@app.route("/", methods=["GET"])
def index():
    return send_file("index.html", mimetype="text/html")

@app.route("/styles.css")
def styles():
    return send_file("styles.css", mimetype="text/css")

@app.route("/script.js")
def scripts():
    return send_file("script.js", mimetype="application/js")


@app.route("/api/download", methods=["POST"])
def download_image():
    """Downloads an image from a URL and saves it to a local folder.
    
    Expects JSON body with:
        - url: The direct link to the image.
        - save_folder: The folder where the image will be stored.

    Returns: 
        JSON response with status and message.
    
    """
    try:
        # Extract parameters from JSON body
        data = request.get_json()
        if not data:
            return jsonify({"status": "error", "message": "Invalid request"}), 400
        
        url = data.get("url", "").strip()
        save_folder = data.get("save_folder", "downloads").strip()
        
        # Validate URL
        if not url:
            return jsonify({"status": "error", "message": "URL is required"}), 400
        
        # Convert string folder into path object.
        folder_path = Path(save_folder)
        folder_path.mkdir(parents=True, exist_ok=True)

        # Extract the filename from the url, cleaning off any url parameters (?)
        clean_url_end = url.split("/")[-1].split("?")[0]

        # fallback name if url doesn't end with valid filename extension.
        if not clean_url_end or "." not in clean_url_end:
            clean_url_end = "downloaded_image.jpg"

        # Combine folder path and file name using the modern '/' operator.
        save_path = folder_path / clean_url_end

        # Adding a browser User-Agent.
        headers = {
            "user-agent": "Mozilla/5.0 (windows NT 10.0; Win64; x64) Applewebkit/537.36 (KHTML, like Gecko) chrome/120.0.0.0 safari/537.36"
        }

        # Send a GET request to stream the image data.
        response = requests.get(url, headers=headers, stream=True, timeout=10)
        response.raise_for_status()

        image_binary = io.BytesIO(response.content)

        return send_file(
            image_binary,
            mimetype=response.headers.get("Content-Type", "image/jpeg"),
            as_attachment=True,
            download_name=clean_url_end,
        )

        # saves the file in chunks.
        with open(save_path, "wb") as file:
            for chunk in response.iter_content(chunk_size = 8192):
                file.write(chunk)

        return (jsonify(
            {
                "status": "success",
                "message": f"✓ Image saved to {save_path.resolve()}",
            }
        ), 
        200,
        )
    
    except requests.exceptions.Timeout:
        return jsonify(
            {
                "status": "error",
                "message": "Download timeout. The URL took too long to respond."
            }
        ), 408
    
    except requests.exceptions.ConnectionError:
        return jsonify(
            {
                "status": "error",
                "message": "Connection error. Please check the URL and try again."
            }
        ), 400
    
    except requests.exceptions.RequestException as e:
        return jsonify(
            {
                "status": "error",
                "message": f"Download failed: {str(e)}"
            }
        ), 500
    
    except FileNotFoundError:
        return jsonify(
            {
                "status": "error",
                "message": "Failed to save file. Check folder permissions."
            }
        ), 500
    
    except Exception as e:
        return jsonify(
            {
                "status": "error",
                "message": f"An error occurred: {str(e)}"
            }
        ), 500


if __name__=="__main__":
   import os

   port = int(os.environ.get("PORT", 5000))
   app.run(host="0.0.0.0", port=port)