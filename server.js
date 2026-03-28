process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const ytdl = require('ytdl-core');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// Set up EJS for HTML rendering
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (downloads)
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

app.use(express.urlencoded({ extended: true }));

// Home page
app.get('/', (req, res) => {
    res.render('index', { message: null });
});

// Handle download requests
app.post('/download', async (req, res) => {
    const url = req.body.url;
    if (!url) return res.render('index', { message: '❌ Please provide a URL' });

    const downloadsDir = path.join(__dirname, 'downloads');
    await fs.ensureDir(downloadsDir);

    try {
        if (ytdl.validateURL(url)) {
            // YouTube download
            const info = await ytdl.getInfo(url);
            const title = info.videoDetails.title.replace(/[\/\\?%*:|"<>]/g, '_');
            const filePath = path.join(downloadsDir, title + '.mp4');
            ytdl(url).pipe(fs.createWriteStream(filePath));
            return res.render('index', { message: `✅ Downloaded YouTube video: <a href="/downloads/${title}.mp4" target="_blank">${title}.mp4</a>` });
        } else {
            // Generic file download
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

            return res.render('index', { message: `✅ Downloaded file: <a href="/downloads/${fileName}" target="_blank">${fileName}</a>` });
        }
    } catch (err) {
        console.error(err);
        return res.render('index', { message: `❌ Download failed: ${err.message}` });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});