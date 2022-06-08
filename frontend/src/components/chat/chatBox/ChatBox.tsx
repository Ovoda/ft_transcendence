import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "src/app/store";
import { setMessages } from "../../../features/chat/chat.slice";
import ChatSender from "./ChatSender";
import './ChatBox.scss';
import { getPreviousMessages } from "services/api.service";
import settings_image from 'images/settings.png';
import block_user_image from 'images/block_user.png';
import TextInput from "assets/TextInput/TextInput";
import Button from "assets/Button/Button";
import { mainSocketContext } from "../../../App";


export default function ChatBox() {

	/** Global data */
	const { chat, relations, user } = useSelector((store: Store) => store);
	const messages = chat.messages;
	const mainSocket = useContext(mainSocketContext);

	/** Tools */
	const dispatch = useDispatch();

	/** Variables */
	const [openSettings, setOpenSettings] = useState<string>("");
	const [roomPassword, setRoomPassword] = useState<string>("");

	function handleOpenSettings() {
		setOpenSettings((settings: string) => {
			if (settings === "") {
				return ("chat_box_settings_open");
			}
			return ("");
		})
	}


	function translateDate(dateStr: string): string {
		const now = new Date();
		const date = new Date(dateStr);

		var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

		var year = date.getFullYear();
		var month = date.getMonth();
		var day = date.getDate();
		var hour = date.getHours();
		var minutes = date.getMinutes();

		if (now.getTime() - date.getTime() > 86400000) { /** one day in ms */
			return months[month] + ' ' + day + ', ' + year;
		}
		return "Today " + hour + ":" + minutes;
	}

	async function handleWatchRequest() {
		mainSocket?.watchingRequest(
			{
				watched: chat.currentRelation?.counterPart.id as string,
				watcher: user.id,
			});
		return false;
	}

	return (
		<div className='chat_box'>
			<div className={"chat_box_header"}>
				<h3>{chat.currentRelation?.counterPart.login}</h3>
				<Button onClick={handleWatchRequest}>Watch Game</Button>
				<img onClick={handleOpenSettings} src={settings_image} alt="" />
				<img onClick={handleOpenSettings} src={block_user_image} alt="" />
			</div>
			<div className={"chat_box_settings " + openSettings}>
				<p>Set room password</p>
				<TextInput text={roomPassword} setText={setRoomPassword} type="password" name="room_password" placeholder="Password" />
				<Button onClick={async () => { return false }}>Next</Button>
			</div>
			<div id="chat_messages_container">
				<div id="chat_messages">
					{
						messages &&
						messages.map((message, index) => {
							return (
								<div key={index} className="message">
									<img src={message.avatar} alt="" />
									<div className="message_content">
										<p>{message.login} <span>{
											translateDate(message.date)
										}</span></p>
										<p className="message_text">{message.content}</p>
									</div>
								</div>
							)
						})
					}
				</div>
			</div>
			<ChatSender />
		</div>
	);
}