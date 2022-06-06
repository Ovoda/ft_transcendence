import { createSlice } from "@reduxjs/toolkit";
import Chat, { e_roomtype } from "./interfaces/chat.interface";
import Message from '../../shared/interfaces/Message';

const initialState: Chat = {
	messages: [],
	currentRoom: "",
	currentRole: "",
	currentLastMessage: "",
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
		openChatDm(state, action) {
			return {
				...state,
				displayChat: true,
				displayChatSelector: false,
				currentRoom: action.payload.roomId,
				currentRole: action.payload.roleId,
				currentLastMessage: action.payload.lastmessage,
			};
		},
		closeChatDms(state) {
			return {
				...state,
				displayChat: false,
				displayChatSelector: true,
				currentRole: "",
				currentRoom: "",
				messages: [],
			};
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
		setMessages(state, action) {
			const array = action.payload.reverse();
			return { ...state, messages: array };
		}
	},
});

export const {
	updateChatSelector,
	updateRoomtype,
	updateDisplayOptions,
	openChatDm,
	closeChatDms,
	addMessage,
	setMessages,
	openChatRoomCreationModal,
	closeChatRoomCreationModal,
} = chat.actions;
export default chat.reducer;