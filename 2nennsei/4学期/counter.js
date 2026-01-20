// 個人HP風 簡易アクセスカウンター
let count = localStorage.getItem("access_count");

if (!count) {
  count = 0;
}

count++;
localStorage.setItem("access_count", count);

// 6桁表示（000001 みたいになる）
document.getElementById("counter").textContent =
  String(count).padStart(6, "0");
