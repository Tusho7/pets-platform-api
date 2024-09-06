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

export const editFaqById = async (req, res) => {
  const { question, answer, languageCode } = req.body;
  const { id } = req.params;

  try {
    const faq = await Faq.findByPk(id);
    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    faq.question = question;
    faq.answer = answer;
    faq.languageCode = languageCode;

    await faq.save();

    res.json(faq);
  } catch (error) {
    console.error("Error updating FAQ:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteFaqById = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await Faq.findByPk(id);
    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }
    await faq.destroy();
    res.json({ message: "FAQ deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting FAQ", error });
  }
};
