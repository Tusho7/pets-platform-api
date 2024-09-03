import User from "../models/User.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  const { file } = req;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: "ყველა ველი აუცილებელია." });
  }
  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "ელ-ფოსტა გამოყენებულია." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      profilePicture: "profil-pictures/" + file.originalname,
    });

    await newUser.save();

    res.status(201).json({ message: "მომხმარებელი შეიქმნა წარმატებით" });
  } catch (error) {
    console.error("dafiqsirda Secdoma:", error);
    res.status(500).json({ message: "Server error" });
  }
};
