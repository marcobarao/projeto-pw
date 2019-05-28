function verifyLocalStorageUse() {
    const actualValues = localStorage.getItem("statements");

    if (actualValues === null) {
        setDefaultLocalStorage();
    }
}

function setDefaultLocalStorage() {
    const defaultValues = [
        { title: "Salário DIG", description: "Salário mensal referente a 6 horas semanais", installments: null, statementType: 1, statementValue: 1500.00, controlDate: "06/05/2019" },
        { title: "Salário SUG", description: "Salário mensal referente a 4 horas semanais", installments: null, statementType: 1, statementValue: 1250.00, controlDate: "08/05/2019" },
        { title: "Conta de água", description: "Conta referente ao uso de água em casa", installments: 1, statementType: 2, statementValue: 60.00, controlDate: "10/05/2019" },
        { title: "Conta de luz", description: "Conta referente ao uso de luz em casa", installments: 1, statementType: 2, statementValue: 80.00, controlDate: "10/05/2019" },
        { title: "Compras no mercado", description: "Gasto mensal de compras no mercado", installments: null, statementType: 2, statementValue: 450.00, controlDate: "12/05/2019" },
        { title: "Parcela do notebook", description: "Conta referente a compra do notebook que foi parcelado em 10 vezes", installments: "5/10", statementType: 2, statementValue: 326.80, controlDate: "20/05/2019" },
        { title: "Freela de front", description: "Receita referente ao projeto de freela", installments: null, statementType: 1, statementValue: 1600.00, controlDate: "22/05/2019" },
    ];

    localStorage.setItem("statements", JSON.stringify(defaultValues));
}

function createAccordions() {
    const statementsJSON = localStorage.getItem("statements");
    const statements = JSON.parse(statementsJSON);
    const origin = document.querySelector("#card-origin");
    const accordionList = document.querySelector("#accordion-list");

    statements.map((item, index) => {
        const clone = origin.cloneNode(true);
        const indicator = clone.querySelector(".indicator");
        const title = clone.querySelector(".title");
        const heading = clone.querySelector("#heading-");
        const btn = clone.querySelector(".btn-link");
        const collapse = clone.querySelector("#collapse-");
        collapse.id += index;
        heading.id += index;
        btn.dataset.target += index;
        btn.setAttribute("aria-controls", btn.getAttribute("aria-controls") + index);
        collapse.setAttribute("aria-labelledby", collapse.getAttribute("aria-labelledby") + index)
        clone.removeAttribute("id");

        if (item.statementType === 1) {
            indicator.classList.add("receipt-indicator");
        } else {
            indicator.classList.add("debit-indicator");
        }

        const titleNode = document.createTextNode(item.title);
        title.appendChild(titleNode);

        accordionList.appendChild(clone);
    });
}

function resetValue() {
    const statementsJSON = localStorage.getItem("statements");
    const statements = JSON.parse(statementsJSON);
    const totalValue = statements.reduce((total, item) => total + item.statementValue, 0);
    const value = document.querySelector(".value");
    value.removeChild(value.firstChild);
    const valueNode = document.createTextNode(`${totalValue < 0 ? "-" : ""}R$ ${totalValue.toFixed(2)}`.replace(/\./g, ","));

    value.appendChild(valueNode);
    value.classList.add("positive");
}

document.addEventListener("DOMContentLoaded", function() {
    verifyLocalStorageUse();
    createAccordions();
    resetValue();
});