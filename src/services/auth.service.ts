import { ForbiddenException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { Product, User } from "src/entities";
import * as bcrypt from 'bcrypt';
import { SearchService } from "./search.service";
import { productDto } from "src/types";

@Injectable()
export class AuthService {
    constructor(
        @Inject(JwtService) private readonly jwt: JwtService,
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Product) private readonly productRepo: Repository<Product>,
        @Inject(forwardRef(() => SearchService)) private readonly search: SearchService
    ) { }

    async signup(signupDto: { email: string, password: string }) {
        const hash = await this.hashData(signupDto.password);

        const createUser = this.userRepo.create({ ...signupDto, hash });

        await this.userRepo.save(createUser);

        const user = (await this.userRepo.findOneBy({ email: createUser.email })) as User;
        
        const tokens = await this.getTokens(user.id, user.email);

        await this.updateRtHash(user.id, tokens.hashRefreshToken);

        return tokens;
    }

    async signin(signinDto: { email: string, password: string }) {
        const user = await this.userRepo.findOneBy({ email: signinDto.email });

        if (!user) throw new ForbiddenException("User doesn't exists");

        const passwordMatches = await bcrypt.compare(signinDto.password, user.hash);

        if (!passwordMatches) throw new ForbiddenException("Password don't match");

        const tokens = await this.getTokens(user.id, user.email);

        await this.updateRtHash(user.id, tokens.hashRefreshToken);

        return tokens;
    }

    async createProduct(auth: string, productDto: productDto) {
        const user = await this.search.findUserByToken(auth);

        if (!user) throw new ForbiddenException("Unauthorized user");

        const product = this.productRepo.create({
            ...productDto,
            location: user.location,
            owner: user
        });

        await this.productRepo.save(product);

        user.totalPoints += productDto.points;

        await this.userRepo.save(user);

        return product;
    }

    async updateInterest(auth: string, id: number) {
        const user = await this.search.findUserByToken(auth);

        if (!user) throw new ForbiddenException("Unauthorized user");

        const product = await this.search.searchProduct(id);

        if (!product) throw new ForbiddenException("Unknown Product");

        const fullUser = (await this.userRepo.findOne({
            where: { id: user.id },
            relations: ['interestedProducts']
        }))!;
        const productIndex = fullUser.interestedProducts.findIndex(p => p.id == product.id);

        if (productIndex == -1) fullUser.interestedProducts.push(product);
        else fullUser.interestedProducts = fullUser.interestedProducts.filter(p => p.id != product.id);

        return await this.userRepo.save(fullUser);
    }

    private async updateRtHash(id: number, rt: string) {
        const hash = await this.hashData(rt);

        const user = await this.userRepo.findOneBy({ id });

        if (!user) return;

        user.hashRefreshToken = hash;

        this.userRepo.save(user);
    }

    hashData(data: string) {
        return bcrypt.hash(data, 10);
    }

    private async getTokens(id: number, email: string) {
        const [access_token, refresh_token] = await Promise.all([
            this.jwt.signAsync({
                sub: id, email
            }, {
                secret: 'at-secret',
                expiresIn: 60 * 60 * 12 // 12 Hours
            }),
            this.jwt.signAsync({
                sub: id, email
            }, {
                secret: 'rt-secret',
                expiresIn: 60 * 60 * 24 * 90 // 90 Days
            })
        ]);

        return {
            hash: access_token,
            hashRefreshToken: refresh_token
        };
    }
}