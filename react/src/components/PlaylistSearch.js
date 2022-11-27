import React from 'react';

function PlaylistSearch ( {setPlOptions, serverUrl} ) {

    const submitPlaylistSearch = (e) => {
        e.preventDefault();

        (async function _ () {
            const plSearchTerm = document.getElementById("plSearchTerm");
            const plOptions = await fetch(`${serverUrl}/api/plSearch/${plSearchTerm.value}`);
            const plOptionsParsed = await plOptions.json();
            setPlOptions(plOptionsParsed);
            plSearchTerm.value = "";
        })();
    }
    
    return (
        <form id="playlistSearch">
            <input type="text" id="plSearchTerm"/>
            <button onClick={submitPlaylistSearch}>Search</button>

        </form>
    );
}

export default PlaylistSearch;