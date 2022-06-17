import { useDispatch, useSelector } from "react-redux";
import { Store } from "src/app/store";
import { closeChat, closeChatSettings, openChatDm, openChatGroup, openChatRoomCreationModal } from "../../../features/chat/chat.slice";
import './dmPicker.scss';
import "./RoomCreation.scss";
import Button from "assets/Button/Button";
import { api, getMessages, getRelation, getRole } from "services/api.service";
import UserRelation from "src/shared/interfaces/userRelation";
import { UserActivityStatusEnum } from "enums/userConnectionStatus.enum";
import UserRole from "src/shared/interfaces/role.interface";
import { useEffect, useState } from "react";
import AddRoomMenu, { RoomMenuType } from "./addRoom/addRoomModal";

export default function DmPicker() {

	/** Global Data */
	const { chat, relations, roleSlice } = useSelector((store: Store) => store);

	/** Tools */
	const dispatch = useDispatch();

	/** Variables */
	const [menuType, setMenuType] = useState<RoomMenuType>(RoomMenuType.FRIENDS);

	async function selectDmRoom(relation: UserRelation) {
		if (chat.currentRelation?.id === relation.id) {
			dispatch(closeChat());
			return;
		}
		const updatedRelation = await getRelation(relation.id);
		if (updatedRelation.data.lastMessage) {
			const response = await api.get(`chat/many/message/dm/${updatedRelation.data.lastMessage}`);
			if (response.data) {
				dispatch(openChatDm({ messages: response.data.reverse(), relation: updatedRelation.data }));
				return;
			}
		}
		dispatch(openChatDm({ messages: [], relation: updatedRelation.data }));
	}

	async function selectGroupRoom(role: UserRole) {
		if (chat.currentRole?.id === role.id) {
			dispatch(closeChat());
			return;
		}
		const updatedRole = await getRole(role.id);
		const group = updatedRole.data.chatGroup;

		const { messages } = await getMessages(group.lastMessage, updatedRole.data.id);

		if (messages)
			dispatch(openChatGroup({ messages: messages.reverse(), role: updatedRole.data }));
	}

	/** Opens a modal to create rooms */
	async function handleRoomCreationModal(menuType: RoomMenuType) {
		setMenuType(menuType);
		dispatch(openChatRoomCreationModal());
		return false;
	}

	function displayCounterpartStatus(status: UserActivityStatusEnum) {
		let color = "";

		switch (status) {

			case UserActivityStatusEnum.CONNECTED:
				color = "connected";
				break;

			case UserActivityStatusEnum.PLAYING:
				color = "playing";
				break;

			case UserActivityStatusEnum.WATCHING:
				color = "watching";
				break;

			case UserActivityStatusEnum.QUEUING:
				color = "queuing";
				break;

			default:
				break;
		}
		return color;
	}


	useEffect(() => {
		async function updateCurrentRelation() {
			if (!chat.currentRelation) return;
			const updatedRelation = await getRelation(chat.currentRelation.id);
			if (updatedRelation.data.lastMessage) {
				const response = await api.get(`chat/many/message/dm/${updatedRelation.data.lastMessage}`);
				if (response.data) {
					dispatch(openChatDm({ messages: response.data.reverse(), relation: updatedRelation.data }));
					return;
				}
			}
			dispatch(openChatDm({ messages: [], relation: updatedRelation.data }));
		}
		updateCurrentRelation();
	}, [relations]);

	return (
		<div id="dm_picker">
			{
				relations.friends &&
				relations.friends.map((relation: UserRelation, index: number) =>
					<div key={index} onClick={() => selectDmRoom(relation)} className="dm_picker_room">
						<img src={relation.counterPart.avatar} alt="" />
						<p className="dm_picker_room_name">{relation.counterPart.username}</p>
						<span id="friend_log_status"
							className={displayCounterpartStatus(relation.counterPart.activityStatus)}>
						</span>
					</div>
				)
			}
			{
				roleSlice.roles &&
				roleSlice.roles.map((role: UserRole, index: number) =>
					<div key={index} onClick={() => selectGroupRoom(role)} className="dm_picker_room">
						<img src={role.chatGroup.groupAvatar} alt="" />
						<p className="dm_picker_room_name">{role.chatGroup.name}</p>
					</div>
				)
			}
			<Button onClick={() => handleRoomCreationModal(RoomMenuType.FRIENDS)}>Friends</Button>
			<Button onClick={() => handleRoomCreationModal(RoomMenuType.GROUP)}>Groups</Button>
			<AddRoomMenu menuType={menuType} />
		</div >
	);
}