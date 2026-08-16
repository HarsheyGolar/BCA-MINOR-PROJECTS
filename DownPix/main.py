import requests
import io
from flask import Flask, request, send_file

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


@app.route("/api/download", methods=["GET"])
def download_image():
    """
    Streams an image directly to the user's Downloads folder.
    
    Query parameters:
        - url: The direct link to the image (required)
    
    Returns: 
        Binary image stream with Content-Disposition: attachment header
    """
    try:
        # Extract the image URL from query parameters
        image_url = request.args.get('url', '').strip()
        
        # Validate URL
        if not image_url:
            return "Error: No URL provided", 400
        
        # Desktop browser User-Agent to bypass restrictions
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        
        # Fetch the image from the remote URL with 15s timeout
        response = requests.get(image_url, headers=headers, timeout=15)
        response.raise_for_status()
        
        # Extract filename from URL, clean off query parameters
        filename = image_url.split("/")[-1].split("?")[0]
        
        # Fallback filename if URL doesn't contain a valid filename
        if not filename or "." not in filename:
            filename = "downloaded_image.jpg"
        
        # Read the binary content into memory (no disk persistence)
        image_stream = io.BytesIO(response.content)
        
        # Stream the file directly to user's Downloads with proper headers
        return send_file(
            image_stream,
            mimetype=response.headers.get("Content-Type", "image/jpeg"),
            as_attachment=True,
            download_name=filename
        )
    
    except requests.exceptions.Timeout:
        return "Error: Remote server took too long to respond (timeout after 15s)", 408
    
    except requests.exceptions.ConnectionError:
        return "Error: Could not connect to the image URL. Check the URL and your internet connection.", 400
    
    except requests.exceptions.HTTPError as e:
        return f"Error: HTTP {e.response.status_code} - {e.response.reason}", e.response.status_code
    
    except requests.exceptions.RequestException as e:
        return f"Error: Failed to fetch image - {str(e)}", 500
    
    except Exception as e:
        return f"Error: An unexpected error occurred - {str(e)}", 500


if __name__=="__main__":
   import os

   port = int(os.environ.get("PORT", 5000))
   app.run(host="0.0.0.0", port=port)