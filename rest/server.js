const creds = require('./client-creds');

const client_id = creds['CLIENT_ID'];
const client_secret = creds['CLIENT_SECRET'];

const fetch = require('node-fetch');
const express = require('express');
const app = express();
const PORT = 3000;


const getApiToken = async () => {
  const urlString = `https://helpmeeeeeee.herokuapp.com/credentials/${client_id}/${client_secret}`;

  console.log("Sending request to token microservice, awaiting.");
  const tokenPromise = await fetch(urlString);

  console.log("Token received, parsing text.");
  const token = await tokenPromise.text();
  return token;
}


const getPlaylistTracks = async accessToken => {
  const queryParams = new URLSearchParams({
    fields: 'items(track(name)),items(track(preview_url))',
    limit: 50
  });
  const playlistId = '37i9dQZF1E4ucISj07fVUh';
  const playlistPromise = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?${queryParams}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
  const trackList =  (await playlistPromise.json());
  return trackList.items;
}


app.get('/api', async (req, res, next)=>{
  
  console.log('Get request received.');

  try {
    // Get token
    const token = await getApiToken()
    console.log(`Token received and parsed: ${token}`);
    
    // Get playlist
    const playlistItems = await getPlaylistTracks(token);
    console.log(`Tracklist received: ${playlistItems}`);
    
    res.json(playlistItems);
  } catch (err) {
    console.error(`Error inside get route.\n${err}`);
    next(err);
  }
});

app.listen(PORT, ()=>console.log(`Server listening on port ${PORT}`));
