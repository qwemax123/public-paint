const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

io.on("connection", (socket) => {

    console.log("Подключился пользователь:", socket.id);

    socket.on("draw-start", (data) => {
        socket.broadcast.emit("draw-start", data);
    });

    socket.on("draw", (data) => {
        socket.broadcast.emit("draw", data);
    });

    socket.on("draw-end", () => {
        socket.broadcast.emit("draw-end");
    });

    socket.on("disconnect", () => {
        console.log("Пользователь отключился:", socket.id);
    });

});

server.listen(3000, () => {
    console.log("Сервер запущен: http://localhost:3000");
});