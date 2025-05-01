import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthService } from './services';
import { User } from './entities';

@Controller()
export class AppController {
  constructor(
    @Inject(AuthService) private readonly auth: AuthService
  ) {}

  @Post('sign-up')
  signUp(@Body() signupDto: User) {
    return this.auth.signup(signupDto);
  }
}
