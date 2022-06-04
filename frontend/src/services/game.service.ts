import Player from "src/components/game/interfaces/player.interface";
import FullGame from "src/components/game/interfaces/game.interface";

export function drawPlayer(game: FullGame, player: Player) {
    game.context?.fillRect(player.position.x, player.position.y, player.width, player.height);
}