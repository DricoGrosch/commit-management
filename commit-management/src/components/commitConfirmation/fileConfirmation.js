class FileConfirmation extends HTMLElement {

    getFileIcon(status) {
        switch (status) {
            case 1: {

                return '<i style="color: red" class="fas fa-trash-alt"></i>'
            }
            case 2: {
                return '<i  style="color: orange" class="fas fa-pencil-alt"></i>'
            }
            default: {
                return '<i  style="color: green" class="fas fa-plus"></i>'

            }
        }


    }

    connectedCallback() {
        const action = $(this).attr('action')
        const file = JSON.parse($(this).attr('file'))
        const current = $(this).attr('current')
        const target = $(this).attr('target')
        $(this).html(`
        <div style="display:flex;width: 100%">
            <div style="width: 70%;color: white">${this.getFileIcon(file.status)} ${file.relativePath}</div>
            <div style="width: 30%"><button class="btn btn-primary actionButton" style="font-size: 12px">${action.toUpperCase()}</button></div>
        </div>
        `)
        $(this).on('click', '.actionButton', () => {
            $('#commit-confirmation').attr(current, (index, currentValue) => {
                return JSON.stringify(JSON.parse(currentValue).filter(({relativePath}) => relativePath !== file.relativePath))
            })
            $('#commit-confirmation').attr(target, (index, currentValue) => {
                return JSON.stringify([...JSON.parse(currentValue), file])
            })
        })
    }
}


customElements.define('file-confirmation', FileConfirmation)