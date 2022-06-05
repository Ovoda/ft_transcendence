import { PartialType } from '@nestjs/mapped-types';
import { CreateGameDto } from './createGame.dto';

export class UpdateGameDto extends PartialType(CreateGameDto) {
	
}
