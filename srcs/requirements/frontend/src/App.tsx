import './App.css';
import 'style/global.scss';
import './App.css';
import { io , Socket} from 'socket.io-client';
import Game from './components/game/game';
import { useEffect, useState } from "react"; 

const socket : Socket = io("ws://localhost:3001");

function App() {
	const [message, setMessage] = useState("");
	const [messageReceived, setMessageReceived] = useState("");
	const sendMessage = () => {
		socket.emit("msgToServer", {message});
	}

	useEffect(() => {
	socket.on("msgToClient", (data) => {
		setMessageReceived(data.message);
		console.log(data);
	})
	}, [socket])
  return (
    <div className="App">
      <header className="App-header">
		  <input 
			placeholder='Message...' 
			onChange={(event) => {
			  setMessage(event.target.value);
		  }}/>
		  <button onClick={sendMessage}> Send Message </button>
		  <h4> Message:</h4>
		  {messageReceived}
		  <Game></Game>
      </header>
    </div>
  );
}

export default App;
