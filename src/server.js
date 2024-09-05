import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import sequelize from "./config/database.js";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/User.js";
import adminRoutes from "./routes/Admin.js";
import faqRoutes from "./routes/Faq.js";
import aboutUsRoutes from "./routes/About.js";

const app = express();

dotenv.config();

const corsOptions = {
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

app.use("/api/auth", userRoutes);
app.use("/api/admin-auth", adminRoutes);
app.use("/api", faqRoutes);
app.use("/api", aboutUsRoutes);

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
