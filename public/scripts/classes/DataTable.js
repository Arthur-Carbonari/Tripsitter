class DataTableBuilder{

    dom = "<'row align-items-center'<'col-sm-6 my-searchbox'f><'toolbar w-auto text-end flex-grow-1'>> <'row'<'col-sm-12'tr>> <'row justify-content-between pt-2'<'col-sm-3'l><'col-sm-5 sub-div-p-0 text-center'i><'col-sm-3'p>>"
    pagingType = "first_last_numbers"


    setIdColumn( idColumn ){
        this.idColumn = idColumn
        return this
    }

    addActionColumn( ...buttonElementStrings ){

        let defaultContent = '<div class="text-end">' + buttonElementStrings.join()  + '</div>'

        this.actionColumn = {
            targets: -1,
            data: null,
            defaultContent: defaultContent
        }

        return this
    }

    setDataColumns( ...columnNames){
        this.dataColumns = columnNames.map( (columnName) => { return { data: columnName } })

        return this
    }

    build( tableId, data ){

        const options = {
            data: data,
            columns: this._generateColumns(),
            dom: this.dom,
            pagingType: this.pagingType,
            rowId: this.idColumn.data,
            columnDefs: [ this.actionColumn ]
        }

        return new DataTable(tableId, options)

    }

    _generateColumns(){
        return this.actionColumn ? [this.idColumn, ...this.dataColumns, {data: '', searchable: false}] : [this.idColumn, ...this.dataColumns]
    }


}


class DataTable {

    static updateButton = '<button class="btn btn-primary edit-button">Edit <i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>'
    static deleteButton = '<button class="btn btn-danger delete-button">Delete <i class="fa fa-trash-o" aria-hidden="true"></i> </button>'

    constructor(tableId, options){

        this.table = $('#' + tableId).DataTable(options)

    }

}