import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reading } from './reading.entity';
import { Brackets, In, Like, Repository } from 'typeorm';
import { CreateReadingDto } from './dtos/create-reading.dto';
import { Sensor } from '@src/sensors/sessor.entity';
import { FilterReadingDto } from './dtos/filter-reading.dto';
import { UpdateReadingDto } from './dtos/update-reading.dto';
import { NotifyService } from '@src/notify/notify.service';

@Injectable()
export class ReadingsService {

  constructor(
    @InjectRepository(Reading) private readingRepository: Repository<Reading>,
    @InjectRepository(Sensor) private sensorRepository: Repository<Sensor>,
    private notifySecivce : NotifyService
  ) {}

  async create(readingData: CreateReadingDto ): Promise<Reading> {
    const existingSensor = await this.sensorRepository.findOneBy({id: readingData.sensorId})
    
    if (!existingSensor) {
      throw new BadRequestException('Sensor id not found')
    }
    const reading = await this.readingRepository.create({...readingData,sensor: existingSensor})
    const saveReading = await this.readingRepository.save(reading);
    this.checkWaterLevelAndNotify(saveReading.id);
    return saveReading
  }

  async findAll(): Promise<Reading[]> {
    return await this.readingRepository.find({
      relations: {
        sensor:true
      }
    });
  }

  async findBySensorId(idSensor: number): Promise<Reading[]> {
    const checkSensor = await this.sensorRepository.findOneBy({id: idSensor})
    if(!checkSensor) {
      throw new BadRequestException('Sensor id not found')
    }
    return await this.readingRepository.find({
      where: {
        sensor : {
          id: idSensor
        }
      },
      relations: {
        sensor: true
      }
    });
  }

  async findAllParams(query: FilterReadingDto):Promise<any> {
    console.log(query)
    const limit = Number(query.limit) || 10 ;
    const page = Number(query.page) || 1;
    const skip = (page -1)* limit
    const keyword = query.search || ''
    const waterlevel = query.water_level ? parseFloat(query.water_level) : null
    const queryBuilder = this.readingRepository.createQueryBuilder('reading')
        .leftJoinAndSelect('reading.sensor', 'sensor')
        .orderBy('reading.created_at', 'DESC')
        .take(limit)
        .skip(skip);

      // Thêm điều kiện tìm kiếm cho `water_level` nếu tồn tại
      if (waterlevel !== null) {
        // queryBuilder.andWhere('reading.water_level = :waterlevel', { waterlevel });
        queryBuilder.andWhere('reading.water_level LIKE :waterlevel', { waterlevel: `%${waterlevel}%` });
      }

      // Thêm điều kiện tìm kiếm cho `sensor.name` và `sensor.description` nếu có `keyword`
      if (keyword) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where('sensor.name LIKE :keyword', { keyword: `%${keyword}%` })
              .orWhere('sensor.description LIKE :keyword', { keyword: `%${keyword}%` });
          }),
        );
      }

    const [res, total] = await queryBuilder.getManyAndCount();
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

  async findOne(id: number): Promise<Reading> {
    const reading = await this.readingRepository.findOne({
      where: { id },
      relations: {
        sensor: {
          region: true
        }
      }
    });
    if(!reading) {
      throw new BadRequestException('Reading id not found')
    }
    return reading;
  }

  async getReadingsByDate(date: string): Promise<any> {
    const queryBuilder = this.readingRepository.createQueryBuilder('reading')
      .innerJoinAndSelect('reading.sensor', 'sensor')
      .where('DATE(reading.updated_at) = :date', { date })
      .andWhere('sensor.status = true') 
      .groupBy('sensor.id') 
      // .addGroupBy('reading.id') 
      .orderBy('reading.updated_at', 'DESC')
      .having('reading.updated_at = MAX(reading.updated_at)'); 
  
    const readings = await queryBuilder.getMany();
    return readings;
  }

  async update(id: number, readingData: UpdateReadingDto): Promise<Reading> {
    let readingExits = await this.readingRepository.findOneBy({id});
    if(!readingExits) {
      throw new BadRequestException(`Not found Reading with id : ${id}`)
    }

    const sensorCheck = await this.sensorRepository.findOneBy({id: readingData.sensorId})

    if(!sensorCheck) {
      throw new BadRequestException(`Not found Sensor with id : ${readingData.sensorId}`)
    }

    readingExits.sensor = sensorCheck;
    Object.assign(readingExits, readingData);

    const saveReading = this.readingRepository.save(readingExits);
    this.checkWaterLevelAndNotify(readingExits.id);
    return saveReading
  }

  async remove(id: number): Promise<Reading> {
    const readingExisting = await this.readingRepository.findOneBy({id});
    if(!readingExisting) {
      throw new BadRequestException(`Not found Reading with id : ${id}`)
    }
    return await this.readingRepository.remove(readingExisting);
  }

  async multipleDelete(ids: string[]): Promise<any>{
    const users = await this.readingRepository.findBy({ id: In(ids) });
    if (users.length !== ids.length) {
      throw new BadRequestException('Some Sensors IDs not found');
    }
      return await this.readingRepository.remove(users);
  }

  async checkWaterLevelAndNotify(readingId: number) : Promise<any> {
    console.log('checkWaterLevelAndNotify call');
    const reading = await this.findOne(readingId)
    const readingLevel = reading.water_level;
    const regionLevel = reading.sensor.region.damage_level
    const notifyData = {
      readingId: reading.id,
      message: null
    }

    if(readingLevel > regionLevel) {
      return this.notifySecivce.multipleCreate(notifyData)
    }

    console.log('Auto send notify Fail');
    return null;
  }

}
