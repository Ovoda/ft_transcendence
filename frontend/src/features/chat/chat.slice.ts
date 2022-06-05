import { createSlice } from "@reduxjs/toolkit";
import Chat, { e_roomtype } from "./interfaces/chat.interface";
import Message from '../../shared/interfaces/Message';

const initialState: Chat = {
	messages: [],
	currentRoom: "",
	displayChat: false,
	displayOptions: false,
	roomtype: e_roomtype.DM,
	displayChatSelector: true,
	displayRoomCreationModal: false,
};

const chat = createSlice({
	name: "chat",
	initialState,
	reducers: {
		updateChatSelector(state, action) {
			return { ...state, displayChatSelector: action.payload }
		},
		updateRoomtype(state, action) {
			return { ...state, roomtype: action.payload }
		},
		updateDisplayOptions(state, action) {
			return { ...state, displayOptions: action.payload }
		},
		openChatDms(state) {
			return { ...state, displayChat: true, displayChatSelector: false };
		},
		closeChatDms(state) {
			return { ...state, displayChat: false, displayChatSelector: true };
		},
		openChatRoomCreationModal(state) {
			return { ...state, displayRoomCreationModal: true };
		},
		closeChatRoomCreationModal(state) {
			return { ...state, displayRoomCreationModal: false };
		},
		addMessage(state, action) {
			return { ...state, messages: [...state.messages, action.payload] };
		},
		clearMessages(state) {
			return { ...state, messages: [] };
		},
		setCurrentRoom(state, action) {
			console.log(`Current room : ${action.payload}`);
			return { ...state, currentRoom: action.payload };
		}
	},
});

export const {
	updateChatSelector,
	updateRoomtype,
	updateDisplayOptions,
	openChatDms,
	closeChatDms,
	addMessage,
	clearMessages,
	setCurrentRoom,
	openChatRoomCreationModal,
	closeChatRoomCreationModal
} = chat.actions;
export default chat.reducer;