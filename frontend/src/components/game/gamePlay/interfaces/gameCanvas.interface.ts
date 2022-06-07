import { useState } from "react";

export default interface GameCanvas {
	context: CanvasRenderingContext2D | null | undefined,
	width: number,
	height: number,
}

export function setInitialGameCanvasState(canvasRef: React.RefObject<HTMLCanvasElement>) {
	return ({
		context: canvasRef.current?.getContext('2d'),
		width: 600,
		height: 400,
	});
}