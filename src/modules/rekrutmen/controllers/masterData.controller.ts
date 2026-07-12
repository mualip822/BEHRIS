// src/modules/rekrutmen/controllers/masterData.controller.ts

import { Request, Response } from "express";

import { MasterDataService }
from "../services/masterData.service";

export class MasterDataController {

  // =====================================================
  // CATEGORY
  // =====================================================

  static async getCategories(req: Request, res: Response) {

    try {

      const result =
        await MasterDataService.getCategories();

      res.json({
        success: true,
        data: result
      });

    } catch (err: any) {

      res.status(500).json({
        success: false,
        message: err.message
      });

    }
  }

  static async getCategoryById(
    req: Request,
    res: Response
  ) {

    try {

      const id = Number(req.params.id);

      const result =
        await MasterDataService.getCategoryById(id);

      res.json({
        success: true,
        data: result
      });

    } catch (err: any) {

      res.status(404).json({
        success: false,
        message: err.message
      });

    }
  }

  static async createCategory(
    req: Request,
    res: Response
  ) {

    try {

      const result =
        await MasterDataService.createCategory(
          req.body.name
        );

      res.json({
        success: true,
        message: "Kategori berhasil dibuat",
        data: result
      });

    } catch (err: any) {

      res.status(400).json({
        success: false,
        message: err.message
      });

    }
  }

  static async updateCategory(
    req: Request,
    res: Response
  ) {

    try {

      const id = Number(req.params.id);

      const result =
        await MasterDataService.updateCategory(
          id,
          req.body.name
        );

      res.json({
        success: true,
        message: "Kategori berhasil diupdate",
        data: result
      });

    } catch (err: any) {

      res.status(400).json({
        success: false,
        message: err.message
      });

    }
  }

  static async deleteCategory(
    req: Request,
    res: Response
  ) {

    try {

      const id = Number(req.params.id);

      const result =
        await MasterDataService.deleteCategory(id);

      res.json({
        success: true,
        message: "Kategori berhasil dihapus",
        data: result
      });

    } catch (err: any) {

      res.status(400).json({
        success: false,
        message: err.message
      });

    }
  }

  // =====================================================
  // JOB TYPES
  // =====================================================

  static async getJobTypes(req: Request, res: Response) {

    try {

      const result =
        await MasterDataService.getJobTypes();

      res.json({
        success: true,
        data: result
      });

    } catch (err: any) {

      res.status(500).json({
        success: false,
        message: err.message
      });

    }
  }

  static async getJobTypeById(
    req: Request,
    res: Response
  ) {

    try {

      const id = Number(req.params.id);

      const result =
        await MasterDataService.getJobTypeById(id);

      res.json({
        success: true,
        data: result
      });

    } catch (err: any) {

      res.status(404).json({
        success: false,
        message: err.message
      });

    }
  }

  static async createJobType(
    req: Request,
    res: Response
  ) {

    try {

      const result =
        await MasterDataService.createJobType(
          req.body.name
        );

      res.json({
        success: true,
        message: "Tipe pekerjaan berhasil dibuat",
        data: result
      });

    } catch (err: any) {

      res.status(400).json({
        success: false,
        message: err.message
      });

    }
  }

  static async updateJobType(
    req: Request,
    res: Response
  ) {

    try {

      const id = Number(req.params.id);

      const result =
        await MasterDataService.updateJobType(
          id,
          req.body.name
        );

      res.json({
        success: true,
        message: "Tipe pekerjaan berhasil diupdate",
        data: result
      });

    } catch (err: any) {

      res.status(400).json({
        success: false,
        message: err.message
      });

    }
  }

  static async deleteJobType(
    req: Request,
    res: Response
  ) {

    try {

      const id = Number(req.params.id);

      const result =
        await MasterDataService.deleteJobType(id);

      res.json({
        success: true,
        message: "Tipe pekerjaan berhasil dihapus",
        data: result
      });

    } catch (err: any) {

      res.status(400).json({
        success: false,
        message: err.message
      });

    }
  }
}