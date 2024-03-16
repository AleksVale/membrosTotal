import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TrainingAdminService } from './training-admin.service';
import { CreateTrainingAdminDTO } from './dto/create-training-admin.dto';
import { UpdateTrainingAdminDto } from './dto/update-training-admin.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RoleGuard } from 'src/auth/role/role.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePaymentResponseDTO } from 'src/collaborator/payments/dto/create-payment-response.dto';

@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(['admin'])
@ApiTags('Training-Admin')
@Controller('training-admin')
export class TrainingAdminController {
  constructor(private readonly trainingAdminService: TrainingAdminService) {}

  @ApiResponse({ type: CreatePaymentResponseDTO, status: 201 })
  @Post()
  async create(
    @Body() createTrainingAdminDto: CreateTrainingAdminDTO,
  ): Promise<CreatePaymentResponseDTO> {
    const training = await this.trainingAdminService.create(
      createTrainingAdminDto,
    );
    return {
      id: training.id,
      success: true,
    };
  }

  @Get()
  findAll() {
    return this.trainingAdminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trainingAdminService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTrainingAdminDto: UpdateTrainingAdminDto,
  ) {
    return this.trainingAdminService.update(+id, updateTrainingAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trainingAdminService.remove(+id);
  }
}
