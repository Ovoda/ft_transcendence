import React, { ChangeEvent, FormEvent, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { mainSocketContext } from "../../../App";
import './ChatSender.scss';
import { Store } from "src/app/store";
import TextInput from "assets/TextInput/TextInput";
import Button from "assets/Button/Button";

export default function ChatSender() {

	/** Global data */
	const mainSocket = useContext(mainSocketContext);
	const { user, chat } = useSelector((store: Store) => store);

	/** Tools */
	const dispatch = useDispatch();

	/** Variables */
	const [newMessage, setNewMessage] = useState<string>("");

	async function sendMessage(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (newMessage === "") return false;

		let today = new Date();
		let time = today.toString();

		mainSocket?.sendMessage({
			content: newMessage,
			login: user.login,
			date: time,
			room: chat.currentRoom,
			avatar: user.avatar,
		});
		setNewMessage("");
		return false;
	}

	return (
		<form className="chat_sender" onClick={sendMessage}>
			<TextInput text={newMessage} setText={setNewMessage} type="text" />
			<button type="submit" hidden></button>
		</form>
	);
}