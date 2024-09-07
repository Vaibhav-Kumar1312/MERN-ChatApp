require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const socketServer = require("./socketServer.js");
const authRoutes = require("./routes/authRoutes.js");
const friendInvitationRoutes = require("./routes/friendInvitationRoutes.js");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/friendInvitation", friendInvitationRoutes);

function connectToMongoDB() {
  try {
    mongoose.connect(
      "mongodb+srv://vaibhavkumar458:YovfPcYEghzN1Skv@cluster0.hy7wkzf.mongodb.net/discord_clone?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("database connected");
  } catch (error) {
    console.log("error occur in conecting to db", error);
  }
}
connectToMongoDB();

const server = app.listen(8000, () => {
  console.log("Server started on port 8000");
});

socketServer.registerSocketServer(server);
