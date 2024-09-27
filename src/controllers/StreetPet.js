import StreetPet from "../models/StreetPets.js";
import User from "../models/User.js";

export const createStreetPet = async (req, res) => {
  try {
    const {
      breed,
      age,
      gender,
      description,
      pet_name,
      help,
      account_number,
      location,
      aggresive,
      status,
      languageCode,
      userId,
    } = req.body;

    const images = req.files["images"] || [];
    const videos = req.files["videos"] || [];

    if (!images.length && !videos.length) {
      return res.status(400).json({
        message: "At least one image or video must be provided.",
      });
    }

    const streetPet = await StreetPet.create({
      breed,
      age,
      gender,
      description,
      pet_name,
      help,
      account_number: account_number ? account_number.split(", ") : [],
      location,
      aggresive,
      status,
      languageCode,
      userId,
      images: images.map((file) => "street-pet-images/" + file.filename),
      videos: videos.map((file) => "street-pet-videos/" + file.filename),
    });

    return res.status(201).json(streetPet);
  } catch (error) {
    console.error("Error creating StreetPet:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getStreetPets = async (req, res) => {
  try {
    const streetPets = await StreetPet.findAll({
      include: User,
    });

    return res.status(200).json(streetPets);
  } catch (error) {
    console.error("Error getting StreetPets:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
