import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChatPasswordService {
	constructor() {}

	async encryptPassword(password: string) {
		const saltRounds = 10;
		const hash = await bcrypt.hash(password, saltRounds);
		return hash;
	}
	
	async verifyPassword(password: string, hash: string) {
		return await bcrypt.compare(password, hash);
	}
}