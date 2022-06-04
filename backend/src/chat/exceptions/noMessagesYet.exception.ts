import { BadRequestException } from '@nestjs/common';

export class noMessagesYet extends BadRequestException {
  constructor(info?: string) {
    super('No messages Yet: ', info);
  }
}