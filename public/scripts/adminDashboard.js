const registerUserModal = new bootstrap.Modal('#registerUserModal')
const registerUserForm = document.getElementById('registerUserForm')
const registerUserInputs = registerUserForm.querySelectorAll('.form-key')

const updateUserModal = new bootstrap.Modal('#updateUserModal')
const updateUserForm = document.getElementById('updateUserForm')
const updateUserFields = updateUserForm.querySelectorAll('input')

const deleteUserModal = new bootstrap.Modal('#deleteUserModal')
const deleteUserForm = document.getElementById('deleteUserForm')

let table

fetch("/admin/users")
    .then(response => response.json())
    .then(data => {
        $(document).ready(function () {

            table = $('#usersTable').DataTable({

                data: data,
                columns: [
                    { data: '_id', visible: false, searchable: false },
                    { data: 'email' },
                    { data: 'username' },
                    { data: 'firstName' },
                    { data: 'lastName' },
                    { data: 'adminRights' },
                    { data: '' }
                ],
                rowId: '_id',
                columnDefs: [
                    {
                        targets: -1,
                        data: null,
                        defaultContent: '<div class="text-end"> <button class="btn btn-primary edit-button">Edit <i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>' + 
                                        '<button class="btn btn-danger delete-button">Delete <i class="fa fa-trash-o" aria-hidden="true"></i> </button> </div>',
                    },
                ],
                pagingType: "first_last_numbers",
                dom: "<'row align-items-center'<'col-sm-6 my-searchbox'f><'toolbar w-auto text-end flex-grow-1'>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row justify-content-between pt-2'<'col-sm-3'l><'col-sm-5 sub-div-p-0 text-center'i><'col-sm-3'p>>",
            });

            $('div.toolbar').html('<button class="btn btn-primary" id="addUserButton" data-bs-toggle="modal" data-bs-target="#registerUserModal"> Add New User <i class="fa fa-plus" aria-hidden="true"></i> </button>');

            $('#usersTable tbody').on('click', '.edit-button', function () {
                let data = table.row($(this).parents('tr')).data();

                updateUserFields.forEach( field => { 
                    field.value = data[field.name]
                    field.classList.remove('is-invalid')
                })
                updateUserForm.adminRights.checked = data.adminRights

                updateUserModal.show()
            });

            $('#usersTable tbody').on('click', '.delete-button', function () {
                let data = table.row($(this).parents('tr')).data();

                deleteUserForm._id.value = data._id
                deleteUserForm.email.value = data.email
                deleteUserForm.username.value = data.username

                deleteUserModal.show()
            });

        });
    })

registerUserForm.addEventListener('submit', async (e) => {

    e.preventDefault()

    if (registerUserForm.password.value != registerUserForm.confirmPassword.value) {
        registerUserForm.password.classList.add('is-invalid')
        registerUserForm.password.nextElementSibling.innerHTML = "Password fields do not match"
        return
    }

    const newUser = {}
    registerUserInputs.forEach( input => {
        input.classList.remove('is-invalid')

        newUser[input.name] = input.value 
    })
    newUser.adminRights = registerUserForm.adminRights.checked

    try {
        const res = await fetch('/admin/users', {
            method: 'POST',
            body: JSON.stringify(newUser),
            headers: { 'Content-Type': "application/json" }
        })

        const data = await res.json()

        // request was a sucess and user was created go to the main page
        if (data['sucess']) {

            table.row.add(data.newUser).draw()
            registerUserModal.hide()

        }

        // request wasnt a sucess, we check response object for what fields have an error message and add the is-invalid class and the error message to them
        addErrorsToInputFields(registerUserInputs, data)

    } catch (err) {
        console.log(err)
    }

})

document.getElementById('registerUserModal').addEventListener('hidden.bs.modal', function (event) {
    
    registerUserInputs.forEach( field => {
        field.value = null
    })

    registerUserForm.confirmPassword.value = null

});

updateUserForm.addEventListener('submit', async (e) => {
    
    e.preventDefault()

    const object = {}
    updateUserFields.forEach(field => {
        object[field.name] = field.value
    })

    object.adminRights = updateUserForm.adminRights.checked

    try {
        const res = await fetch('/admin/users', {
            method: 'PATCH',
            body: JSON.stringify(object),
            headers: { 'Content-Type': "application/json" }
        })

        const data = await res.json()

        // request was a sucess and user was created
        if (data['sucess']) {

            table.row('#' + data.user._id).data(data.user).draw()

            return updateUserModal.hide()
        }


        // request wasnt a sucess, we add the respective errors to theirs input field
        addErrorsToInputFields(updateUserFields, data)

    } catch (err) {
        console.log(err)
    }       

})

deleteUserForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const _id = deleteUserForm._id.value

    try {
        const res = await fetch('/admin/users', {
            method: 'DELETE',
            body: JSON.stringify({_id}),
            headers: { 'Content-Type': "application/json" }
        })

        const data = await res.json()

        // request was a sucess and user was deleted, so we delete him from the table
        if (data['sucess']) table.row('#' + _id).remove().draw()
        
        return deleteUserModal.hide()

    } catch (err) {
        console.log(err)
    }     

})

function addErrorsToInputFields(inputFields, errors){

    inputFields.forEach( field => {

        if(errors[field.name]){
            field.classList.add('is-invalid')
            field.nextElementSibling.innerHTML = errors[field.name].message
        }
    })

}