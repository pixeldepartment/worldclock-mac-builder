
const config = {
  zones: [
    { label: "Deutschland", timezone: "Europe/Berlin" },
    { label: "Vietnam", timezone: "Asia/Ho_Chi_Minh" },
    { label: "USA", timezone: "America/New_York" }
  ]
};

const zonesContainer = document.getElementById('zones');
const detailsContainer = document.getElementById('details');
const settingsBtn = document.getElementById('settings-btn');
const settingsPanel = document.getElementById('settings-panel');
const selectZone = document.getElementById('zone-select');

function updateTimes() {
  zonesContainer.innerHTML = '';
  detailsContainer.innerHTML = '';
  const now = new Date();
  const cutoff = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  config.zones.forEach(zone => {
    const time = new Intl.DateTimeFormat('de-DE', {
      hour: '2-digit', minute: '2-digit', hour12: false,
      timeZone: zone.timezone
    }).format(now);

    const zoneDiv = document.createElement('div');
    zoneDiv.className = 'zone';
    zoneDiv.innerHTML = `<strong>${zone.label}</strong><br>${time}`;
    zonesContainer.appendChild(zoneDiv);

    const detailDiv = document.createElement('div');
    detailDiv.className = 'detail-zone';
    let html = `<strong>${zone.label}</strong><br>`;

    for (let i = 1; i <= 24; i++) {
      const hour = new Date(now.getTime() + i * 60 * 60 * 1000);
      if (hour > cutoff) break;
      html += new Intl.DateTimeFormat('de-DE', {
        hour: '2-digit', timeZone: zone.timezone
      }).format(hour) + '<br>';
    }

    detailDiv.innerHTML = html;
    detailsContainer.appendChild(detailDiv);
  });
}

settingsBtn.addEventListener('click', () => {
  settingsPanel.classList.toggle('hidden');
});

selectZone.addEventListener('change', e => {
  config.zones[1].timezone = e.target.value;
  config.zones[1].label = e.target.options[e.target.selectedIndex].text;
  localStorage.setItem('selected_timezone', e.target.value);
  updateTimes();
});

window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('selected_timezone');
  if (saved) {
    config.zones[1].timezone = saved;
    const label = selectZone.querySelector(`[value='${saved}']`)?.textContent;
    if (label) config.zones[1].label = label;
    selectZone.value = saved;
  }
  updateTimes();
  setInterval(updateTimes, 1000);
});
