import { useDispatch, useSelector } from "react-redux";
import { Store } from "src/app/store";
import { closeChatDm, openChatDm, openChatGroup, openChatRoomCreationModal } from "../../../features/chat/chat.slice";
import './dmPicker.scss';
import "./RoomCreation.scss";
import Button from "assets/Button/Button";
import AddRoomMenu from "./AddRoomMenu";
import { getMessages, getRelation, getRole } from "services/api.service";
import UserRelation from "src/shared/interfaces/userRelation";
import { UserActivityStatusEnum } from "enums/userConnectionStatus.enum";
import UserRole from "src/shared/interfaces/role.interface";

export default function DmPicker() {

	/** Global Data */
	const { chat, relations, roleSlice } = useSelector((store: Store) => store);

	/** Tools */
	const dispatch = useDispatch();

	async function selectDmRoom(relation: UserRelation) {
		if (chat.currentRelation?.id === relation.id) {
			dispatch(closeChatDm());
			return;
		}
		const updatedRelation = await getRelation(relation.id);
		const { messages } = await getMessages(updatedRelation.data.lastMessage);
		if (messages)
			dispatch(openChatDm({ messages: messages.reverse(), relation: updatedRelation.data }));
	}

	async function selectGroupRoom(role: UserRole) {
		if (chat.currentRole?.id === role.id) {
			dispatch(closeChatDm());
			return;
		}

		const updatedRole = await getRole(role.id);
		const group = updatedRole.data.chatGroup;

		const { messages } = await getMessages(group.lastMessage, updatedRole.data.id);
		if (messages)
			dispatch(openChatGroup({ messages: messages.reverse(), role: updatedRole.data }));
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
			{
				roleSlice.roles &&
				roleSlice.roles.map((role: UserRole, index: number) =>
					<div key={index} onClick={() => selectGroupRoom(role)} className="dm_picker_room">
						{/* TODO : image */}
						<img src="https://42.fr/wp-content/uploads/2021/08/42.jpg" alt="" />
						<p className="dm_picker_room_name">{role.chatGroup.name}</p>
					</div>
				)
			}
			<Button id="add_room_button" onClick={handleRoomCreationModal}>&#43;</Button>
			<AddRoomMenu />
		</div >
	);
}