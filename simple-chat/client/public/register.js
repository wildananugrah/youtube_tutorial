
function handleRegisterSubmit(e){
    e.preventDefault();

    let data = {
        'email': $("#email").val(),
        'password': $("#password").val()
    }

    $.ajax({
        url: `https://${window.location.hostname}:3000/users/register`,
        data: JSON.stringify(data),
        type: 'POST',
        contentType: 'application/json',
        success: function(response, textStatus, xhr){
            console.log(response)
            alert(response.message)
        },
        error: function(xhr,status,error){
            console.log(`status: ${xhr.status}, error: ${error}`)
            console.log(xhr.responseJSON.message)
            alert(xhr.responseJSON.message)
        }
    })
}

$(function(){
    $("form").submit(handleRegisterSubmit)
})