import { createSlice } from "@reduxjs/toolkit";
import Game from "./interfaces/game.interface";

const initialState: Game = {
	showGame: false,
}

const game = createSlice({
	name: "game",
	initialState,
	reducers: {
		updateShowGame(state, action) {
			return {...state, showGame: action.payload}
		},
	}
})

export const {
	updateShowGame,
} = game.actions;

export default game.reducer;