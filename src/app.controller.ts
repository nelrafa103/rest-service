import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './app.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
