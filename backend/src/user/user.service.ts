import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly _repository: Repository<UserEntity>,
    ) { }


    public async create(createUserDto: CreateUserDto) {
        const response: Promise<CreateUserDto & UserEntity> | null;
        return await this._repository.save(createUserDto);
    }
}
