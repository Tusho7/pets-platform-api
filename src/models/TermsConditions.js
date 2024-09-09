import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const TermsConditions = sequelize.define(
  "TermsConditions",
  {
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    content: {
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
    tableName: "terms",
    timestamps: false,
  }
);
export default TermsConditions;
