
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
            alert(response.message)
        },
        error: function(xhr,status,error){
            console.log(`status: ${xhr.status}, error: ${error}`)
            alert(error.message)
        }
    })
}

$(function(){
    $("form").submit(handleRegisterSubmit)
})