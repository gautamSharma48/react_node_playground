const {createServer} = require("http");
const {Server} = require("socket.io");


const httpServer = createServer();
const socket = new Server(httpServer,{
    cors: "http://127.0.0.1:5500/"
});


socket.on("connection", (socket)=>{

    socket.emit("message","hello"); // create a socket event

    socket.on("message",(data)=>{ // listen a socket event
        console.log(data)
    })
})


httpServer.listen(3000, ()=>{
    console.log(`server started`);
})
