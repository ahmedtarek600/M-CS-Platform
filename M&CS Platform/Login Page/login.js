const form = document.getElementById("loginForm");
const uniCode = document.getElementById("uniCode");
const userRole = document.getElementById("userRole");
const nationalId = document.getElementById("nationalId");

const codeError = document.getElementById("codeError");
const roleError = document.getElementById("roleError");
const nationalIdError = document.getElementById("nationalIdError");

const toast = document.getElementById("toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

function setError(input, errorEl, show) {
  if (show) {
    input.style.borderColor = "#dc2626";
    errorEl.style.display = "block";
  } else {
    input.style.borderColor = "";
    errorEl.style.display = "none";
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const codeVal = uniCode.value.trim();
  const roleVal = userRole.value;
  const nationalIdVal = nationalId.value.trim();

  const codeInvalid = codeVal.length === 0;
  const roleInvalid = roleVal.length === 0;
  const nationalIdInvalid = nationalIdVal.length === 0;

  setError(uniCode, codeError, codeInvalid);
  setError(userRole, roleError, roleInvalid);
  setError(nationalId, nationalIdError, nationalIdInvalid);

  if (codeInvalid || roleInvalid || nationalIdInvalid) {
    showToast("راجع البيانات الأول");
    return;
  }

  showToast("تم تسجيل الدخول (واجهة فقط)");
});