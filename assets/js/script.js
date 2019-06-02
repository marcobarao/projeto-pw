function verifyLocalStorageUse() {
    const actualValues = localStorage.getItem("statements");

    if (actualValues === null) {
        setDefaultLocalStorage();
    }
}

function setDefaultLocalStorage() {
    const defaultValues = [
        { title: "Salário DIG", description: "Salário mensal referente a 6 horas semanais", installments: "1/1", statementType: 1, statementValue: 1500.00, controlDate: "06/05/2019" },
        { title: "Salário SUG", description: "Salário mensal referente a 4 horas semanais", installments: "1/1", statementType: 1, statementValue: 1250.00, controlDate: "08/05/2019" },
        { title: "Conta de água", description: "Conta referente ao uso de água em casa", installments: "1/1", statementType: 2, statementValue: 60.00, controlDate: "10/05/2019" },
        { title: "Conta de luz", description: "Conta referente ao uso de luz em casa", installments: "1/12", statementType: 2, statementValue: 80.00, controlDate: "10/05/2019" },
        { title: "Compras no mercado", description: "Gasto mensal de compras no mercado", installments: "1/1", statementType: 2, statementValue: 450.00, controlDate: "12/05/2019" },
        { title: "Parcela do notebook", description: "Conta referente a compra do notebook que foi parcelado em 10 vezes", installments: "5/10", statementType: 2, statementValue: 326.80, controlDate: "20/05/2019" },
        { title: "Freela de front", description: "Receita referente ao projeto de freela", installments: "1/1", statementType: 1, statementValue: 1600.00, controlDate: "22/05/2019" },
    ];

    localStorage.setItem("statements", JSON.stringify(defaultValues));
}

const removeItem = (id) => () => {
    const statementsJSON = localStorage.getItem("statements");
    const statements = JSON.parse(statementsJSON);

    statements.splice(id, 1);

    localStorage.setItem("statements", JSON.stringify(statements));

    resetAccordions();
    resetValue();
}

function resetAccordions() {
    const accordionList = document.querySelector("#accordion-list");
    while (accordionList.lastChild.id !== 'card-origin') {
        accordionList.removeChild(accordionList.lastChild);
    }

    createAccordions();
}

function createAccordions() {
    const statementsJSON = localStorage.getItem("statements");
    const statements = JSON.parse(statementsJSON);
    const origin = document.querySelector("#card-origin");
    const accordionList = document.querySelector("#accordion-list");

    statements.map((item, index) => {
        const clone = origin.cloneNode(true);
        const indicator = clone.querySelector(".indicator");
        const titles = clone.querySelectorAll(".title");
        const description = clone.querySelector(".description");
        const controlDate = clone.querySelector(".control-date");
        const value = clone.querySelector(".statement-value");
        const installments = clone.querySelector(".installments");
        const remove = clone.querySelector("#remove");
        const heading = clone.querySelector("#heading-");
        const btn = clone.querySelector(".btn-link");
        const collapse = clone.querySelector("#collapse-");
        collapse.id += index;
        heading.id += index;
        btn.dataset.target += index;
        btn.setAttribute("aria-controls", btn.getAttribute("aria-controls") + index);
        collapse.setAttribute("aria-labelledby", collapse.getAttribute("aria-labelledby") + index)
        clone.removeAttribute("id");
        clone.id = index;

        if (item.statementType === 1) {
            indicator.classList.add("receipt-indicator");
        } else {
            indicator.classList.add("debit-indicator");
        }


        for (let i = 0; i < titles.length; i++) {
            const titleNode = document.createTextNode(item.title);
            titles[i].appendChild(titleNode);
        }

        const descriptionNode = document.createTextNode(item.title);
        description.appendChild(descriptionNode);

        const controlDateNode = document.createTextNode(item.controlDate);
        controlDate.appendChild(controlDateNode);

        const valueNode = document.createTextNode(`R$ ${Math.abs(item.statementValue).toFixed(2)}`.replace(/\./g, ","));
        value.appendChild(valueNode);

        const installmentsNode = document.createTextNode(item.installments !== "1/1" ? `- ${item.installments}` : "");
        installments.appendChild(installmentsNode);

        remove.onclick = removeItem(index);

        accordionList.appendChild(clone);
    });
}

function resetValue() {
    const statementsJSON = localStorage.getItem("statements");
    const statements = JSON.parse(statementsJSON);
    const totalValue = statements.reduce((total, item) => {
        let value = item.statementValue;

        if(item.statementType === 2) {
            value = -value;
        }

        return total + value;
    }, 0);
    const value = document.querySelector(".value");
    value.removeChild(value.firstChild);
    const valueNode = document.createTextNode(`${totalValue < 0 ? "-" : ""}R$ ${Math.abs(totalValue).toFixed(2)}`.replace(/\./g, ","));

    value.appendChild(valueNode);
    if (totalValue > 0 ) {
        value.classList.add("positive");
    } else {
        value.classList.add("negative");
    }
}

document.addEventListener("DOMContentLoaded", function() {
    verifyLocalStorageUse();
    createAccordions();
    resetValue();
});