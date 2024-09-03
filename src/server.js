import bodyParser from "body-parser";
import express from "express";
import sequelize from "./config/database.js";
import dotenv from "dotenv";
import cors from "cors";

const app = express();

app.use(bodyParser.json());
dotenv.config();

const corsOptions = {
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

sequelize
  .sync()
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log(error);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
