//UTILS

function generateId(length) {
    var id           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var length = characters.length;
    for ( var i = 0; i < length; i++ ) {
      id += characters.charAt(Math.floor(Math.random() * length));
   }
   return id;
}