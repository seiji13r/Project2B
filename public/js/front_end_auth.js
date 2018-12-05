// Show Login Modal On Button Click
$(document).on("click", ".login-button button", () => {
  $(".login-modal").show();
});

// Show Register Modal on button click
$(document).on("click", ".register-button button", () => {
  $(".register-modal").show();
});

// Hide Login and register modal on close button click
$(document).on("click", ".close", () => {
  $(".register-modal").hide();
  $(".login-modal").hide();
  $(".menu").hide();
});

// The Following Event Listener will Handle the Register Submit Button
$(document).on("click", ".submit-button__register", () => {
  event.preventDefault();
  var data = $("#register-form").serialize();
  console.log(data);
  $.ajax({
    method: "POST",
    url: "/users/register",
    data: data
  })
    .done(response => {
      // Remove Any Remaining Error Message
      $(".register-error-msg").remove();
      console.log(response);
      // Clear the Inputs, hide the Modal and Diplay Success Message
      $(".register-modal").find("input").val("");
      $(".register-modal").hide();
      $(".error-block").html(
        "<div class='alert alert-success'>You Are Now Registered</div>"
      );
      // Wait 2 Seconds before redirecting
      setTimeout(function() {
        window.location.reload();
      }, 3 * 1000);
    })
    .fail(response => {
      // console.log(response);
      // console.log(response.status);
      // console.log(response.responseJSON.errors);

      // The Server will return a status 422 and a JSON with the errors.
      if (response.status === 422) {
        // Remove Any error Msg
        $(".register-error-msg").remove();
        // Iterate Over the Errors in the Form.
        response.responseJSON.errors.forEach(function(elem) {
          // console.log(elem);
          // console.log(".register__" + elem.param);
          var msgDiv = $("<div>");
          msgDiv.addClass("register-error-msg text-danger");
          msgDiv.text(elem.msg);
          $(".register__" + elem.param).append(msgDiv);
        });
      } else {
        // Other Server Response will be printed here.
        console.log(response);
      }
    });
});
