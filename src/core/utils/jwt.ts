import jwt from "jsonwebtoken";

const SECRET = "SECRET_KEY";

export const generateToken = (payload: any) => {
  return jwt.sign(payload, SECRET, { expiresIn: "1d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET);
};