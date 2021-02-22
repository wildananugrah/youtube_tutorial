function handleDeleteRoom(roomId){

    let data = { 'roomId': roomId }

    $.ajax({
        url: `https://${window.location.hostname}:3000/rooms`,
        type: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response, textStatus, xhr){
            console.log(response.message)
            loadRoomList()
        },
        error: function(xhr,status,error){
            console.log(`status: ${xhr.status}, error: ${error}`)
        }
    })
}

function handleAddRoom(e){
    e.preventDefault()

    let roomName = $("#roomName").val()
    let data = { 'roomName': roomName }

    $.ajax({
        url: `https://${window.location.hostname}:3000/rooms`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response, textStatus, xhr){
            console.log(response.message)
            $('#addRoomModal').modal('hide')
            loadRoomList()
        },
        error: function(xhr,status,error){
            console.log(`status: ${xhr.status}, error: ${error}`)
        }
    })
}

function loadRoomList(){

    $.ajax({
        url: `https://${window.location.hostname}:3000/rooms`,
        type: 'GET',
        contentType: 'application/json',
        success: function(response, textStatus, xhr){
            let responseJson = response.data
            let sourceTarget = $("#roomList > tbody")
            sourceTarget.empty()
            for(var i = 0; i < responseJson.length; i++)
            {
                sourceTarget.append(`<tr><td>${(i + 1)}</td><td><a href="/rooms/${responseJson[i].roomId}">${responseJson[i].roomName}</a></td><td><a href="#" onclick="handleDeleteRoom('${responseJson[i].roomId}')" style="color: red">delete</a></td></tr>`)
            }
        },
        error: function(xhr,status,error){
            console.log(`status: ${xhr.status}, error: ${error}`)
        }
    })

}

$(function(){
    
    loadRoomList()

    $("#createRoomButton").click(handleAddRoom)
    $("#addRoom").submit(handleAddRoom)

})