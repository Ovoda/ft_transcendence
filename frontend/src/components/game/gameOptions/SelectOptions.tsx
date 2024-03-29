import Button from "assets/Button/Button";
import SwitchButton from "assets/SwitchButton/SwitchButton";
import { closeGameOptions, openGameOptions } from "features/uiState/uiState.slice";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { mainSocketContext } from "src";
import { Store } from "src/app/store";
import "./selectOptions.scss"
import close from 'images/close.png';
import { hideById, showById } from "../utils";
import { closeChat, showChat } from "features/chat/chat.slice";
import { setGameIsPrivate, setShowPrivateGameModal } from "features/game/game.slice";


export default function SelectOptions() {

	/** Global data */
	const { uiState, game, user, chat } = useSelector((store: Store) => store);
	const mainSocket = useContext(mainSocketContext);

	/** Tools */
	const dispatch = useDispatch();

	/** Variables */
	const [gameLength, setGameLength] = useState<boolean>(false);
	const [gameDifficulty, setGameDifficulty] = useState<boolean>(false);
	const [gameSpin, setGameSpinning] = useState<boolean>(false);

	async function handleConfirmGame() {
		dispatch(closeGameOptions());
		hideById("start_game_button");
		showById("pending_game_text");

		mainSocket?.emit("joinGame", { long: gameLength, hard: gameDifficulty, spin: gameSpin });
		return false;
	}

	function handleStartGame() {
		dispatch(setGameIsPrivate(false));
		dispatch(openGameOptions());
		dispatch(showChat(false));
		showById("stop_waiting_game_button");
	}

	function cancelGame() {
		hideById("stop_waiting_game_button");
		dispatch(closeGameOptions());
		dispatch(showChat(true));
	}

	function respond(status: boolean) {
		mainSocket?.emit("privateGameResponse",
			{
				userId: game.requestingUser?.id as string,
				status: status,
				hard: gameDifficulty,
				long: gameLength,
				spin: gameSpin,
			});
		dispatch(closeGameOptions());
		if (status) {
			dispatch(showChat(false));
		} else {
			dispatch(showChat(true));
		}
		return false;
	}

	function cancel() {
		mainSocket?.emit("cancelPrivateGame", game.requestedUserId as string);
		hideById("pending_game_text");
		hideById("pending_game_button");
		showById("start_game_button");
		return false;
	}

	return (
		<>
			{
				uiState.showGameOptions &&
				<div id="game_options_list_container">
					<div id="game_options_list">
						<h2>Game Options</h2>
						{

							(!game.requestingUser || game.requestingUser?.id === user.id) &&
							<img id="close_button_img" onClick={cancelGame} src={close} alt="Close modal icon" />
						}
						<div className="game_option_item">
							<p>Easy</p>
							<SwitchButton value={gameDifficulty} setValue={setGameDifficulty} />
							<p>Hard</p>
						</div>
						<div className="game_option_item">
							<p>10 pts</p>
							<SwitchButton value={gameLength} setValue={setGameLength} />
							<p>20 pts</p>
						</div>
						<div className="game_option_item">
							<p>Fun</p>
							<SwitchButton value={gameSpin} setValue={setGameSpinning} />
							<p>More fun</p>
						</div>

						<div className="game_option_item">
							<p>Move up:  &#8593;</p>
							<p>Move down:  &#8595;</p>
						</div>
						<div>
							{
								(!game.requestingUser || game.requestingUser?.id === user.id) &&
								<Button onClick={handleConfirmGame}>Confirm</Button>
							}
						</div>
						{
							(game.gameIsPrivate && game.requestingUser?.id !== user.id) &&
							<div id="private_game_modal">
								<h2>Game invitation from {game.requestingUser?.username}</h2>
								<div id="private_game_modal_buttons">
									<Button onClick={async () => respond(true)}>Accept</Button>
									<Button onClick={async () => respond(false)}>Decline</Button>
								</div>
							</div>
						}
					</div>
				</div>
			}
			<Button id="start_game_button" onClick={handleStartGame}>Start game</Button>
			<p id="pending_game_text" style={{ display: "none" }}>waiting for oponent</p>
			<Button id="pending_game_button" style={{ display: "none" }} onClick={() => cancel()}> Stop waiting </Button>
		</>
	)
}