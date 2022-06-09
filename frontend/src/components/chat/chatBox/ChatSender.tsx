import React, { ChangeEvent, FormEvent, MouseEvent, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import './ChatSender.scss';
import { Store } from "src/app/store";
import TextInput from "assets/TextInput/TextInput";
import Button from "assets/Button/Button";
import UserRelation from "src/shared/interfaces/userRelation";
import { mainSocketContext } from "src";

export default function ChatSender() {

	/** Global data */
	const mainSocket = useContext(mainSocketContext);
	const { user, chat } = useSelector((store: Store) => store);

	/** Variables */
	const [newMessage, setNewMessage] = useState<string>("");

	async function sendMessage(event: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>) {
		event.preventDefault();

		if (newMessage === "") return false;

		let today = new Date();
		let time = today.toString();

		mainSocket?.sendDm({
			content: newMessage,
			login: user.login,
			date: time,
			avatar: user.avatar,
			relation: chat.currentRelation as UserRelation,
		});
		setNewMessage("");
		return false;
	}

	return (
		<form className="chat_sender">
			<TextInput text={newMessage} setText={setNewMessage} type="text" />
			<Button onClick={sendMessage}>Send</Button>
		</form>
	);
}