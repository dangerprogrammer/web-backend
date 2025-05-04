import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { User } from "src/entities";

@Injectable()
export class AuthService {
    constructor(
        @Inject(JwtService) private readonly jwt: JwtService,
        @InjectRepository(User) private readonly userRepo: Repository<User>
    ) {}

    async signup(signupDto: Partial<User>) {
        const tokens = await this.getTokens(signupDto);

        const user = this.userRepo.create({
            ...signupDto,
            ...tokens
        });

        await this.userRepo.save(user);

        console.log(user);

        return await this.userRepo.findOneBy({ email: user.email });
    }

    private async getTokens(signupDto: Partial<User>) {
        const [access_token, refresh_token] = await Promise.all([
            this.jwt.signAsync(signupDto, {
                secret: 'at-secret',
                expiresIn: 60 * 60 * 12 // 12 Hours
            }),
            this.jwt.signAsync(signupDto, {
                secret: 'rt-secret',
                expiresIn: 60 * 60 * 24 * 90 // 90 Days
            })
        ]);

        return {
            access_token,
            refresh_token
        };
    }
}