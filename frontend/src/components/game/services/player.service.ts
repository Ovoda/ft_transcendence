import Player from '../interfaces/player.interface';
import GameCanvas from '../interfaces/gameCanvas.interface';

function drawPlayer(game: GameCanvas, player: Player) {
	game.context?.fillRect(player.position.x, player.position.y, player.width, player.height);
}

export default drawPlayer;