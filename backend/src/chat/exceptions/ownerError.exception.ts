import { ForbiddenException } from '@nestjs/common';

export class OwnerError extends ForbiddenException {
  constructor(info?: string) {
    super('Owner Error: ', info);
  }
}