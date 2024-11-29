class AnimalTable {
    constructor(id, data, config) {
        this.id = id;
        this.data = data;
        this.config = config;
        this.renderTable();
    }

    renderTable() {
        const container = document.getElementById(this.id);
        container.innerHTML = `
          <button class="btn btn-primary mb-3" onclick="${this.id}.addAnimal()">Add Animal</button>
          <table class="table table-bordered">
              <thead>
                  <tr>
                      ${this.config.columns.map(col => `
                          <th ${col.sortable ? `onclick="${this.id}.sort('${col.key}')"` : ''}>
                              ${col.label} ${col.sortable ? '⬍' : ''}
                          </th>`).join('')}
                      <th>Actions</th>
                  </tr>
              </thead>
              <tbody>
                  ${this.data.map((animal, index) => `
                      <tr>
                          ${this.config.columns.map(col => `
                              <td class="${col.class || ''}">${col.format ? col.format(animal[col.key]) : animal[col.key]}</td>
                          `).join('')}
                          <td>
                              <button class="btn btn-warning btn-sm" onclick="${this.id}.editAnimal(${index})">Edit</button>
                              <button class="btn btn-danger btn-sm" onclick="${this.id}.deleteAnimal(${index})">Delete</button>
                          </td>
                      </tr>`).join('')}
              </tbody>
          </table>`;
    }

    addAnimal() {
        const name = prompt("Enter animal name:");
        const size = prompt("Enter size:");
        const location = prompt("Enter location:");
        const image = prompt("Enter image url:");

        if (!name || !size || !location || !image) {
            alert("Data must be valid!");
            return;
        }

        if (!size || isNaN(size)) {
            alert("Size must be a valid number!");
            return;
        }

        if (this.data.find(animal => animal.name === name)) {
            alert("Animal already exists!");
            return;
        }

        this.data.push({ name, size, location, image });
        this.renderTable();
    }

    editAnimal(index) {
        const animal = this.data[index];
        const name = prompt("Enter new name:", animal.name);
        const size = prompt("Enter new size:", animal.size);
        const location = prompt("Enter new location:", animal.location);
        const image = prompt("Enter image url:", animal.image);

        if (!name || !size || !location || !image) {
            alert("Data must be valid!");
            return;
        }

        if (!size || isNaN(size)) {
            alert("Size must be a valid number!");
            return;
        }

        this.data[index] = { ...animal, name, size, location, image };
        this.renderTable();
    }

    deleteAnimal(index) {
        this.data.splice(index, 1);
        this.renderTable();
    }

    sort(key) {
        this.data.sort((a, b) => (a[key] > b[key] ? 1 : -1));
        this.renderTable();
    }
}

let bigCatsTable, dogsTable, bigFishTable;

fetch('/data.json')
    .then(response => response.json())
    .then(data => {
        const bigCatsData = data.bigCatsData;
        const dogsData = data.dogsData;
        const bigFishData = data.bigFishData;

        const bigCatsConfig = {
            columns: [
                { key: "image", label: "Image", sortable: false, format: img => `<img src="${img}" alt="animal image">` },
                { key: "name", label: "Name", sortable: true },
                { key: "size", label: "Size", sortable: true, format: size => `${size} ft` },
                { key: "location", label: "Location", sortable: true }
            ]
        };

        const dogsConfig = {
            columns: [
                { key: "image", label: "Image", sortable: false, format: img => `<img src="${img}" alt="animal image">` },
                { key: "name", label: "Name", sortable: true, class: "bold" },
                { key: "size", label: "Size", sortable: true, format: size => `${size} ft` },
                { key: "location", label: "Location", sortable: true }
            ]
        };

        const bigFishConfig = {
            columns: [
                { key: "image", label: "Image", sortable: false, format: img => `<img src="${img}" alt="animal image">` },
                { key: "name", label: "Name", sortable: true, class: "bold-italic-blue" },
                { key: "size", label: "Size", sortable: true, format: size => `${size} ft` },
                { key: "location", label: "Location", sortable: true }
            ]
        };

        bigCatsTable = new AnimalTable("bigCatsTable", bigCatsData, bigCatsConfig);
        dogsTable = new AnimalTable("dogsTable", dogsData, dogsConfig);
        bigFishTable = new AnimalTable("bigFishTable", bigFishData, bigFishConfig);
    })
    .catch(error => {
        console.error('Error fetching animal data:', error);
    });
