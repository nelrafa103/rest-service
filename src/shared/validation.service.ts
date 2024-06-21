import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, retry, timer } from 'rxjs';

@Injectable()
export default class ValidationService {
  constructor() {}
  async validateUrl(url: string) {
    console.log(url);
    return true;
  }
}
