function updateScore(c: CanvasRenderingContext2D, canvas : HTMLCanvasElement, player1 : Player, player2 : Player)
{
	let str : string = player1.score.toString() + "   " + player2.score.toString()
	c.font = "10px Arial"
	c.fillText(str, (canvas.width / 2) - 10, 10)
	c?.fillRect((canvas.width / 2) - 1, 0, 1, canvas.height)
}