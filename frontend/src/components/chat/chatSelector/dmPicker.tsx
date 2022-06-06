import { useDispatch, useSelector } from "react-redux";
import { Store } from "src/app/store";
import { openChatDm, openChatRoomCreationModal } from "../../../features/chat/chat.slice";
import './dmPicker.scss';
import "./RoomCreation.scss";
import Button from "assets/Button/Button";
import AddRoomMenu from "./AddRoomMenu";
import { api } from "services/api.service";
import ClientSocket from "services/websocket";
import { useContext } from "react";
import { mainSocketContext } from "../../../App";
import { watchingRequest } from "../../game/services/watch.service";

export default function DmPicker() {

	/** Global Data */
	const { chat, user } = useSelector((store: Store) => store);
	const mainSocket: ClientSocket | null = useContext(mainSocketContext);

	/** Tools */
	const dispatch = useDispatch();

	async function selectDmRoom(roomId: string, roleId: string) {
		console.log(roomId);

		if (chat.currentRoom) {
			mainSocket?.leaveRoom(chat.currentRoom);
		}

		const ret = await api.get(`/chat/room/${roleId}`);


		dispatch(openChatDm({ roomId, roleId, lastmessage: ret.data.lastmessage }));
	}

	/** Opens a modal to create rooms */
	async function handleRoomCreationModal() {
		dispatch(openChatRoomCreationModal());
		return false;
	}

	return (
		<div id="dm_picker">
			{
				user.roles.map((role) =>
					<div key={role.id} onClick={() => selectDmRoom(role.chatroom.id, role.id)} className="dm_picker_room">
						<img src={user.avatar} alt="" />
						<Button onClick={() => watchingRequest(role.chatroom.name, mainSocket)}>Watch Game</Button>
						<p className="dm_picker_room_name">{role.chatroom.name}</p>
					</div>
				)
			}
			<Button id="add_room_button" onClick={handleRoomCreationModal}>&#43;</Button>
			<AddRoomMenu />
		</div>
	);
}