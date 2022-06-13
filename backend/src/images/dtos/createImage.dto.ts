import { IsNotEmpty } from "class-validator";

export class CreateImageDto {
	@IsNotEmpty()
	root: string;

	@IsNotEmpty()
	filename: string;
}