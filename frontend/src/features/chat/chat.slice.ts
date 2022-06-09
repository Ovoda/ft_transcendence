import { createSlice } from "@reduxjs/toolkit";
import Chat from "./interfaces/chat.interface";
import OpenChatRoom from "./interfaces/openChatGroup.interface";
import OpenChatDm from "./interfaces/openChatDm.interface";

const initialState: Chat = {
	messages: [],
	currentRoom: "",
	currentRole: "",
	currentRelation: null,
	currentLastMessage: "",
	displayChatBox: false,
	displayRoomCreationModal: false,
};

const chat = createSlice({
	name: "chat",
	initialState,
	reducers: {
		updateRoomtype(state, action) {
			return { ...state, roomtype: action.payload }
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
		addMessageFromBack(state, action) {
			const newMessages = action.payload;
			newMessages.reverse();
			return { ...state, messages: [...newMessages, ...state.messages] };
		},
		setMessages(state, action) {
			const array = action.payload.reverse();
			return { ...state, messages: array };
		}
	},
});

export const {
	updateRoomtype,
	openChatDm,
	openChatRoom,
	closeChatDm,
	addMessage,
	setMessages,
	addMessageFromBack,
	openChatRoomCreationModal,
	closeChatRoomCreationModal,
} = chat.actions;
export default chat.reducer;