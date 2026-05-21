from flask import Flask, redirect, render_template
import json
import os

app = Flask(__name__)

LINKS = {
    "website": "https://www.zagatboutiques.com/",
    "whatsapp": "https://api.whatsapp.com/send/?phone=380951011135&text=https%3A%2F%2Fzagatboutique.com%2F%0D%0A%0D%0AHi!+Can+you+help%3F&type=phone_number&app_absent=0",
    "zagatclub": "https://t.me/zagat_club",
    "reviews": "https://www.instagram.com/stories/highlights/18104464960940633/"
}

DATA_FILE = "clicks.json"

def load_data():

    if not os.path.exists(DATA_FILE):

        data = {
            "website": 0,
            "whatsapp": 0,
            "zagatclub": 0,
            "reviews": 0
        }

        with open(DATA_FILE, "w") as f:
            json.dump(data, f)

    with open(DATA_FILE, "r") as f:
        return json.load(f)

def save_data(data):

    with open(DATA_FILE, "w") as f:
        json.dump(data, f)

@app.route('/')

def home():
    return render_template('index.html')

@app.route('/go/<name>')

def go(name):

    if name not in LINKS:
        return "404"

    data = load_data()

    data[name] += 1

    save_data(data)

    return redirect(LINKS[name])

@app.route('/analytics')

def analytics():

    data = load_data()

    return render_template(
        'analytics.html',
        data=data
    )

if __name__ == '__main__':
    app.run(debug=True)
