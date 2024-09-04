import Faq from "../models/Faq.js";

export const createFaq = async (req, res) => {
  const { question, answer, languageCode } = req.body;

  if (!question || !answer || !languageCode) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newFaq = await Faq.create({
      question,
      answer,
      languageCode,
    });

    res.status(201).json(newFaq);
  } catch (error) {
    console.error("Error creating FAQ:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFaqs = async (req, res) => {
  try {
    const languageCode = req.query.language || "";
    const faqs = await Faq.findAll({
      where: { languageCode },
    });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching FAQs", error });
  }
};
