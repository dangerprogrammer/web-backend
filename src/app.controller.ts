import { Body, Controller, Get, Headers, Inject, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AuthService, SearchService } from './services';
import { Product } from './entities';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller()
export class AppController {
  constructor(
    @Inject(AuthService) private readonly auth: AuthService,
    @Inject(SearchService) private readonly search: SearchService
  ) { }

  @Post('sign-up')
  signUp(@Body() signupDto: { email: string, password: string }) {
    return this.auth.signup(signupDto);
  }

  @Post('signin')
  signin(@Body() signinDto: { email: string, password: string }) {
    return this.auth.signin(signinDto);
  }

  @Get('user')
  async getUserByEmail(@Query('email') email: string) {
    const user = await this.search.searchUser(email);

    return user || {};
  }

  @Get('user-products')
  async getUserProductsByEmail(@Query('email') email: string) {
    const user = await this.search.searchUserWithProducts(email);

    return user || {};
  }

  @Get('products')
  getProducts() {
    return this.search.searchAllProducts();
  }

  @Get('products/product')
  getProductById(@Query('id') id: string) {
    return this.search.searchProduct(+id);
  }

  @Get('user-interest')
  setUserInterestedProducts(@Headers('authorization') auth: string, @Query('id') id: string) {
    return this.auth.updateInterest(auth, +id);
  }

  @Post('product')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'images', maxCount: 8 },
  ], {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + extname(file.originalname));
      },
    }),
  }))
  async createProduct(
    @UploadedFiles() files: { images?: Express.Multer.File[] },
    @Headers('authorization') auth: string,
    @Body() body: any
  ) {
    const imagePaths = files.images?.map(file => `/uploads/${file.filename}`) || [];

    const productDto = { ...body, images: imagePaths };

    return await this.auth.createProduct(auth, productDto);
  }

  @Get('search-token')
  async findUserByToken(@Headers('authorization') auth: string) {
    return await this.search.findUserByToken(auth) || {};
  }
}
