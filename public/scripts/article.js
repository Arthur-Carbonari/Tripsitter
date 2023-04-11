const path = window.location.pathname;

async function main() {
    initializeCommentsSection()
}

// this function initialize the comments section from an article page
async function initializeCommentsSection() {

    // gets the comment form
    const newCommentForm = new SmartForm('newCommentForm', ['body'])

    // gets the conmments container
    const commentsContainer = document.getElementById('commentsContainer')

    // sets the submit event for the form
    newCommentForm.overwriteSubmitEvent(async _e => {

        newCommentForm.clearWarnings()

        try {

            // sends the form data to the comments post
            const resData = await newCommentForm.submitForm(`${path}/comments`, 'POST')

            // if it was a sucess adds the new comment to the current page
            if (resData.sucess) {
                commentsContainer.appendChild(makeCommentElement(resData.newComment))
                return newCommentForm.resetForm()
            }

            // if user not logged in displays the log in form to the user
            if(!resData.loggedIn){
                loginModal.modal('show')
            }

        } catch (error) {
            console.log(error);
        }
    })

    // adds the delete comment function to all the .delete-comment action anchor
    deleteButtons = commentsContainer.querySelectorAll('.delete-comment')

    deleteButtons.forEach( button => {
        button.addEventListener('click', e => deleteComment(e))
    });

}

// this function makes a new comment dom element from an newComment struct
function makeCommentElement(newComment) {

    // creates the element
    const newCommentDiv = document.createElement('div')
    newCommentDiv.classList.add('comment')

    // sets the inner html
    newCommentDiv.innerHTML = `
    <div class="d-flex">
        <div class="flex-shrink-0">
            <img class="rounded-circle" src="https://dummyimage.com/50x50/ced4da/6c757d.jpg" alt="..." />
        </div>
        <div class="ms-3">
            <div class="fw-bold">${newComment.username}</div>
            ${newComment.body}
        </div>
    </div>
    <div class="text-end">
        <small> <a class="text-danger delete-comment" href="!#" value="${newComment._id}">delete</a> | ${new Date(newComment.date).toLocaleString()}</small>
    </div>`

    // add the action listener to the delete button
    newCommentDiv.querySelector('.delete-comment').addEventListener('click', e => deleteComment(e))

    // returns the element
    return newCommentDiv
}

// this function delete a comment from an article
async function deleteComment(e){

    e.preventDefault()

    // send request to delete comment
    const res = await fetch(`${path}/comments`, {
        method : 'DELETE',
        body: JSON.stringify({commentId: e.target.getAttribute('value')}), // the id for the comment is store in the value attribute
        headers: { 'Content-Type': "application/json" }
    })

    const data = await res.json()

    // if it was a sucess removes the comment from the curren page
    if(data.sucess){
        e.target.parentNode.parentNode.parentNode.remove()
    }

}

main()