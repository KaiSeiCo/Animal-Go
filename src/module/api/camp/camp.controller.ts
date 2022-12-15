import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Result } from 'src/common/class/result.class';
import { OnlyRequireLogin } from 'src/common/decorator/auth.decorator';
import { UserContext } from 'src/global/context/user.context';
import { Camp } from 'src/model/entity/app/camp.entity';
import { BuildCampDto } from './camp.dto';
import { CampService } from './camp.service';

@ApiTags('营地模块')
@ApiBearerAuth()
@Controller('camps')
export class CampController {
  constructor(
    private readonly campService: CampService,
    private readonly userCtx: UserContext,
  ) {}

  @ApiOperation({
    summary: '创建营地',
  })
  @OnlyRequireLogin()
  @Post('build')
  async buildCamp(@Body() dto: BuildCampDto): Promise<Result<Camp>> {
    const user = this.userCtx.get('user');
    const camp = await this.campService.createCampByUser(user.id, dto);
    return Result.success(camp);
  }
}
