import { Request, Response, NextFunction } from 'express';
import { CandidateService } from '../services/candidate.service';
import {
  UpdateStatusRequest,
  InviteRequest,
} from '../types/candidate.types';

export class CandidateController {
  private service = new CandidateService();

  async getCandidates(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = String(req.query.search || '');
      const status = String(req.query.status || 'semua');

      console.log('=== GET CANDIDATES ===');
      console.log({
        page,
        limit,
        search,
        status,
      });

      const result = await this.service.getCandidates(
        search,
        status,
        page,
        limit
      );

      return res.status(200).json({
        success: true,
        message: 'Data kandidat berhasil diambil',
        ...result,
      });
    } catch (error: any) {
      console.error('GET CANDIDATES ERROR');
      console.error(error);

      return res.status(500).json({
        success: false,
        message: error?.message || 'Internal Server Error',
      });
    }
  }

  async getCandidateDetail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID tidak valid',
        });
      }

      const candidate =
        await this.service.getCandidateDetail(id);

      if (!candidate) {
        return res.status(404).json({
          success: false,
          message: 'Kandidat tidak ditemukan',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Detail kandidat berhasil diambil',
        data: candidate,
      });
    } catch (error: any) {
      console.error('GET DETAIL ERROR');
      console.error(error);

      return res.status(500).json({
        success: false,
        message: error?.message || 'Internal Server Error',
      });
    }
  }

  async updateStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID tidak valid',
        });
      }

      const { status } =
        req.body as UpdateStatusRequest;

      const validStatuses = [
        'pending',
        'review',
        'interview',
        'accepted',
        'rejected',
      ];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status tidak valid',
        });
      }

      await this.service.updateStatus(id, status);

      return res.status(200).json({
        success: true,
        message: 'Status berhasil diperbarui',
      });
    } catch (error: any) {
      console.error('UPDATE STATUS ERROR');
      console.error(error);

      return res.status(500).json({
        success: false,
        message: error?.message || 'Internal Server Error',
      });
    }
  }

  async inviteCandidate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID tidak valid',
        });
      }

      const inviteData: InviteRequest = req.body;

      if (
        !inviteData.tanggal_interview ||
        !inviteData.lokasi
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Tanggal interview dan lokasi harus diisi',
        });
      }

      const invitation =
        await this.service.inviteCandidate(
          id,
          inviteData
        );

      return res.status(201).json({
        success: true,
        message: 'Undangan interview berhasil dikirim',
        data: invitation,
      });
    } catch (error: any) {
      console.error('INVITE CANDIDATE ERROR');
      console.error(error);

      return res.status(500).json({
        success: false,
        message: error?.message || 'Internal Server Error',
      });
    }
  }
}

export const candidateController =
  new CandidateController();