import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Create Category' })
  @UseInterceptors(FileInterceptor('image'))
  @ApiBearerAuth()
  @Post()
  create(
    @UploadedFile() image: Express.Multer.File,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    console.log(image.originalname)
    return this.categoriesService.create(createCategoryDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get Categories' })
  findAll() {
    return this.categoriesService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single Category' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Category' })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Category' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id)
  }
}
