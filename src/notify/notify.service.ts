import { MultipleCreateNotifyDto } from './dtos/multiple-create-notify.dto';
import { BadGatewayException, BadRequestException, Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notify } from './notify.entity';
import { Brackets, In, Repository } from 'typeorm';
import { Reading } from '@src/readings/reading.entity';
import { User } from '@src/users/user.entity';
import { CreateNotifyDto } from './dtos/create-notify.dto';
import { FilterNotifyDto } from './dtos/filter-notify.dto';
import { FilterNotifyUserDto } from './dtos/filter-notify-user.dto';

@Injectable()
export class NotifyService {

  constructor(
    @InjectRepository(Notify) private notifyRepository: Repository<Notify>,
    @InjectRepository(Reading) private readingRepository: Repository<Reading>,
    @InjectRepository(User) private userRepository: Repository<User>
  ){}

  async create(createData: CreateNotifyDto ): Promise<Notify> {
    const exitingReading = await this.readingRepository.findOne({
      where: { id: createData.readingId },
      relations: ['sensor', 'sensor.region'],
    });
    if (!exitingReading) {
      throw new BadRequestException('Reading id not exist')
    }

    console.log(exitingReading)
    const exitingUser = await this.userRepository.findOneBy({id: createData.userId});
    if (!exitingUser) {
      throw new BadRequestException('User id not exist')
    }
    if(createData.message) {
      return await this.createEntity(exitingReading, exitingUser, createData.message);
    }
    
    return await this.createEntity(exitingReading, exitingUser);
     
  }

  async multipleCreate(createData: MultipleCreateNotifyDto ): Promise<User[]> {
    const {message} = createData;
    const exitingReading = await this.readingRepository.findOne({
      where: { id: createData.readingId },
      relations: ['sensor', 'sensor.region'],
    });
    if (!exitingReading) {
      throw new BadRequestException('Reading id not exist')
    }
    const exitingRegion = exitingReading.sensor.region;
    
    const userList = await this.userRepository.find({
      where: {
        region: {
          id : exitingRegion.id
        }
      }
    })
    console.log(userList)

    for (const user of userList) {
      if(message) {
        await this.createEntity(exitingReading, user, message);
      }else{
        await this.createEntity(exitingReading, user);
      }
    }
    return userList;
  }

  async createEntity(reading: Reading, user?: User, message?: string ): Promise<Notify> {
    const compareLevel = reading.water_level - reading.sensor.region.damage_level
    console.log(compareLevel)
    const messagecustom = message ? message : `Cảnh báo ngập lụt với mực nước hiện tại cao hơn : ${compareLevel} m. 
                    Tại cảm biến ${reading.sensor.name}.
                    User ${user.fullName} hãy chú ý` 
    const data  = {
      reading,
      user,
      message: messagecustom
    }

    console.log(data)
    const notify = await this.notifyRepository.create(data);
    return await this.notifyRepository.save(notify);
  }

  async findAll(query: FilterNotifyDto):Promise<any> {
    console.log(query)
    const limit = Number(query.limit) || 10 ;
    const page = Number(query.page) || 1;
    const skip = (page -1)* limit
    const keyword = query.search || ''
    const isReading = query.isReading === 'true' ? true : query.isReading === 'false' ? false : null;
    const queryBuilder = this.notifyRepository.createQueryBuilder('notify')
        .leftJoinAndSelect('notify.reading', 'reading')
        .leftJoinAndSelect('notify.user', 'user')
        .orderBy('notify.created_at', 'DESC')
        .take(limit)
        .skip(skip);

      if (isReading !== null) {
        queryBuilder.andWhere('notify.isReading = :isReading', { isReading });
      }

      if (keyword) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where('notify.message LIKE :keyword', { keyword: `%${keyword}%` })
            .orWhere('notify.isReading = :isReading', { isReading: keyword === 'true' ? true : false });
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

  async findOne(id: number): Promise<Notify> {
    const notifyExisting = await this.notifyRepository.findOneBy({ id });
    if(!notifyExisting) {
      throw new BadRequestException('Notify Id id not found')
    }
    return notifyExisting;
  }

  async read(id: number): Promise<Notify> {
    try {
      const notifyExisting = await this.notifyRepository.findOne({
        where: { id },
        relations: { reading: true },
    });

      
      if (!notifyExisting) {
          throw new BadRequestException('Notify Id not found');
      }

      // Cập nhật trạng thái đọc
      notifyExisting.isReading = true;
      console.log(notifyExisting);

      

      // Lưu và trả về thông báo đã cập nhật
      return await this.notifyRepository.save(notifyExisting);
    } catch (error) {
        console.error('Error in reading notification:', error);
        throw new BadRequestException('An error occurred while reading the notification');
    }
  }

  async findAllByUserId(userId : number, query: FilterNotifyUserDto): Promise<any> {
    const checkUser = await this.userRepository.findOneBy({id: userId});
    if(!checkUser) {
      throw new BadRequestException('User id not found')
    }

    console.log(query)
    const limit = Number(query.limit) || 10 ;
    const page = Number(query.page) || 1;
    const skip = (page -1)* limit
    const keyword = query.search || ''
    const queryBuilder = this.notifyRepository.createQueryBuilder('notify')
        .leftJoinAndSelect('notify.reading', 'reading')
        .orderBy('notify.created_at', 'DESC')
        .take(limit)
        .skip(skip);

      if (userId !== null) {
        queryBuilder.andWhere('notify.userId = :userId', { userId });
      }

      if (keyword) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where('notify.message LIKE :keyword', { keyword: `%${keyword}%` })
            .orWhere('notify.isReading = :isReading', { isReading: keyword === 'true' ? true : false });
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
  async multipleDelete(ids: string[]): Promise<any>{
    const notifies = await this.notifyRepository.findBy({ id: In(ids) });
    console.log(notifies.length, ids.length)
    if (notifies.length !== ids.length) {
      throw new BadRequestException('Some Sensors IDs not found');
    }
      return await this.notifyRepository.remove(notifies);
  }
  async remove(id: number): Promise<Notify> {
    const notifyExiting = await this.notifyRepository.findOneBy({id});
    if(!notifyExiting) {
      throw new BadRequestException(`Not found Reading with id : ${id}`)
    }
    return await this.notifyRepository.remove(notifyExiting);
  }

}
