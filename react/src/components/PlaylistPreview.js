import React from 'react';

function PlaylistPreview ({playlist, setPlIndex, myIndex, plIndex}) {
    const clickHandler = e => {
        e.preventDefault();
        setPlIndex(myIndex);
    }
    return (
        <li className={plIndex===myIndex? "pl-preview selected" : "pl-preview"} onClick={clickHandler}>
            <img src={playlist.imageUrl} alt="Spotify playlist cover" height='100px' width='100px'/>
            <h3>{playlist.name}</h3>
            <p dangerouslySetInnerHTML={{__html: playlist.description}}></p>
        </li>
    );
}

export default PlaylistPreview;