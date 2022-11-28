import React from 'react';

function PlaylistSearch ( {setPlOptions, serverUrl, setShowPls} ) {

    const submitPlaylistSearch = (e) => {
        e.preventDefault();
        setPlOptions([]);
        setShowPls(true);
        (async function _ () {
            const plSearchTerm = document.getElementById("pl-search-term");
            const plOptions = await fetch(`${serverUrl}/api/plSearch/${plSearchTerm.value}`);
            const plOptionsParsed = await plOptions.json();
            setPlOptions(plOptionsParsed);
            plSearchTerm.value = "";
        })();

        
    }
    
    return (
        <form id="playlist-search" onSubmit={submitPlaylistSearch}>
            <input type="text" id="pl-search-term"/>
            <button >Search</button>

        </form>
    );
}

export default PlaylistSearch;