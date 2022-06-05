import React, { ChangeEvent, FormEvent, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { mainSocketContext } from "../../../App";
import './ChatSender.scss';
import { Store } from "src/app/store";

export default function ChatSender() {

	/** Global data */
	const mainSocket = useContext(mainSocketContext);
	const { user, chat } = useSelector((store: Store) => store);

	/** Tools */
	const dispatch = useDispatch();

	/** Variables */
	const [newMessage, setNewMessage] = useState<string>("");

	function handleNewMessageOnChange(event: ChangeEvent<HTMLInputElement>) {
		event.preventDefault();
		setNewMessage(event.target.value);
	}

	function sendMessage(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (newMessage === "") return;

		var today = new Date();
		var time = today.getHours() + ":" + today.getMinutes();

		mainSocket?.sendMessage({
			content: newMessage,
			from: user.login,
			date: time,
			room: chat.currentRoom,
		});
		setNewMessage("");
	}

	return (
		<form className="chat_sender" onSubmit={sendMessage}>
			<input
				type="text"
				className="message_input"
				placeholder="your message"
				value={newMessage}
				onChange={handleNewMessageOnChange}
			/>
			<button type="submit">send</button>
		</form>
	);
}