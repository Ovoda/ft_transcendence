import ChatData from '../../features/chat/interfaces/chat.interface'
import { Store } from "../../app/store";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatSelector from "./chatSelector/chatSelector";
import { updateChatSelector } from '../../features/chat/chat.slice';
import ChatBox from './chatBox/chatBox';

export default function Chat(){
	// GLOBAL DATA.
	const store: Store = useSelector((store: Store) => store);
    const chatData: ChatData = store.chat;
	const uiState = store.uiState;

	// Tools
	const dispatch = useDispatch();

	if (!uiState.showChat){
		return (
			<></>
		);
	} else {
		return (
		<>
			<div>
				<ChatSelector />
			</div>
			{chatData.displayChat && <ChatBox />}
		</>
		);
	}
}