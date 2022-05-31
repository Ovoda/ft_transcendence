import Player from '../interfaces/player.interface';
import Game from '../interfaces/game.interface';

function drawPlayer(game: Game, player: Player) {
	game.context?.fillRect(player.position.x, player.position.y, player.width, player.height);
}

export default drawPlayer;