const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');

const app = express();
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/your_database_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;

const pageSchema = new mongoose.Schema({
  title: String,
  directLinkPath: String,
  telegramLink: String,
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

function decryptLinkPath(encryptedPath, key) {
  const decipher = crypto.createDecipher('aes-256-cbc', key);
  let decrypted = decipher.update(encryptedPath, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

app.post('/generate', (req, res) => {
  const { title, directLinkPath, telegramLink } = req.body;

  if (!title || !directLinkPath || !telegramLink) {
    return res.status(400).send('Missing required fields');
  }

  const htmlContent = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
  </head>
  <body>
    <h1>${title}</h1>
    <p>Links:</p>
    <ul>
      <li><a href="${encryptLinkPath(directLinkPath, process.env.SECRET_KEY)}">Direct link</a></li>
      <li><a href="${encryptLinkPath(telegramLink, process.env.SECRET_KEY)}">Telegram link</a></li>
    </ul>
  </body>
  </html>`;

  const hash = generateRandomHexString(8);

  const newPage = new Page({
    title,
    directLinkPath: encryptLinkPath(directLinkPath, process.env.SECRET_KEY),
    telegramLink: encryptLinkPath(telegramLink, process.env.SECRET_KEY),
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
      <button type="submit">Generate HTML Page</button>
    </form>
  `);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
