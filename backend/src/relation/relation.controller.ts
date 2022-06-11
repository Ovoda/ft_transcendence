import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { TfaGuard } from 'src/auth/guards/tfa.auth.guard';
import { JwtRequest } from 'src/auth/interfaces/jwtRequest.interface';
import { SocketGateway } from 'src/websockets/socket.gateway';
import { RelationId } from 'typeorm';
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
    async getAllRelations(
        @Req() request: JwtRequest) {
        return await this.relationService.getAllRelations(request.user.id);
    }

    @Get("/:relation_id")
    @HttpCode(200)
    @UseGuards(TfaGuard)
    async getRelation(
        @Req() request: JwtRequest,
        @Param("relation_id") relationId: string) {
        return await this.relationService.getRelation(relationId, request.user.id);
    }

    @Delete("/:relation_id")
    @HttpCode(200)
    @UseGuards(TfaGuard)
    async deleteRelation(
        @Req() request: JwtRequest,
        @Param("relation_id") relationId: string) {

        const relation = await this.relationService.findOneById(relationId, {
            relations: ["users"],
        })

        if (!relation) return;

        const deleted = await this.relationService.delete(relationId);

        if (deleted) {
            this.socketGateway.updateRelations(relation.users[0].id);
            this.socketGateway.updateRelations(relation.users[1].id);
        }
    }

    @Post()
    @HttpCode(201)
    @UseGuards(TfaGuard)
    async createRelation(@Body() createRelationDto: CreateRelationDto, @Req() request: JwtRequest) {
        const newRelation = await this.relationService.createRelation(createRelationDto, request.user.id);
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
