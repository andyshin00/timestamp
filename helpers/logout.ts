export default function logout() {
  fetch("/api/logout", { method: "POST" });
}
