import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { create } from "domain";
import { Repository } from "typeorm";
import { Metadata } from "../entities/metadata.entity";
import { Release } from "../entities/release.entity";

@Injectable()
export class ReleaseService {
    constructor(
        @InjectRepository(Release)
        private releaseRepo: Repository<Release>,
    ) {}

    create(version: string, md: Metadata) {
        return new Promise((resolve, _) => {
            var release = new Release();
            release.version = version;
            release.metadata = md;
            this.releaseRepo.save(release);
            resolve(release);
        });
    }

    async findLatest(): Promise<Release> {
        var vers = await this.releaseRepo.find();
        return vers.pop();
    } 
}