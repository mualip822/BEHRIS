import { Request, Response } from "express";

import { ApplyService } from "../services/apply.service";

export class ApplyController {


  // =====================================
  // CREATE APPLY
  // =====================================

  static async create(
    req: any,
    res: Response
  ) {
    try {

      const userId: string =
        req.user?.id;


      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }


      const files =
        req.files as {
          cv?: Express.Multer.File[];
          ijazah?: Express.Multer.File[];
          transkrip?: Express.Multer.File[];
          pendukung?: Express.Multer.File[];
        };


      const {
        lowongan_id,
        ...formData
      } = req.body;



      const result =
        await ApplyService.apply(
          userId,              // UUID
          Number(lowongan_id),
          formData,
          files
        );


      return res.status(201).json({
        success: true,
        message:
          "Lamaran berhasil dikirim",
        data: result,
      });


    } catch (error:any) {

      console.log(
        "CREATE APPLY ERROR:",
        error
      );


      return res.status(400).json({
        success:false,
        message:
          error.message ||
          "Gagal mengirim lamaran",
      });
    }
  }



  // =====================================
  // MY APPLICATIONS
  // =====================================

  static async myApplications(
    req:any,
    res:Response
  ){

    try {

      const userId:string =
        req.user?.id;


      if(!userId){
        return res.status(401).json({
          success:false,
          message:"Unauthorized"
        });
      }


      const data =
        await ApplyService.getMyApplications(
          userId        // UUID
        );


      return res.status(200).json({
        success:true,
        data
      });


    }catch(error:any){

      console.log(
        "MY APPLICATION ERROR:",
        error
      );


      return res.status(500).json({
        success:false,
        message:
          error.message ||
          "Internal server error"
      });
    }
  }



  // =====================================
  // DETAIL APPLICATION
  // =====================================

  static async detail(
    req:Request,
    res:Response
  ){

    try {

      const id =
        Number(req.params.id);


      const data =
        await ApplyService.getById(
          id
        );


      return res.status(200).json({
        success:true,
        data
      });


    }catch(error:any){

      console.log(
        "DETAIL APPLICATION ERROR:",
        error
      );


      return res.status(404).json({
        success:false,
        message:
          error.message ||
          "Data tidak ditemukan"
      });
    }
  }

}