import React from 'react';
import PlaylistPreview from './PlaylistPreview';
import {ImCancelCircle} from 'react-icons/im';

function PlaylistSelection ({plOptions, setPlIndex, plIndex}) {
    return (
        <div id="plSelectBg">
            <ImCancelCircle className="close-button"/>
            <ul id="plSelect">
            {
                plOptions.map( (el, index) => {
                    return <li key={index}> <PlaylistPreview playlist={el} setPlIndex={setPlIndex} myIndex={index} plIndex={plIndex}/></li>
                })
            }
            </ul>
        </div>
    );
}

export default PlaylistSelection;