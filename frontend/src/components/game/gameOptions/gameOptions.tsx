import { showColorOptions, showScoreOptions, showSizeOptions, showSpeedOptions } from "./options.service";
import './GameOptions.scss'

export default function GameOptions() {
	return (
		<div id="options_area">
			<h3>Game Options</h3>
			<ul className="options-list" >
				<button onClick={() => showScoreOptions()}>Score</button>
				<div id="scoreOptions">
					<li>10</li>
					<li>20</li>
					<li>50</li>
				</div>
				<button onClick={() => showSizeOptions()}>Size of Elems</button>
				<div id="sizeOptions">
					<li>Easy</li>
					<li>Medium</li>
					<li>Hard</li>
				</div>
				<button onClick={() => showSpeedOptions()}>Speed</button>
				<div id="speedOptions">
					<li>slow</li>
					<li>chill</li>
					<li>fast</li>
				</div>
				<button onClick={() => showColorOptions()}>Color</button>
				<div id="colorOptions">
					<li>Cute</li>
					<li>Fun</li>
					<li>Dark</li>
				</div>
			</ul>
		</div>
	)
}


