
const gear = document.getElementById("gear");
const menu = document.getElementById("menu");
if (gear && menu) {
  gear.addEventListener("click", () => {
    menu.hidden = !menu.hidden;
    gear.setAttribute("aria-expanded", String(!menu.hidden));
  });
  document.addEventListener("click", e => {
    if (!menu.contains(e.target) && e.target !== gear) menu.hidden = true;
  });
}


const store = {
  get(k, d) { try { return localStorage.getItem(k) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} }
};
if (store.get("hms_password") === null) store.set("hms_password", "password12345"); // demo default


const viewer = document.getElementById("photos");
if (viewer) {
  // Put your real pictures in an "images" folder and list them here
  const rooms = [
    { src: "images/room1.jpg", label: "Patient room" },
    { src: "images/emergency.jpg", label: "Emergency Room" },
    { src: "images/lab.jpg", label: "Laboratory" }
  ];
  let i = 1;
  const draw = () => {
    viewer.innerHTML = "";
    [-1, 0, 1].forEach(offset => {
      const r = rooms[(i + offset + rooms.length) % rooms.length];
      const d = document.createElement("div");
      d.className = "photo" + (offset === 0 ? " main" : "");
      d.style.backgroundImage = `url("${r.src}")`;
      d.setAttribute("role", "img");
      d.setAttribute("aria-label", r.label);
      d.textContent = r.label; // shows if the image file is missing
      viewer.appendChild(d);
    });
  };
  document.getElementById("prev").onclick = () => { i = (i - 1 + rooms.length) % rooms.length; draw(); };
  document.getElementById("next").onclick = () => { i = (i + 1) % rooms.length; draw(); };
  draw();
}


const phone = document.getElementById("phone");
if (phone) {
  phone.value = store.get("hms_phone", "09123456789");
  document.getElementById("editPhone").addEventListener("click", () => {
    if (phone.readOnly) {
      phone.readOnly = false; phone.focus();
    } else {
      const ok = /^09\d{9}$/.test(phone.value);
      const msg = document.getElementById("msg");
      if (!ok) { msg.className = "msg error"; msg.textContent = "Enter an 11-digit number that starts with 09."; return; }
      store.set("hms_phone", phone.value);
      phone.readOnly = true;
      msg.className = "msg ok"; msg.textContent = "Mobile number updated.";
    }
  });
}


const pwForm = document.getElementById("pwForm");
if (pwForm) {
  const msg = document.getElementById("msg");
  const show = (t, type) => { msg.className = "msg " + type; msg.textContent = t; };
  document.getElementById("changeBtn").addEventListener("click", () => {
    const oldPw = document.getElementById("oldPw").value;
    const newPw = document.getElementById("newPw").value;
    const confirmPw = document.getElementById("confirmPw").value;
    if (oldPw !== store.get("hms_password")) return show("Old password is incorrect.", "error");
    if (newPw.length < 8) return show("New password must be at least 8 characters.", "error");
    if (newPw !== confirmPw) return show("New passwords do not match.", "error");
    store.set("hms_password", newPw);
    pwForm.reset();
    show("Password changed.", "ok");
  });
}
