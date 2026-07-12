import { Request, Response } from "express";

import * as service from "../services/auth.service";

// =====================================
// REGISTER
// =====================================
export const register = async (req: Request, res: Response) => {
  try {
    const user = await service.register(req.body);

    return res.json({
      success: true,
      user,
    });
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// =====================================
// LOGIN
// =====================================
export const login = async (req: Request, res: Response) => {
  try {
    const result = await service.login(
      req.body.email,
      req.body.password
    );

    // ================================
    // kemungkinan response:
    //
    // 1. requires2FASetup
    // 2. requiresOTP
    // ================================
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// =====================================
// LOGIN WITH GOOGLE
// =====================================
export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Google token is required",
      });
    }

    const result = await service.loginWithGoogle(token);

    return res.json(result);
  } catch (err: any) {
    let statusCode = 400;
    let message = err.message;

    // Better error messages for common Google auth issues
    if (message.includes("GOOGLE_CLIENT_ID is not configured")) {
      statusCode = 500;
      message = "Google authentication is not properly configured";
    } else if (message.includes("token verification failed")) {
      statusCode = 401;
      message = "Invalid Google token";
    } else if (message.includes("Email not verified")) {
      statusCode = 403;
      message = "Please verify your email with Google first";
    }

    return res.status(statusCode).json({
      success: false,
      message: message,
    });
  }
};

// =====================================
// VERIFY OTP
// =====================================
export const verifyOTP = async (
  req: Request,
  res: Response
) => {

  try {

    const {
      userUuid,
      otp
    } = req.body;


    console.log("=== VERIFY OTP BODY ===");
    console.log({
      userUuid,
      otp
    });


    const result =
      await service.verifyOTP(
        userUuid,
        otp
      );


    return res.json(result);


  } catch (err:any) {

    return res.status(400).json({
      success:false,
      message:err.message
    });

  }

};
