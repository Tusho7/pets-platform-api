import TermsConditions from "../models/TermsConditions.js";

export const createTerms = async (req, res) => {
  const { title, content, languageCode } = req.body;

  if (!title || !content || !languageCode) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newTerms = await TermsConditions.create({
      title,
      content,
      languageCode,
    });

    res.status(201).json(newTerms);
  } catch (error) {
    console.error("Error creating Terms:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTerms = async (req, res) => {
  try {
    const languageCode = req.query.language || "";
    const terms = await TermsConditions.findAll({
      where: { languageCode },
    });
    res.json(terms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Terms", error });
  }
};

export const editTermsById = async (req, res) => {
  const { title, content, languageCode } = req.body;
  const { id } = req.params;

  try {
    const term = await TermsConditions.findByPk(id);
    if (!term) {
      return res.status(404).json({ message: "Term not found" });
    }

    term.title = title;
    term.content = content;
    term.languageCode = languageCode;

    await term.save();

    res.json(term);
  } catch (error) {
    console.error("Error updating Term:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTermById = async (req, res) => {
  try {
    const { id } = req.params;
    const term = await TermsConditions.findByPk(id);
    if (!term) {
      return res.status(404).json({ message: "Term not found" });
    }
    await term.destroy();
    res.json({ message: "Term deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Term", error });
  }
};
