import React from 'react';
import {IoIosTimer} from 'react-icons/io';

function Timer ({timer}) {
    
    return (    
        <div id="timer">
            <IoIosTimer /> {timer}s
            
        </div>
    );
}

export default Timer;