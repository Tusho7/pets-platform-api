import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

const Lostpet = sequelize.define(
  "LostPet",
  {
    breed: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("male", "female", "ხვადი", "ძუ"),
      allowNull: false,
      validate: {
        isIn: [["male", "female", "ხვადი", "ძუ"]],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    help: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    account_number: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      validate: {
        ifHelpHasAccount(val) {
          if (this.help === true && (!val || val.length === 0)) {
            throw new Error(
              "When 'help' is true, account_number must be provided."
            );
          }
        },
      },
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    aggresive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM("lost", "found", "დაკარგული", "ნაპოვნი"),
      validate: {
        isIn: [["lost", "found", "დაკარგული", "ნაპოვნი"]],
      },
      allowNull: false,
    },
    languageCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: "language_code",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      validate: {
        isArrayOfStrings(val) {
          if (val && !val.every((item) => typeof item === "string")) {
            throw new Error("Images must be an array of strings.");
          }
        },
      },
    },
    videos: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      validate: {
        isArrayOfStrings(val) {
          if (val && !val.every((item) => typeof item === "string")) {
            throw new Error("Videos must be an array of strings.");
          }
        },
      },
    },
  },
  {
    tableName: "lost_pets",
    timestamps: false,
  }
);

Lostpet.belongsTo(User, {
  foreignKey: "userId",
});
User.hasMany(Lostpet, {
  foreignKey: "userId",
});

export default Lostpet;
