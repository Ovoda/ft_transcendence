import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudService } from 'src/app/templates/crud.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserEntity } from './entities/user.entity';
import { UserActivityStatusEnum } from './enums/userConnectionStatus.enum';

@Injectable()
export class UserService extends CrudService<UserEntity> {
    constructor(
        @InjectRepository(UserEntity)
        protected readonly _repository: Repository<UserEntity>,
        protected readonly _log: Logger,
    ) {
        super(_repository, _log);
    }

    async findOrCreate(createUserDto: CreateUserDto) {
        let user = await this._repository.findOne({
            where: {
                login: createUserDto.login,
            }
        });
        if (!user) {
            user = await this._repository.save(createUserDto);
        }
        return user;
    }

    async setTfaSecret(secret: string, userId: string) {
        return await this._repository.update(userId, {
            tfaSecret: secret,
        });
    }

    async turnTfaOn(userId: string) {
        return await this._repository.update(userId, {
            tfaEnabled: true,
        })
    }

    async turnTfaOff(userId: string) {
        return await this._repository.update(userId, {
            tfaEnabled: false,
        })
    }

    async setUserAsConnected(userId: string) {
        // return await this.updateById(userId, {
        //     activityStatus: UserActivityStatusEnum.CONNECTED,
        // });
    }

    async setUserAsDisconnected(userId: string) {
        // return await this.updateById(userId, {
        //     activityStatus: UserActivityStatusEnum.DISCONNECTED,
        // });
    }

    async setUserAsPlaying(userId: string) {
        // return await this.updateById(userId, {
        //     activityStatus: UserActivityStatusEnum.PLAYING,
        // });
    }

    async setUserAsWatching(userId: string) {
        // return await this.updateById(userId, {
        //     activityStatus: UserActivityStatusEnum.WATCHING,
        // });
    }

    async setUserAsQueuing(userId: string) {
        // return await this.updateById(userId, {
        //     activityStatus: UserActivityStatusEnum.QUEUING,
        // });
    }
}
