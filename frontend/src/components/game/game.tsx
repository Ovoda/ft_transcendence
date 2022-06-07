import GameOptions from "./gameOptions/gameOptions";
import GamePlay from "./gamePlay/gamePlay";
import './game.scss'

export default function Game() {
	return (
		<div id='game'>
			<GamePlay />
			<GameOptions />
		</div>
	);
}