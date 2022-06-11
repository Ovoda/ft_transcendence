import { IsNotEmpty } from "class-validator";

export default class JoinGroupDto {
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    groupId: string;
}