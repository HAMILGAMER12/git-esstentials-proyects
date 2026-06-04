const money = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const state = {
  quoteCounter: 1,
  items: [
    { concept: "Diagnostico tecnico", quantity: 1, price: 8500 },
    { concept: "Limpieza interna y cambio de pasta termica", quantity: 1, price: 22000 },
    { concept: "Instalacion y configuracion de software", quantity: 1, price: 14500 },
  ],
};

const formFields = [
  "clientName",
  "clientPhone",
  "deviceType",
  "technician",
  "problem",
  "status",
  "validDays",
];

const itemsBody = document.querySelector("#itemsBody");

function currency(value) {
  return money.format(Number(value) || 0);
}

function renderItems() {
  itemsBody.innerHTML = "";

  state.items.forEach((item, index) => {
    const row = document.createElement("tr");
    const subtotal = item.quantity * item.price;

    row.innerHTML = `
      <td><input type="text" value="${item.concept}" data-field="concept" data-index="${index}" aria-label="Concepto" /></td>
      <td><input type="number" min="1" value="${item.quantity}" data-field="quantity" data-index="${index}" aria-label="Cantidad" /></td>
      <td><input type="number" min="0" value="${item.price}" data-field="price" data-index="${index}" aria-label="Precio unitario" /></td>
      <td class="amount">${currency(subtotal)}</td>
      <td><button class="delete-button" type="button" data-delete="${index}" title="Eliminar concepto" aria-label="Eliminar concepto">X</button></td>
    `;

    itemsBody.appendChild(row);
  });

  updatePreview();
}

function updatePreview() {
  const subtotal = state.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const tax = subtotal * 0.21;
  const total = subtotal + tax;

  document.querySelector("#quoteNumber").textContent = `TF-${String(state.quoteCounter).padStart(4, "0")}`;
  document.querySelector("#previewClient").textContent = document.querySelector("#clientName").value || "Sin cliente";
  document.querySelector("#previewPhone").textContent = document.querySelector("#clientPhone").value || "Sin telefono";
  document.querySelector("#previewDevice").textContent = document.querySelector("#deviceType").value;
  document.querySelector("#previewProblem").textContent = document.querySelector("#problem").value || "Sin descripcion de falla";
  document.querySelector("#previewStatus").textContent = document.querySelector("#status").value;
  document.querySelector("#previewTechnician").textContent = `Tecnico: ${document.querySelector("#technician").value}`;
  document.querySelector("#previewValidity").textContent = `Valido por ${document.querySelector("#validDays").value || 1} dias`;
  document.querySelector("#subtotalText").textContent = currency(subtotal);
  document.querySelector("#taxText").textContent = currency(tax);
  document.querySelector("#totalText").textContent = currency(total);
}

function resetForm() {
  state.quoteCounter += 1;
  state.items = [{ concept: "Diagnostico tecnico", quantity: 1, price: 8500 }];
  document.querySelector("#clientName").value = "";
  document.querySelector("#clientPhone").value = "";
  document.querySelector("#deviceType").value = "Notebook";
  document.querySelector("#technician").value = "Juan Perez";
  document.querySelector("#problem").value = "";
  document.querySelector("#status").value = "Pendiente";
  document.querySelector("#validDays").value = 7;
  renderItems();
}

formFields.forEach((fieldId) => {
  document.querySelector(`#${fieldId}`).addEventListener("input", updatePreview);
});

itemsBody.addEventListener("input", (event) => {
  const input = event.target;
  const index = Number(input.dataset.index);
  const field = input.dataset.field;

  if (!field || Number.isNaN(index)) return;

  state.items[index][field] = field === "concept" ? input.value : Number(input.value);
  renderItems();
});

itemsBody.addEventListener("click", (event) => {
  const index = Number(event.target.dataset.delete);
  if (Number.isNaN(index)) return;

  state.items.splice(index, 1);
  if (state.items.length === 0) {
    state.items.push({ concept: "Nuevo concepto", quantity: 1, price: 0 });
  }
  renderItems();
});

document.querySelector("#addItemBtn").addEventListener("click", () => {
  state.items.push({ concept: "Nuevo concepto", quantity: 1, price: 0 });
  renderItems();
});

document.querySelector("#newBtn").addEventListener("click", resetForm);
document.querySelector("#printBtn").addEventListener("click", () => window.print());

renderItems();
