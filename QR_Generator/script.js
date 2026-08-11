const form = document.getElementById('qrForm');
const input = document.getElementById('qrInput');
const qrImage = document.getElementById('qrImage');

function generateQRCode(value) {
  qrImage.src = `/generate-qr?text=${encodeURIComponent(value)}`;
  qrImage.alt = `QR code for ${value}`;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = input.value.trim() || 'https://example.com';
  generateQRCode(value);
});

window.addEventListener('DOMContentLoaded', () => {
  generateQRCode('https://example.com');
});
