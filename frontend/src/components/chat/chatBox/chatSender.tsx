import React, { ChangeEvent, FormEvent, MouseEvent, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import './chatSender.scss';
import { Store } from "src/app/store";
import TextInput from "assets/TextInput/TextInput";
import Button from "assets/Button/Button";
import UserRelation from "src/shared/interfaces/userRelation";
import { mainSocketContext } from "src";
import UserRole from "src/shared/interfaces/role.interface";

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

		if (chat.currentRelation) {
			mainSocket?.sendDm({
				content: newMessage,
				username: user.username,
				date: time,
				avatar: user.avatar,
				userId: user.id,
				relation: chat.currentRelation as UserRelation,
			});
		} else if (chat.currentRole) {
			mainSocket?.sendGroupMessage({
				content: newMessage,
				username: user.username,
				date: time,
				avatar: user.avatar,
				userId: user.id,
				role: chat.currentRole as UserRole,
			});
		}

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