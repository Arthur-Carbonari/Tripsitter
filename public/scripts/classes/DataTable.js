/**
 * A class used to build and configure the DataTable instance.
 */
class DataTableBuilder {

    /**
     * The default DOM structure for the DataTable.
     * @type {string}
     */
    dom = "<'row align-items-center'<'col-sm-6 my-searchbox'f><'toolbar w-auto text-end flex-grow-1'>> <'row'<'col-sm-12'tr>> <'row justify-content-between pt-2'<'col-sm-3'l><'col-sm-5 sub-div-p-0 text-center'i><'col-sm-3'p>>";

    /**
     * The default paging type for the DataTable.
     * @type {string}
     */
    pagingType = "first_last_numbers";

    /**
     * Sets the ID column for the DataTable.
     * @param {object} idColumn - The ID column object.
     * @returns {DataTableBuilder} - The DataTableBuilder instance.
     */
    setIdColumn(idColumn) {
        this.idColumn = idColumn;
        return this;
    }

    /**
     * Sets the action column for the DataTable.
     * @param {...string} buttonElementStrings - The button element strings.
     * @returns {DataTableBuilder} - The DataTableBuilder instance.
     */
    addActionColumn(...buttonElementStrings) {
        let defaultContent = '<div class="text-end">' + buttonElementStrings.join("") + '</div>';
        this.actionColumn = {
            targets: -1,
            data: null,
            defaultContent: defaultContent
        };
        return this;
    }

    /**
     * Sets the data columns for the DataTable.
     * @param {...string} columnNames - The column names.
     * @returns {DataTableBuilder} - The DataTableBuilder instance.
     */
    setDataColumns(...columnNames) {
        this.dataColumns = columnNames.map((columnName) => {
            return { data: columnName };
        });
        return this;
    }

    /**
     * Builds and returns the DataTable instance with the specified options.
     * @param {string} tableId - The table ID.
     * @param {array} data - The table data array.
     * @returns {DataTable} - The DataTable instance.
     */
    build(tableId, data) {
        const options = {
            data: data,
            columns: this._generateColumns(),
            dom: this.dom,
            pagingType: this.pagingType,
            rowId: this.idColumn.data,
            columnDefs: [this.actionColumn]
        };
        return new DataTable(tableId, options);
    }

    /**
     * Generates columns for the DataTable instance.
     * @returns {array} - The column array.
     * @private
     */
    _generateColumns() {
        return this.actionColumn ? [this.idColumn, ...this.dataColumns, { data: "", searchable: false }] : [this.idColumn, ...this.dataColumns];
    }
}


// This class is used to create and manage DataTable instances
/**
 * DataTable class for creating and manipulating DataTable instances
 * @class
 */
class DataTable {
    /**
     * Static buttons for DataTable instances
     * @type {string}
     * @static
     */
    static newButton = '<button class="btn btn-primary new-button"> Create New <i class="fa fa-plus" aria-hidden="true"></i> </button>'
    static updateButton = '<button class="btn btn-primary edit-button"> <i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>'
    static deleteButton = '<button class="btn btn-danger delete-button"> <i class="fa fa-trash-o" aria-hidden="true"></i> </button>'
    static goToButton = '<button class="btn btn-secondary goto-button"><i class="fa fa-external-link" aria-hidden="true"></i> </button>'

    /**
     * Constructor for DataTable instances
     * @constructor
     * @param {string} tableId - The ID of the table element to turn into a DataTable instance
     * @param {Object} options - The DataTable options to initialize the instance with
     */
    constructor(tableId, options) {
        /**
         * The ID of the table element associated with the DataTable instance
         * @type {string}
         */
        this.tableId = '#' + tableId

        /**
         * The DataTable instance associated with the table element
         * @type {Object}
         */
        this.table = $(this.tableId).DataTable(options)
    }

    /**
     * Adds a row to the DataTable
     * @param {Object} rowData - The data for the new row to add to the DataTable
     */
    addRow(rowData) {
        this.table.row.add(rowData).draw()
    }

    /**
     * Gets a row of the DataTable by its ID
     * @param {string} rowId - The ID of the row to retrieve from the DataTable
     * @returns {Object} The row of the DataTable with the given ID
     */
    getRowById(rowId) {
        return this.table.row('#' + rowId)
    }

    /**
     * Overwrites a row in the DataTable with new data
     * @param {string} rowId - The ID of the row to overwrite in the DataTable
     * @param {Object} newData - The new data to replace the row's existing data with
     */
    overwriteRow(rowId, newData) {
        this.getRowById(rowId).data(newData).draw()
    }

    /**
     * Deletes a row from the DataTable
     * @param {string} rowId - The ID of the row to delete from the DataTable
     */
    deleteRow(rowId) {
        this.table.row('#' + rowId).remove().draw()
    }

    /**
     * Gets row data from a button node in the DataTable
     * @param {Object} buttonNode - The button node to get the row data from
     * @returns {Object} The data of the row that the button node is associated with
     */
    getRowDataFromButton(buttonNode) {
        return this.table.row($(buttonNode).parents('tr')).data();
    }

    /**
     * Sets the HTML for the toolbar of the table
     * @param {...string} htmlString - The HTML strings to set as the toolbar contents
     */
    setToolbar(...htmlString) {
        $('div.toolbar').html(htmlString.join())
    }

    /**
     * Adds an action to all buttons of a specific class inside the table.
     * @param {string} buttonClass - The class name of the buttons to which the action will be added.
     * @param {function} action - The function that will be executed when a button of the specified class is clicked.
     */
    addAction(buttonClass, action) {
        $(this.tableId + '_wrapper').on('click', buttonClass, (e) => {
            action(e)
        });
    }


}