import speakeasy from "speakeasy";
import QRCode from "qrcode";

// =====================================
// GENERATE SECRET
// =====================================
export const generate2FASecret =
  async (email: string) => {
    const secret =
      speakeasy.generateSecret({
        name: `HRIS (${email})`,
      });

    const qrCode =
      await QRCode.toDataURL(
        secret.otpauth_url!
      );

    return {
      secret: secret.base32,
      qrCode,
    };
  };

// =====================================
// VERIFY OTP
// =====================================
export const verify2FACode = (
  secret: string,
  token: string
) => {
  return speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
    window: 1,
  });
};