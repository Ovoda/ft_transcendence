import Button from "assets/Button/Button";
import SwitchButton from "assets/SwitchButton/SwitchButton";
import { closeGameOptions } from "features/uiState/uiState.slice";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import ClientSocket from "services/websocket.service";
import { mainSocketContext } from "src";
import { Store } from "src/app/store";
import GamePlay from "../gamePlay/gamePlay";
import { setInitialBallState } from "../gamePlay/interfaces/ball.interface";
import GameCanvas from "../gamePlay/interfaces/gameCanvas.interface";
import Gameplay from "../gamePlay/interfaces/gameplay.interface";
import { setInitialPlayerLeftState, setInitialPlayerRightState } from "../gamePlay/interfaces/player.interface";
import SetUserDto from "../gamePlay/interfaces/SetUser.dto";
import "./selectOptions.scss"

interface Props {
	setGameplay: Dispatch<SetStateAction<Gameplay>>;
	gameplay: Gameplay;
	gameCanvas: GameCanvas;
}

export default function SelectOptions({ setGameplay, gameplay, gameCanvas }: Props) {

	//Global Data
	const { uiState, user } = useSelector((store: Store) => store);
	const mainSocket: ClientSocket | null = useContext(mainSocketContext);

	/** Variables */
	const [fastModeActivated, setFastModeActivated] = useState<boolean>(false);
	const [longModeActivated, setLongModeActivated] = useState<boolean>(false);

	/** Tools */
	const dispatch = useDispatch();

	async function launchPlaying() {
		//console.log("In Launch Playing");
		//console.log("Fast Mode on?:", fastModeActivated);
		setGameplay((gameplay: Gameplay) => {
			return {
				...gameplay,
				fast: fastModeActivated,
				longGame: longModeActivated,
				ball: setInitialBallState(gameCanvas.width, gameCanvas.height),
				playerLeft: setInitialPlayerLeftState(gameCanvas.width, gameCanvas.height),
				playerRight: setInitialPlayerRightState(gameCanvas.width, gameCanvas.height),
			}
		})
		let userInfo: SetUserDto = {
			id: user.id,
			login: user.username,
		}
		mainSocket?.emit("joinGame", userInfo);
		dispatch(closeGameOptions());
		return true;
	}

	useEffect(() => {
		let newVX: number = gameplay.ball.velocity.x;
		let newVY: number = gameplay.ball.velocity.y;

		if (fastModeActivated) {
			newVX = newVX + 1;
			newVY = newVY + 1;
			if (gameplay.ball.velocity.x < 0) {
				newVX = gameplay.ball.velocity.x - 1;
			}
			if (gameplay.ball.velocity.y < 0) {
				newVY = gameplay.ball.velocity.y - 1;
			}
		}
		else {
			newVX = newVX - 1;
			newVY = newVY - 1;
			if (gameplay.ball.velocity.x < 0) {
				newVX = gameplay.ball.velocity.x + 1;
			}
			if (gameplay.ball.velocity.y < 0) {
				newVY = gameplay.ball.velocity.y + 1;
			}
		}
		setGameplay((gameplay: Gameplay) => {
			return {
				...gameplay,
				ball: {
					...gameplay.ball,
					velocity: {
						x: newVX,
						y: newVY,
					}
				}
			}
		})
		console.log("Switch speed: ", gameplay.ball.velocity);
	}, [fastModeActivated]);

	if (uiState.showGameOptions) {
		return (
			<div id="game_options_list_container">
				<div id="game_options_list">
					<h2>Game Options</h2>
					<div className="game_option_item">
						<p>Slow</p>
						<SwitchButton value={fastModeActivated} setValue={setFastModeActivated} />
						<p>Fast</p>
					</div>
					<div className="game_option_item">
						<p>21 pts</p>
						<SwitchButton value={longModeActivated} setValue={setLongModeActivated} />
						<p>42 pts</p>
					</div>
					<div>
						<Button onClick={() => launchPlaying()}>Confirm</Button>
					</div>
				</div>
			</div>
		);
	}
	return (
		<></>
	)
}