FROM python:3.8

COPY getkey.py /app/getkey.py
COPY app.py /app/app.py
COPY requirements.txt /app/requirements.txt

RUN pip install -r /app/requirements.txt

CMD ["python","-u","/app/app.py"]