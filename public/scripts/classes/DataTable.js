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

    static newButton = '<button class="btn btn-primary new-button"> Create New <i class="fa fa-plus" aria-hidden="true"></i> </button>'
    static updateButton = '<button class="btn btn-primary edit-button">Edit <i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>'
    static deleteButton = '<button class="btn btn-danger delete-button">Delete <i class="fa fa-trash-o" aria-hidden="true"></i> </button>'

    constructor(tableId, options){

        this.tableId = '#' + tableId

        this.table = $(this.tableId).DataTable(options)

    }

    addRow( rowData ){
        this.table.row.add(rowData).draw()
    }

    getRowById( rowId ){
        return this.table.row('#' + rowId)
    }

    overwriteRow(rowId, newData){
        this.getRowById(rowId).data(newData).draw()
    }

    deleteRow(rowId){
        this.table.row('#' + rowId).remove().draw()
    }

    getRowDataFromButton( buttonNode ){
        return this.table.row($(buttonNode).parents('tr')).data();
    }

    setToolbar( ...htmlString ){
        $('div.toolbar').html(htmlString.join())
    }

    addAction( buttonClass, action ){
        $(this.tableId+'_wrapper').on('click', buttonClass, (e) => {
            action(e)
        });
    }


}