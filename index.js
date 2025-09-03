const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const Appointment = require('./models/Appointment');
const path = require('path');
const Doctor = require('./models/Doctor');

const app = express();
const port = process.env.PORT || 3000;

// Database connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/medical_consultancy';
mongoose.connect(mongoUri)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB:', err));

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.post('/users/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user.' });
    }
});

app.post('/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        res.status(200).json({ message: 'User logged in successfully!', userId: user._id }); // Respond with user ID
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Error logging in user.' });
    }
});

app.post('/appointments', async (req, res) => {
    try {
        const { userId, doctorName, date, time } = req.body;

        // Validate userId and doctorId
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ message: 'Invalid userId.' });
        }

        // Fetch user details
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const appointment = new Appointment({
            userId: new mongoose.Types.ObjectId(userId),
            userName: user.name,
            userEmail: user.email,
            doctorName,
            date,
            time
        });

        await appointment.save();
        res.status(201).json({ message: 'Appointment booked successfully!' });
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ message: 'Error booking appointment.' });
    }
});


app.get('/appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Error fetching appointments.' });
    }
});


// Helper to escape regex special characters
function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

app.post('/doctorSignUp/doctor-login', async (req, res) => {
    try {
        const rawName = typeof req.body.name === 'string' ? req.body.name : '';
        const rawPassword = typeof req.body.password === 'string' ? req.body.password : '';

        const name = rawName.trim();
        const password = rawPassword.trim();

        // Case-insensitive exact match on name
        const nameRegex = new RegExp(`^${escapeRegex(name)}$`, 'i');
        const user = await Doctor.findOne({ name: nameRegex });

        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        res.status(200).json({ message: 'Doctor logged in successfully!', userId: user._id });
    } catch (error) {
        console.error('Error logging in doctor:', error);
        res.status(500).json({ message: 'Error logging in doctor.' });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});












