import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "src/app/store";
import { openChatDms, openChatRoomCreationModal, setCurrentRoom } from "../../../features/chat/chat.slice";
import AddChatRoomButton from "./AddChatRoomButton";
import './dmPicker.scss';
import AddFriend from "./AddFriend";
import "./RoomCreation.scss";
import Button from "assets/Button/Button";
import AddRoomMenu from "./AddRoomMenu";

export default function DmPicker() {

	/** Global Data */
	const { chat, user } = useSelector((store: Store) => store);

	/** Tools */
	const dispatch = useDispatch();

	function selectDmRoom(id: string) {
		dispatch(openChatDms());
		dispatch(setCurrentRoom(id));
	}

	/** Opens a modal to create rooms */
	async function handleRoomCreationModal() {
		dispatch(openChatRoomCreationModal());
		return false;
	}

	if (chat.displayChatSelector) {
		return (
			<div id="dm_picker">
				{
					user.roles.map((role) =>
						<div key={role.id} onClick={() => selectDmRoom(role.chatroom.id)} className="chat_friend">
							{role.chatroom.name}
						</div>
					)
				}
				<Button onClick={handleRoomCreationModal}>Add</Button>
				<AddRoomMenu />
			</div>
		);
	}
	return (<></>);
}