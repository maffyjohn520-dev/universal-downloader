const express = require('express');
const fs = require('fs');
const path = require('path');
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
    }
});

app.listen(3000, () => console.log('🚀 Server running on port 3000'));
