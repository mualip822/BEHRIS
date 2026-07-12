import { Response, NextFunction } from 'express';
import { LamaranService } from '../services/lamaran.service';
import type { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role?: string;
  };
}

export class LamaranController {
  private service = new LamaranService();

  async getLamaranSaya(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Token tidak valid atau tidak ditemukan',
        });
      }

      const data = await this.service.getLamaranSaya(userId);
      return res.status(200).json({
        success: true,
        message: 'Data lamaran berhasil diambil',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getDetailLamaran(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Token tidak valid atau tidak ditemukan',
        });
      }

      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID lamaran tidak valid',
        });
      }

      const data = await this.service.getDetailLamaran(id, userId);
      if (!data) {
        return res.status(404).json({
          success: false,
          message: 'Lamaran tidak ditemukan',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Detail lamaran berhasil diambil',
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const lamaranController = new LamaranController();