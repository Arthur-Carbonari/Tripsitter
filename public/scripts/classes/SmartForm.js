/**
 * A class for managing forms and their input fields.
 */
class SmartForm {

    /**
     * @constructor
     * @param {string} formId - The id of the form element.
     * @param {Array<string>} [keyFieldsNames=null] - An array of the input field names to be used as key fields. If not provided, all input fields in the form will be used as key fields.
     */
    constructor(formId, keyFieldsNames = null) {
        this.form = document.getElementById(formId);
        this.keyFields = keyFieldsNames ? keyFieldsNames.map(fieldName => { return this.form[fieldName]; }) : Array.from(this.form.getElementsByTagName('input'));
    }

    /**
     * Returns the value of the given input field.
     * @param {string} fieldName - The name of the input field to retrieve the value of.
     * @returns {string} - The value of the given input field.
     */
    getFieldValue(fieldName) {
        console.log("these are the fields: ", this.form[fieldName]);
        return this.form[fieldName].value;
    }

    /**
     * Resets the form by clearing all input fields and removing any validation warnings.
     */
    resetForm() {
        this.keyFields.forEach(field => {
            field.value = '';
            field.classList.remove('is-invalid');
        });
    }

    /**
     * Removes any validation warnings from the input fields.
     */
    clearWarnings() {
        this.keyFields.forEach(field => {
            field.classList.remove('is-invalid');
        });
    }

    /**
     * Adds validation warnings to the input fields based on the provided warnings object.
     * @param {object} warning - An object containing validation warning messages, with the keys being the names of the input fields to which the warnings apply.
     */
    addWarnings(warning) {
        this.keyFields.forEach(field => {
            if (warning[field.name]) {
                field.classList.add('is-invalid');
                field.nextElementSibling.innerHTML = warning[field.name].message;
            }
        });
    }

    /**
     * Returns an object containing the names and values of all input fields in the form.
     * @returns {object} - An object containing the names and values of all input fields in the form.
     */
    getFormData() {
        return this.keyFields.reduce((formValues, field) => {
            formValues[field.name] = field.value;
            return formValues;
        }, {});
    }

    /**
     * Populates the input fields in the form with the provided data object.
     * @param {object} data - An object containing key-value pairs where the key corresponds to the name of an input field and the value corresponds to the value to be set in the field.
     */
    setData(data) {
        this.keyFields.forEach(field => {
            if (data[field.name]) {
                field.value = data[field.name];
            }
            else {
                field.value = "";
            }
        });
    }

    /**
     * Sends a fetch request to the specified target URL with the form data, 
     * and returns the response data as a JSON object. If the response indicates 
     * that the submission was unsuccessful, the function adds warnings to the 
     * form fields.
     * 
     * @param {string} targetUrl - The URL to which the form data should be submitted.
     * @param {string} [method='POST'] - The HTTP method to use for the submission.
     * @returns {Promise<object>} - A Promise that resolves with the response data as a JSON object.
     */
    async submitForm(targetUrl, method = 'POST') {

        const formData = this.getFormData()

        const res = await fetch(targetUrl, {
            method: method,
            body: JSON.stringify(formData),
            headers: { 'Content-Type': "application/json" }
        })

        const resData = await res.json()

        if (!resData.sucess) this.addWarnings(resData)

        return resData
    }

    /**
     * Overwrites the form's default submit event with the specified action.
     * 
     * @param {function} action - The function to execute when the form is submitted.
     */
    overwriteSubmitEvent(action) {

        this.form.addEventListener('submit', (e) => {

            e.preventDefault()

            action(e)

        })
    }



}