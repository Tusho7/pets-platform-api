import Lostpet from "../models/LostPet.js";
import User from "../models/User.js";
import {
  deleteImageFile,
  deleteVideoFileForLostPets,
} from "../utils/multer.js";

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
      videos: videos.map((file) => "lost-pet-videos/" + file.filename),
    });

    return res.status(201).json(lostPet);
  } catch (error) {
    console.error("Error creating LostPet:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getLostPets = async (req, res) => {
  try {
    const lostPets = await Lostpet.findAll({
      include: User,
    });

    return res.status(200).json(lostPets);
  } catch (error) {
    console.error("Error getting LostPets:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getLostPetsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const lostPets = await Lostpet.findAll({
      where: { userId },
      include: User,
    });

    return res.status(200).json(lostPets);
  } catch (error) {
    console.error("Error getting LostPets:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const updateLostPetByUserId = async (req, res) => {
  const { userId } = req.params;
  const { id: petId, ...updateData } = req.body;

  try {
    const pet = await Lostpet.findOne({ where: { id: petId, userId: userId } });

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    await pet.update(updateData);

    res.status(200).json({ message: "Pet updated successfully", pet });
  } catch (error) {
    console.error("Error updating LostPet:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const deleteLostPetByUserId = async (req, res) => {
  const { userId, petId } = req.params;

  try {
    const pet = await Lostpet.findOne({ where: { id: petId, userId } });

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    await pet.destroy();

    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (error) {
    console.error("Error deleting LostPet:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const deleteLostPetImageByFilename = async (req, res) => {
  const { petId, filename, userId } = req.params;

  try {
    if (!petId || !filename || !userId) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    const pet = await Lostpet.findOne({ where: { id: petId } });

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    if (parseInt(userId, 10) !== pet.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const oldImages = pet.images || [];
    const updatedImages = oldImages.filter(
      (image) => !image.endsWith(filename)
    );

    await pet.update({ images: updatedImages });

    deleteImageFile(filename);

    res.status(200).json({ message: "Image deleted successfully", pet });
  } catch (error) {
    console.error("Error deleting LostPet image:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadLostPetImages = async (req, res) => {
  const { petId, userId } = req.params;

  try {
    const pet = await Lostpet.findOne({ where: { id: petId } });

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    if (parseInt(userId, 10) !== pet.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const images = req.files?.images || [];

    if (!images.length) {
      return res.status(400).json({ message: "No images provided" });
    }

    const updatedImages = pet.images.concat(
      images.map((file) => "lost-pet-images/" + file.filename)
    );

    await pet.update({ images: updatedImages });

    res.status(200).json({ message: "Images uploaded successfully", pet });
  } catch (error) {
    console.error("Error uploading LostPet images:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadLostPetVideos = async (req, res) => {
  const { petId, userId } = req.params;

  try {
    const pet = await Lostpet.findOne({ where: { id: petId } });

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    if (parseInt(userId, 10) !== pet.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const videos = req.files?.videos || [];

    if (!videos.length) {
      return res.status(400).json({ message: "No videos provided" });
    }

    const updatedVideos = pet.videos.concat(
      videos.map((file) => "lost-pet-videos/" + file.filename)
    );

    await pet.update({ videos: updatedVideos });

    res.status(200).json({ message: "Videos uploaded successfully", pet });
  } catch (error) {
    console.error("Error uploading LostPet videos:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteLostPetVideoByFilename = async (req, res) => {
  const { petId, filename, userId } = req.params;

  try {
    if (!petId || !filename || !userId) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    const pet = await Lostpet.findOne({ where: { id: petId } });

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    if (parseInt(userId, 10) !== pet.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const oldVideos = pet.videos || [];
    const updatedVideos = oldVideos.filter(
      (video) => !video.endsWith(filename)
    );

    await pet.update({ videos: updatedVideos });

    deleteVideoFileForLostPets(filename);

    res.status(200).json({ message: "Video deleted successfully", pet });
  } catch (error) {
    console.error("Error deleting LostPet video:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
