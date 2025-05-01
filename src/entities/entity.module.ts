import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User, Product } from ".";

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([User, Product])],
    exports: [TypeOrmModule]
})
export class EntityModule {}