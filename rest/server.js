const creds = require('./client-creds');

const client_id = creds['CLIENT_ID'];
const client_secret = creds['CLIENT_SECRET'];
let accessToken;

const fetch = require('node-fetch');
const express = require('express');
const app = express();
const PORT = 3000;


const getApiToken = async () => {
  const urlString = `https://helpmeeeeeee.herokuapp.com/credentials/${client_id}/${client_secret}`;
  console.log("Sending request to token microservice, awaiting.");
  const tokenPromise = await fetch(urlString);
  console.log("Token received, parsing text.");
  accessToken = await tokenPromise.text();    // Sets global variable accessToken
  console.log(`accessToken = ${accessToken}`);
}

const getHeaders = () => {return {Authorization:`Bearer ${accessToken}`,'Content-Type':'application/json'}};

const requestSpotify = async urlQuery => {
  if (!accessToken) {
    await getApiToken();
  }

  const url = `https://api.spotify.com/v1/${urlQuery}`;
  
  return fetch(url, {headers: getHeaders()})
    .then( (res) => res.json() )
    .catch( () => {
      getApiToken()
      .then(()=>fetch(url, {headers: getHeaders()}))
      .then((res)=>res.json())
      .catch((err)=>console.error(err));
    });
}


const getPlaylistTracks = async () => {
  const queryParams = new URLSearchParams({
    fields: 'items(track(name)),items(track(preview_url))',
    limit: 50
  });
  const playlistId = '37i9dQZF1E4ucISj07fVUh';
  // const playlistPromise = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?${queryParams}`, {
  //   method: 'GET',
  //   headers: {
  //     Authorization: `Bearer ${accessToken}`,
  //     'Content-Type': 'application/json'
  //   }
  // });
  const trackList = await requestSpotify(`playlists/${playlistId}/tracks?${queryParams}`);
  return trackList.items;
}


app.get('/api/', async (req, res, next)=>{
  
  console.log('Get request received.');
  const searchTerm = req.params.searchTerm;

  try {
    // Get playlist
    const playlistItems = await getPlaylistTracks();

    if (searchTerm) {
      const results = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=playlist`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer BQDnYdI10XFwHIirU43m4enqncNegNlHnzD5eYV-xB4_zAavUl87dBD_z1yGmhgTVs7sj6RvleZLZGEXOixG4aAx9QibheclAXw7_Ge6B4GVzQIw8Go`,
          'Content-Type': 'application/json'
        }
    });
      const parsedResults = await results.json();
      res.json(parsedResults.playlists.items[0]);
    }
    
    res.json(playlistItems);
  } catch (err) {
    console.error(`Error inside get route.\n${err}`);
    next(err);
  }
});

app.listen(PORT, ()=>console.log(`Server listening on port ${PORT}`));
