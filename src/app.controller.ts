import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { AuthService, SearchService } from './services';
import { User } from './entities';

@Controller()
export class AppController {
  constructor(
    @Inject(AuthService) private readonly auth: AuthService,
    @Inject(SearchService) private readonly search: SearchService
  ) {}

  @Post('sign-up')
  signUp(@Body() signupDto: User) {
    return this.auth.signup(signupDto);
  }

  @Get('products')
  getProducts() {
    return this.search.searchAllProducts();
  }

  @Get('products')
  getProductById(@Query('id') id: string) {
    return this.search.searchProduct(+id);
  }
}
