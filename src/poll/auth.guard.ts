import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<Request>()
    return this.validateRequest(req)
  }

  private validateRequest(req: Request): boolean {
    if(req.get('user_id')) {
      return true;
    } else {
      throw new UnauthorizedException()
    }
  }
}