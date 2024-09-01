import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { TOKEN_SECRET } from "../config.js";
import { createAccessToken } from "../libs/jwt.js";

export const register = async (req, res) => {
  try {
    const { userId, name, email, mobile, password, organization } = req.body;

    const userFound = await User.findOne({ userId });

    if (userFound)
      return res.status(400).json({
        message: ["The user ID is already registered"],
      });

    // hashing the password
    const passwordHash = await bcrypt.hash(password, 10);

    // creating the user
    const newUser = new User({
      userId,
      email,
      name,
      mobile,
      password: passwordHash,
      organization,
    });

    // saving the user in the database
    const userSaved = await newUser.save();

    // create access token
    const token = await createAccessToken({
      id: userSaved._id,
    });

    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV !== "development",
      secure: true,
      sameSite: "none",
    });

    res.json({
      id: userSaved._id,
      userId: userSaved.userId,
      name: userSaved.name,
      email: userSaved.email,
      mobile: userSaved.mobile,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { userId, password, organization } = req.body;
    const userFound = await User.findOne({ userId, organization }).populate(
      "organization"
    );

    if (!userFound)
      return res.status(400).json({
        message: ["The user ID is not registered"],
      });

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(400).json({
        message: ["The password is incorrect"],
      });
    }

    const token = await createAccessToken({
      id: userFound._id,
      userId: userFound.userId,
    });

    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV !== "development",
      secure: true,
      sameSite: "none",
    });

    res.json({
      id: userFound._id,
      userId: userFound.userId,
      name: userFound.name,
      mobile: userFound.mobile,
      email: userFound.email,
      organization: userFound.organization,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.send(false);

  jwt.verify(token, TOKEN_SECRET, async (error, user) => {
    if (error) return res.sendStatus(401);

    const userFound = await User.findById(user.id).populate("organization");
    if (!userFound) return res.sendStatus(401);

    return res.json({
      id: userFound._id,
      userId: userFound.userId,
      name: userFound.name,
      mobile: userFound.mobile,
      email: userFound.email,
      organization: userFound.organization,
    });
  });
};

export const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
  });
  return res.sendStatus(200);
};
