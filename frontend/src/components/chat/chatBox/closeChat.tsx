import React from "react";
import ChatData from '../../../features/chat/interfaces/chat.interface'
import { useDispatch, useSelector } from "react-redux";
import { Store } from "../../../app/store";
import { updateDisplayChat } from '../../../features/chat/chat.slice';

export default function CloseChat(){
	const store: Store = useSelector((store: Store) => store);
	const chatData: ChatData = store.chat;
	
	const dispatch = useDispatch();
	
	return (
		<>
			<div className="close_message" onClick={()=>dispatch(updateDisplayChat(false))}>
				<div className="text">close</div>
			</div>
		</>
	)
}