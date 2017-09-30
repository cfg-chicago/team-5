from flask import Flask
from flask.ext.mysql import MySQL


app = Flask(__name__)
mysql = MySQL()
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'codeforgoodteam5'
app.config['MYSQL_DATABASE_DB'] = 'codeforgood'
app.config['MYSQL_DATABASE_HOST'] = '107.21.85.123'



mysql.init_app(app)

conn = mysql.connect()
 
@app.route("/")
def hello():    
    cur = conn.cursor()
    cur.execute('''SELECT username FROM user''')
    rv = cur.fetchall()
    return str(rv)

 
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)