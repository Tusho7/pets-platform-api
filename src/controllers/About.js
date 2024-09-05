import About from "../models/About.js";

export const createAbout = async (req, res) => {
  const {
    title,
    introductionOverview,
    missionStatement,
    historyBackground,
    foundingStory,
    features,
    howItWorks,
    languageCode,
  } = req.body;

  if (!title || !introductionOverview || !languageCode) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newAbout = await About.create({
      title,
      introductionOverview,
      missionStatement,
      historyBackground,
      foundingStory,
      features,
      howItWorks,
      languageCode,
    });

    res.status(201).json(newAbout);
  } catch (error) {
    console.error("Error creating About:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAboutUs = async (req, res) => {
  try {
    const languageCode = req.query.language || "";
    const aboutUs = await About.findAll({
      where: { languageCode },
    });
    res.json(aboutUs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching About Us", error });
  }
};