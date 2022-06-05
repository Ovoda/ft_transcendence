import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "src/app/store";
import { openChatDms, setCurrentRoom } from "../../../features/chat/chat.slice";
import './dmPicker.scss';
import RoomCreation from "./roomCreation";


export default function DmPicker() {

	/** Global Data */
	const { chat, user } = useSelector((store: Store) => store);

	/** Tools */
	const dispatch = useDispatch();

	function selectDmRoom(id: string) {
		dispatch(openChatDms());
		dispatch(setCurrentRoom(id));
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
				<RoomCreation />
			</div>
		);
	}
	return (<></>);
}