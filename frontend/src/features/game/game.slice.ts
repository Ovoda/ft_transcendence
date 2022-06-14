import { createSlice } from "@reduxjs/toolkit";
import { GameOptions } from "./interfaces/gameOptions.interface";

const initialState: GameOptions = {
	fastModeActivated: false,
	longModeActivated: false,
	playingFriendRequest: false,
	showFriendRequest: null,
};

const game = createSlice({
	name: "game",
	initialState,
	reducers: {
		updateFastMode(state, action) {
			return { ...state, fastModeActivated: action.payload }
		},
		updateLongMode(state, action) {
			return { ...state, longModeActivated: action.payload }
		},
		setPlayingFriendRequest(state) {
			return { ...state, playingFriendRequest: true }
		},
		unsetPlayingFriendRequest(state) {
			return { ...state, playingFriendRequest: false }
		},
		toggleShowFriendRequest(state, action) {
			return { ...state, showFriendRequest: action.payload };
		}
	}
});

export const {
	updateFastMode,
	updateLongMode,
	setPlayingFriendRequest,
	unsetPlayingFriendRequest,
	toggleShowFriendRequest,
} = game.actions;
export default game.reducer;