import './App.css';
import { useState } from 'react';
import InfoButton from './components/InfoButton';
import Modal from './components/Modal';
import EmbediFrame from './components/EmbediFrame';

function App() {

  let [showModal, setShowModal] = useState(true);
  return (
    <div className="App">
      <button onClick={()=>setShowModal(true)}>
      <InfoButton />
      </button>
      {showModal && <Modal setShowModal={setShowModal}/>}
    </div>
  );
}

export default App;
