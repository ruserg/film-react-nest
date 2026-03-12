import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { FilmsRepository } from '../films/repository/films.repository';
import { CreateOrderDto } from './dto/order.dto';
import { OrderResponseDto, TicketResponseDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async createOrder(dto: CreateOrderDto): Promise<OrderResponseDto> {
    const tickets = dto.tickets;
    if (!tickets.length) {
      throw new BadRequestException({
        error: 'At least one ticket is required',
      });
    }

    const takenBySession = new Map<string, string[]>();
    const seenInRequest = new Set<string>();

    for (const ticket of tickets) {
      const film = await this.filmsRepository.findById(ticket.film);
      if (!film) {
        throw new BadRequestException({ error: 'Film not found' });
      }
      const session = film.schedule?.find((s) => s.id === ticket.session);
      if (!session) {
        throw new BadRequestException({ error: 'Session not found' });
      }
      const rows = session.rows ?? 0;
      const seats = session.seats ?? 0;
      if (
        ticket.row < 1 ||
        ticket.row > rows ||
        ticket.seat < 1 ||
        ticket.seat > seats
      ) {
        throw new BadRequestException({
          error: `Seat row ${ticket.row}, seat ${ticket.seat} is out of range (1-${rows} rows, 1-${seats} seats)`,
        });
      }
      const key = `${ticket.row}:${ticket.seat}`;
      const requestKey = `${ticket.film}:${ticket.session}:${key}`;
      if (seenInRequest.has(requestKey)) {
        throw new BadRequestException({
          error: `Duplicate seat ${key} in the same order`,
        });
      }
      seenInRequest.add(requestKey);
      const taken = session.taken ?? [];
      if (taken.includes(key)) {
        throw new BadRequestException({
          error: `Seat ${key} is already taken`,
        });
      }
      const mapKey = `${ticket.film}:${ticket.session}`;
      const list = takenBySession.get(mapKey) ?? [];
      list.push(key);
      takenBySession.set(mapKey, list);
    }

    for (const [mapKey, keys] of takenBySession) {
      const [filmId, sessionId] = mapKey.split(':');
      const updated = await this.filmsRepository.addTakenToSession(
        filmId,
        sessionId,
        keys,
      );
      if (!updated) {
        throw new BadRequestException({ error: 'Failed to reserve seats' });
      }
    }

    const items: TicketResponseDto[] = tickets.map((t) => ({
      id: randomUUID(),
      film: t.film,
      session: t.session,
      daytime: t.daytime,
      row: t.row,
      seat: t.seat,
      price: t.price,
    }));

    return {
      total: items.length,
      items,
    };
  }
}
