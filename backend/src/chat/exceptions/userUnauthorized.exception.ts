import { ForbiddenException } from '@nestjs/common';

export class UserUnauthorized extends ForbiddenException {
  constructor(info?: string) {
    super('User Unauthorized: ', info);
  }
}