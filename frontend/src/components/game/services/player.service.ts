export function drawPlayers(canvas: HTMLCanvasElement, c: CanvasRenderingContext2D, keys_1 : Keys, player1 : Player, keys_2 : Keys, player2 : Player) {
	if (c) {
		player1.update(c, keys_1, canvas)
		player2.update(c, keys_2, canvas)
	}
}