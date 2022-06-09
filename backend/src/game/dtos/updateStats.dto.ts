import { ApiProperty, ApiBody } from '@nestjs/swagger';
import { IsNotEmpty } from "class-validator";

export class UpdateStatsDto {
	@IsNotEmpty()
	winnerId: string;

	@IsNotEmpty()
	loserId: string;
}
