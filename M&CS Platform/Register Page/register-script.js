const form = document.getElementById("registerForm");

const fullName        = document.getElementById("fullName");
const uniCode         = document.getElementById("uniCode");
const password        = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const togglePass    = document.getElementById("togglePass");
const toggleConfirm = document.getElementById("toggleConfirm");

const nameError    = document.getElementById("nameError");
const codeError    = document.getElementById("codeError");
const passError    = document.getElementById("passError");
const confirmError = document.getElementById("confirmError");

const toast = document.getElementById("toast");

/* ---- Toast ---- */
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

/* ---- Error helper ---- */
function setError(input, errorEl, show, msg = null) {
  if (show) {
    input.style.borderColor = "#dc2626";
    errorEl.style.display = "block";
    if (msg) errorEl.textContent = msg;
  } else {
    input.style.borderColor = "";
    errorEl.style.display = "none";
  }
}

/* ---- Toggle password visibility ---- */
togglePass.addEventListener("click", () => {
  const isHidden = password.type === "password";
  password.type = isHidden ? "text" : "password";
  togglePass.textContent = isHidden ? "إخفاء" : "إظهار";
});

toggleConfirm.addEventListener("click", () => {
  const isHidden = confirmPassword.type === "password";
  confirmPassword.type = isHidden ? "text" : "password";
  toggleConfirm.textContent = isHidden ? "إخفاء" : "إظهار";
});

/* ---- Form Submit ---- */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nameVal    = fullName.value.trim();
  const codeVal    = uniCode.value.trim();
  const passVal    = password.value.trim();
  const confirmVal = confirmPassword.value.trim();

  const nameInvalid    = nameVal.length === 0;
  const codeInvalid    = codeVal.length === 0;
  const passInvalid    = passVal.length === 0;
  const confirmInvalid = confirmVal.length === 0 || confirmVal !== passVal;

  setError(fullName,        nameError,    nameInvalid);
  setError(uniCode,         codeError,    codeInvalid);
  setError(password,        passError,    passInvalid);
  setError(
    confirmPassword,
    confirmError,
    confirmInvalid,
    confirmVal.length === 0 ? "من فضلك أكد كلمة المرور" : "كلمتا المرور غير متطابقتين"
  );

  if (nameInvalid || codeInvalid || passInvalid || confirmInvalid) {
    showToast("راجع البيانات الأول");
    return;
  }

  showToast("تم إنشاء الحساب بنجاح (واجهة فقط)");
});
