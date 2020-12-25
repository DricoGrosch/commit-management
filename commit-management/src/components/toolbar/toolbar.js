class Toolbar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        $(this).html(`
        <div style="display: flex;justify-content: flex-end">
            <button class="btn btn-primary" style="border-radius:100%;margin: 1%"><i class="fas fa-cogs"></i></button>
            <button class="btn btn-primary" style="border-radius:100%;margin: 1%" id="display-repo-creation-modal"><i class="fas fa-plus" ></i></button>
        </div>
        `)
        $('#display-repo-creation-modal').on('click', () => {
            $('#repo-creation-modal').attr('open', true)
        })
    }

}

customElements.define('tool-bar', Toolbar)