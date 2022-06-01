import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "src/app/store";
import { closeChat, openChat } from "../../features/uiState/uiState.slice";

export default function ChatButton(){
	/** Global Data */
	const store: Store = useSelector((store: Store) => store);
	const userData = store.user;
	const uiState = store.uiState;

	/** Tools */
	const dispatch = useDispatch();
	return (
		<>
			{
				!uiState.showChat &&
				<button id='chat_button' onClick={ ()=> dispatch(openChat())}>Chat</button>
			}
			{
				uiState.showChat &&
				<button id='chat_button' onClick={ ()=> dispatch(closeChat())}>Chat</button>
			}
		</>
	);
}