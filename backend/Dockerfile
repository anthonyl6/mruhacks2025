FROM python:latest

WORKDIR /var/api/mojo/


COPY ./app.py app.py
COPY ./auth.py auth.py
COPY ./db.py db.py
COPY ./account_details.py account_details.py
COPY ./requirements.txt requirements.txt

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

CMD ["flask", "--app", "app", "run", "--host=0.0.0.0"]
