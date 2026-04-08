import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let service: jest.Mocked<Pick<OrderService, 'createOrder'>>;

  beforeEach(async () => {
    service = {
      createOrder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get(OrderController);
  });

  it('createOrder передаёт DTO в сервис и возвращает результат', async () => {
    const dto: CreateOrderDto = {
      email: 'a@b.ru',
      phone: '+7 000 000-00-00',
      tickets: [
        {
          film: '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf',
          session: 'f2e429b0-685d-41f8-a8cd-1d8cb63b99ce',
          daytime: '2024-06-28T10:00:53+03:00',
          row: 1,
          seat: 1,
          price: 350,
        },
      ],
    };
    const response: OrderResponseDto = {
      total: 1,
      items: [
        {
          id: '11111111-1111-4111-8111-111111111111',
          ...dto.tickets[0],
        },
      ],
    };
    service.createOrder.mockResolvedValue(response);

    await expect(controller.createOrder(dto)).resolves.toEqual(response);
    expect(service.createOrder).toHaveBeenCalledWith(dto);
  });
});
