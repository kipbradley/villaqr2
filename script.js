const sheetURL = "https://docs.google.com/spreadsheets/d/e/your_sheet_id/pub?output=csv";
const urlParams = new URLSearchParams(window.location.search);
const villaId = urlParams.get("villa");

fetch(sheetURL)
  .then(res => res.text())
  .then(data => {
    const lines = data.split("\n").map(line => line.split(","));
    const headers = lines[0];
    const villas = lines.slice(1).map(row => {
      let obj = {};
      headers.forEach((h, i) => obj[h.trim()] = row[i]?.trim());
      return obj;
    });

    const match = villas.find(v => v.villa_id === villaId);
    const content = document.getElementById("content");

    if (!match) {
      content.innerHTML = `<p>Villa ID not found. Please check your link.</p>`;
      return;
    }

    content.innerHTML = `
      <section>
        <h3>Wi-Fi</h3>
        <p><strong>Network:</strong> ${match.wifi_name}</p>
        <p><strong>Password:</strong> ${match.wifi_pass}</p>
      </section>
      <section>
        <h3>TV Instructions</h3>
        <ul>
          <li><strong>Living Room:</strong> FireTV + XUMO (use FireTV remote to switch input, then XUMO remote)</li>
          <li><strong>Guest Bedroom:</strong> FireTV only (FireTV remote)</li>
        </ul>
        <p><strong>Streaming:</strong> The Xfinity Stream app is preloaded and managed by our team.</p>
        <p>To watch: switch to HDMI1, then use the XUMO remote to open the Xfinity Stream app.</p>
      </section>
      <section>
        <h3>Check-Out</h3>
        <p>${match.checkout_info}</p>
      </section>
      <section>
        <h3>Restaurant Hours</h3>
        <p><strong>Breakfast:</strong> ${match.breakfast_time}</p>
        <p><strong>Lunch:</strong> ${match.lunch_time}</p>
        <p><strong>Dinner:</strong> ${match.dinner_time}</p>
      </section>
      <section>
        <h3>Emergency Info</h3>
        <p>${match.emergency_info || "Please contact the front desk for assistance."}</p>
      </section>
    `;
  })
  .catch(err => {
    document.getElementById("content").innerHTML = `<p>Error loading villa data.</p>`;
    console.error(err);
  });
