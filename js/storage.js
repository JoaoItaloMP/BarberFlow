/* =========================
   CHAVE DO LOCALSTORAGE
========================== */

/*
  Nome que será utilizado
  para armazenar os dados
  no navegador.
*/
const STORAGE_KEY = "barberflow_appointments";

/* =========================
   BUSCAR AGENDAMENTOS
========================== */

/*
  Recupera os agendamentos
  salvos no LocalStorage.

  Se não existir nada,
  retorna um array vazio.
*/
function getAppointments() {

  const appointments =
    localStorage.getItem(STORAGE_KEY);

  return appointments
    ? JSON.parse(appointments)
    : [];
}

/* =========================
   SALVAR AGENDAMENTOS
========================== */

/*
  Recebe um array de
  agendamentos e salva
  no LocalStorage.
*/
function saveAppointments(appointments) {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(appointments)
  );
}