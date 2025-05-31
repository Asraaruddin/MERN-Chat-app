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

const server  =  app.listen(PORT, () => console.log(`Server started on Port ${PORT}`));

const io = require('socket.io')(server,{
  pingTimeout:60000,
  cors:{
    origin:"http://localhost:3000",
  },
})
io.on("connection",(socket)=>{
  console.log("connected to socket.io");
  socket.on('setup',(userData)=>{
    socket.join(userData._id);
    socket.emit('connected');
  });
  socket.on('join chat',(room)=>{
    socket.join(room);
    console.log("User JOINED Room:" +room);
  });
  socket.on("new message",(newMessageRecieved)=>{
    var chat = newMessageRecieved.chat;

    if(!chat.users) return console.log("chat.users not defined");
    chat.users.forEach(user=>{
      if(user._id===newMessageRecieved.send._id) return;

      socket.in(user._id).emit("message recieved",newMessageRecieved);
    })
  });
  socket.off("setup",()=>{
    console.log("User disconnected");
    socket.leave(userData._id)
  })
})