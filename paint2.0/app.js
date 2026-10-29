const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const socket = io("http://localhost:3000");

const w = canvas.width;
const h = canvas.height;

const mouse = { x: 0, y: 0 };
let draw = false;

// Настройки рисования
context.lineWidth = 2;
context.lineCap = "round";
context.lineJoin = "round";
context.strokeStyle = "black";

// Получаем координаты мыши относительно canvas
function getMousePosition(e) {
    const rect = canvas.getBoundingClientRect();

    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

// Начало рисования
canvas.addEventListener("mousedown", function (e) {

    mouse.x = getMousePosition(e).x;
    mouse.y = getMousePosition(e).y;

    draw = true;

    context.beginPath();
    context.moveTo(mouse.x, mouse.y);

    // Отправляем событие начала рисования
    socket.emit("draw-start", {
        x: mouse.x,
        y: mouse.y
    });
});

// Перемещение мыши
canvas.addEventListener("mousemove", function (e) {

    if (!draw) return;

    const position = getMousePosition(e);

    mouse.x = position.x;
    mouse.y = position.y;

    context.lineTo(mouse.x, mouse.y);
    context.stroke();

    // Отправляем координаты другим пользователям
    socket.emit("draw", {
        x: mouse.x,
        y: mouse.y
    });
});

// Завершение рисования
function stopDrawing() {

    if (!draw) return;

    draw = false;

    context.closePath();

    socket.emit("draw-end");
}

canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);

socket.on("draw-start", function (data) {

    context.beginPath();
    context.moveTo(data.x, data.y);
});

socket.on("draw", function (data) {

    context.lineTo(data.x, data.y);
    context.stroke();
});

socket.on("draw-end", function () {

    context.closePath();
});