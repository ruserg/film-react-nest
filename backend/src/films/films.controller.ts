import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsResponseDto, ScheduleResponseDto } from './dto/films.dto';

const filmIdPipe = new ParseUUIDPipe({
  exceptionFactory: () =>
    new BadRequestException({ error: 'Film id must be a valid UUID' }),
});

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async getFilms(): Promise<FilmsResponseDto> {
    return this.filmsService.getFilms();
  }

  @Get(':id/schedule')
  async getSchedule(
    @Param('id', filmIdPipe) id: string,
  ): Promise<ScheduleResponseDto> {
    return this.filmsService.getSchedule(id);
  }
}
