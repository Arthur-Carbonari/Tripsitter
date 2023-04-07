async function adminDashboardMain() {

    const registerUserModal = $('#registerUserModal');
    const registerUserForm = new SmartForm('registerUserForm')

    registerUserModal.on('hidden.bs.modal', () => { registerUserForm.resetForm() })

    const updateUserModal = $('#updateUserModal');
    const updateUserForm = new SmartForm('updateUserForm')

    const deleteUserModal = $('#deleteUserModal')
    const deleteUserForm = new SmartForm('deleteUserForm')

    const res = await fetch("/admin/users")
    const data = await res.json()

    dataTableBuilder = new DataTableBuilder()

    const table = dataTableBuilder
        .setIdColumn({ data: '_id', visible: false, searchable: false })
        .addActionColumn(DataTable.updateButton, DataTable.deleteButton)
        .setDataColumns('email', 'username', 'firstName', 'lastName', 'adminRights')
        .build('usersTable', data).table


    $('div.toolbar').html('<button class="btn btn-primary" id="addUserButton" data-bs-toggle="modal" data-bs-target="#registerUserModal"> Create New <i class="fa fa-plus" aria-hidden="true"></i> </button>');

    $('#usersTable tbody').on('click', '.edit-button', function () {
        let data = table.row($(this).parents('tr')).data();

        updateUserForm.setData(data)
        updateUserForm.form.adminRights.checked = data.adminRights

        updateUserModal.modal('show')
    });

    $('#usersTable tbody').on('click', '.delete-button', function () {
        let data = table.row($(this).parents('tr')).data();

        deleteUserForm.setData(data)

        deleteUserModal.modal('show')
    });


    registerUserForm.overwriteSubmitEvent(async (e) => {

        if (registerUserForm.getFieldValue('password') != registerUserForm.getFieldValue('confirmPassword')) {
            registerUserForm.addWarnings({ password: { message: "Password fields do not match" } })
            return
        }

        registerUserForm.clearWarnings()

        registerUserForm.form.adminRights.value = registerUserForm.form.adminRights.checked

        try {
            const resData = await registerUserForm.submitForm('/admin/users', 'POST')

            // request was a sucess and user was created go to the main page
            if (resData.sucess) {

                table.row.add(resData.newUser).draw()
                registerUserModal.modal('hide')

            }

        } catch (err) {
            console.log(err)
        }

    })

    updateUserForm.overwriteSubmitEvent(async (e) => {

        updateUserForm.clearWarnings()

        updateUserForm.form.adminRights.value = updateUserForm.form.adminRights.checked

        try {

            const resData = await updateUserForm.submitForm('/admin/users', 'PATCH')

            // request was a sucess and user was created
            if (resData.sucess) {

                table.row('#' + resData.user._id).data(resData.user).draw()

                return updateUserModal.modal('hide')
            }


        } catch (err) {
            console.log(err)
        }

    })

    deleteUserForm.overwriteSubmitEvent(async (e) => {

        try {
            const resData = await deleteUserForm.submitForm('/admin/users', 'DELETE')

            // request was a sucess and user was deleted, so we delete him from the table
            if (resData.sucess) table.row('#' + resData.userId).remove().draw()

            return deleteUserModal.modal('hide')

        } catch (err) {
            console.log(err)
        }

    })

}

window.onload = adminDashboardMain