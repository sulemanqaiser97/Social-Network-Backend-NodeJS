import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { Request, Response, NextFunction } from "express";

const signAccessToken = (userId: String) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = config.secrets.ACCESS_TOKEN;
    const options: any = {
      expiresIn: "1h",
      issuer: "socialnetwork.com",
      audience: userId,
    };

    jwt.sign(payload, secret, options, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};

const verifySignature = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization?.includes("Bearer "))
    return res.status(401).json({ message: `Unauthorized` });

  const authHeaderToken = req.headers.authorization.split(" ")[1];

  jwt.verify(authHeaderToken, config.secrets.ACCESS_TOKEN, (err, payload) => {
    if (err) return res.status(401).json({ message: `Unauthorized` });
    next();
  });
};

export { signAccessToken, verifySignature };
