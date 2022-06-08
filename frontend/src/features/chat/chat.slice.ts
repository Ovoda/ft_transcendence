import { createSlice } from "@reduxjs/toolkit";
import Chat, { e_roomtype } from "./interfaces/chat.interface";
import Message from '../../shared/interfaces/Message';
import OpenChatRoom from "./interfaces/openChatGroup.interface";
import OpenChatDm from "./interfaces/openChatDm.interface";

const initialState: Chat = {
	messages: [],
	currentRoom: "",
	currentRole: "",
	currentRelation: null,
	currentLastMessage: "",
	displayChatBox: false,
	displayOptions: false,
	roomtype: e_roomtype.DM,
	displayRoomCreationModal: false,
};

const chat = createSlice({
	name: "chat",
	initialState,
	reducers: {
		updateRoomtype(state, action) {
			return { ...state, roomtype: action.payload }
		},
		updateDisplayOptions(state, action) {
			return { ...state, displayOptions: action.payload }
		},
		openChatRoom(state, action: OpenChatRoom) {
			return {
				...state,
				displayChatBox: true,
				currentRoom: action.payload.roomId,
				currentRole: action.payload.roleId,
				messages: action.payload.messages,
			};
		},
		openChatDm(state, action: OpenChatDm) {
			return {
				...state,
				displayChatBox: true,
				currentRelation: action.payload.relation,
				messages: action.payload.messages,
			};
		},
		closeChatDm(state) {
			return {
				...state,
				displayChatBox: false,
				currentRelation: null,
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
	updateRoomtype,
	updateDisplayOptions,
	openChatDm,
	openChatRoom,
	closeChatDm,
	addMessage,
	setMessages,
	openChatRoomCreationModal,
	closeChatRoomCreationModal,
} = chat.actions;
export default chat.reducer;