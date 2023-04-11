// front end script responsible for operating the login and register form logic

const loginForm = document.getElementById('loginForm')
const loginUserInputs = loginForm.querySelectorAll('.form-key')

const loginModal = $('#loginModal')

// add event listener on submit
loginForm.addEventListener('submit', async (e) => {

    e.preventDefault()

    const userCredentials = {}

    // gets data from the form field and remove all existing warning from them
    loginUserInputs.forEach(input => {

        input.classList.remove('is-invalid')

        userCredentials[input.name] = input.value
    })

    try {
        // send request to the auth login route
        const res = await fetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify(userCredentials),
            headers: { 'Content-Type': "application/json" }
        })

        const data = await res.json()

        // request was a sucess and user was created go to the main page
        if (data['sucess']) return location.assign('/')

        // request wasnt a sucess, we add the respective errors to theirs input field
        addErrorsToInputFields(loginUserInputs, data)

    } catch (err) {
        console.log(err)
    }

})

// get the register form and its input fields

const registerUserForm = document.getElementById('registerForm')
const registerUserInputs = registerUserForm.querySelectorAll('.form-key')

// add event to it on submit
registerUserForm.addEventListener('submit', async (e) => {

    e.preventDefault()

    // check if password matchs confirm password field if they dont warn the user
    if (registerUserForm.password.value != registerUserForm.confirmPassword.value) {
        registerUserForm.password.classList.add('is-invalid')
        registerUserForm.password.nextElementSibling.innerHTML = "Password fields do not match"
        return
    }

    const newUser = {}
    
    // removes existing warnings and get the value from the form fields
    registerUserInputs.forEach(input => {
        input.classList.remove('is-invalid')

        newUser[input.name] = input.value
    })

    try {

        // send request to the signup route
        const res = await fetch('/auth/signup', {
            method: 'POST',
            body: JSON.stringify(newUser),
            headers: { 'Content-Type': "application/json" }
        })

        const data = await res.json()

        // request was a sucess and user was created go to the main page
        if (data['sucess']) return location.assign('/')

        // request wasnt a sucess, we check response object for what fields have an error message and add the is-invalid class and the error message to them
        addErrorsToInputFields(registerUserInputs, data)

    } catch (err) {
        console.log(err)
    }

})


// this function iterate through the input and add any error that for it to it and its sub div element
function addErrorsToInputFields(inputFields, errors) {

    inputFields.forEach(field => {

        if (errors[field.name]) {
            field.classList.add('is-invalid')
            field.nextElementSibling.innerHTML = errors[field.name].message
        }
    })

}

