import telegram
from telegram.ext import Updater, CommandHandler, ConversationHandler, MessageHandler, Filters
from pymongo import MongoClient
from flask import Flask, render_template_string
import hashlib
import os


baseurl = os.getenv("BASEURL", "https://localhost:80")
dlurl1 = os.getenv("DLURL1", "https://fastdl.tamilloggers.workers.dev")
dlurl2 = os.getenv("DLURL2", "https://mediumdl.tamilloggers.workers.dev")
dlurl3 = os.getenv("DLURL3", "https://slowdl.tamilloggers.workers.dev")
mongodb_url = os.getenv("DATABSE_URL", "mongodb+srv://tamilloggers:tamilloggers@cluster0.plurmqb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")


client = MongoClient(mongodb_url)
db = client['html_pages']
collection = db['generated_pages']


TOKEN = '6732148866:AAF1hYe6x4r01zfPyUHc_ft4I0cP79E3X4A'
bot = telegram.Bot(token=TOKEN)


app = Flask(__name__)

DIRECT_LINK, TELLINK1, TELLINK2, CONFIRM = range(4)


def start(update, context):
    update.message.reply_text("Send /gen to generate an HTML page.")


def generate_start(update, context):
    update.message.reply_text("Send me the direct link (URL).")
    return DIRECT_LINK


def receive_direct_link(update, context):
    context.user_data['direct_link'] = update.message.text
    update.message.reply_text("Send me tellink1.")
    return TELLINK1


def receive_tellink1(update, context):
    context.user_data['tellink1'] = update.message.text
    update.message.reply_text("Send me tellink2.")
    return TELLINK2


def receive_tellink2(update, context):
    context.user_data['tellink2'] = update.message.text
    update.message.reply_text("Confirm generation? (yes/no)")
    return CONFIRM

def parse_link(link):
    domain = link.split('/')[2]
    path = '/'.join(link.split('/')[3:])
    return domain, path


def generate_html_content(domain, path, tellink1, tellink2):
    dllink1 = f"{dlurl1}/{path}"
    dllink2 = f"{dlurl2}/{path}"
    dllink3 = f"{dlurl3}/{path}"
    
    html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&family=Roboto+Condensed:wght@300;400;700&display=swap");

*{{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'poppins', sans-serif;
}}

body{{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  min-height: 100vh;
  background-color: #232427;

}}

.container{{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 40px 0;
}}

.container .card{{
  position: relative;
  min-width: 320px;
  height: 440px;
  box-shadow: inset 5px 5px 5px rgba(0, 0, 0, 0.2),
              inset -5px -5px 15px rgba(255, 255, 255, 0.1),
              5px 5px 15px rgba(0, 0, 0, 0.3),
              -5px -5px 15px rgba(255, 255, 255, 0.1);

  border-radius: 15px;
  margin: 30px;
}}

.container .card::before{{
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
}}

.container .card .box{{
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 20px;
  background: #2a2b2f;
  border: 2px solid #1e1f23;
  border-radius: 15px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  transition: 0.s;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;


}}


.container .card .box::before{{
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  pointer-events: none;
}}

.container .card .box:hover{{
  transform: translateY(-50px);
  box-shadow: 0 40px 70px rgba(0, 0, 0, 0.5);
}}

.container .card .box .content{{
  padding: 20px;
  text-align: center;

}}
.container .card .box .content h2{{
  position: absolute;
  top: -10;
  right: 30px;
  font-size: 8em;
  color: rgba(255, 255, 255, 0.05);
}}

.container .card .box .content h3{{
  font-size: 1.8em;
  color: rgba(255, 255, 255, 0.5);
  z-index: 1;
  transition: 0.5s;

}}

.container .card .box .content p{{
  font-size: 16px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.5);
  z-index: 1;
  transition: 0.5s;

}}

.container .card .box .content a{{
  position: relative;
  display: inline-block;
  padding: 8px 20px ;
  background: #000;
  margin-top: 15px;
  margin-bottom: 5px;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 400;
  color: #fff;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);


}}


.container .card:nth-child(1) .box .content a{{
  background: #2196f3;

}}

.container .card:nth-child(2) .box .content a{{
  background: #e91e63;

}}

.container .card:nth-child(3) .box .content a{{
  background: #97dc47;

}}

h1{{
  align-items: center;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
}}
</style>
<body>
  <h1>TAMILLOGGERS</h1>
  <div class="container">
    <div class="card">
      <div class="box">
        <div class="content">
          <h2>01</h2>
          <h3>Fast Download Link</h3>
          <a onclick="window.location.href='{dllink1}'">Download 1</a>
          <a onclick="window.location.href='{dllink2}'">Download 2</a>
          <a onclick="window.location.href='{dllink3}'">Download 3</a>
          <p>Uploaded By TamilLoggers</p>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="box">
        <div class="content">
          <h2>02</h2>
          <h3>Telegram Link</h3>
          <a onclick="window.location.href='{tellink1}'">Telegram 1</a>
          <a onclick="window.location.href='{tellink2}'">Telegram 2</a>
          <p>Uploaded By TamilLoggers</p>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="box">
        <div class="content">
          <h2>01</h2>
          <h3>About</h3>
          <a href="#">Telegram Channel</a>
          <a href="#">Main Site</a>
          <a href="#">Contact</a>
          <p>Uploaded By TamilLoggers</p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
    """
    return html_content

def save_html_to_db(html_content):
    html_hash = hashlib.sha256(html_content.encode()).hexdigest()
    existing_entry = collection.find_one({'hash': html_hash})
    if not existing_entry:
        collection.insert_one({'hash': html_hash, 'html_content': html_content})
    return html_hash

@app.route('/<html_hash>')
def render_html(html_hash):
    html_entry = collection.find_one({'hash': html_hash})
    if html_entry:
        return render_template_string(html_entry['html_content'])
    else:
        return "HTML page not found."

updater = Updater(TOKEN, use_context=True)
dp = updater.dispatcher


def confirm_generation(update, context):
    confirmation = update.message.text.lower()
    if confirmation == 'yes':
        direct_link = context.user_data['direct_link']
        domain, path = parse_link(direct_link)
        tellink1 = context.user_data['tellink1']
        tellink2 = context.user_data['tellink2']
        html_content = generate_html_content(domain, path, tellink1, tellink2)
        html_hash = save_html_to_db(html_content)
        html_url = f"{baseurl}/{html_hash}"  
        update.message.reply_text(f"HTML page generated successfully. Access it here: {html_url}")
        return html_content  
    else:
        update.message.reply_text("Generation process canceled.")
        return None  


def send_generated_html(update, context):
    html_content = context.user_data.get('html_content')
    if html_content:
        update.message.reply_text(html_content)
    else:
        update.message.reply_text("HTML page not generated.")


conv_handler = ConversationHandler(
    entry_points=[CommandHandler('gen', generate_start)],
    states={
        DIRECT_LINK: [MessageHandler(Filters.text & ~Filters.command, receive_direct_link)],
        TELLINK1: [MessageHandler(Filters.text & ~Filters.command, receive_tellink1)],
        TELLINK2: [MessageHandler(Filters.text & ~Filters.command, receive_tellink2)],
        CONFIRM: [MessageHandler(Filters.text & ~Filters.command, confirm_generation)]
    },
    fallbacks=[CommandHandler('cancel', cancel)]
)

dp.add_handler(MessageHandler(Filters.text & ~Filters.command, send_generated_html))


dp.add_handler(CommandHandler("start", start))
dp.add_handler(conv_handler)

updater.start_polling()

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
