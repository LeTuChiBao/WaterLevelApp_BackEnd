import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sensor } from './sessor.entity';
import { In, Like, Repository } from 'typeorm';
import { Region } from '@src/regions/region.entity';
import { FilterSensorDto } from './dtos/filter-sensor.dto';
import { CreateSensorDto } from './dtos/create-sessor.dto';
import { UpdateSensorDto } from './dtos/update-sensor.dto';

@Injectable()
export class SensorsService {

  constructor( 
    @InjectRepository(Sensor) private readonly sensorRepository: Repository<Sensor>,
    @InjectRepository(Region) private readonly regionRepository: Repository<Region>,
  ){}

  async findAll(query: FilterSensorDto):Promise<any> {
    const limit = Number(query.limit) || 10 ;
    const page = Number(query.page) || 1;
    const skip = (page -1)* limit
    const keyword = query.search || ''
    const [res,total] =  await this.sensorRepository.findAndCount({
        where: [
            {name: Like('%'+ keyword+'%')},
            {description: Like('%'+ keyword+ '%')}
        ],
        relations: {
            region: true
        },
        order: {created_at: "DESC"},
        take : limit,
        skip : skip,
        select: ['id', 'name', 'description','latitude','longitude','status','created_at','updated_at']
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

  async findOne(id: number): Promise<Sensor> {
    const sensor = await this.sensorRepository.findOne({ where: { id }, relations: ['region', 'readings'] });
    if(!sensor) {
      throw new BadRequestException('Sensor id not found')
    }
    return sensor;
  }

  async create(createSensorDto: CreateSensorDto): Promise<Sensor> {
    const checkRegion = await this.regionRepository.findOneBy({id: createSensorDto.regionId});
    if(!checkRegion){
      throw new BadRequestException('Region Id id not found')
    }
    const sensor = this.sensorRepository.create({...createSensorDto, region: checkRegion});
    return await this.sensorRepository.save(sensor);
  }

  async update(id: number, updateSensorDto: UpdateSensorDto): Promise<Sensor> {
    let sensor = await this.sensorRepository.findOneBy({ id });
    if(!sensor) {
      throw new BadRequestException('Sensor id not found')
    }

    const checkRegion = await this.regionRepository.findOneBy({id: updateSensorDto.regionId});
    if(!checkRegion){
      throw new BadRequestException('Region Id id not found')
    }
    sensor.region = checkRegion;

    Object.assign(sensor,updateSensorDto)

    return await this.sensorRepository.save(sensor);
  }

  async delete( id: number): Promise<Sensor> {
    let sensor = await this.sensorRepository.findOneBy({ id });
    if(!sensor) {
      throw new BadRequestException('Sensor id not found')
    }
    return await this.sensorRepository.remove(sensor)
  }

  async multipleDelete(ids: string[]): Promise<any>{
    console.log(ids)
    const users = await this.sensorRepository.findBy({ id: In(ids) });
    if (users.length !== ids.length) {
      throw new BadRequestException('Some Sensors IDs not found');
    }
      return await this.sensorRepository.remove(users);
  }

}
