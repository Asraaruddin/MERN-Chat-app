const express = require("express");
const dotenv = require("dotenv");
dotenv.config(); 
const cors = require("cors");        // require cors at top
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require("./routes/chatRoutes")
const messageRoutes = require("./routes/messageroutes")
const {notFound,errorHandler} = require('./middleware/errorMiddleware')


connectDB();
const app = express();

app.use(express.json()) //to  accept JSON Data 

app.use(cors());                     // use cors BEFORE routes

app.get("/", (req, res) => {
  res.send("API is running successfully ");
});

app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes)
app.use('/api/message',messageRoutes)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on Port ${PORT}`));
