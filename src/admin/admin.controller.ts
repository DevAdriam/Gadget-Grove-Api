import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateAdminDto, updateAdminDto } from './dto/admin.dto';

@Controller('api/v1/admin')
@ApiTags('admins-crud')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @HttpCode(200)
  @ApiOperation({ summary: 'get all admins' })
  @Get('getAll')
  GetAllAdmins() {
    return this.adminService.getAllAdmins();
  }

  @ApiOperation({ summary: 'get admin detail' })
  @Get(':id/detail')
  GetAdminDetail(@Param('id') id: string) {
    return this.adminService.getAdminDetail(id);
  }

  @ApiOperation({ summary: 'create admin' })
  @ApiBody({ description: 'create admin', type: CreateAdminDto })
  @Post('create')
  CreateAdmin(@Body() dto: CreateAdminDto) {
    return this.adminService.createAdmin(dto);
  }

  @ApiOperation({ summary: 'update admin' })
  @ApiBody({
    description: 'edit admin',
    type: updateAdminDto,
  })
  @Put('update')
  UpdateAdmin(@Param('id') id: string, @Body() dto: updateAdminDto) {
    return this.adminService.updateAdmin(id, dto);
  }

  @ApiOperation({ summary: 'delete admin' })
  @ApiBody({
    description: 'delete admin',
  })
  @Delete('delete')
  DeleteAdmin(@Param('id') id: string) {
    return this.adminService.deleteAdmin(id);
  }
}
