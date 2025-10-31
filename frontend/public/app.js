const form = document.getElementById('appt-form');
const list = document.getElementById('list');

async function load() {
  const res = await fetch('/api/appointments');
  const items = await res.json();
  list.innerHTML = items.map(a => `<li><b>${a.patient_name}</b> with <b>${a.doctor_name}</b> at ${new Date(a.scheduled_at).toLocaleString()} (${a.reason||'n/a'})</li>`).join('');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  if (data.scheduled_at) {
    data.scheduled_at = new Date(data.scheduled_at).toISOString();
  }
  await fetch('/api/appointments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  form.reset();
  await load();
});

load();
