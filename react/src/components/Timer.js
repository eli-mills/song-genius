import React from 'react';
import {IoIosTimer} from 'react-icons/io';

function Timer ({timer, score}) {
    
    return (    
        <div id="timer">
            <span>
                <IoIosTimer /> {timer}s    
            </span>
            <span> 
                {score}pts
            </span>
            
        </div>
    );
}

export default Timer;