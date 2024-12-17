import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  UnitQuestionTextCreateRequestDTO,
  UnitQuestionTextUpdateRequestDTO,
} from './dtos';
import { UnitQuestionTextService } from './unit-question-text.service';

@ApiTags('Unit Question Text')
@ApiBearerAuth()
@Controller('unit-question-texts')
export class UnitQuestionTextController {
  constructor(private unitQuestionTextService: UnitQuestionTextService) {}

  @Post()
  create(@Body() dto: UnitQuestionTextCreateRequestDTO): Promise<void> {
    return this.unitQuestionTextService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UnitQuestionTextUpdateRequestDTO,
  ): Promise<void> {
    return this.unitQuestionTextService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.unitQuestionTextService.delete(id);
  }
}
