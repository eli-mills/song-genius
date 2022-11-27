import React from 'react';

function PlaylistPreview ({playlist, updateTrackList}) {
    const clickHandler = e => {
        e.preventDefault();
        updateTrackList(playlist.tracks);
    }
    return (
        <div className="plPreview" onClick={clickHandler}>
            <img src={playlist.imageUrl} alt="Spotify playlist cover" height='100px' width='100px'/>
            <h3>{playlist.name}</h3>
            <p>{playlist.description}</p>
        </div>
    );
}

export default PlaylistPreview;