import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller('tests')
export class TestController {
  @Get('rooms')
  getRoomTestPage(@Res() res: Response) {
    return res.sendFile('room-test.html', { 
      root: './requests' 
    });
  }

  @Get('rooms/new')
  getRoomTestPageNew(@Res() res: Response) {
    return res.sendFile('room-test-new.html', { 
      root: './requests' 
    });
  }
}
