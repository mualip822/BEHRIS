import { Response } from "express";

import { ZodError } from "zod";

import { ProfileService } from "../services/profile.service";

import { updateProfileSchema } from "../validations/profile.validation";

export class ProfileController {
  static async getProfile(
    req: any,
    res: Response
  ) {
    try {
      const userId = req.user.id;

      const profile =
        await ProfileService.getProfile(
          userId
        );

      return res.status(200).json({
        success: true,
        data: profile || null,
      });
    } catch (error: any) {

      console.log(
        "GET PROFILE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Internal server error",
      });
    }
  }

  static async saveProfile(
    req: any,
    res: Response
  ) {
    try {

      console.log("BODY:", req.body);

      console.log("FILE:", req.file);

      const userId = req.user.id;

      const validated =
        updateProfileSchema.parse(
          req.body
        );

      const profile =
        await ProfileService.saveProfile(
          userId,
          validated,
          req.file
        );

      return res.status(200).json({
        success: true,
        message:
          "Profile berhasil disimpan",
        data: profile,
      });

    } catch (error: any) {

      console.log(
        "SAVE PROFILE ERROR:",
        error
      );

      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation Error",
         errors: error.issues,
        });
      }

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Internal server error",
      });
    }
  }

  static async deleteProfile(
    req: any,
    res: Response
  ) {
    try {
      const userId = req.user.id;

      await ProfileService.deleteProfile(
        userId
      );

      return res.status(200).json({
        success: true,
        message:
          "Profile berhasil dihapus",
      });

    } catch (error: any) {

      console.log(
        "DELETE PROFILE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Internal server error",
      });
    }
  }
}