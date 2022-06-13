import { IsNotEmpty } from "class-validator";

export default class UpdateUserDto {
	@IsNotEmpty()
    username: string;
}