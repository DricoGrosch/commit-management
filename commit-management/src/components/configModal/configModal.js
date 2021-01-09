class ConfigModal extends HTMLElement {
    static get observedAttributes() {
        return ['open'];
    }

    constructor() {
        super();
        this.config = CONTEXT.config
    }

    attributeChangedCallback(name, oldValue, newValue) {
        newValue ? $(this).show() : $(this).hide()
    }

    connectedCallback() {
        $(this).css('display', 'none')
        $(this).attr('id', 'config-modal')

        $(this).html(`
            <div style="height: 100%;width: 100%">
            <div style="display: flex;width: 100%;justify-content: center;margin-top: 5%;position: absolute;">
                <div style="color:white;display: flex;justify-content: center;background-color:#333333;padding:1%;flex-wrap: wrap;width: 90%;border-radius: 5px;border: 2px solid #11a7a7">
                    <div style="width: 100%"><h2>Config handler</h2></div>
                    <div style="width: 100%">      
                        <label for="repo-name">Repository name</label>
                        <input type="file" id="repo-folder" class="form-control">
                        <label for="repo-name">Commit interval</label>
                        <input type="number" id="commit-interval"  placeholder="Enter the commit interval" class="form-control">
                    </div>
                    <div style="display: flex;justify-content: flex-end;width: 100%">
                        <button style="margin: 1%" class="btn btn-primary" id="dismiss-config-modal">Cancel</button>
                        <button style="margin: 1%" class="btn btn-primary" id="save-config">Save</button>
                    </div>
               </div>
            </div>
        </div>
            `)
        $('#dismiss-config-modal').on('click',()=>{
            this.config = CONTEXT.config
            $(this).attr('open', false)
        })

    }
}

customElements.define('config-modal', ConfigModal)