const express = require('express');
const ytdl = require('ytdl-core');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

// Middleware for handling CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// API endpoint for downloading YouTube videos
app.post('/download', async (req, res) => {
    const { url } = req.body;

    // Validate YouTube URL
    if (!ytdl.validateURL(url)) {
        return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    try {
        // Get video info
        const info = await ytdl.getInfo(url);

        // Extract thumbnail URL
        const thumbnail = info.videoDetails.thumbnails[0].url;

        // Respond with title, formats, and thumbnail
        res.json({ 
            title: info.videoDetails.title, 
            formats: info.formats,
            thumbnail: thumbnail
        });
    } catch (error) {
        console.error('Error fetching video info:', error);
        res.status(500).json({ error: 'Failed to fetch video info' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
