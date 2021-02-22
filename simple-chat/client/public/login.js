
function handleLoginSubmit(e){
    e.preventDefault();

    let data = {
        'email': $("#email").val(),
        'password': $("#password").val()
    }

    $.ajax({
        url: `https://${window.location.hostname}:3000/users/login`,
        data: JSON.stringify(data),
        type: 'POST',
        contentType: 'application/json',
        success: function(response, textStatus, xhr){
            console.log(response)
            window.location.href = "/dashboard"
        },
        error: function(xhr,status,error){
            console.log(`status: ${xhr.status}, error: ${error}`)
        }
    })
}

$(function(){
    $("form").submit(handleLoginSubmit)
})