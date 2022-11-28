import React from 'react';

function ShowPlaylists ({setShowPls}) {
    return (
        <button onClick={()=>setShowPls(true)}>Show Playlist Options</button>
    );
}

export default ShowPlaylists;