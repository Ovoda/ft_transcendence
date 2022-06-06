import { ForbiddenException } from '@nestjs/common';

export class CannotPlay extends ForbiddenException {
	constructor(info?: string) {
		super('Cannot play: ', info);
	}
}