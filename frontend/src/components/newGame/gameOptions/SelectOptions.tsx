import Button from "assets/Button/Button";
import SwitchButton from "assets/SwitchButton/SwitchButton";
import { closeGameOptions, openGameOptions } from "features/uiState/uiState.slice";
import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { mainSocketContext } from "src";
import { Store } from "src/app/store";
import "./selectOptions.scss"
import close from 'images/close.png';
import { hideById, showById } from "../utils";


export default function SelectOptions() {

	/** Global data */
	const { uiState, game, user } = useSelector((store: Store) => store);
	const mainSocket = useContext(mainSocketContext);

	/** Tools */
	const dispatch = useDispatch();

	/** Variables */
	const [gameLength, setGameLength] = useState<boolean>(false);
	const [gameDifficulty, setGameDifficulty] = useState<boolean>(false);

	async function handleConfirmGame() {
		dispatch(closeGameOptions());
		hideById("start_game_button");
		showById("pending_game_text");
		if (game.gameIsPrivate) {
			mainSocket?.emit("playingRequest", {
				userRequesting: user.id,
				userRequested: game.requestedUserId,
			});
		} else {
			mainSocket?.emit("joinGame", { long: gameLength, hard: gameDifficulty });
		}
		return false;
	}

	return (
		<>
			{
				uiState.showGameOptions &&
				<div id="game_options_list_container">
					<div id="game_options_list">
						<h2>Game Options</h2>
						<img id="close_button_img" onClick={() => dispatch(dispatch(closeGameOptions()))} src={close} alt="Close modal icon" />
						<div className="game_option_item">
							<p>Easy</p>
							<SwitchButton value={gameDifficulty} setValue={setGameDifficulty} />
							<p>Hard</p>
						</div>
						<div className="game_option_item">
							<p>21 pts</p>
							<SwitchButton value={gameLength} setValue={setGameLength} />
							<p>42 pts</p>
						</div>
						<div>
							<Button onClick={handleConfirmGame}>Confirm</Button>
						</div>
					</div>
				</div>
			}
			<Button id="start_game_button" onClick={() => { dispatch(openGameOptions()); }}>Start game</Button>
			<p id="pending_game_text" style={{ display: "none" }}>waiting for oponent</p>
		</>
	)
}