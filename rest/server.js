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

app.get('/', (req, res)=>{
  const accessToken = getApiToken();
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