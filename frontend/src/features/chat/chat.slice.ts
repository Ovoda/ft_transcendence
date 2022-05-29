import { createSlice } from "@reduxjs/toolkit";
import Chat from "./interfaces/chat.interface";

const initialState: Chat = {};

const chat = createSlice({
	name: "chat",
	initialState,
	reducers: {

	},
});

export const {} = chat.actions;
export default chat.reducer;