import StreetPet from "../models/StreetPets.js";
import User from "../models/User.js";
import { deleteImageFileForStreetPets } from "../utils/multer.js";

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

export const getStreetPetsBytUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const streetPets = await StreetPet.findAll({
      where: {
        userId,
      },
      include: User,
    });

    return res.status(200).json(streetPets);
  } catch (error) {
    console.error("Error getting StreetPets:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const deleteStreetPetByUserId = async (req, res) => {
  const { userId, petId } = req.params;

  try {
    const pet = await StreetPet.findOne({ where: { id: petId, userId } });

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    await pet.destroy();

    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (error) {
    console.error("Error deleting StreetPet:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const updateStreetPetByUserId = async (req, res) => {
  const { userId } = req.params;
  const { id: petId, ...updateData } = req.body;

  try {
    const pet = await StreetPet.findOne({
      where: { id: petId, userId: userId },
    });

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    await pet.update(updateData);

    res.status(200).json({ message: "Pet updated successfully", pet });
  } catch (error) {
    console.error("Error updating StreetPet:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const uploadStreetPetImages = async (req, res) => {
  const { petId, userId } = req.params;

  try {
    const pet = await StreetPet.findOne({ where: { id: petId } });

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
      images.map((file) => "street-pet-images/" + file.filename)
    );

    await pet.update({ images: updatedImages });

    res.status(200).json({ message: "Images uploaded successfully", pet });
  } catch (error) {
    console.error("Error uploading StreetPet images:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteStreetPetImageByFilename = async (req, res) => {
  const { petId, filename, userId } = req.params;

  try {
    if (!petId || !filename || !userId) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    const pet = await StreetPet.findOne({ where: { id: petId } });

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

    deleteImageFileForStreetPets(filename);

    res.status(200).json({ message: "Image deleted successfully", pet });
  } catch (error) {
    console.error("Error deleting StreetPet image:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
