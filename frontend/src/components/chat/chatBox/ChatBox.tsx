import React, { UIEvent, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "src/app/store";
import './chatBox.scss';
import TextInput from "assets/TextInput/TextInput";
import Button from "assets/Button/Button";
import { mainSocketContext } from "src";
import useLoadMessagesOnScroll from "src/hooks/useLoadMessagesOnScroll";
import { translateMessageDate } from "services/utils.service";
import GroupUserList from "./groupUsersList";
import { api } from "services/api.service";
import { addMessageFromBack } from "features/chat/chat.slice";
import ChatSender from "./chatSender";
import { RoleTypeEnum } from "enums/roleType.enum";
import ChatBoxHeader from "./chatBoxHeader";


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
			<ChatBoxHeader setOpenSettings={setOpenSettings} />
			<div id="chat_messages_container" onScroll={handleScroll}>
				{
					chat.currentRole?.role === RoleTypeEnum.OWNER &&
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
				}
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
		</div >
	);
}