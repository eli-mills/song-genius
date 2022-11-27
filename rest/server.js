/*****************************
    SERVER INITIALIZATIONS
*****************************/
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 3000;


/*************************************
    SPOTIFY API CLIENT CREDENTIALS
*************************************/
const creds = require('./client-creds');
const client_id = creds['CLIENT_ID'];
const client_secret = creds['CLIENT_SECRET'];
let accessToken;


/**************
    METHODS
***************/

const getHeaders = () => {return {Authorization:`Bearer ${accessToken}`,'Content-Type':'application/json'}};


/**
 * Function: getApiToken
 *    Sends Spotify API client credentials to token generator microservice. 
 *    Expects to receive a valid bearer access token from microservice and
 *    sets the global variable accessToken to this value.
 */
const getApiToken = async () => {
  const urlString = `https://helpmeeeeeee.herokuapp.com/credentials/${client_id}/${client_secret}`;
  console.log("Sending request to token microservice, awaiting.");
  const tokenPromise = await fetch(urlString);
  console.log("Token received, parsing text.");
  accessToken = await tokenPromise.text();    // Sets global variable accessToken
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

  console.log(`Server sending request to ${url}`);
  
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
    limit: 50
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


const getFilteredTracklists = async (playlistOptions) => {
  const minLength = 10;
  const maxOutputLength = 5;
  const minPopularity = 20;
  const output = [];

  for (pl of playlistOptions) {
    const trackList = await getPlaylistTracks(pl.id);
    const temp = trackList.filter(el => el.track["preview_url"] != null && el.track.popularity>=minPopularity);
    if (temp != [] && temp.length >= minLength) {
      output.push(temp);
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
    console.log(`Server sending list of playlists: ${JSON.stringify(trackLists)}`);
    res.json(trackLists);

  } catch (err) {
    console.error(`Server error when retrieving playlists for search term ${searchTerm}:\n${err}`);
    next(err);
  }
});


// ROUTE plTracks: GET TRACKS FROM PLAYLIST
app.get('/api/plTracks/:playlistId', async (req, res, next)=>{
  // Reference https://developer.spotify.com/documentation/web-api/reference/#/operations/get-playlists-tracks

  const playlistId = req.params.playlistId;
  console.log(`Server received request for playlist tracks for ID ${playlistId}`);

  try {
    const playlistTracks = await getPlaylistTracks(playlistId);
    // Eliminate null preview_urls
    const cleanedPlaylistTracks = playlistTracks.filter((el)=>el.track["preview_url"] != null);
    console.log(`Sending tracks: ${JSON.stringify(cleanedPlaylistTracks)}`);
    res.json(cleanedPlaylistTracks);

  } catch (err) {
    console.error(`Server error when retrieving tracks for playlist ID ${playlistId}:\n${err}`);
    next(err);
  }

})

app.listen(PORT, ()=>console.log(`Server listening on port ${PORT}`));
