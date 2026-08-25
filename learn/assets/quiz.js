// Minimal retrieval-quiz component. Mark options with data-ok="1" for the correct one.
document.querySelectorAll(".quiz .q").forEach((q) => {
  q.querySelectorAll("button.opt").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (q.classList.contains("answered")) return;
      q.classList.add("answered");
      q.querySelectorAll("button.opt").forEach((b) => {
        if (b.dataset.ok === "1") b.classList.add("correct");
        else if (b === btn) b.classList.add("wrong");
        b.disabled = true;
      });
    });
  });
});
