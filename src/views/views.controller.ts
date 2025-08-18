import { Controller, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller('admin')
export class ViewsController {
  // Rota principal - serve index.html em /admin
  @Get()
  getAdminIndex(@Res() res: Response) {
    return res.sendFile('index.html', { root: './src/views/public' });
  }

  // Rotas para views específicas - serve qualquer .html sem extensão
  // /admin/rooms -> rooms.html, /admin/settings -> settings.html, etc.
  @Get(':viewName')
  getAdminView(@Param('viewName') viewName: string, @Res() res: Response) {
    const fileName = `${viewName}.html`;
    return res.sendFile(fileName, { root: './src/views/public' });
  }

  // Assets CSS - /admin/assets/styles/main.css
  @Get('assets/styles/:filename')
  getStyleFile(@Param('filename') filename: string, @Res() res: Response) {
    return res.sendFile(filename, { root: './src/views/public/styles' });
  }

  // Assets JavaScript - /admin/assets/scripts/app.js
  @Get('assets/scripts/:filename')
  getScriptFile(@Param('filename') filename: string, @Res() res: Response) {
    return res.sendFile(filename, { root: './src/views/public/scripts' });
  }
}