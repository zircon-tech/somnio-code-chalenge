import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'ACK api status',
    description: 'ACK api status',
  })
  getAppStatus(): string {
    return this.appService.getAppStatus();
  }
}
