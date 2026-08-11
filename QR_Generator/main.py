from flask import Flask, request, send_file
import qrcode
import io

app = Flask(__name__)


@app.route("/")
def index():
    return send_file("index.html", mimetype="text/html")


@app.route("/styles.css")
def styles():
    return send_file("styles.css", mimetype="text/css")


@app.route("/script.js")
def script():
    return send_file("script.js", mimetype="application/javascript")


@app.route("/generate-qr")
def generate():
    text = request.args.get("text", "").strip() or "https://example.com"

    qr_code = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=4,
    )
    qr_code.add_data(text)
    qr_code.make(fit=True)

    img = qr_code.make_image(fill_color="#6aff9b", back_color="white")

    img_buffer = io.BytesIO()
    img.save(img_buffer, format="PNG")
    img_buffer.seek(0)

    return send_file(img_buffer, mimetype="image/png")


# if __name__ == "__main__":
#     app.run(debug=True)