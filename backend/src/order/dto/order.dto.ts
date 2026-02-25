import {
  IsEmail,
  IsArray,
  IsString,
  IsUUID,
  IsNumber,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

/** Билет в теле запроса (схема Ticket из film.yml) */
export class TicketDto {
  @IsUUID()
  film: string;

  @IsUUID()
  session: string;

  @IsString()
  daytime: string;

  @IsNumber()
  @Min(1)
  row: number;

  @IsNumber()
  @Min(1)
  seat: number;

  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateOrderDto {
  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketDto)
  tickets: TicketDto[];
}

/** Билет в ответе (Ticket + id) */
export class TicketResponseDto {
  id?: string;
  film: string;
  session: string;
  daytime: string;
  row: number;
  seat: number;
  price: number;
}

export class OrderResponseDto {
  total: number;
  items: TicketResponseDto[];
}
