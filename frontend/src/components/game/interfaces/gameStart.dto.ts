

export default interface GameStartDto {
    isRight: boolean;
    gameRoomId: string;
    hard: boolean;
    long: boolean;
    spin: boolean;
    logins: string[];
}