const socket = io('https://'+window.location.hostname+':3002', {secure: true});
socket.on('connect', () => {
    console.log("connect.");
    socket.emit('join-room', ROOM_ID, EMAIL)
});

socket.on('user-connected', email => {
    console.log("user connected! " + email)
})

socket.on('server-message-room', (email, message) => {
    console.log(`message from ${email}: ${message}`)
    let child = `<div class="messages right">${email} said: ${message}</div>`
    $("#listMessage").append(child)
})

function handleSendMessage(e){
    e.preventDefault()

    let messageInput = $("#messageInput").val()
    let message = `<div class="messages">me said: ${messageInput}</div>`

    $("#listMessage").append(message)
    $("#messageInput").val('')

    socket.emit("client-message-room", ROOM_ID, EMAIL, messageInput)

    $.ajax({
        url: `https://${window.location.hostname}:3000/chats`,
        data: JSON.stringify({ roomId: ROOM_ID, sentBy: EMAIL, message: messageInput }),
        type: 'POST',
        contentType: 'application/json',
        success: function(response, textStatus, xhr){
            console.log(response)
        },
        error: function(xhr,status,error){
            console.log(`status: ${xhr.status}, error: ${error}`)
        }
    })

}

const load = () => {
    $.ajax({
        url: `https://${window.location.hostname}:3000/chats/${ROOM_ID}`,
        type: 'GET',
        contentType: 'application/json',
        success: function(response, textStatus, xhr){
            console.log(response.data.length)
            let responseData = response.data
            for(let i = 0; i < responseData.length; i++){
                let message = ''
                if(responseData[i].sentBy == EMAIL)
                {
                    message = `<div class="messages">me said: ${responseData[i].message}</div>`
                } else {
                    message = `<div class="messages right">${responseData[i].sentBy} said: ${responseData[i].message}</div>`
                }
                $("#listMessage").append(message)
            }
        },
        error: function(xhr,status,error){
            console.log(`status: ${xhr.status}, error: ${error}`)
        }
    })
}

$(function(){

    $("#sendMessageButton").click(handleSendMessage)
    $("#sendMessageForm").submit(handleSendMessage)

    load()

})