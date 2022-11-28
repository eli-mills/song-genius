import React from 'react';

function PlaylistPreview ({playlist, setPlIndex, myIndex, plIndex}) {
    const clickHandler = e => {
        e.preventDefault();
        setPlIndex(myIndex);
    }
    return (
        <div className={plIndex===myIndex? "pl-preview selected" : "pl-preview"} onClick={clickHandler}>
            <img src={playlist.imageUrl} alt="Spotify playlist cover" height='100px' width='100px'/>
            <h3>{playlist.name}</h3>
            <p>{playlist.description}</p>
        </div>
    );
}

export default PlaylistPreview;