import { createSlice } from "@reduxjs/toolkit";
import Chat from "./interfaces/chat.interface";
import OpenChatRoom from "./interfaces/openChatGroup.interface";
import OpenChatDm from "./interfaces/openChatDm.interface";
import OpenChatGroup from "./interfaces/openChatGroup.interface";

const initialState: Chat = {
	messages: [],
	currentRoom: "",
	currentRole: null,
	currentRelation: null,
	currentLastMessage: "",
	displayChatBox: false,
	openSettings: false,
	displayRoomCreationModal: false,
};

const chat = createSlice({
	name: "chat",
	initialState,
	reducers: {
		updateRoomtype(state, action) {
			return { ...state, roomtype: action.payload }
		},
		openChatDm(state, action: OpenChatDm) {
			return {
				...state,
				displayChatBox: true,
				currentRole: null,
				currentRelation: action.payload.relation,
				messages: action.payload.messages,
			};
		},
		openChatGroup(state, action: OpenChatGroup) {
			return {
				...state,
				displayChatBox: true,
				currentRole: action.payload.role,
				currentRelation: null,
				messages: action.payload.messages,
			};
		},
		closeChat(state) {
			return {
				...state,
				displayChatBox: false,
				currentRelation: null,
				currentRole: null,
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
		},
		openChatSettings(state) {
			return {... state, openSettings: true};
		},
		closeChatSettings(state) {
			return {... state, openSettings: false};
		}
	},
});

export const {
	updateRoomtype,
	openChatDm,
	openChatGroup,
	closeChat,
	addMessage,
	setMessages,
	addMessageFromBack,
	openChatRoomCreationModal,
	closeChatRoomCreationModal,
	openChatSettings,
	closeChatSettings,
} = chat.actions;
export default chat.reducer;