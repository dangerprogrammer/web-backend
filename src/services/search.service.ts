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

    async searchUserWithProducts(email: string) {
        const user = await this.userRepo.findOne({
            where: { email },
            relations: ['ownerProducts', 'interestedProducts']
        });

        return user;
    }

    async searchAllProducts() {
        return await this.productRepo.find();
    }

    async searchProduct(id: number) {
        return await this.productRepo.findOne({
            where: { id },
            relations: ['owner', 'owner.ownerProducts']
        });
    }

    async findUserByToken(auth: string) {
        const token = auth.split(' ')[1];
        const { sub: id } = jwt.verify(token, 'at-secret') as any;

        return await this.userRepo.findOneBy({ id });
    }
}