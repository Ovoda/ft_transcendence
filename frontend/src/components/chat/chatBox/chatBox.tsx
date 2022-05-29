import React, { useState } from "react";
import ChatData from '../../../features/chat/interfaces/chat.interface'
import MessageWrapper from './messageWrapper';
import SendButton from './sendButton';
import TextBox from './textBox'
import { useDispatch, useSelector } from "react-redux";
import { Store } from "src/app/store";
import CloseChat from "./closeChat";

export default function ChatBox(){
	const store: Store = useSelector((store: Store) => store);
	const chatData: ChatData = store.chat;
	
	const dispatch = useDispatch();

	return (
		<>
			<div className='chat_window'>
				<CloseChat />
				<MessageWrapper />
				<TextBox />
				<SendButton />
			</div>
		</>
	);
}