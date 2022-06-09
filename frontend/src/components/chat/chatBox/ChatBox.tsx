import React, { UIEvent, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "src/app/store";
import { addMessageFromBack, setMessages } from "../../../features/chat/chat.slice";
import ChatSender from "./ChatSender";
import './ChatBox.scss';
import { api, getPreviousMessages } from "services/api.service";
import settings_image from 'images/settings.png';
import block_user_image from 'images/block_user.png';
import TextInput from "assets/TextInput/TextInput";
import Button from "assets/Button/Button";
import { mainSocketContext } from "src";


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
	const [scrolledToTop, setScrolledToTop] = useState<boolean>(false);
	const [firstMessage, setFirstMessage] = useState<string>("");

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

<<<<<<< HEAD
	function handleScroll(event: UIEvent<HTMLDivElement>) {
		const target = event.target as HTMLInputElement;
		const top = target.scrollHeight + target.scrollTop;
		setScrolledToTop(top <= target.clientHeight + 10 && top >= target.clientHeight - 10);
	}

	useEffect(() => {
		async function fetchPreviousMessages() {
			const response = await api.get(`chat/many/message/dm/${firstMessage}`);
			const messages = response.data;
			dispatch(addMessageFromBack(messages));
		}
		if (scrolledToTop === true && firstMessage) {
			fetchPreviousMessages();
		}
	}, [scrolledToTop]);

	useEffect(() => {
		if (chat.messages.length > 0) {
			setFirstMessage(chat.messages[0].id);
		}
	}, [chat.messages]);

=======
	async function handlePlayRequest() {
		console.log("Playing Request");
		return false;
	}

>>>>>>> 10d2be5 (Synchronise data when watching a game, saving scores in db, displaying scores in profile)
	return (
		<div className='chat_box'>
			<div className={"chat_box_header"}>
				<h3>{chat.currentRelation?.counterPart.login}</h3>
				{
					chat.currentRelation?.counterPart.activityStatus === UserActivityStatusEnum.PLAYING &&
					<Button onClick={handleWatchRequest}>Watch</Button>
				}
				{
					chat.currentRelation?.counterPart.activityStatus === UserActivityStatusEnum.CONNECTED &&
					<Button onClick={handlePlayRequest}>Play</Button>
				}
				<img onClick={handleOpenSettings} src={settings_image} alt="" />
				<img onClick={handleOpenSettings} src={block_user_image} alt="" />
			</div>
			<div className={"chat_box_settings " + openSettings}>
				<p>Set room password</p>
				<TextInput text={roomPassword} setText={setRoomPassword} type="password" name="room_password" placeholder="Password" />
				<Button onClick={async () => { return false }}>Next</Button>
			</div>
			<div id="chat_messages_container" onScroll={handleScroll}>
				<div id="chat_messages" onScroll={handleScroll}>
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