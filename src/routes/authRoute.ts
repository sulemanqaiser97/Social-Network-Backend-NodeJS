import { Router, Request, Response, NextFunction } from "express";
import User from "../models/user_model";
import bcrypt from "bcrypt";
import { signAccessToken } from "../helper/jwt_helper";
import {
  authSchemaValidation,
  loginSchemaValidation,
} from "../helper/validation_schema";
import { config } from "../config/config";

const authRouter = Router();

authRouter.get("/register", (req: Request, res: Response) => {
  res.render("register.ejs");
});

authRouter.get("/", (req: Request, res: Response) => {
  res.render("login.ejs");
});

authRouter.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email, password } =
        await authSchemaValidation.validateAsync(req.body);

      const newUser = new User({
        username: username,
        email: email,
        password: password,
      });
      const user = await newUser.save();

      const accessToken = await signAccessToken(user._id.toString());
      res.redirect("/");
      //res.status(200).json({ user, accessToken });
    } catch (error: any) {
      if (error.isJoi === true) return res.status(442).json({ message: error });
      if (error.code === 11000)
        return res
          .status(400)
          .json({ message: `Username/Password already exist.` });
      res.status(500).json({ message: error });
    }
  }
);

authRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { username, password } = await loginSchemaValidation.validateAsync(
      req.body
    );

    const user = await User.findOne({ username });
    if (user === null) {
      return res.status(404).json({ message: `user not found` });
    }

    const validPassword = await bcrypt.compare(password, user!.password);
    if (validPassword === false) {
      return res.status(401).json({ message: `Invalid Password` });
    }
    const accesstoken = await signAccessToken(user._id.toString());
    //res.status(200).json({ message: `logged in`, accesstoken });

    if (user.subscriptionEnabled == true) {
      res.render("timeline.ejs", {
        userId: user._id,
        username: user.username,
        accesstoken: accesstoken,
      });
    } else {
      res.render("payment.ejs", {
        userId: user._id,
        accesstoken: accesstoken,
        key: config.stripe.PUBLISHABLE_KEY,
      });
    }
  } catch (error: any) {
    if (error.isJoi === true) return res.status(400).json({ message: error });
    res.status(500).json({ message: error });
  }
});

authRouter.get("/gettoken", async (req: Request, res: Response) => {
  try {
    const { username, password } = await loginSchemaValidation.validateAsync(
      req.body
    );

    const user = await User.findOne({ username });
    if (user === null) {
      return res.status(404).json({ message: `user not found` });
    }

    const validPassword = await bcrypt.compare(password, user!.password);
    if (validPassword === false) {
      return res.status(401).json({ message: `Invalid Password` });
    }
    const accesstoken = await signAccessToken(user._id.toString());
    res.status(200).json({ message: `logged in`, accesstoken });
  } catch (error: any) {
    if (error.isJoi === true) return res.status(400).json({ message: error });
    res.status(500).json({ message: error });
  }
});

export { authRouter };
