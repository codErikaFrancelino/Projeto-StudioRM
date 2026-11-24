const WHATSAPP_PHONE = "5583991488967";

function getRequiredElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Elemento obrigatório não encontrado: #${id}`);
  }
  return element;
}

function createCell(text) {
  const cell = document.createElement("td");
  cell.textContent = text;
  return cell;
}

export function initModalitiesAndSchedule({ modalities, schedule }) {
  const modalitiesList = getRequiredElement("modalities-list");
  const scheduleBody = getRequiredElement("schedule-tbody");
  const interestSelect = getRequiredElement("modalidade-interesse");
  const trialForm = getRequiredElement("trial-form");
  const formFeedback = getRequiredElement("form-feedback");
  const categoryButtons = [...document.querySelectorAll(".filter-pill")];
  const dayButtons = [...document.querySelectorAll(".day-tab")];

  const renderModalities = (category = "todas") => {
    const fragment = document.createDocumentFragment();

    modalities
      .filter((modality) => category === "todas" || modality.category === category)
      .forEach((modality) => {
        const card = document.createElement("article");
        card.className = "modality-card";

        const name = document.createElement("strong");
        name.textContent = modality.name;
        const group = document.createElement("span");
        group.textContent = modality.group;

        card.append(name, group);
        fragment.append(card);
      });

    modalitiesList.replaceChildren(fragment);
  };

  const renderSchedule = (day = "todos") => {
    const fragment = document.createDocumentFragment();

    schedule
      .filter((item) => day === "todos" || item.days.includes(day))
      .forEach((item) => {
        const row = document.createElement("tr");
        row.append(
          createCell(item.modality),
          createCell(item.ageGroup),
          createCell(item.daysLabel),
          createCell(item.time)
        );

        const actionCell = document.createElement("td");
        const requestButton = document.createElement("button");
        requestButton.type = "button";
        requestButton.className = "btn-table";
        requestButton.textContent = "Solicitar";
        requestButton.addEventListener("click", () => {
          interestSelect.value = item.modality;
          trialForm.scrollIntoView({ behavior: "smooth", block: "center" });
          interestSelect.focus({ preventScroll: true });
        });
        actionCell.append(requestButton);
        row.append(actionCell);
        fragment.append(row);
      });

    scheduleBody.replaceChildren(fragment);
  };

  const selectOptions = document.createDocumentFragment();
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Selecione uma modalidade ou turma";
  selectOptions.append(placeholder);

  const interestOptions = new Set([
    ...modalities.map((modality) => modality.name),
    ...schedule.map((item) => item.modality),
  ]);
  interestOptions.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    selectOptions.append(option);
  });
  interestSelect.replaceChildren(selectOptions);

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      categoryButtons.forEach((item) => item.classList.toggle("active", item === button));
      renderModalities(button.dataset.category);
    });
  });

  dayButtons.forEach((button) => {
    button.addEventListener("click", () => {
      dayButtons.forEach((item) => item.classList.toggle("active", item === button));
      renderSchedule(button.dataset.day);
    });
  });

  trialForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!trialForm.reportValidity()) return;

    const formData = new FormData(trialForm);
    const message = [
      "Olá! Gostaria de solicitar uma aula experimental ou matrícula.",
      `Aluno(a) / responsável: ${formData.get("alunoNome").trim()}`,
      `Idade / faixa etária: ${formData.get("alunoIdade").trim()}`,
      `WhatsApp para contato: ${formData.get("alunoTelefone").trim()}`,
      `Modalidade / turma: ${formData.get("modalidadeInteresse") || "Não informada"}`,
      `Observações: ${formData.get("observacoes").trim() || "Nenhuma"}`,
    ].join("\n");

    formFeedback.textContent = "Abrindo o WhatsApp para concluir sua solicitação.";
    formFeedback.classList.remove("hidden");

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  });

  renderModalities();
  renderSchedule();
}