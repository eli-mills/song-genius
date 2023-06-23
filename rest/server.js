/*****************************
    SERVER INITIALIZATIONS
*****************************/
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT;


/*************************************
    SPOTIFY API CLIENT CREDENTIALS
*************************************/
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'
const CLIENT_CREDS = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64');
const TOKEN_REQUEST_HEADERS = {
    method: 'POST',
    headers: {
      Authorization: `Basic ${CLIENT_CREDS}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials'
    })
  };
let accessToken;


/**************
    METHODS
***************/

const getHeaders = () => {return {Authorization:`Bearer ${accessToken}`,'Content-Type':'application/json'}};


/**
 * Function: getApiToken
 *    Sends Spotify API client credentials to Spotify token endpoint. 
 *    Expects to receive a valid bearer access token from microservice and
 *    sets the global variable accessToken to this value.
 */
const getApiToken = async () => {
  console.log("Sending request to token microservice, awaiting.");
  const tokenPromise = await fetch(SPOTIFY_TOKEN_URL, TOKEN_REQUEST_HEADERS);
  console.log("Token received, parsing text.");
  const { access_token } = await tokenPromise.json();
  accessToken = access_token;                           // Sets global variable accessToken
  console.log(`accessToken = ${accessToken}`);
}


/**
 * Function: requestSpotify
 *    Attempts to send a request with the given URL add-on to the Spotify API
 *    access URL. If request fails, updates the global variable accessToken and
 *    tries again. If second request fails, returns the error.
 * 
 * Parameters:
 *    urlQuery (string): URL-encoded string to add on to Spotify API access URL
 * 
 * Returns:
 *    Promise to resolve to JSON-parsed results from Spotify API.
 * 
 */
const requestSpotify = async urlQuery => {
  if (!accessToken) {
    await getApiToken();
  }

  const url = `https://api.spotify.com/v1/${urlQuery}`;
  
  try {
    let results = await fetch(url, {headers: getHeaders()})        // Attempt with current accessToken
    let resultsParsed = await results.json();

    if (resultsParsed.error) {
      await getApiToken();                                        // Refresh accessToken and attempt again
      results = await fetch(url, {headers: getHeaders()});
      resultsParsed = await results.json();
    }

    return resultsParsed.error ? new Error(`Spotify API error: improper fetch:\n${resultsParsed}`) : resultsParsed;
  } catch (err) {
    console.error(`Server error in resolving Spotify request to ${url}:\n${err}`)

  }
}


/**
 * Function: getPlaylistTracks
 *    Requests the Spotify API to fetch the list of tracks in the given playlist.
 * 
 * Parameters:
 *    playlistId (string): the Spotify ID of the desired playlist
 * 
 * Returns:
 *    List of track objects containing the track name and preview URL (both strings).
 */
const getPlaylistTracks = async (playlistId) => {
  const queryParams = new URLSearchParams({
    fields: 'items(track(name,artists(name),preview_url,popularity))',
    limit: 50,
    market: "US"
  });
  const trackList = await requestSpotify(`playlists/${playlistId}/tracks?${queryParams}`);
  return trackList.items;
}


/**
 * Function: searchForPlaylists
 *    Sends playlist search request to Spotify API and returns results.
 * 
 * Parameters:
 *    searchTerm (string): URL encoded string to search
 * 
 * Returns: 
 *    List of playlist objects.
 */
const searchForPlaylists = async (searchTerm) => {
  const urlAddon = `search?q=${encodeURIComponent(searchTerm)}&type=playlist`;
  const playlists = await requestSpotify(urlAddon);
  return playlists.playlists.items;
}


/**
 * Function: getFilteredTracklists
 *    Retrieves all tracks for each playlist, then checks for preview URLs and minimum popularity.
 * 
 * Parameters:
 *    playlistOptions (array of Spotify playlist objects): list of playlist to grab songs for
 * 
 * Returns:
 *    Array of arrays of tracks that have preview url's and are >= minPopularity popular.
 */
const getFilteredTracklists = async (playlistOptions) => {
  // Define tracklist criteria
  const minPlaylistLength = 10;
  const maxOutputLength = 5;
  const minPopularity = 20;

  // Get tracks for each playlist, then filter
  const output = [];
  for (pl of playlistOptions) {
    const trackList = await getPlaylistTracks(pl.id);
    const temp = trackList.filter(el => el.track["preview_url"] != null && el.track.popularity>=minPopularity);
    if (temp != [] && temp.length >= minPlaylistLength) {
      output.push({
        name: pl.name,
        description: pl.description,
        imageUrl: pl.images[0].url,
        tracks: temp
      });
    }
    if (output.length >= maxOutputLength) break;
  }
  
  return output;
}


/************
    ROUTES
*************/


// ROUTE plSearch: PLAYLIST SEARCH
app.get('/api/plSearch/:searchTerm', async (req, res, next)=>{
  // Reference https://developer.spotify.com/documentation/web-api/reference/#/operations/search
  // result.playlists.items[].(name, description, images[].(url/height/width), tracks.items[])
  const searchTerm = req.params.searchTerm;
  console.log(`Server received request for playlists from search term ${searchTerm}`);

  try {
    const playlistOptions = await searchForPlaylists(searchTerm);
    const trackLists = await getFilteredTracklists(playlistOptions);
    console.log(`Server sending list of ${trackLists.length} playlists`);
    res.header('Access-Control-Allow-Origin', '*');
    res.json(trackLists);

  } catch (err) {
    console.error(`Server error when retrieving playlists for search term ${searchTerm}:\n${err}`);
    next(err);
  }
});

app.listen(PORT, ()=>console.log(`Server listening on port ${PORT}`));
