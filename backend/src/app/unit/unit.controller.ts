import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UnitService } from './unit.service';
import {
  UnitCreateRequestDTO,
  UnitQuestionResponseDTO,
  UnitResponseDTO,
  UnitUpdateRequestDTO,
} from './dtos';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Unit')
@ApiBearerAuth()
@Controller('units')
export class UnitController {
  constructor(private unitService: UnitService) {}

  @Post()
  create(@Body() dto: UnitCreateRequestDTO): Promise<void> {
    return this.unitService.create(dto);
  }

  @Post(':id/questions')
  generateQuestions(@Param('id') id: string): Promise<void> {
    return this.unitService.generateQuestions(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UnitUpdateRequestDTO,
  ): Promise<void> {
    return this.unitService.update(id, dto);
  }

  @Get()
  @UseGuards(AuthGuard)
  listAll(): Promise<UnitResponseDTO[]> {
    return this.unitService.listAll();
  }

  @Get(':id/questions')
  @UseGuards(AuthGuard)
  listQuestions(@Param('id') id: string): Promise<UnitQuestionResponseDTO[]> {
    return this.unitService.listQuestions(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.unitService.delete(id);
  }
}
