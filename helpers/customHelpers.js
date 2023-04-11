// these are the custom helpers used inside handlebars templates where necessary
export default {

    // checks if the delete button should be shown in a comment or not
    showDeleteButton: function (adminRights, username, commentUsername){
        console.log(username, commentUsername);
        return (adminRights || username == commentUsername)
    },

    // parses data to local string
    getLocalDateString: function (date){
        return new Date(date).toLocaleString()
    },

    // checks if x1 is bigger than x2
    gt : function(x1, x2){ return x1 > x2},

    // checks if 2 variables are equal
    equal: function(x1, x2){return x1 == x2},

    // repeates the html code inside it n times
    times: function(n, block){
        let accum = '';
        for (let i = 1; i < n+1; i++) {
          accum += block.fn(i);
        }
        return accum;
    }
}