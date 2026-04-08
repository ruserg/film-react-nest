import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmsResponseDto, ScheduleResponseDto } from './dto/films.dto';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: jest.Mocked<Pick<FilmsService, 'getFilms' | 'getSchedule'>>;

  beforeEach(async () => {
    service = {
      getFilms: jest.fn(),
      getSchedule: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get(FilmsController);
  });

  it('getFilms возвращает ответ сервиса', async () => {
    const dto: FilmsResponseDto = {
      total: 1,
      items: [
        {
          id: '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf',
          title: 'Test',
        },
      ],
    };
    service.getFilms.mockResolvedValue(dto);

    await expect(controller.getFilms()).resolves.toEqual(dto);
    expect(service.getFilms).toHaveBeenCalledTimes(1);
  });

  it('getSchedule проксирует id в сервис', async () => {
    const id = '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf';
    const dto: ScheduleResponseDto = { total: 0, items: [] };
    service.getSchedule.mockResolvedValue(dto);

    await expect(controller.getSchedule(id)).resolves.toEqual(dto);
    expect(service.getSchedule).toHaveBeenCalledWith(id);
  });
});
