/* =====================================================================
   dashboard.js — الكورسات page logic
   Self-contained mock data (no backend) so the page works as a demo.
   Replace MOCK_FILES / loadFiles() with real fetch() calls to your API
   when you wire this up to a backend.
   ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mock data: subject -> content type -> files ---------- */
  const MOCK_FILES = {
    '1': {
      book: [
        {
          name: 'pdf.10',
          uploader: 'Ahmed Ali Ahmed',
          date: '27 أبريل 2026',
          section: 'سكشن 1',
          icon: 'fa-file-pdf',
          url: '#'
        }
      ],
      lecture: [],
      assignment: [],
      exams: []
    },
    '2': { book: [], lecture: [], assignment: [], exams: [] },
    '3': { book: [], lecture: [], assignment: [], exams: [] },
    '4': { book: [], lecture: [], assignment: [], exams: [] },
    '5': { book: [], lecture: [], assignment: [], exams: [] }
  };

  let currentSubject = '1';
  let currentType    = 'book';

  const subjectsBar = document.getElementById('subjectsBar');
  const contentBtns = document.getElementById('contentBtns');
  const filesList    = document.getElementById('filesList');

  /* ---------- Subject tab switching ---------- */
  subjectsBar.querySelectorAll('.subject-btn[data-subject]').forEach(btn => {
    btn.addEventListener('click', () => {
      subjectsBar.querySelectorAll('.subject-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSubject = btn.dataset.subject;
      renderFiles();
    });
  });

  /* ---------- Content type tab switching ---------- */
  contentBtns.querySelectorAll('.content-btn[data-content]').forEach(btn => {
    btn.addEventListener('click', () => {
      contentBtns.querySelectorAll('.content-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentType = btn.dataset.content;
      renderFiles();
    });
  });

  /* ---------- Render the file list for the current subject/type ---------- */
  function renderFiles() {
    const files = (MOCK_FILES[currentSubject] && MOCK_FILES[currentSubject][currentType]) || [];

    if (!files.length) {
      filesList.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1;">
          <i class="fa-solid fa-folder-open"></i>
          <h3>لا يوجد ملفات هنا حتى الآن</h3>
          <p>لم يتم رفع أي ملف في هذا القسم بعد</p>
        </div>`;
      return;
    }

    filesList.innerHTML = files.map(f => `
      <div class="file-card">
        <i class="fa-solid ${f.icon} file-card-icon"></i>
        <div class="file-card-name">${escapeHtml(f.name)}</div>
        <div class="file-card-meta">
          رُفع بواسطة: ${escapeHtml(f.uploader)} | ${escapeHtml(f.date)}<br/>
          ${escapeHtml(f.section)}
        </div>
        <div class="file-card-actions">
          <a class="file-btn dl" href="${f.url}" download>
            <i class="fa-solid fa-download"></i> تحميل
          </a>
          <button class="file-btn view" onclick="window.open('${f.url}','_blank')">
            <i class="fa-solid fa-eye"></i> عرض
          </button>
        </div>
      </div>
    `).join('');
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  renderFiles();
  /* ---------- Panel switching (sidebar + any button that needs it) ---------- */
  const PANEL_MAP = {
    courses:    'panelCourses',
    schedule:   'panelSchedule',
    addSubject: 'panelAddSubject'
  };

  function showPanel(name) {
    if (!PANEL_MAP[name]) return;

    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
    document.querySelector(`.sidebar-link[data-panel="${name}"]`)?.classList.add('active');

    document.querySelectorAll('.dash-panel').forEach(p => p.classList.remove('active'));
    document.getElementById(PANEL_MAP[name]).classList.add('active');
  }

  const sidebarLinks = document.querySelectorAll('.sidebar-link[data-panel]');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      showPanel(link.dataset.panel);
    });
  });

  /* ---------- Add subject: open the real form panel ---------- */
  document.getElementById('addSubjectBtn')?.addEventListener('click', () => {
    showPanel('addSubject');
  });

  document.getElementById('cancelAddSubjectBtn')?.addEventListener('click', () => {
    document.getElementById('addSubjectForm').reset();
    resetImagePreview();
    showPanel('courses');
  });

  /* ---------- Add subject: image upload + live preview ---------- */
  const subjectImageInput = document.getElementById('subjectImage');
  const imagePreview       = document.getElementById('imagePreview');
  const imageFileName      = document.getElementById('imageFileName');
  const imageRemoveBtn     = document.getElementById('imageRemoveBtn');

  function resetImagePreview() {
    imagePreview.innerHTML = '<i class="fa-solid fa-image"></i>';
    imageFileName.textContent = 'اضغط لاختيار صورة من جهازك';
    imageRemoveBtn.style.display = 'none';
    subjectImageInput.value = '';
  }

  subjectImageInput?.addEventListener('change', () => {
    const file = subjectImageInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      imagePreview.innerHTML = `<img src="${e.target.result}" alt="معاينة صورة المادة" />`;
    };
    reader.readAsDataURL(file);
    imageFileName.textContent = file.name;
    imageRemoveBtn.style.display = 'flex';
  });

  imageRemoveBtn?.addEventListener('click', e => {
    e.preventDefault();
    resetImagePreview();
  });

  /* ---------- Add subject: validation + submit ---------- */
  const addSubjectForm = document.getElementById('addSubjectForm');
  const formSuccessMsg  = document.getElementById('formSuccessMsg');

  const requiredFields = [
    { id: 'subjectName',  errId: 'err_subjectName'  },
    { id: 'subjectCode',  errId: 'err_subjectCode'  },
    { id: 'department',   errId: 'err_department'   },
    { id: 'academicYear', errId: 'err_academicYear' },
    { id: 'semester',     errId: 'err_semester'      },
    { id: 'creditHours',  errId: 'err_creditHours'  },
    { id: 'instructor',   errId: 'err_instructor'   }
  ];

  addSubjectForm?.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    requiredFields.forEach(({ id, errId }) => {
      const field = document.getElementById(id);
      const err   = document.getElementById(errId);
      const isEmpty = !field.value.trim();
      field.classList.toggle('invalid', isEmpty);
      err.classList.toggle('show', isEmpty);
      if (isEmpty) valid = false;
    });

    if (!valid) {
      formSuccessMsg.classList.remove('show');
      return;
    }

    /* ----- Build the new subject object (front-end only / no backend yet) ----- */
    const newSubject = {
      id: Date.now().toString(),
      name: document.getElementById('subjectName').value.trim(),
      code: document.getElementById('subjectCode').value.trim(),
      department: document.getElementById('department').value,
      year: document.getElementById('academicYear').value,
      semester: document.getElementById('semester').value,
      hours: document.getElementById('creditHours').value,
      instructor: document.getElementById('instructor').value.trim(),
      description: document.getElementById('subjectDesc').value.trim(),
      image: imagePreview.querySelector('img')?.src || null
    };

    /* Register it in the mock data store so it behaves like a real subject */
    MOCK_FILES[newSubject.id] = { book: [], lecture: [], assignment: [], exams: [] };

    /* Inject a real pill into the subjects bar, reusing .subject-btn styling */
    const newBtn = document.createElement('button');
    newBtn.className = 'subject-btn';
    newBtn.dataset.subject = newSubject.id;
    newBtn.textContent = newSubject.name;
    newBtn.addEventListener('click', () => {
      subjectsBar.querySelectorAll('.subject-btn').forEach(b => b.classList.remove('active'));
      newBtn.classList.add('active');
      currentSubject = newSubject.id;
      renderFiles();
    });
    subjectsBar.insertBefore(newBtn, document.getElementById('addSubjectBtn'));

    formSuccessMsg.classList.add('show');

    setTimeout(() => {
      addSubjectForm.reset();
      resetImagePreview();
      formSuccessMsg.classList.remove('show');
      requiredFields.forEach(({ id, errId }) => {
        document.getElementById(id).classList.remove('invalid');
        document.getElementById(errId).classList.remove('show');
      });
      newBtn.click();          // jump straight to the newly added subject
      showPanel('courses');
    }, 1200);
  });

/* ---------- Upload modal ---------- */
  const uploadModal      = document.getElementById('uploadModal');
  const uploadTriggerBtn = document.getElementById('uploadTriggerBtn');
  const modalCloseBtn    = document.getElementById('modalCloseBtn');
  const modalCancelBtn   = document.getElementById('modalCancelBtn');
  const modalFileInput   = document.getElementById('modalFileInput');
  const modalFileName    = document.getElementById('modalFileName');
  const modalUploadForm  = document.getElementById('modalUploadForm');

  function openModal() { uploadModal.classList.add('active'); }
  function closeModal() {
    uploadModal.classList.remove('active');
    modalUploadForm.reset();
    modalFileName.textContent = 'اضغط لاختيار ملف من جهازك';
  }

  uploadTriggerBtn.addEventListener('click', openModal);
  modalCloseBtn.addEventListener('click', closeModal);
  modalCancelBtn.addEventListener('click', closeModal);
  uploadModal.addEventListener('click', e => { if (e.target === uploadModal) closeModal(); });

  modalFileInput.addEventListener('change', () => {
    modalFileName.textContent = modalFileInput.files[0]?.name || 'اضغط لاختيار ملف من جهازك';
  });

  modalUploadForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!modalFileInput.files.length) {
      alert('اختر ملفاً أولاً');
      return;
    }
    const file = modalFileInput.files[0];
    const ext  = file.name.split('.').pop().toLowerCase();
    const icon = ext === 'pdf' ? 'fa-file-pdf'
               : ['doc','docx'].includes(ext) ? 'fa-file-word'
               : ['jpg','jpeg','png'].includes(ext) ? 'fa-file-image'
               : 'fa-file';

    MOCK_FILES[currentSubject][currentType].push({
      name: file.name,
      uploader: 'username',
      date: new Date().toLocaleDateString('ar-EG'),
      section: 'سكشن 1',
      icon,
      url: '#'
    });

    renderFiles();
    closeModal();
  });

  /* ---------- Mobile menu toggle ---------- */
  document.getElementById('menuBtn')?.addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('open');
  });

});

  /* ---------- Sidebar panel switching (الكورسات / جدول المحاضرات) ---------- */
  const sidebarLinks = document.querySelectorAll('.sidebar-link[data-panel]');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      sidebarLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      document.querySelectorAll('.dash-panel').forEach(p => p.classList.remove('active'));
      const targetId = link.dataset.panel === 'courses' ? 'panelCourses' : 'panelSchedule';
      document.getElementById(targetId).classList.add('active');
    });
  });

  /* ---------- Add subject (placeholder action) ---------- */
  // document.getElementById('addSubjectBtn')?.addEventListener('click', () => {
  //   alert('قريباً: نموذج إضافة مادة جديدة');
  // });

  /* ---------- Upload modal ---------- */
  const uploadModal      = document.getElementById('uploadModal');
  const uploadTriggerBtn = document.getElementById('uploadTriggerBtn');
  const modalCloseBtn    = document.getElementById('modalCloseBtn');
  const modalCancelBtn   = document.getElementById('modalCancelBtn');
  const modalFileInput   = document.getElementById('modalFileInput');
  const modalFileName    = document.getElementById('modalFileName');
  const modalUploadForm  = document.getElementById('modalUploadForm');

  function openModal() { uploadModal.classList.add('active'); }
  function closeModal() {
    uploadModal.classList.remove('active');
    modalUploadForm.reset();
    modalFileName.textContent = 'اضغط لاختيار ملف من جهازك';
  }

  uploadTriggerBtn.addEventListener('click', openModal);
  modalCloseBtn.addEventListener('click', closeModal);
  modalCancelBtn.addEventListener('click', closeModal);
  uploadModal.addEventListener('click', e => { if (e.target === uploadModal) closeModal(); });

  modalFileInput.addEventListener('change', () => {
    modalFileName.textContent = modalFileInput.files[0]?.name || 'اضغط لاختيار ملف من جهازك';
  });

  modalUploadForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!modalFileInput.files.length) {
      alert('اختر ملفاً أولاً');
      return;
    }
    const file = modalFileInput.files[0];
    const ext  = file.name.split('.').pop().toLowerCase();
    const icon = ext === 'pdf' ? 'fa-file-pdf'
               : ['doc','docx'].includes(ext) ? 'fa-file-word'
               : ['jpg','jpeg','png'].includes(ext) ? 'fa-file-image'
               : 'fa-file';

    MOCK_FILES[currentSubject][currentType].push({
      name: file.name,
      uploader: 'username',
      date: new Date().toLocaleDateString('ar-EG'),
      section: 'سكشن 1',
      icon,
      url: '#'
    });

    renderFiles();
    closeModal();
  });

  /* ---------- Mobile menu toggle ---------- */
  document.getElementById('menuBtn')?.addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('open');
  });


