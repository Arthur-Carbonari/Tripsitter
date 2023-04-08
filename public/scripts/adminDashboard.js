async function adminDashboardMain() {

    const registerUserModal = $('#registerUserModal');
    const registerUserForm = new SmartForm('registerUserForm')

    const updateUserModal = $('#updateUserModal');
    const updateUserForm = new SmartForm('updateUserForm')

    const deleteUserModal = $('#deleteUserModal')
    const deleteUserForm = new SmartForm('deleteUserForm')

    const res = await fetch("/admin/users")
    const data = await res.json()

    dataTableBuilder = new DataTableBuilder()

    const usersTable = dataTableBuilder
        .setIdColumn({ data: '_id', visible: false, searchable: false })
        .addActionColumn(DataTable.updateButton, DataTable.deleteButton)
        .setDataColumns('email', 'username', 'firstName', 'lastName', 'adminRights')
        .build('usersTable', data)

    usersTable.setToolbar(DataTable.newButton);


    registerUserModal.on('hidden.bs.modal', () => { registerUserForm.resetForm() })

    usersTable.addAction( '.new-button', (e) => {
        registerUserModal.modal('show')
    })

    usersTable.addAction( '.edit-button', (e) => {
        
        const data = usersTable.getRowDataFromButton(e.currentTarget)
    
        updateUserForm.setData(data)
        updateUserForm.form.adminRights.checked = data.adminRights
    
        updateUserModal.modal('show')

    })

    usersTable.addAction('.delete-button', (e) => {
        const data = usersTable.getRowDataFromButton(e.currentTarget)

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

            if (resData.sucess) {

                usersTable.addRow(resData.newUser)
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

                usersTable.overwriteRow(resData.user._id, resData.user)

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
            if (resData.sucess) usersTable.deleteRow(resData.userId)

            return deleteUserModal.modal('hide')

        } catch (err) {
            console.log(err)
        }

    })



}

window.onload = adminDashboardMain