import { Body, Controller, Get, HttpCode, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { TfaGuard } from 'src/auth/guards/tfa.auth.guard';
import { JwtRequest } from 'src/auth/interfaces/jwtRequest.interface';
import { SocketGateway } from 'src/websockets/socket.gateway';
import CreateRelationDto from './dtos/createRelation.dto';
import UpdateRelationDto from './dtos/updateRelation.dto';
import { RelationTypeEnum } from './enums/relationType.enum';
import { RelationService } from './relation.service';

@Controller('relation')
export class RelationController {
    constructor(
        private readonly relationService: RelationService,
        private readonly socketGateway: SocketGateway,
    ) { }

    @Get("many")
    @HttpCode(200)
    @UseGuards(TfaGuard)
    async getAllRelations(@Req() request: JwtRequest) {
        return await this.relationService.getAllRelations(request.user.id);
    }

    @Get("counterpart/many")
    @HttpCode(200)
    @UseGuards(TfaGuard)
    async getAllRelationsCounterpart(
        @Req() request: JwtRequest,
        @Query("status") status: string) {

        let relationStatus: RelationTypeEnum | null = null;
        if (status === "friends") {
            relationStatus = RelationTypeEnum.FRIEND;
        } else if (status === "blocked") {
            relationStatus = RelationTypeEnum.BLOCKED;
        }
        return await this.relationService.getAllRelationCounterPart(request.user, relationStatus);
    }

    @Post()
    @HttpCode(201)
    @UseGuards(TfaGuard)
    async createRelation(@Body() createRelationDto: CreateRelationDto, @Req() request: JwtRequest) {
        const newRelation = await this.relationService.createRelation(createRelationDto, request.user);
        this.socketGateway.addFriend(newRelation);
        return newRelation;
    }

    @Patch()
    @HttpCode(201)
    @UseGuards(TfaGuard)
    async updateRelationStatus(@Body() updateRelationDto: UpdateRelationDto) {
        return await this.relationService.updateById(updateRelationDto.relationId, {
            status: updateRelationDto.status,
        })
    }
}
