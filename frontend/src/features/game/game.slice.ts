import { createSlice } from "@reduxjs/toolkit";
import { GameOptions } from "./interfaces/gameOptions.interface";

const initialState: GameOptions = {
	gameIsPrivate: false,
	requestingUser: null,
	requestedUserId: "",
	showPrivateGameModal: false,
};

const game = createSlice({
	name: "game",
	initialState,
	reducers: {
		setGameIsPrivate(state, action) {
			return { ...state, gameIsPrivate: action.payload };
		},
		setRequestingUser(state, action) {
			return { ...state, requestingUser: action.payload };
		},
		setRequestedUser(state, action) {
			return { ...state, requestedUserId: action.payload };
		},
		setShowPrivateGameModal(state, action) {
			return { ...state, showPrivateGameModal: action.payload };
		}
	}
});

export const {
	setGameIsPrivate,
	setRequestingUser,
	setRequestedUser,
	setShowPrivateGameModal,
} = game.actions;
export default game.reducer;