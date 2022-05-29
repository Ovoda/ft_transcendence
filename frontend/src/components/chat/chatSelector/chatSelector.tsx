import React, { useState } from "react";
import DmPicker from "./dmPicker";
import RoomPicker from "./roomPicker";

interface Chat {
	stateChanger: any
}

export default function ChatSelector(chat: Chat) {
	const [ isDm, setIsDm ] = useState(true);
	//chat.stateChanger(true);
	function pickRoom(event: any) {
		console.log(event);
		setIsDm(false);
	}

	return (
		<>
			<div>
			<button onClick={ ()=>setIsDm(true) }>DMs</button>
			<button onClick={ pickRoom }>Rooms</button>
			<button onClick={ ()=>chat.stateChanger(false) }>Close</button>
			{ isDm && <DmPicker/> }
			{ !isDm && <RoomPicker/> }
			</div>
		</>
	);
}