import { showColorOptions, showScoreOptions, showSizeOptions, showSpeedOptions } from "./options.service";
import './GameOptions.scss'
import SwitchButton from "assets/SwitchButton/SwitchButton";
import { useState , useEffect} from "react";

export default function GameOptions() {

	const [darkModeActivated, setDarkModeActivated] = useState<boolean>(false);
	const [fastModeActivated, setFastModeActivated] = useState<boolean>(false);


	useEffect(() => {
		//changecolor();
    }, [darkModeActivated]);

	useEffect(() => {
		//changespeed();
    }, [darkModeActivated]);


	return (
		<div id="options_area">
			<h3>Game Options</h3>
			<ul className="options-list" >
				<p>Dark Mode</p>
				<SwitchButton value={darkModeActivated} setValue={setDarkModeActivated} />
				<p>Fast Mode</p>
				<SwitchButton value={fastModeActivated} setValue={setFastModeActivated} />
			</ul>
		</div>
	)
}


