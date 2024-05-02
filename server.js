
const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
require('dotenv').config(); 

const app = express();
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;


const pageSchema = new mongoose.Schema({
  title: String,
  directLinkPath: String,
  telegramLink: String,
  telegramdl: String,
  htmlContent: String,
  hash: { type: String, unique: true }
});


const Page = mongoose.model('Page', pageSchema);


function generateRandomHexString(length) {
  return crypto.randomBytes(length).toString('hex');
}

function encryptLinkPath(path, key) {
  const cipher = crypto.createCipher('aes-256-cbc', key);
  let encrypted = cipher.update(path, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Function to decrypt link path
function decryptLinkPath(encryptedPath, key) {
  const decipher = crypto.createDecipher('aes-256-cbc', key);
  let decrypted = decipher.update(encryptedPath, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}


app.post('/generate', (req, res) => {
  const { title, directLinkPath, telegramLink, telegramdl } = req.body;

  
  if (!title || !directLinkPath || !telegramLink) {
    return res.status(400).send('Missing required fields');
  }

  // Encrypt direct link path
  const encryptedDirectLink = encryptLinkPath(directLinkPath, process.env.SECRET_KEY);
  const encryptedTelegramLink = encryptLinkPath(telegramLink, process.env.SECRET_KEY);

  const encryptedTelegramDl = encryptLinkPath(telegramdl, process.env.SECRET_KEY)

  const htmlContent = `<!DOCTYPE html>
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
          <a href='https://fastdl.tamilloggers.workers.dev/${encryptedDirectLink}'">Download 1</a>
          <a href="https://mediumdl.tamilloggers.workers.dev/${encryptedDirectLink}'">Download 2</a>
          <a href="https://slowdl.tamilloggers.workers.dev/${encryptedDirectLink}'">Download 3</a>
          <p>Uploaded By TamilLoggers</p>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="box">
        <div class="content">
          <h2>02</h2>
          <h3>Telegram Link</h3>
          <a href='${encryptedTelegramLink}'">Telegram 1</a>
          <a href='${encryptedTelegramDl}'">Telegram 2</a>
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
</html>`;

  const hash = generateRandomHexString(8);


  const newPage = new Page({
    title,
    directLinkPath: encryptedDirectLink,
    telegramLink: encryptLinkPath(telegramLink, process.env.SECRET_KEY),
    telegramdl: encryptLinkPath(telegramdl, process.env.SECRET_KEY),
    htmlContent,
    hash
  });

  newPage.save((err, savedPage) => {
    if (err) {
      console.error('Error saving to MongoDB:', err);
      return res.status(500).send('Internal Server Error');
    }
    console.log('Data saved to MongoDB successfully!');
    res.redirect(`/page/${hash}`);
  });
});


app.get('/page/:hash', (req, res) => {
  const hash = req.params.hash;

  Page.findOne({ hash }, (err, page) => {
    if (err || !page) {
      return res.status(404).send('Page not found');
    }

    res.send(page.htmlContent);
  });
});

app.get('/generator', (req, res) => {
  res.send(`
    <form action="/generate" method="POST">
      <label for="title">Title:</label><br>
      <input type="text" id="title" name="title"><br>
      <label for="directLinkPath">Direct Link Path:</label><br>
      <input type="text" id="directLinkPath" name="directLinkPath"><br>
      <label for="telegramLink">Telegram Link:</label><br>
      <input type="text" id="telegramLink" name="telegramLink"><br><br>
      <label for="telegramdl">Telegram dl:</label><br>
      <input type="text" id="telegramdl" name="telegramdl"><br><br>
      <button type="submit">Generate HTML Page</button>
    </form>
  `);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
