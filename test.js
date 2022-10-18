var request = require('request');
const creds = require('./client-creds');

var client_id = creds['CLIENT_ID'];
var client_secret = creds['CLIENT_SECRET'];

var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

request.post(authOptions, function(error, response, body) {
  if (!error && response.statusCode === 200) {

    // use the access token to access the Spotify Web API
    var token = body.access_token;
    console.log(token);

    const getOptions = {
      url: 'https://api.spotify.com/v1/tracks/1DrlLvlYd1FIjNavRm6NdX',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    }

    request.get(getOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        console.log(response);
        console.log(response.body.linked_from.preview_url);
      } else {
        console.log(error);
        console.log(response);
      }
    })
  }
});