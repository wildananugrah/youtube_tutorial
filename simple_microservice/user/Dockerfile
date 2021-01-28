FROM python:3.8

COPY requirements.txt /app/requirements.txt
COPY app.py /app/app.py

RUN pip install -r /app/requirements.txt

CMD ["python","/app/app.py"]