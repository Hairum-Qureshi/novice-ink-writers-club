import {
  Controller,
  Get,
  Param,
  NotFoundException,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GenresService } from './genres.service';
import { Genre } from '../../../../packages/shared-types/dist/enums/genres';

@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Get(':genre/published/all')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  getGenre(@Param('genre') genre: Genre) {
    if (
      typeof genre !== 'string' ||
      !(Object.values(Genre) as string[]).includes(genre)
    )
      throw new NotFoundException('Genre not found');

    return this.genresService.getAllPublishedInGenre(genre);
  }

  @Get('published/:userId/all')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  getPublishedUserContent(@Param('userId') userId: string) {
    return this.genresService.getPublishedGenreContentByUserId(userId);
  }

  @Get(':publishedContentId/content')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  getPublishedContentById(
    @Param('publishedContentId') publishedContentId: string,
  ) {
    return this.genresService.getPublishedGenreContentById(publishedContentId);
  }
}
