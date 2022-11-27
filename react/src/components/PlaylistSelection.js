import React from 'react';
import PlaylistPreview from './PlaylistPreview';

function PlaylistSelection ({plOptions, updateTrackList}) {
    return (
        <ul id="plSelect">
        {
            plOptions.map( (el, index) => {
                return <li key={index}> <PlaylistPreview playlist={el} updateTrackList={updateTrackList}/></li>
            })
        }
        </ul>
    );
}

export default PlaylistSelection;