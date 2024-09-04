import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Faq = sequelize.define(
  "Faq",
  {
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    languageCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: "language_code",
    },
  },
  {
    tableName: "faqs",
    timestamps: false,
  }
);
export default Faq;
