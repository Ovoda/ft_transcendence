import Button from "assets/Button/Button";
import { showChat } from "features/chat/chat.slice";
import { setShowPrivateGameModal } from "features/game/game.slice";
import UserData from "features/user/interfaces/user.interface";
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux"
import { mainSocketContext } from "src";
import { Store } from "src/app/store"
import './privateGameModal.scss';



export default function PrivateGameModal() {

	const { game } = useSelector((store: Store) => store);

	const mainSocket = useContext(mainSocketContext);

	/** Tools */
	const dispatch = useDispatch();

	function respond(status: boolean) {
		mainSocket?.emit("privateGameResponse", { userId: game.requestingUser?.id as string, status: status });
		dispatch(setShowPrivateGameModal(false));
		dispatch(showChat(true));
		return false;
	}

	if (game.showPrivateGameModal) {
		return (
			<div id="private_game_modal_container">
				<div id="private_game_modal">
					<h2>Game invitation from {game.requestingUser?.username}</h2>
					<div id="private_game_modal_buttons">
						<Button onClick={async () => respond(true)}>Accept</Button>
						<Button onClick={async () => respond(false)}>Decline</Button>
					</div>
				</div>
			</div >
		)
	}
	return <></>
}