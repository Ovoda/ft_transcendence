import React, { UIEvent, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "src/app/store";
import './chatBox.scss';
import settings_image from 'images/settings.png';
import TextInput from "assets/TextInput/TextInput";
import Button from "assets/Button/Button";
import { mainSocketContext } from "src";
import useLoadMessagesOnScroll from "src/hooks/useLoadMessagesOnScroll";
import { translateMessageDate } from "services/utils.service";
import GroupUserList from "./groupUsersList";
import { UserActivityStatusEnum } from "enums/userConnectionStatus.enum";
import { api } from "services/api.service";
import { addMessageFromBack } from "features/chat/chat.slice";
import ChatSender from "./chatSender";


export default function ChatBox() {

	/** Global data */
	const { chat, user } = useSelector((store: Store) => store);
	const messages = chat.messages;
	const mainSocket = useContext(mainSocketContext);

	/** Tools */
	const dispatch = useDispatch();

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

	async function handlePlayRequest() {
		mainSocket?.playingRequest(
			{
				userRequested: chat.currentRelation?.counterPart.id as string,
				userRequesting: user.id,
			}
		)
		return false;
	}


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
			setFirstMessage(chat.messages[0].id as string);
		}
	}, [chat.messages]);

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
				{
					chat.currentRole &&
					<>
						<p>{chat.currentRole.chatGroup.name}</p>
						<img onClick={handleOpenSettings} src={settings_image} alt="" />
					</>
				}
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