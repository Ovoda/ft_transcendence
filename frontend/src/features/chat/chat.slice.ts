import { createSlice } from "@reduxjs/toolkit";
import Chat, { e_roomtype } from "./interfaces/chat.interface";

const initialState: Chat = {
	chatSelector: false,
	roomtype: e_roomtype.DM,
	displayChat: false,
	displayOptions: false,
};

const chat = createSlice({
	name: "chat",
	initialState,
	reducers: {
		updateChatSelector(state, action){
			return {...state, chatSelector: action.payload}
		},
		updateRoomtype(state, action){
			return {...state, roomtype: action.payload}
		},
		updateDisplayChat(state, action){
			return {...state, displayChat: action.payload}
		},
		updateDisplayOptions(state, action) {
			return {...state, displayOptions: action.payload}
		},
	},
});

export const {
	updateChatSelector,
	updateRoomtype,
	updateDisplayChat,
	updateDisplayOptions,
} = chat.actions;
export default chat.reducer;