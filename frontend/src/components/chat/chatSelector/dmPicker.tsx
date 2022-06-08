import { useDispatch, useSelector } from "react-redux";
import { Store } from "src/app/store";
import { closeChatDm, openChatDm, openChatRoomCreationModal } from "../../../features/chat/chat.slice";
import './dmPicker.scss';
import "./RoomCreation.scss";
import Button from "assets/Button/Button";
import AddRoomMenu from "./AddRoomMenu";
import { api } from "services/api.service";
import ClientSocket from "services/websocket.service";
import { useContext } from "react";
import { mainSocketContext } from "../../../App";
import UserRelation from "src/shared/interfaces/userRelation";
import { UserActivityStatusEnum } from "enums/userConnectionStatus.enum";

export default function DmPicker() {

	/** Global Data */
	const { chat, user, relations } = useSelector((store: Store) => store);
	const mainSocket: ClientSocket | null = useContext(mainSocketContext);

	/** Tools */
	const dispatch = useDispatch();

	async function selectDmRoom(relation: UserRelation) {
		if (chat.currentRelation) {
			mainSocket?.leaveRoom(chat.currentRoom);
		}

		if (chat.currentRelation?.id === relation.id) {
			dispatch(closeChatDm());
			return;
		}

		let messages;
		/** Todo get relation last message, not just last message */
		if (relation.lastMessage) {
			const response = await api.get(`chat/many/message/dm/${relation.lastMessage}`);
			messages = response.data;
		} else {
			messages = [];
		}
		dispatch(openChatDm({ messages, relation }));
	}

	/** Opens a modal to create rooms */
	async function handleRoomCreationModal() {
		dispatch(openChatRoomCreationModal());
		return false;
	}

	return (
		<div id="dm_picker">
			{
				relations.relations &&
				relations.relations.map((relation: UserRelation, index: number) =>
					<div key={index} onClick={() => selectDmRoom(relation)} className="dm_picker_room">
						<img src={relation.counterPart.avatar} alt="" />
						{/* <button onClick={() => watchingRequest(role.chatroom.name, mainSocket)}>Watch Game</button> */}
						<p className="dm_picker_room_name">{relation.counterPart.login}</p>

						<span id="friend_log_status"
							className={relation.counterPart.activityStatus === UserActivityStatusEnum.CONNECTED
								? "connected" : ""}>
						</span>
					</div>
				)
			}
			<Button id="add_room_button" onClick={handleRoomCreationModal}>&#43;</Button>
			<AddRoomMenu />
		</div >
	);
}