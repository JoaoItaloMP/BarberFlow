/* =========================
   ELEMENTOS DA TELA
========================== */

/*
  Captura o formulário
  de agendamento.
*/
const form =
  document.querySelector("#appointment-form");

/*
  Captura a lista onde
  os cards serão renderizados.
*/
const appointmentsList =
  document.querySelector("#appointments-list");

/* =========================
   RENDERIZAR AGENDAMENTOS
========================== */

/*
  Função responsável por:

  - limpar a tela
  - buscar dados
  - criar cards
  - renderizar cards
*/
function renderAppointments() {

  /* Limpa os cards antigos */
  appointmentsList.innerHTML = "";

  /* Busca agendamentos salvos */
  const appointments =
    getAppointments();

  /* Percorre todos os agendamentos */
  appointments.forEach((appointment, index) => {

    /* Cria card */
    const card =
      document.createElement("div");

    /* Adiciona classe */
    card.classList.add("appointment-card");

    /* Estrutura HTML do card */
    card.innerHTML = `
      <h3>${appointment.name}</h3>

      <p>
        Serviço:
        ${appointment.service}
      </p>

      <p>
        Data:
        ${appointment.date}
      </p>

      <p>
        Horário:
        ${appointment.time}
      </p>

      <div class="card-buttons">

        <button
          class="delete-btn"
          onclick="deleteAppointment(${index})"
        >
          Excluir
        </button>

      </div>
    `;

    /* Adiciona card na tela */
    appointmentsList.appendChild(card);

  });
}

/* =========================
   ADICIONAR AGENDAMENTO
========================== */

/*
  Evento disparado quando
  o formulário é enviado.
*/
form.addEventListener("submit", (event) => {

  /* Impede recarregar página */
  event.preventDefault();

  /* Captura valores dos inputs */
  const name =
    document.querySelector("#client-name").value;

  const service =
    document.querySelector("#service").value;

  const date =
    document.querySelector("#date").value;

  const time =
    document.querySelector("#time").value;

  /* Cria objeto do agendamento */
  const newAppointment = {

    name,
    service,
    date,
    time
  };

  /* Busca agendamentos atuais */
  const appointments =
    getAppointments();

  /* Adiciona novo agendamento */
  appointments.push(newAppointment);

  /* Salva novamente */
  saveAppointments(appointments);

  /* Atualiza tela */
  renderAppointments();

  /* Limpa formulário */
  form.reset();

});

/* =========================
   EXCLUIR AGENDAMENTO
========================== */

/*
  Remove um agendamento
  pelo índice do array.
*/
function deleteAppointment(index) {

  /* Busca agendamentos */
  const appointments =
    getAppointments();

  /* Remove item */
  appointments.splice(index, 1);

  /* Salva novamente */
  saveAppointments(appointments);

  /* Atualiza tela */
  renderAppointments();
}

/* =========================
   INICIALIZAÇÃO
========================== */

/*
  Renderiza os agendamentos
  quando a página abrir.
*/
renderAppointments();