$(function(){

  $('.modal-action').click(function(){
    var name = $('#new_business_name').val();
    var pw = $('#new_password').val();
    var pw_confirm = $('#new_password_confirm').val();

    if (!name) {
      Materialize.toast('Username is empty!', 3000, 'short-toast');
    } else if (/(\w+(-\w+)*)/.test(name)) {
      Materialize.toast('Username must be lowercase letters connected by hyphens', 3000, 'short-toast');

    }

    if (!pw && !pw_confirm) {
      Materialize.toast('Password is empty', 3000, 'short-toast');
    }
    else if (!(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}/).test(pw)) {
      Materialize.toast('Password must have at least six characters that are letters, numbers or the underscore and at least one number, one lowercase and one uppercase letter.', 3000, 'short-toast');
    } 
    else if (pw != pw_confirm) {
      Materialize.toast('Passwords do not match!', 3000, 'short-toast');
    }




  });
});