const creds = require('./client-creds');

const client_id = creds['CLIENT_ID'];
const client_secret = creds['CLIENT_SECRET'];

const fetch = require('node-fetch');
const express = require('express');
const app = express();
const PORT = 3100;

const getApiToken = async () => {
  const clientCreds = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
  const tokenPromise = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${clientCreds}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials'
    })
  });
  const { access_token } = (await tokenPromise.json());
  return access_token;
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



app.get('/', (req, res)=>{
  getApiToken()
    .then( token => getPlaylistTracks(token) )
    .then( list => res.json(list));
});

app.listen(PORT);


// const getOptions = {
  //       url: 'https://api.spotify.com/v1/tracks/1DrlLvlYd1FIjNavRm6NdX',
  //       headers: {
  //         'Authorization': 'Bearer ' + token,
  //         'Content-Type': 'application/json'
  //       }
  //     }
  
  //     request.get(getOptions, function(error, response, body) {
  //       if (!error && response.statusCode === 200) {
  //         console.log(response);
  //         console.log(response.body.linked_from.preview_url);
  //       } else {
  //         console.log(error);
  //         console.log(response);
  //       }
  //     })
  //   }
  // });