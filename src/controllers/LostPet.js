import Lostpet from "../models/LostPet.js";

export const createLostPet = async (req, res) => {
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

    const lostPet = await Lostpet.create({
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
      images: images.map((file) => "lost-pet-images/" + file.filename),
      videos: videos.map((file) => "lost-pet-videos/" + file.path),
    });

    return res.status(201).json(lostPet);
  } catch (error) {
    console.error("Error creating LostPet:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
