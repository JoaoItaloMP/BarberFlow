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

/*
Elemento do toast.
*/
const toast =
  document.querySelector("#toast");

/* =========================
   CONTROLE DE EDIÇÃO
========================== */

/*
  Armazena o índice do
  agendamento em edição.

  Se for null:
  estamos criando.

  Se tiver valor:
  estamos editando.
*/
let editingIndex = null;

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

      <p>
        Status:

        <span class="
          status-badge

          ${
            appointment.status === "Agendado"
              ? "status-agendado"
              : appointment.status === "Em andamento"
              ? "status-andamento"
              : "status-finalizado"
          }
        ">
          ${appointment.status}
        </span>

      </p>
      

      <div class="card-buttons">

        <button
          onclick="changeStatus(${index})"
        >
          Alterar Status
        </button>

        <!-- Botão editar -->
        <button
            onclick="editAppointment(${index})"
        >
            Editar
        </button>

        <!-- Botão excluir -->
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

  /*
  Objeto do novo agendamento
  */
  const newAppointment = {

    name,
    service,
    date,
    time,

    /*
      Status inicial
      do atendimento.
    */
    status: "Agendado"
};

/* Busca agendamentos atuais */
const appointments =
getAppointments();

/* =========================
VERIFICA HORÁRIO DUPLICADO
========================== */

/*
Verifica se já existe
um agendamento com:

- mesma data
- mesmo horário
*/
const alreadyExists =
appointments.some((appointment) => {

    return (
    appointment.date === date &&
    appointment.time === time
    );

});

/*
Se já existir,
interrompe o cadastro.
*/
if (alreadyExists) {

showToast(
  "Já existe um agendamento neste horário."
);

return;
}

/* =========================
   MODO EDIÇÃO
========================== */

/*
  Se estiver editando:
  atualiza item existente.
*/
if (editingIndex !== null) {

  appointments[editingIndex] =
    newAppointment;

  /*
    Reseta modo edição
  */
  editingIndex = null;

} else {

  /*
    Se não:
    cria novo agendamento.
  */
  appointments.push(newAppointment);

}

  /* Salva novamente */
  saveAppointments(appointments);

  /* Atualiza tela */
  renderAppointments();

  /* Exibe sucesso */
  showToast(
    "Agendamento salvo com sucesso."
  );

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

/* =========================
   EDITAR AGENDAMENTO
========================== */

/*
  Preenche o formulário
  com os dados do card.
*/
function editAppointment(index) {

  /* Busca agendamentos */
  const appointments =
    getAppointments();

  /* Agendamento selecionado */
  const appointment =
    appointments[index];

  /* Preenche formulário */
  document.querySelector("#client-name").value =
    appointment.name;

  document.querySelector("#service").value =
    appointment.service;

  document.querySelector("#date").value =
    appointment.date;

  document.querySelector("#time").value =
    appointment.time;

  /*
    Define índice em edição
  */
  editingIndex = index;

}

/* =========================
   ALTERAR STATUS
========================== */

/*
  Alterna o status
  do atendimento.
*/
function changeStatus(index) {

  /* Busca agendamentos */
  const appointments =
    getAppointments();

  /* Agendamento atual */
  const appointment =
    appointments[index];

  /*
    Fluxo dos status:
    Agendado
    → Em andamento
    → Finalizado
  */

  if (appointment.status === "Agendado") {

    appointment.status =
      "Em andamento";

  } else if (
    appointment.status === "Em andamento"
  ) {

    appointment.status =
      "Finalizado";

  } else {

    appointment.status =
      "Agendado";
  }

  /* Salva alterações */
  saveAppointments(appointments);

  /* Atualiza tela */
  renderAppointments();

  /* Toast */
  showToast(
    "Status atualizado."
  );

}

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

  /* Notificação */
  showToast(
    "Agendamento removido."
  );
}

/* =========================
   INICIALIZAÇÃO
========================== */

/*
  Renderiza os agendamentos
  quando a página abrir.
*/
renderAppointments();

/* =========================
   TOAST NOTIFICATION
========================== */

/*
  Exibe notificações
  elegantes na tela.
*/
function showToast(message) {

  /* Define texto */
  toast.textContent = message;

  /* Mostra toast */
  toast.classList.add("show");

  /* Remove após 3 segundos */
  setTimeout(() => {

    toast.classList.remove("show");

  }, 3000);

}