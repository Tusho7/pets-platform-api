import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const AboutUs = sequelize.define(
  "AboutUs",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "About Us",
    },
    introductionOverview: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    missionStatement: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    historyBackground: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    foundingStory: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    features: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    howItWorks: {
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
    timestamps: false,
    tableName: "about_us",
  }
);

export default AboutUs;
