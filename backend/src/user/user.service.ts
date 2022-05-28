import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudService } from 'src/app/templates/crud.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService extends CrudService<UserEntity> {
    constructor(
        @InjectRepository(UserEntity)
        private readonly _repository: Repository<UserEntity>,
        private readonly _log: Logger,
    ) {
        super(_repository, _log);
    }


    async findOrCreate(createUserDto: CreateUserDto) {
        let user = await this.findOne({
            where: {
                username: createUserDto.username,
            }
        });

        if (!user) {
            user = await this._repository.save({
                username: createUserDto.username,
                password: await bcrypt.hash(createUserDto.password, 10)
            });
        }
        return user;

    }
}
