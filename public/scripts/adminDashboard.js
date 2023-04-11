// script for the admin dashboard page

// initializes and set the common configuration for the dataTableBuilder
dataTableBuilder = new DataTableBuilder()
    .setIdColumn({ data: '_id', visible: false, searchable: false })
    .addActionColumn(DataTable.updateButton, DataTable.deleteButton)

// main function for this script
function adminDashboardMain(){

    initializeArticlesControlPanel()
    initializetUserControlPanel()

}

// initializes the Articles control panel on the admin dashboard page
async function initializeArticlesControlPanel(){

    // gets the form and the modal to post a new article
    const newArticleModal = $('#newArticleModal')
    const newArticleForm = new SmartForm('newArticleForm', ["title", "body", "coAuthors", "tags", "imageURL", "imageDescription"])

    // gets the form and the modal to update an article
    const updateArticleModal = $('#updateArticleModal');
    const updateArticleForm = new SmartForm('updateArticleForm', ["_id", "title", "body", "coAuthors", "tags", "imageURL", "imageDescription"])

    // gets the form and the modal to delete an article
    const deleteArticleModal = $('#deleteArticleModal')
    const deleteArticleForm = new SmartForm('deleteArticleForm')

    // gets the data for the table
    const res = await fetch("/admin/articles")
    const data = await res.json()

    // parses all the dates to local string
    data.forEach(element => {
        element.date = new Date(element.date).toLocaleString()
    });

    // initializes the DataTable object
    const articlesTable = dataTableBuilder
        .setDataColumns('title', 'author', 'coAuthors', 'tags', 'date')
        .addActionColumn(DataTable.goToButton, DataTable.updateButton, DataTable.deleteButton)
        .build('articleTable', data)

    // sets the table toolbar
    articlesTable.setToolbar(DataTable.newButton)

    // add action to the table buttons
    articlesTable.addAction('.new-button', (e) => { newArticleModal.modal('show') })

    articlesTable.addAction( '.goto-button', e => {
        const data = articlesTable.getRowDataFromButton(e.currentTarget)

        window.location.href = '/blog/' + data._id;
    })

    articlesTable.addAction( '.edit-button', (e) => {
        
        const data = articlesTable.getRowDataFromButton(e.currentTarget)
    
        updateArticleForm.setData(data)
        updateArticleForm.form.imagePreview.src = data.imageURL;
    
        updateArticleModal.modal('show')
    })

    articlesTable.addAction('.delete-button', (e) => {
        const data = articlesTable.getRowDataFromButton(e.currentTarget)

        deleteArticleForm.setData(data)

        deleteArticleModal.modal('show')
    });

    // changes the imagePreview src value for the new and update article form
    // add a timeout so the src doenst change while the user types

    let timeoutIdNewForm; 
    newArticleForm.form.imageURL.addEventListener("input", () => {
        clearTimeout(timeoutIdNewForm);
        timeoutIdNewForm = setTimeout(() => {
            newArticleForm.form.imagePreview.src = newArticleForm.form.imageURL.value;
        }, 500);
    });

    let timeoutIdUpdateForm;
    updateArticleForm.form.imageURL.addEventListener("input", () => {
        clearTimeout(timeoutIdUpdateForm);
        timeoutIdUpdateForm = setTimeout(() => {
            updateArticleForm.form.imagePreview.src = updateArticleForm.form.imageURL.value;
        }, 500);
    });

    // add submit event to the new article form
    newArticleForm.overwriteSubmitEvent( async (e) => {

        newArticleForm.clearWarnings()

        try {
            
            // sends form to the articles route
            const resData = await newArticleForm.submitForm('/admin/articles', 'POST')

            // if sucess adds it to the article table
            if (resData.sucess) {
                
                resData.newArticle.date = new Date(resData.newArticle.date).toLocaleString()

                articlesTable.addRow(resData.newArticle)

                newArticleForm.form.imagePreview.src = 'https://cdn.onlinewebfonts.com/svg/img_98811.png'
                newArticleModal.modal('hide')
                newArticleForm.resetForm()
            }

        } catch (error) {
            console.log(error);
        }

    })

    // add submit event to the update article form
    updateArticleForm.overwriteSubmitEvent(async (e) => {

        updateArticleForm.clearWarnings()

        try {
            // send form data to the article route 
            const resData = await updateArticleForm.submitForm('/admin/articles', 'PATCH')

            // if request was a sucess and user was updated then the table is updated as well
            if (resData.sucess) {

                resData.article.date = new Date(resData.article.date).toLocaleString()

                articlesTable.overwriteRow(resData.article._id, resData.article)

                return updateArticleModal.modal('hide')
            }


        } catch (err) {
            console.log(err)
        }

    })

    // add submit event to the delete article form
    deleteArticleForm.overwriteSubmitEvent(async (e) => {

        try {
            // sends request to delete to articles route
            const resData = await deleteArticleForm.submitForm('/admin/articles', 'DELETE')

            // request was a sucess and article was deleted, so we delete it from the table
            if (resData.sucess) articlesTable.deleteRow(resData.articleId)

            return deleteArticleModal.modal('hide')

        } catch (err) {
            console.log(err)
        }

    })

}

// initializes the User control panel on the dashboard page
async function initializetUserControlPanel() {

    // gets the form and the modal to create a new user
    const registerUserModal = $('#registerUserModal');
    const registerUserForm = new SmartForm('registerUserForm')

    // gets the form and the modal to update user
    const updateUserModal = $('#updateUserModal');
    const updateUserForm = new SmartForm('updateUserForm')

    // gets the form and the modal to delete user
    const deleteUserModal = $('#deleteUserModal')
    const deleteUserForm = new SmartForm('deleteUserForm')

    // gets all the users
    const res = await fetch("/admin/users")
    const data = await res.json()

    // creates the user table
    const usersTable = dataTableBuilder
        .setDataColumns('email', 'username', 'firstName', 'lastName', 'adminRights')
        .addActionColumn(DataTable.updateButton, DataTable.deleteButton)
        .build('usersTable', data)

    // sets the toolbar for the user table
    usersTable.setToolbar(DataTable.newButton);

    // reset the register user form when it hides
    registerUserModal.on('hidden.bs.modal', () => { registerUserForm.resetForm() })

    // add actions to the user table buttons
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

    // overwrites submit event for the register user form
    registerUserForm.overwriteSubmitEvent(async (e) => {

        // checks if the password matches
        if (registerUserForm.getFieldValue('password') != registerUserForm.getFieldValue('confirmPassword')) {
            registerUserForm.addWarnings({ password: { message: "Password fields do not match" } })
            return
        }

        // clear all existing warnings
        registerUserForm.clearWarnings()

        // sets the value for the adminRigths switch to match if it checked or not
        registerUserForm.form.adminRights.value = registerUserForm.form.adminRights.checked

        try {
            // send request to users route
            const resData = await registerUserForm.submitForm('/admin/users')

            // if sucess adds user to the table
            if (resData.sucess) {

                usersTable.addRow(resData.newUser)
                registerUserModal.modal('hide')

            }

        } catch (err) {
            console.log(err)
        }

    })

    // overwrites submit event for the update user form
    updateUserForm.overwriteSubmitEvent(async (e) => {

        // clears existing warnings
        updateUserForm.clearWarnings()

        // sets the value for the adminRigths switch to match if it checked or not
        updateUserForm.form.adminRights.value = updateUserForm.form.adminRights.checked

        try {
            // sends patch request to users route
            const resData = await updateUserForm.submitForm('/admin/users', 'PATCH')

            // request was a sucess update the user data on the table
            if (resData.sucess) {

                usersTable.overwriteRow(resData.user._id, resData.user)

                return updateUserModal.modal('hide')
            }


        } catch (err) {
            console.log(err)
        }

    })

    // overwrites submit event for the delete user form
    deleteUserForm.overwriteSubmitEvent(async (e) => {

        try {
            // sends form data to the users route as a delete request
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
