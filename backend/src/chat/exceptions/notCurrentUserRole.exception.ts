import { ForbiddenException } from '@nestjs/common';

export class NotCurrentUserRole extends ForbiddenException {
  constructor(info?: string) {
    super("This role doesn't belong to current user", info);
  }
}