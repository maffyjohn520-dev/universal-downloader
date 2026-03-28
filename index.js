process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Fix SSL issues

const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const ytdl = require('ytdl-core');

const url = process.argv[2];
if (!url) {
  console.error('❌ Please provide a URL!');
  process.exit(1);
}

const downloadFolder = path.join(__dirname, 'downloads');
fs.ensureDirSync(downloadFolder);

async function downloadFile(fileUrl) {
  try {
    const fileName = path.basename(fileUrl.split('?')[0]);
    const filePath = path.join(downloadFolder, fileName);

    const response = await axios({
      method: 'GET',
      url: fileUrl,
      responseType: 'stream',
    });

    response.data.pipe(fs.createWriteStream(filePath))
      .on('finish', () => console.log(`✅ Downloaded: ${fileName}`))
      .on('error', (err) => console.error('❌ Error:', err));
  } catch (err) {
    console.error('❌ Download failed:', err.message);
  }
}

async function downloadYouTube(videoUrl) {
  try {
    if (!ytdl.validateURL(videoUrl)) {
      console.error('❌ Invalid YouTube URL!');
      return;
    }

    const info = await ytdl.getInfo(videoUrl);
    const title = info.videoDetails.title.replace(/[\/\\?%*:|"<>]/g, '-');
    const filePath = path.join(downloadFolder, `${title}.mp4`);

    ytdl(videoUrl)
      .pipe(fs.createWriteStream(filePath))
      .on('finish', () => console.log(`✅ YouTube Downloaded: ${title}.mp4`))
      .on('error', (err) => console.error('❌ Error:', err));
  } catch (err) {
    console.error('❌ YouTube download failed:', err.message);
  }
}

async function main() {
  if (ytdl.validateURL(url)) {
    await downloadYouTube(url);
  } else {
    await downloadFile(url);
  }
}

main();