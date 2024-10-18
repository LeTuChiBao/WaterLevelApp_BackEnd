import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Region } from './region.entity';
import { In, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRegionDto } from './dtos/create-region.dto';
import { UpdateRegionDto } from './dtos/update-region.dto';
import { FilterRegionDto } from './dtos/filter-region.dto';

@Injectable()
export class RegionsService {
  constructor(@InjectRepository(Region) private regionRepository: Repository<Region>) {}

  async create(regionData :CreateRegionDto ): Promise<Region> {
    const existingRegion = await this.regionRepository.findOne({
      where: {
        ward: regionData.ward,
        district: regionData.district,
      },
    });
    
    if (existingRegion) {
      throw new BadRequestException('Region with the same ward and district already exists.')
    }
    const region = await this.regionRepository.create(regionData)
    return await this.regionRepository.save(region);
  }

  async findAll(): Promise<Region[]> {
    return await this.regionRepository.find();
  }

  async findAllParams(query: FilterRegionDto):Promise<any> {
    const limit = Number(query.limit) || 10 ;
    const page = Number(query.page) || 1;
    const skip = (page -1)* limit
    const keyword = query.search || ''
    const [res,total] =  await this.regionRepository.findAndCount({
        where: [
            {ward: Like('%'+ keyword+'%')},
            {district: Like('%'+ keyword+ '%')},
        ],
        order: {created_at: "DESC"},
        take : limit,
        skip : skip,
        select: ['id', 'ward', 'district','damage_level','created_at','updated_at']
    })

    const lastPage = Math.ceil(total/limit);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page -1;

    return {
        data : res,
        total : total,
        currentPage : page,
        nextPage,
        prevPage,
        lastPage
    }
  }

  async findOne(id: number): Promise<Region> {
    const region = await this.regionRepository.findOneBy({ id });
    if(!region) {
      throw new BadRequestException('Region id not found')
    }
    return region;
  }

  async update(id: number, regionData: UpdateRegionDto): Promise<Region> {
    let regionExits = await this.regionRepository.findOneBy({id});
    if(!regionExits) {
      throw new NotFoundException(`Not found region with id : ${id}`)
    }
    Object.assign(regionExits, regionData);
    return await this.regionRepository.save(regionExits);
  }

  async remove(id: number): Promise<Region> {
    const regionExits = await this.regionRepository.findOneBy({id});
    if(!regionExits) {
      throw new NotFoundException(`Not found region with id : ${id}`)
    }
    return await this.regionRepository.remove(regionExits);
  }

  async multipleDelete(ids: string[]): Promise<any>{
    const users = await this.regionRepository.findBy({ id: In(ids) });
    if (users.length !== ids.length) {
      throw new BadRequestException('Some Sensors IDs not found');
    }
      return await this.regionRepository.remove(users);
  }
}
