const socket = io('http://localhost:3001');
socket.on('connect', () => {
    console.log("connect.");
});

socket.on('server-send-message', (message) => {
    console.log(`message: ${message}`)
})

socket.on('server-send-broadcast', (userId, message) => {
    console.log(`message from ${userId}: ${message}`)
    let child = `<div class="container"><p class="right">${userId} said: ${message}</p></div>`
    $("#listMessage").append(child)
})

$(function () {

    $("#sendMessageButton").click(function () {
        let message = $("#messageText").val()
        let userId = $("#userIdText").val()
        socket.emit("client-send-broadcast", userId, message)
        let child = `<div class="container"><p class="left">${userId} said: ${message}</p></div>`
        $("#listMessage").append(child)
        $("#messageText").val('')
    })

});