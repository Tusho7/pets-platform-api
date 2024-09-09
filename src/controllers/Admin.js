import Admin from "../models/Admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const createAdmin = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: "ყველა ველი აუცილებელია." });
  }
  try {
    const adminExists = await Admin.findOne({ where: { email } });
    if (adminExists) {
      return res.status(400).json({ message: "ელ-ფოსტა უკვე გამოყენებულია." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      profilePicture: "profile-pictures/default.png",
    });

    await newAdmin.save();

    res.status(201).json({ message: "რეგსიტრაცია წარმატებით დასრულდა." });
  } catch (error) {
    console.error("დაფიქსირდა შეცდომა:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAdmin = async (req, res) => {
  try {
    const adminId = req.admin?.id;
    const admin = await Admin.findByPk(adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json(admin);
  } catch (error) {
    console.error("Error getting admin:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password)
      return res.status(400).json({ message: "ყველა ველი აუცილებელია." });

    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return res.status(401).json({ message: "ადმინი ვერ მოიძებნა." });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: admin.email, id: admin.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000,
      secure: true,
    });

    res.status(200).json({ id: admin.id });
  } catch (error) {
    console.error("Error logging in admin:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutAdmin = async (_, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out admin:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateAdmin = async (req, res) => {
  const { email, firstName, lastName, password } = req.body;
  const adminId = req.admin?.id;

  try {
    const admin = await Admin.findByPk(adminId);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (email !== undefined) {
      admin.email = email;
    }

    if (firstName !== undefined) {
      admin.firstName = firstName;
    }
    if (lastName !== undefined) {
      admin.lastName = lastName;
    }
    if (password !== undefined) {
      const hashedPassword = await bcrypt.hash(password, 10);
      admin.password = hashedPassword;
    }

    await admin.save();

    res.status(200).json(admin);
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

export const toggleBlockUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({ message: "User blocked status updated" });
  } catch (error) {
    console.error("Error blocking user:", error);
    res.status(500).json({ message: "Server error" });
  }
};
