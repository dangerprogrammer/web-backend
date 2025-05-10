import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { Product, User } from "src/entities";
import * as jwt from 'jsonwebtoken';

@Injectable()
export class SearchService {
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Product) private readonly productRepo: Repository<Product>
    ) {}

    async searchUser(email: string) {
        const user = await this.userRepo.findOneBy({ email });

        return user;
    }

    async searchAllProducts() {
        return await this.productRepo.find();
    }

    async searchProduct(id: number) {
        return await this.productRepo.findOneBy({ id });
    }

    async findUserByToken(auth: string) {
        const token = auth.split(' ')[1];
        const { sub: id } = jwt.verify(token, 'at-secret') as any;

        return await this.userRepo.findOneBy({ id });
    }
}