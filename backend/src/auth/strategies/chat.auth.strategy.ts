import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { configService } from "src/app/config/config.service";
import { ChatRoleService } from "src/chat/services/chatRole.service";

@Injectable()
export class ChatStrategy extends PassportStrategy(Strategy, "chat-jwt"){
	constructor(
		private readonly chatRoomService: ChatRoleService,
	){
		// super({
		// 	jwtFromRequest: ExtractJwt.fromExtractors([
		// 		(request: Request) => {
		// 			let data = request.cookies.authentication;

		// 			if (!data){
		// 				return null;
		// 			}
		// 			return data;
		// 		}
		// 	]),
		// 	secretOrKey: configService.getJwtTokenSecret(),
		// })
		super()
	}
	async validate(room_id: string, password: string) {}
}