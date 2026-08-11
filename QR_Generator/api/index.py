from flask import Flask, request, send_file
import qrcode
import io

app = Flask(__name__)


@app.route("/api/generate-qr", methods=["GET"])
def generate_qr():
    text = request.args.get("text", "").strip()

    if not text:
        text = "https://example.com"

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=8,
        border=4,
    )

    qr.add_data(text)
    qr.make(fit=True)

    image = qr.make_image(
        fill_color="#6aff9b",
        back_color="white",
    )

    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    buffer.seek(0)

    return send_file(
        buffer,
        mimetype="image/png",
        download_name="qr-code.png",
    )