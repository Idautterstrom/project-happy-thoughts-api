import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

//Change below for new project
const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    minLenght: 4,
    maxlenght: 300,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Thought = mongoose.model("Thought", ThoughtSchema);

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: "desc" }).limit();
    res.status(200).json({ response: thoughts, success: true });
  } catch (error) {
    res.status(400).json({ message: "no thoughts here", success: false });
  }
});

app.post("/thoughts", async (req, res) => {
  const { message } = req.body;

  try {
    const thought = await new Thought({ message: message }).save();
    res.status(201).json(thought);
  } catch (error) {
    res
      .status(400)
      .json({ message: "not possible to save thought", success: false });
  }
});

app.post("/members/:id/like", async (req, res) => {
  const { id } = req.params;

  try {
    const thought = await Thought.findByIdAndUpdate(
      { _id: id },
      { $inc: { hearts: 1 } },
      { new: true }
    );
    res.status(200).json(thought);
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
