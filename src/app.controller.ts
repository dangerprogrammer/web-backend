import { Body, Controller, Get, Headers, Inject, Post, Query } from '@nestjs/common';
import { AuthService, SearchService } from './services';
import { Product, User } from './entities';

@Controller()
export class AppController {
  constructor(
    @Inject(AuthService) private readonly auth: AuthService,
    @Inject(SearchService) private readonly search: SearchService
  ) {}

  @Post('sign-up')
  signUp(@Body() signupDto: { email: string, password: string }) {
    return this.auth.signup(signupDto);
  }

  @Post('signin')
  signin(@Body() signinDto: { email: string, password: string }) {
    return this.auth.signin(signinDto);
  }

  @Get('users')
  async getUserByEmail(@Query('email') email: string) {
    const user = await this.search.searchUser(email);

    return user || {};
  }

  @Get('products')
  getProducts() {
    return this.search.searchAllProducts();
  }

  @Get('products')
  getProductById(@Query('id') id: string) {
    return this.search.searchProduct(+id);
  }

  @Post('product')
  createProduct(@Headers('authorization') auth: string, @Body() productDto: Partial<Product>) {
    return this.auth.createProduct(auth, productDto);
  }

  @Get('search-token')
    findUserByToken(@Headers('authorization') auth: string) {
        return this.search.findUserByToken(auth);
    }
}
