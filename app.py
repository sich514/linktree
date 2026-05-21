from flask import Flask, redirect, render_template
import sqlite3

app = Flask(__name__)

LINKS = {
    "website": "https://yourwebsite.com",
    "whatsapp": "https://wa.me/123456789",
    "zagatclub": "https://t.me/yourchannel",
    "reviews": "https://instagram.com/yourinstagram"
}

def init_db():
    conn = sqlite3.connect('clicks.db')
    c = conn.cursor()

    c.execute('''
    CREATE TABLE IF NOT EXISTS clicks (
        name TEXT PRIMARY KEY,
        count INTEGER
    )
    ''')

    for link in LINKS:
        c.execute(
            "INSERT OR IGNORE INTO clicks VALUES (?, ?)",
            (link, 0)
        )

    conn.commit()
    conn.close()

@app.route('/')

def home():
    return render_template('index.html')

@app.route('/go/<name>')

def go(name):

    if name not in LINKS:
        return "404"

    conn = sqlite3.connect('clicks.db')
    c = conn.cursor()

    c.execute(
        "UPDATE clicks SET count = count + 1 WHERE name=?",
        (name,)
    )

    conn.commit()
    conn.close()

    return redirect(LINKS[name])

@app.route('/analytics')

def analytics():

    conn = sqlite3.connect('clicks.db')
    c = conn.cursor()

    c.execute("SELECT * FROM clicks")

    data = c.fetchall()

    conn.close()

    return render_template(
        'analytics.html',
        data=data
    )

if __name__ == '__main__':
    init_db()
    app.run(debug=True)