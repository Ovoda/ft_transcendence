import Player from '../interfaces/player.interface';
import GameCanvas from '../interfaces/gameCanvas.interface';

function drawPlayer(game: GameCanvas, player: Player) {
	if (!game.context) { return; }
	game.context.fillStyle = game.elements_color;
	game.context.fillRect(game.width / 2, 0, 2, game.height);
	game.context.fillRect(0, 0, 2, game.height);
	game.context.fillRect(game.width - 2, 0, 2, game.height);
	game.context.fillRect(0, 0, game.width, 2);
	game.context.fillRect(0 ,game.height - 2, game.width, 2);
	game.context.fillRect(player.position.x, player.position.y, player.width, player.height);
}

export default drawPlayer;