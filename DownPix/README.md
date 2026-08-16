<div align="center">

# 📸 DownPix

### *Fast & Simple Image Downloader*

[![Python](https://img.shields.io/badge/Python-3.8%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0.3-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Gunicorn](https://img.shields.io/badge/Gunicorn-23.0.0-499848?style=for-the-badge&logo=gunicorn&logoColor=white)](https://gunicorn.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://bca-minor-projects-2.onrender.com/)

> **DownPix** is a sleek, browser-based image downloader powered by a lightweight Flask backend.  
> Paste any direct image URL — DownPix fetches, streams, and saves it to your device instantly.

---

</div>

## ✨ Features

| Feature | Description |
|---|---|
| 🔗 **Direct URL Support** | Paste any direct image link and download immediately |
| ⚡ **Fast Streaming** | Images are streamed in-memory — no temporary files written to disk |
| 🎨 **Multiple Formats** | Supports JPG, PNG, WEBP, GIF, BMP, and more |
| 🛡️ **Smart Error Handling** | Graceful handling for timeouts, bad URLs, and HTTP errors |
| 🌐 **Browser-Friendly** | Clean web UI with real-time progress bar and status feedback |
| 🤖 **Bot Bypass** | Uses a desktop User-Agent to bypass basic image access restrictions |

---

## 🗂️ Project Structure

```
DownPix/
│
├── main.py            # Flask backend — serves UI & handles /api/download
├── index.html         # Frontend layout — input form & progress UI
├── styles.css         # Styling — dark theme, animations, responsive design
├── script.js          # Client-side logic — download trigger & UX feedback
├── requirements.txt   # Python dependencies
└── downloads/         # Default download output folder
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.8+** installed on your system
- `pip` package manager

### 1. Clone the Repository

```bash
git clone https://github.com/HarsheyGolar/BCA-MINOR-PROJECTS.git
cd BCA-MINOR-PROJECTS/DownPix
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the App

```bash
python main.py
```

### 4. Open in Browser

Navigate to:

```
http://localhost:5000
```

---

## 🖥️ How It Works

```
User pastes image URL
        │
        ▼
  Frontend (script.js)
  validates the URL
        │
        ▼
  GET /api/download?url=<image_url>
        │
        ▼
  Flask (main.py) fetches the image
  from the remote server
        │
        ▼
  Image is loaded into memory (BytesIO)
  and streamed back to the browser
        │
        ▼
  Browser saves image to Downloads
```

The backend never persists the image to disk — it's fetched remotely and piped directly as a binary attachment response.

---

## 🔌 API Reference

### `GET /api/download`

Downloads an image from a remote URL and streams it to the client.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `url` | `string` | ✅ Yes | The direct URL to the image |

**Example Request:**
```
GET /api/download?url=https://example.com/photo.jpg
```

**Response:**
- `200 OK` — Binary image stream with `Content-Disposition: attachment`
- `400 Bad Request` — Invalid or missing URL
- `408 Request Timeout` — Remote server did not respond within 15s
- `500 Internal Server Error` — Unexpected failure

---

## 📦 Dependencies

```txt
flask==3.0.3
requests==2.32.3
gunicorn==23.0.0
```

| Package | Role |
|---|---|
| **Flask** | Lightweight web framework to serve the UI and REST API |
| **Requests** | HTTP client to fetch remote images |
| **Gunicorn** | Production-grade WSGI server for deployment |

---

## 🌍 Deployment

### 🔗 Live Demo

> The app is deployed and publicly accessible on **Render**:

<div align="center">

[![🚀 Open DownPix Live](https://img.shields.io/badge/🚀%20Open%20DownPix%20Live-bca--minor--projects--2.onrender.com-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://bca-minor-projects-2.onrender.com/)

</div>

> [!NOTE]
> Hosted on Render's free tier — the app may take **10–30 seconds** to wake up on the first visit.

---

### Using Gunicorn (Production)

```bash
gunicorn -w 4 -b 0.0.0.0:5000 main:app
```

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Port the server listens on |

---

## 🧩 Tech Stack

<div align="center">

![Python](https://img.shields.io/badge/-Python-3776AB?style=flat-square&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/-Flask-000000?style=flat-square&logo=flask&logoColor=white)
![HTML5](https://img.shields.io/badge/-HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/-CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

</div>

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute.

---

<div align="center">

Made with ❤️ as a **BCA Minor Project**

*© 2026 DownPix — Download with ease.*

</div>
