<<<<<<< HEAD
=======
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

>>>>>>> 461cb14 (Fix Railway deployment)
const express = require('express');
const fs = require('fs');
const path = require('path');
<<<<<<< HEAD
const ytdl = require('ytdl-core'); // if you want YouTube downloads
const axios = require('axios');     // for direct file downloads
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('downloads'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', { file: null });
});

app.post('/download', async (req, res) => {
    const url = req.body.url;
    let filename = path.basename(url.split('?')[0]); // default filename

    try {
        // Example: YouTube download
        if (ytdl.validateURL(url)) {
            filename = `${Date.now()}.mp4`;
            ytdl(url).pipe(fs.createWriteStream(path.join(__dirname, 'downloads', filename)))
                   .on('finish', () => res.render('index', { file: filename }));
        } else {
            // Direct file download
            const response = await axios({ url, responseType: 'stream' });
            const filePath = path.join(__dirname, 'downloads', filename);
            response.data.pipe(fs.createWriteStream(filePath))
                         .on('finish', () => res.render('index', { file: filename }));
        }
    } catch (err) {
        console.error(err);
        res.render('index', { file: 'Error: Could not download file.' });
=======
const fs = require('fs-extra');
const ytdl = require('ytdl-core');

const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));

// Views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static downloads folder
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

// Home
app.get('/', (req, res) => {
  res.render('index', { message: null });
});

// Download route
app.post('/download', async (req, res) => {
  const url = req.body.url;
  if (!url) return res.render('index', { message: '❌ Please provide a URL' });

  const downloadsDir = path.join(__dirname, 'downloads');
  await fs.ensureDir(downloadsDir);

  try {
    if (ytdl.validateURL(url)) {
      const info = await ytdl.getInfo(url);
      const title = info.videoDetails.title.replace(/[\/\\?%*:|"<>]/g, '_');
      const filePath = path.join(downloadsDir, title + '.mp4');

      ytdl(url)
        .pipe(fs.createWriteStream(filePath))
        .on('finish', () => {
          res.render('index', {
            message: `✅ Downloaded YouTube video: <a href="/downloads/${title}.mp4" target="_blank">${title}.mp4</a>`
          });
        });

    } else {
      let fileName = '';
      try {
        const parsedUrl = new URL(url);
        fileName = path.basename(parsedUrl.pathname);
      } catch {
        fileName = 'video';
      }

      if (!fileName || fileName.length < 5) {
        fileName = `video_${Date.now()}`;
      }

      if (!fileName.includes('.')) {
        fileName += '.mp4';
      }

      const filePath = path.join(downloadsDir, fileName);
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();

      await fs.writeFile(filePath, Buffer.from(buffer));

      res.render('index', {
        message: `✅ Downloaded file: <a href="/downloads/${fileName}" target="_blank">${fileName}</a>`
      });
>>>>>>> 461cb14 (Fix Railway deployment)
    }

  } catch (err) {
    console.error(err);
    res.render('index', {
      message: `❌ Download failed: ${err.message}`
    });
  }
});

<<<<<<< HEAD
app.listen(3000, () => console.log('🚀 Server running on port 3000'));
=======
// Start server (ONLY ONCE!)
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
>>>>>>> 461cb14 (Fix Railway deployment)
