class SmartForm{


    constructor( formId ){
        
        this.form = document.getElementById(formId)
        this.inputFields = Array.from(this.form.getElementsByTagName('input'))
        this.keyFields = this.inputFields.filter( field => field.classList.contains('key-field'))

    }

    getFieldValue( fieldName ){
        console.log("these are the fields: ", this.form[fieldName]);
        return this.form[fieldName].value
    }

    resetForm(){
        this.inputFields.forEach( field => {
            field.value = ''
            field.classList.remove('is-invalid')
        })
    }

    clearWarnings(){
        this.inputFields.forEach( field => {
            field.classList.remove('is-invalid')
        })
    }

    addWarnings(warning){
        this.inputFields.forEach( field => {
            if(warning[field.name]){
                field.classList.add('is-invalid')
                field.nextElementSibling.innerHTML = warning[field.name].message
            }
        })
    }

    getFormData(){
        return this.inputFields.reduce( (formValues, field) => {
            formValues[field.name] = field.value
            return formValues
        }, {})
    }

    setData( data ){
        this.inputFields.forEach( field => {
            if (data[field.name]){
                field.value = data[field.name]
            }
            else{
                field.value = ""
            }
        })
    }

    async submitForm(targetUrl, method){

        const formData = this.getFormData()

        const res = await fetch( targetUrl, {
            method : method,
            body: JSON.stringify(formData),
            headers: { 'Content-Type': "application/json" }
        })

        const resData = await res.json()

        if( !resData.sucess ) this.addWarnings(resData)
        
        return resData
    }

    overwriteSubmitEvent( action ){

        this.form.addEventListener('submit', (e) => {

            e.preventDefault()

            action(e)

        })
    }


}