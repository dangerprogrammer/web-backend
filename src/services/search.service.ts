import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { User } from "src/entities";

@Injectable()
export class SearchService {
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>
    ) {}

    async searchUser(email: string) {
        const user = await this.userRepo.findOneBy({ email });

        return user;
    }
}