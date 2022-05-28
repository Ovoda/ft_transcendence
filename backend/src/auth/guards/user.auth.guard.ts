import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class UserLocalAuthGuard extends AuthGuard("user-local") { }