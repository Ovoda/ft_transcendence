import ChatData, { e_roomtype } from '../../../features/chat/interfaces/chat.interface'
import React, { useState } from "react";
import DmPicker from "./dmPicker";
import RoomPicker from "./roomPicker";
import { Store } from "../../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { updateRoomtype } from '../../../features/chat/chat.slice';
import { closeChat } from '../../../features/uiState/uiState.slice';

// interface Chat {
// 	stateChanger: any
// }

export default function ChatSelector() {
	// GLOBAL DATA.
	const store: Store = useSelector((store: Store) => store);
	const chatData: ChatData = store.chat;
	const uiState = store.uiState;
	
	const dispatch = useDispatch();

	return (
		<>
			<div>
				<button onClick={ () => dispatch(updateRoomtype(e_roomtype.DM)) }>DMs</button>
				<button onClick={ () => dispatch(updateRoomtype(e_roomtype.ROOM)) }>Rooms</button>
				<button onClick={ () => dispatch(closeChat()) }>Close</button>
				{ chatData.roomtype === e_roomtype.DM && <DmPicker/> }
				{ chatData.roomtype === e_roomtype.ROOM && <RoomPicker/> }
			</div>
		</>
	);
}