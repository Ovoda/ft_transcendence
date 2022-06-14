


// export class ball {
//     x = 0;
//     y = 0;
//     vx = 0;
//     vy = 0;
//     radius = 0;
//     mainsocket = null;
//     constructor(
//         x: number,
//         y: number,
//         vx: number,
//         vy: number,
//         radius: number) {
//         this.x = x;
//         this.y = y;
//         this.vx = vx;
//         this.vy = vy;
//         this.radius = radius;
//     }


//     public moveBall() {

//         if ((this.y <= 0 || this.y >= 400) && (this.x <= 0 || this.x >= 600)) {
//             this.vx = -this.vx;
//             this.vy = -this.vy;
//             this.x = this.x + this.vx;
//             this.y = this.y + this.vy;
//             mainSocket?.emit("synchronizeBallHit",
//                 { x: this.x, y: this.y, isRight: isCurrentRight, gameRoomId: currentGameRoomId } as SynchronizeBallHitDto);
//             return;
//         }

//         if (this.x <= 0 || this.x >= 600) {
//             this.vx = -this.vx;
//             this.x = this.x + this.vx;
//             this.y = this.y + this.vy;
//             mainSocket?.emit("synchronizeBallHit",
//                 { x: this.x, y: this.y, isRight: isCurrentRight, gameRoomId: currentGameRoomId } as SynchronizeBallHitDto);
//             return;
//         }

//         if (this.y <= 0 || this.y >= 400) {
//             this.vy = -this.vy;
//             this.x = this.x + this.vx;
//             this.y = this.y + this.vy;
//             mainSocket?.emit("synchronizeBallHit",
//                 { x: this.x, y: this.y, isRight: isCurrentRight, gameRoomId: currentGameRoomId } as SynchronizeBallHitDto);
//             return;
//         }

//         this.x = this.x + this.vx;
//         this.y = this.y + this.vy;
//     }
// }

export const ok = 0;