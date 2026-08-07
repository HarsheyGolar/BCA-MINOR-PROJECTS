# 1. Base image (Python 3.14 slim version)
FROM python:3.14-slim

# 2. Work directory set karo container ke andar
WORKDIR /app

# 3. Sab files copy karo container mein
COPY . .

# 4. Flask install karo
RUN pip install flask

# 5. Port expose karo (jo app run karega)
EXPOSE 5000

# 6. Command to run the app
CMD ["python", "app.py"]