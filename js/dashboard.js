/* =========================
   ELEMENTOS DA TELA
========================== */

/*
  Captura o formulário
  de agendamento.
*/
const form =
  document.querySelector("#appointment-form");

const clientNameInput =
  document.querySelector("#client-name");

const dateInput =
  document.querySelector("#date");

/* Modal */
const eventModal =
  document.querySelector("#event-modal");

const modalBody =
  document.querySelector("#modal-body");

const closeModalButton =
  document.querySelector("#close-modal");
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

/*
  Select do filtro.
*/
const statusFilter =
  document.querySelector("#status-filter");

/*
  Input de busca.
*/
const searchInput =
  document.querySelector("#search-input");

/* =========================
   ELEMENTOS DAS ESTATÍSTICAS
========================== */

const totalStat =
  document.querySelector("#total-stat");

const scheduledStat =
  document.querySelector("#scheduled-stat");

const progressStat =
  document.querySelector("#progress-stat");

const finishedStat =
  document.querySelector("#finished-stat");
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
   ATUALIZA ESTATÍSTICAS
========================== */

function updateStats() {

  /* Busca agendamentos */
  const appointments =
    getAppointments();

  /* Total */
  totalStat.textContent =
    appointments.length;

  /* Agendados */
  scheduledStat.textContent =
    appointments.filter((appointment) => {

      return (
        appointment.status === "Agendado"
      );

    }).length;

  /* Em andamento */
  progressStat.textContent =
    appointments.filter((appointment) => {

      return (
        appointment.status === "Em andamento"
      );

    }).length;

  /* Finalizados */
  finishedStat.textContent =
    appointments.filter((appointment) => {

      return (
        appointment.status === "Finalizado"
      );

    }).length;

}

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
  
  /* =========================
   ORDENAÇÃO DA AGENDA
  ========================== */
  /*
    Organiza agendamentos
    por data e horário.
  */
  appointments.sort((a, b) => {

    /*
      Cria datas completas
      para comparação.
    */
    const dateA =
      new Date(`${a.date}T${a.time}`);

    const dateB =
      new Date(`${b.date}T${b.time}`);

    /*
      Ordem crescente:
      mais próximo primeiro.
    */
    return dateA - dateB;

  });

  /* =========================
   FILTRO DE STATUS
  ========================== */

  /*
    Valor selecionado
    no filtro.

    Se o select não existir,
    usa "Todos".
  */
  const selectedStatus =
    statusFilter
      ? statusFilter.value
      : "Todos";

    /* =========================
      FILTRO DE STATUS
    ========================== */

    let filteredAppointments =
      appointments;

    /*
      Filtra por status
    */
    if (selectedStatus !== "Todos") {

      filteredAppointments =
        filteredAppointments.filter((appointment) => {

          return (
            appointment.status === selectedStatus
          );

        });

    }

    /* =========================
      FILTRO DE BUSCA
    ========================== */

    /*
      Texto digitado
    */
    const searchTerm =
      searchInput
        ? searchInput.value.toLowerCase()
        : "";

    /*
      Filtra pelo nome
    */
    filteredAppointments =
      filteredAppointments.filter((appointment) => {

        return (
          appointment.name
            .toLowerCase()
            .includes(searchTerm)
        );

      });

  /* Percorre todos os agendamentos */
  filteredAppointments.forEach((appointment) => {

    /* Cria card */
    const card =
      document.createElement("div");

    /* Adiciona classe */
    card.classList.add("appointment-card");

    /* Estrutura HTML do card */
    card.innerHTML = `
      
      <!-- Cabeçalho -->
      <div class="appointment-top">
      
        <!-- Nome -->
        <h3>
          ${appointment.name}
        </h3>

        <!-- Horário -->
        <span class="appointment-time">
          ${appointment.time}
        </span>

      </div>

      <!-- Informações -->
      <div class="appointment-info">

        <p>
          <strong>Serviço:</strong>
          ${appointment.service}
        </p>

        <p>
          <strong>Data:</strong>
          ${appointment.date}
        </p>

        <p>
          <strong>Status:</strong>

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

      </div>

      <!-- Botões -->
      <div class="card-buttons">

        <button
          onclick="changeStatus('${appointment.id}')"
          >
          Alterar Status
        </button>

        <button
          onclick="editAppointment('${appointment.id}')"
          >
          Editar
        </button>

        <button
          class="delete-btn"
          onclick="deleteAppointment('${appointment.id}')"
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

    id: crypto.randomUUID(),

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
  outro agendamento
  com mesma data e horário.
*/
const alreadyExists =
  appointments.some((appointment) => {

    /*
      Ignora o próprio item
      durante edição.
    */
    if (appointment.id === editingIndex) {

      return false;
    }

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

  /*
  Busca índice real
  pelo ID.
  */
  const appointmentIndex =
    appointments.findIndex((appointment) => {

      return appointment.id === editingIndex;

    });

  /*
    Mantém mesmo ID
  */
  newAppointment.id =
    editingIndex;

  /*
    Atualiza item
  */
  appointments[appointmentIndex] =
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

  updateCalendarEvents();

  updateStats();

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
function editAppointment(id) {

  /* Busca agendamentos */
  const appointments =
    getAppointments();

  /* Agendamento selecionado */
  const appointment =
  appointments.find((appointment) => {

    return appointment.id === id;

  });

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
  editingIndex = id;

}

/* =========================
   ALTERAR STATUS
========================== */

/*
  Alterna o status
  do atendimento.
*/
function changeStatus(id) {

  /* Busca agendamentos */
  const appointments =
    getAppointments();

  /* Agendamento atual */
  const appointment =
  appointments.find((appointment) => {

    return appointment.id === id;

  });
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

  updateCalendarEvents();

  updateStats();

  /* Toast */
  showToast(
    "Status atualizado."
  );

}

function deleteAppointment(id) {

  /* Busca agendamentos */
  const appointments =
    getAppointments();

  /* Remove item */
  const updatedAppointments =
  appointments.filter((appointment) => {

    return appointment.id !== id;

  });

saveAppointments(updatedAppointments);

  /* Atualiza tela */
  renderAppointments();

  updateCalendarEvents();

  updateStats();

  /* Notificação */
  showToast(
    "Agendamento removido."
  );
}

/* =========================
   EVENTO DO FILTRO
========================== */

/*
  Adiciona evento apenas
  se o filtro existir.
*/
if (statusFilter) {

  statusFilter.addEventListener("change", () => {

    renderAppointments();

    updateCalendarEvents();

    updateStats();

  });

}

/* =========================
   EVENTO DE BUSCA
========================== */

/*
  Atualiza lista
  enquanto digita.
*/
if (searchInput) {

  searchInput.addEventListener("input", () => {

    renderAppointments();

    updateCalendarEvents();

    updateStats();

  });

}

/* =========================
   INICIALIZAÇÃO
========================== */

/*
  Renderiza os agendamentos
  quando a página abrir.
*/
/* Inicializa sistema */
renderAppointments();

/* Atualiza métricas */
updateStats();

/* =========================
   FUNÇÕES GLOBAIS
========================== */

/*
  Torna funções acessíveis
  no HTML inline.
*/
window.changeStatus =
  changeStatus;

window.editAppointment =
  editAppointment;

window.deleteAppointment =
  deleteAppointment;

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

/* =========================
   FULLCALENDAR
========================== */

/*
  Elemento do calendário
*/
const calendarEl =
  document.querySelector("#calendar");

/*
  Inicializa calendário
*/

/* =========================
   EVENTOS DO CALENDÁRIO
========================== */

function updateCalendarEvents() {

  /*
    Remove eventos antigos
  */
  calendar.removeAllEvents();

  /*
    Busca agendamentos
  */
  const appointments =
    getAppointments();

  /*
    Adiciona eventos
  */
  appointments.forEach((appointment) => {

    /*
      Cria evento
    */
    calendar.addEvent({

      title:
        `${appointment.time} - ${appointment.name}`,

      start:
        `${appointment.date}T${appointment.time}`,

      extendedProps: {

        service:
          appointment.service,

        status:
          appointment.status
      }

    });

  });

}

const calendar =
  new FullCalendar.Calendar(calendarEl, {

    initialView: "dayGridMonth",

    locale: "pt-br",

    /*
      Barra ferramentas
    */
    headerToolbar: {

      left:
        "prev,next today",

      center:
        "title",

      right:
        "dayGridMonth,timeGridWeek,timeGridDay"

    },

    height: "auto",

    /*
      Horário comercial
    */
    slotMinTime: "08:00:00",

    slotMaxTime: "22:00:00",

    allDaySlot: false,

    /*
      Permite mover eventos
    */
    editable: true,

    /*
      Permite clicar
      nos dias.
    */
    dateClick(info) {

      /*
        Preenche input
        de data.
      */
      dateInput.value =
        info.dateStr;

      /*
        Scroll suave
      */
      form.scrollIntoView({

        behavior: "smooth"

      });

      /*
        Foca input nome
      */
      clientNameInput.focus();

      /*
        Toast
      */
      showToast(
        "Data selecionada no calendário"
      );

    },

    /*
      Clique em evento
    */
    eventClick(info) {

      /*
        Dados evento
      */
      const event =
        info.event;

      /*
        Conteúdo modal
      */
      modalBody.innerHTML = `

        <p>
          <strong>Cliente:</strong>
          ${event.title}
        </p>

        <p>
          <strong>Serviço:</strong>
          ${event.extendedProps.service}
        </p>

        <p>
          <strong>Status:</strong>
          ${event.extendedProps.status}
        </p>

        <p>
          <strong>Data:</strong>
          ${event.start.toLocaleDateString()}
        </p>

        <p>
          <strong>Horário:</strong>
          ${event.start.toLocaleTimeString([], {

            hour: "2-digit",
            minute: "2-digit"

          })}
        </p>

      `;

      /*
        Abre modal
      */
      eventModal.classList.add(
        "active"
      );

    },

    /*
      Evento movido
    */
   eventDrop(info) {

    /*
      Evento atualizado
    */
    const movedEvent =
      info.event;
    
    /*
      Busca agendamentos
    */
    const appointments =
      getAppointments();

    /*
      Busca agendamentos
      correspondente;
    */
    
    const appointment =
      appointments.find((appointment) => {

        return ( 
          '${appointment.time} - ${appointment.name}'
          ===
          movedEvent.title
        );

      });

    /*
      Se encontrou
    */
    if (appointment) {

      /*
        Atualiza data
      */
      appointment.data =
        movedEvent.startStr.split("T")[0];
      
      /*
        Salva alterações
      */
      saveAppointments(
        appointments
      );

      /*
        Atualiza cards
      */
     renderAppointments();

      /*
        Atualiza métricas
      */
     updateStats();

      /*
        Toast
      */
      showToast(
        "Agendamento movido com sucesso"
      );

    }

   }

});

/*
  Renderiza calendário
*/
calendar.render();

/* Atualiza eventos */
updateCalendarEvents();

/* =========================
   FECHAR MODAL
========================== */

closeModalButton.addEventListener(
  "click",
  () => {

    eventModal.classList.remove(
      "active"
    );

  }
);