import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
app.use(cors());
app.use(express.json());
const uri = "mongodb+srv://jimenopppppp:Shishir_123@joyverse.g0ptnwm.mongodb.net/?retryWrites=true&w=majority&appName=joyverse";


// 1️⃣ MONGOOSE CONNECTION SETUP
mongoose.connect('mongodb://localhost:27017/joyverse', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// 2️⃣ SCHEMAS
const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
  isSuperAdmin: Boolean,
});

const childSchema = new mongoose.Schema({
  username: String,
  password: String,
  hint: String,
  adminId: String,
});

const scoreSchema = new mongoose.Schema({
  childId: String,
  score: Number,
  timestamp: { type: Date, default: Date.now },
});

const feedbackSchema = new mongoose.Schema({
  adminId: String,
  childId: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});

// 3️⃣ MODELS
const Admin = mongoose.model('Admin', adminSchema);
const Child = mongoose.model('Child', childSchema);
const Score = mongoose.model('Score', scoreSchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);

// 4️⃣ ROUTES

// ADMIN ROUTES
app.get('/api/admins', async (req, res) => {
  const admins = await Admin.find({}, '-password');
  res.json(admins);
});

app.post('/api/admins', async (req, res) => {
  const { username, password } = req.body;
  const exists = await Admin.findOne({ username });
  if (exists) return res.status(400).json({ error: 'Username already exists' });

  const newAdmin = new Admin({ username, password, isSuperAdmin: false });
  await newAdmin.save();
  res.json({ id: newAdmin._id, username, isSuperAdmin: false });
});

app.post('/api/admins/delete', async (req, res) => {
  const { username } = req.body;
  console.log(`🔁 POST delete request received for admin: ${username}`);

  try {
    const deletedAdmin = await Admin.findOneAndDelete({ username });
    if (!deletedAdmin) {
      console.log(`❌ No admin found with username: ${username}`);
      return res.status(404).json({ error: 'Admin not found' });
    }

    console.log(`✅ Deleted admin: ${username}`);
    res.json({ success: true });
  } catch (err) {
    console.error(`🔥 Error deleting admin (${username}):`, err);
    res.status(500).json({ error: 'Server error' });
  }
});



// AUTH ROUTE
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username, password });
    if (admin) return res.json({ role: 'admin' });

    const child = await Child.findOne({ username, password });
    if (child) return res.json({ role: 'user' });

    return res.status(401).json({ error: 'Invalid username or password' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// CHILDREN ROUTES
app.get('/api/children', async (req, res) => {
  const { adminId } = req.query;
  let query = {};
  if (adminId) query.adminId = adminId;

  const children = await Child.find(query, '-password');
  res.json(children);
});

app.post('/api/children', async (req, res) => {
  const { username, password, hint, adminId } = req.body;
  const exists = await Child.findOne({ username });
  if (exists) return res.status(400).json({ error: 'Username already exists' });

  const newChild = new Child({ username, password, hint, adminId });
  await newChild.save();
  res.json({ id: newChild._id, username, hint, adminId });
});

// GAME SCORES
app.post('/api/scores', async (req, res) => {
  const { childId, score } = req.body;
  const newScore = new Score({ childId, score });
  await newScore.save();
  res.json(newScore);
});

app.get('/api/scores', async (req, res) => {
  const { childId } = req.query;
  let query = {};
  if (childId) query.childId = childId;

  const scores = await Score.find(query);
  res.json(scores);
});

// FEEDBACK
app.post('/api/feedback', async (req, res) => {
  const { adminId, childId, message } = req.body;
  const newFeedback = new Feedback({ adminId, childId, message });
  await newFeedback.save();
  res.json(newFeedback);
});

app.get('/api/feedback', async (req, res) => {
  const feedbacks = await Feedback.find();
  res.json(feedbacks);
});

// SERVER LISTEN
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
