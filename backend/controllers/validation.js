module.exports.Regex = Object.freeze({
    USERNAME      : /^(\w|-){1,32}$/,
    NICKNAME      : /^[\w\- .]{1,32}$/,
    EMAIL         : /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    WEAK_PASSWD   : /^(\w|-|\.){8,32}$/,
    STRONG_PASSWD : /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,32})/
});