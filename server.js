require('dotenv').config();
const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');

app.use(express.json());

// // Routes
app.use("/api/", authRoutes);



app.listen(process.env.PORT, () => {
    console.log("Server running on port", process.env.PORT);
});
