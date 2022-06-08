import { ForbiddenException } from '@nestjs/common';

export class WrongPassword extends ForbiddenException {
  constructor(info?: string) {
    super('WrongPassword: ', info);
  }
}