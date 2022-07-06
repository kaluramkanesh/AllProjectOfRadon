
// <=======================validation Function=================================================>
const isvalid = function (value) {
    if (typeof value === undefined || typeof value === null) return false
    if (typeof value === String ) return false
    return true
}


