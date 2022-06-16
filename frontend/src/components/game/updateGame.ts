import { BallHitEnum } from "./enums/ballHit.enum";
import Ball from "./interfaces/ball.interface";
import Player from "./interfaces/player.interface";

function playerLeftCollision(ball: Ball, player: Player) {
    if (((ball.x + ball.vx) <= player.x + player.width)) {
        if (ball.y + ball.vy >= player.y && ball.y + ball.vy <= player.y + player.height) {
            return true;
        }
    }
    return false;
}

function playerRightCollision(ball: Ball, player: Player) {
    if (((ball.x + ball.vx) >= player.x)) {
        if (ball.y + ball.vy >= player.y && ball.y + ball.vy <= player.y + player.height) {
            return true;
        }
    }
    return false;
}

export function updateBall(ball: Ball, players: Player[], ballSpeed: number): BallHitEnum {

    if (ball.x > 600 || ball.x < 0) {
        const ret = ((ball.x > 600) ? BallHitEnum.OUT_RIGHT : BallHitEnum.OUT_LEFT);
        ball.x = 300;
        ball.y = 200;
        ball.vx = ballSpeed * (ball.vx / Math.abs(ball.vx));
        ball.vy = ballSpeed * (ball.vy / Math.abs(ball.vy));
        return ret;
    }

    if (playerLeftCollision(ball, players[0]) || playerRightCollision(ball, players[1])) {
        ball.vx += ball.vx < 0 ? -0.5 : 0.5;
        ball.vy += ball.vy < 0 ? -0.5 : 0.5;
        ball.vx = -ball.vx;
        ball.x = ball.x + ball.vx;
        ball.y = ball.y + ball.vy;
        return BallHitEnum.HIT;
    }

    if (ball.y <= 0 || ball.y >= 400) {
        ball.vy = -ball.vy;
        ball.x = ball.x + ball.vx;
        ball.y = ball.y + ball.vy;
        return BallHitEnum.HIT;

    }

    ball.x = ball.x + ball.vx;
    ball.y = ball.y + ball.vy;
    return BallHitEnum.DEFAULT;
}

export function udpatePlayers(players: Player[]) {
    if (players[0].goDown) {
        const newPos = players[0].y + players[0].velocity;
        players[0].y = (newPos > 400 - players[0].height) ? 400 - players[0].height : newPos;
    }

    if (players[0].goUp) {
        players[0].y = (players[0].y - players[0].velocity < 0)
            ? 0 : players[0].y - players[0].velocity
    }

    if (players[1].goDown) {
        const newPos = players[1].y + players[1].velocity;
        players[1].y = (newPos > 400 - players[1].height) ? 400 - players[1].height : newPos;
    }

    if (players[1].goUp) {
        players[1].y = (players[1].y - players[1].velocity < 0)
            ? 0 : players[1].y - players[1].velocity
    }
}