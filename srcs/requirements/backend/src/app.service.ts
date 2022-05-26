import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io'


@Injectable()
export class AppService {
	getHello() {
		console.log("test")
		return 'Hello World';
	}
}
