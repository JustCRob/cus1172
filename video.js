const express = require('express');
const fs = require('fs');
router = express.Router();

const videoData = './data/videos.json';

const videos = () => {
    if (!fs.existsSync(videoData)) {
      fs.writeFileSync(videoData, JSON.stringify({ videos: [] }, null, 2));
    }
    const data = fs.readFileSync(videoData);
    return JSON.parse(data).videos;
};
  

const saveVideos = (videosArray) => {
    fs.writeFileSync(videoData, JSON.stringify({ videos: videosArray }, null, 2));
};

router.get('/new_video', (req, res) => {
    if (!req.session.user) {
      return res.redirect('/auth1/login?error=' + encodeURIComponent('You must log in to access this content'));
    }
  
    res.render('new_video', { username: req.session.user.username });
  });

  router.post('/new', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth1/login?error=' + encodeURIComponent('You must log in to access this content'));
    }

    const { vidLink, title, thumbnail} = req.body;

    console.log("VID LINK:", vidLink);
    console.log("TITLE:", title);

    const allVideos = videos();

    const newVideo = {
        vidLink,
        title,
        thumbnail,
        uploader: req.session.user.username
    };

    allVideos.push(newVideo);
    saveVideos(allVideos);

    res.render('new_video', {
        username: req.session.user.username,
        success: 'Video uploaded successfully!',
      });
});



router.get('/dashboard/:videofilter', (req, res) => {
    if (!req.session.user) {
      return res.redirect('/auth1/login?error=' + encodeURIComponent('Please log in first.'));
    }

    const vids = videos();
  
    const filter = req.params.videofilter || 'all';
  
    let filteredVideos = [];
        if (filter === 'all') {
            filteredVideos = vids;
        } 
        else if (filter === 'mine' && req.session.user) {
            filteredVideos = vids.filter(vid => vid.uploader === req.session.user.username);
         } 
         else {
            filteredVideos = [];
    }

    res.render('dashboard', { 
        videos : filteredVideos,
        username: req.session.user.username,
      });
  });
  
  module.exports = router;