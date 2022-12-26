import { Controller, Post } from '@nestjs/common';
import {
  Body,
  Param,
} from '@nestjs/common/decorators/http/route-params.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Result } from 'src/common/class/result.class';
import { OnlyRequireLogin } from 'src/common/decorator/auth.decorator';
import { UserContext } from 'src/global/context/user.context';
import { BuildCampDto, JoinCampDto } from './camp.dto';
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
  async buildCamp(@Body() dto: BuildCampDto) {
    const user = this.userCtx.get('user');
    const camp = await this.campService.createCampByUser(user.id, dto);
    return Result.success(camp);
  }

  @ApiOperation({
    summary: '加入营地',
  })
  @OnlyRequireLogin()
  @Post('join')
  async joinCamp(@Body() dto: JoinCampDto) {
    const user = this.userCtx.get('user');
    const data = await this.campService.joinCamp(user.id, dto);
    return Result.success(data);
  }

  @ApiOperation({
    summary: '退出营地',
  })
  @OnlyRequireLogin()
  @Post('/:id/leaves')
  async leaveCamp(@Param('id') camp_id: string) {
    const user = this.userCtx.get('user');
    const data = await this.campService.leaveCamp(user.id, camp_id);
    return Result.success(data);
  }
}
