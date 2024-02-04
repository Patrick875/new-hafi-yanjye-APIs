import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common'
import { SiteService } from './site.service'
import { CreateSiteDto } from './dto/create-site.dto'
import { UpdateSiteDto } from './dto/update-site.dto'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { Role } from '../users/entities/user.entity'
import { Roles } from '../auth/roles/roles.decorator'
import { AuthGuard } from '../auth/auth.guard'
import { RolesGuard } from '../auth/roles/roles.guard'

@ApiTags('sites')
@Controller('site')
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Create site | Collection' })
  @ApiResponse({ status: 201, description: 'Site created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth()
  @Post()
  create(@Body() createSiteDto: CreateSiteDto) {
    return this.siteService.create(createSiteDto)
  }

  @Get()
  findAll() {
    return this.siteService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.siteService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSiteDto: UpdateSiteDto) {
    return this.siteService.update(+id, updateSiteDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.siteService.remove(+id)
  }

  @ApiOperation({ summary: 'Get all provinces' })
  @ApiResponse({ status: 200, description: 'sites retrieved successfully' })
  @Get('address/province')
  getAddressProvince() {
    return this.siteService.getAllProvince()
  }
}
