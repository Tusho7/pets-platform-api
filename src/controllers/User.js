import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
  const { email, password, firstName, lastName, phoneNumber } = req.body;
  const { file } = req;

  if (!email || !password || !firstName || !lastName || !phoneNumber) {
    return res.status(400).json({ message: "ყველა ველი აუცილებელია." });
  }
  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "ელ-ფოსტა გამოყენებულია." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const profilePicturePath = file
      ? "profile-pictures/" + file.filename
      : "profile-pictures/default.png";

    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      profilePicture: profilePicturePath,
      phoneNumber,
    });

    await newUser.save();

    res.status(201).json({ message: "ყველა ველი აუცილებელია." });
  } catch (error) {
    console.error("დაფიქსირდა შეცდომა:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password)
      return res.status(400).json({ message: "ყველა ველი აუცილებელია." });

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "მომხმარემებელი ვერ მოიძებნა." });
    }
    if (user.isBlocked)
      return res
        .status(401)
        .json({ message: "თქვენი მომხმარებელი დაბლოკილია." });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: user.email, id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000,
      secure: true,
    });

    res.status(200).json({ id: user.id });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutUser = async (_, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ message: "Server error" });
  }
};
