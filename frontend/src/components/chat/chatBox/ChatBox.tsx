import React, { UIEvent, useContext, useState } from "react";
import { useSelector } from "react-redux";
import { Store } from "src/app/store";
import './chatBox.scss';
import settings_image from 'images/settings.png';
import block_user_image from 'images/block_user.png';
import TextInput from "assets/TextInput/TextInput";
import Button from "assets/Button/Button";
import { mainSocketContext } from "src";
import useLoadMessagesOnScroll from "src/hooks/useLoadMessagesOnScroll";
import { translateMessageDate } from "services/utils.service";
import ChatSender from "./chatSender";
import GroupUserList from "./groupUsersList";

export default function ChatBox() {

	/** Global data */
	const { chat, user } = useSelector((store: Store) => store);
	const messages = chat.messages;
	const mainSocket = useContext(mainSocketContext);

	/** Variables */
	const [openSettings, setOpenSettings] = useState<string>("");
	const [roomPassword, setRoomPassword] = useState<string>("");
	const [scrolledToTop, setScrolledToTop] = useState<boolean>(false);
	const [firstMessage, setFirstMessage] = useState<string>("");

	/** Hooks */
	useLoadMessagesOnScroll({ firstMessage, setFirstMessage, scrolledToTop });

	function handleOpenSettings() {
		setOpenSettings((settings: string) => {
			if (settings === "") {
				return ("chat_box_settings_container_open");
			}
			return ("");
		})
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

<<<<<<< HEAD
=======
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
>>>>>>> 4fa0ba376cf4e3207ef9729a6319c3477eabd70e
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
			</div>
			<div id="chat_messages_container" onScroll={handleScroll}>
				<div className={"chat_box_settings_container " + openSettings}>
					<div className="chat_box_settings">
						<div className="chat_box_settings_password">
							<p>Set room password</p>
							<TextInput text={roomPassword} setText={setRoomPassword} type="password" name="room_password" placeholder="Password" />
							<Button onClick={async () => { return false }}>Next</Button>
						</div>
						<GroupUserList />
					</div>
				</div>
				<div id="chat_messages" onScroll={handleScroll}>
					{
						messages &&
						messages.map((message, index) => {
							return (
								<div key={index} className="message">
									<img src={message.avatar} alt="" />
									<div className="message_content">
										<p>{message.login} <span>{
											translateMessageDate(message.date)
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