import ChatData from '../../features/chat/interfaces/chat.interface'
import { Store } from "../../app/store";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatSelector from "./chatSelector/chatSelector";

export default function Chat(){
	// GLOBAL DATA.
	const store: Store = useSelector((store: Store) => store);
    const chatData: ChatData = store.chat;

	const [chatSel, setChatSel] = useState(false);

	// Tools
	const dispatch = useDispatch();
	
	return (
	<>
		{
			!chatSel &&
			<div>
				<button onClick={()=>setChatSel(true)}>Chat</button>
			</div>
		}
		{
			chatSel &&
			<div>
				<ChatSelector stateChanger={setChatSel}/>
				{/* <button onClick={()=>setChatSel(false)}>Close</button> */}
			</div>
			
		}
	</>
	);
}