function hitWall(ball: Ball, canvas : HTMLCanvasElement) {
	if (ball.position.y - ball.radius <= 0 || ball.position.y + ball.radius >= canvas.height)
		return (1);
	return (0);
}