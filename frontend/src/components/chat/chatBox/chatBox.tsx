import React, { useState } from "react";
import ChatData from '../../../features/chat/interfaces/chat.interface'
import MessageWrapper from './messageWrapper';
import SendButton from './sendButton';
import TextBox from './textBox'
import { useDispatch, useSelector } from "react-redux";
import { Store } from "src/app/store";
import CloseChat from "./closeChat";
import OpenChatOptions from "./openChatOptions";
import '../Chat.scss';
import ChatOptions from "../chatOptions/chatOptions";
import SubmitPassword from "./submitPassword";

export default function ChatBox(){
	const store: Store = useSelector((store: Store) => store);
	const chatData: ChatData = store.chat;
	
	const dispatch = useDispatch();

	return (
		<>
			<div className='chat_window'>
				<SubmitPassword />
				<CloseChat />
				<OpenChatOptions />
				<MessageWrapper />
				<TextBox />
				<SendButton />
			</div>
		</>
	);
}