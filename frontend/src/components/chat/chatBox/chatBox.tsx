import React, { MouseEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "src/app/store";
import '../Chat.scss';
import SubmitPassword from "./submitPassword";
import ChatButton from "../utils/ChatButton";
import { clearMessages, closeChatDms } from "../../../features/chat/chat.slice";
import ChatSender from "./ChatSender";
import './ChatBox.scss';

export default function ChatBox() {

	/** Global data */
	const chat = useSelector((store: Store) => store.chat);
	const messages = chat.messages;

	/** Tools */
	const dispatch = useDispatch();

	/** TODO: Fetch previous messages */
	useEffect(() => {
		console.log(messages);
	});

	function closeDm(event: MouseEvent<HTMLButtonElement>) {
		event.preventDefault();
		dispatch(closeChatDms());
		dispatch(clearMessages());
	}

	return (
		<div className='chat_box'>
			<div id="header">
				<button onClick={closeDm}>x</button>
				<ChatButton text="=" onClick={() => dispatch(closeChatDms())} />
			</div>
			<div>
				<div className="chat_messages">
					{
						messages.map((message, index) => {
							return (
								<p key={index} className="message right">
									{message.content}
									<span>{"from " + message.from + " " + message.date}</span>
								</p>
							)
						})
					}
				</div>
				<ChatSender />
			</div>
		</div>
	);
}