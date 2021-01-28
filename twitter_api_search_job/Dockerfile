FROM python:3.8

COPY requirements.txt /app/requirements.txt
COPY search.py /app/search.py

RUN pip install -r /app/requirements.txt

CMD ["python", "/app/search.py"]