import { Exclude } from "class-transformer";


export class CreateUserDto {
    username: string;

    @Exclude()
    password: string;
}