class RepositoryList extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
         <div id="repo-list" style="display: flex;justify-content: center;flex-wrap: wrap;width: 100%">
             ${CONTEXT.repositories.reduce((content, repo) => content += `<repository-list-item style="width: 100%" repository=${JSON.stringify(repo)}></repository-list-item>`, '')}
         </div>`;
    }
}

customElements.define('repository-list', RepositoryList);

