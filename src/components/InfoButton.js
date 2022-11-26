import React from 'react';
import {AiOutlineInfoCircle} from 'react-icons/ai';


function InfoButton ({setShowModal}) {
    return (
        <div>
            <button onClick={()=>setShowModal(true)} id="infoButton">
                <AiOutlineInfoCircle />
            </button>
        </div>        
    );
}

export default InfoButton;