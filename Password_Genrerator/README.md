<div align="center">
  <h1>🔐 Password Generator</h1>
  <p><strong>A sleek, simple, and secure password generator web application.</strong></p>

  <a href="https://bca-minor-projects-1.onrender.com/" target="_blank">
    <img src="https://img.shields.io/badge/Live_Demo-View_Project-5A29E4?style=for-the-badge&logo=railway&logoColor=white" alt="Live Demo">
  </a>
</div>

<br />

Create strong, random passwords with a single click and easily copy them to your clipboard.
## ✨ Features

- **Customizable Length**: Generate passwords of any length between 8 and 64 characters using an intuitive range slider.
- **Strong Randomization**: Generates robust passwords consisting of uppercase/lowercase letters, digits, and special characters.
- **One-Click Copy**: Instantly copy the generated password to your clipboard.
- **Responsive UI**: Modern, clean, and user-friendly interface built with vanilla HTML, CSS, and JavaScript.
- **Dockerized**: Easy to run and deploy anywhere using Docker.

## 🛠️ Technologies Used

- **Backend**: Python 3, Flask
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Containerization**: Docker

## 🚀 Getting Started

You can run this project either natively using Python or by using Docker.

### Prerequisites

- **Python 3.x** (if running locally)
- **Docker** (if running via container)

### Option 1: Run Locally (Native Python)

1. **Navigate to the project directory**:
   ```bash
   cd Password_Genrerator
   ```

2. **Install the required dependencies**:
   ```bash
   pip install flask
   ```

3. **Start the Flask server**:
   ```bash
   python app.py
   ```

4. **Open your browser**:
   Navigate to [http://localhost:5000](http://localhost:5000)

### Option 2: Run with Docker

1. **Build the Docker image**:
   ```bash
   docker build -t password-generator .
   ```

2. **Run the Docker container**:
   ```bash
   docker run -d -p 5000:5000 password-generator
   ```

3. **Open your browser**:
   Navigate to [http://localhost:5000](http://localhost:5000)

## 📁 Project Structure

```text
Password_Genrerator/
├── Dockerfile        # Docker configuration for containerization
├── app.py            # Flask web server and API routes
├── index.html        # Main web interface
├── main.py           # Core password generation script
├── script.js         # Frontend logic for API calls and UI interaction
├── styles.css        # UI styling and design
└── License           # Project License
```

## 📝 License

This project is open-source and available under the terms of the License included in the repository.
