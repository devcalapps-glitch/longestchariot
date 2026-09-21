// Mobile nav toggle
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// Highlight the current page's nav link
function markActiveNavLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav-link]').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === path) {
      link.classList.add('text-amber-400');
      link.classList.remove('text-slate-200');
      link.setAttribute('aria-current', 'page');
    }
  });
}

// Reveal [data-animate] elements as they scroll into view
function initScrollReveal() {
  const targets = document.querySelectorAll('[data-animate]');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}

// Footer year
function setFooterYear() {
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// Contact form: client-side validation, then submit to Formspree
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const FORM_ENDPOINT = 'https://formspree.io/f/xaeyyrln';
  const status = document.getElementById('form-status');
  const submitButton = form.querySelector('button[type="submit"]');
  const fields = ['name', 'email', 'subject', 'message'];

  // Prefill subject if ?project= is in URL
  const urlParams = new URLSearchParams(window.location.search);
  const projectParam = urlParams.get('project');
  if (projectParam && form.subject) {
    form.subject.value = `Inquiry regarding ${projectParam}`;
  }


  function showError(field, message) {
    const errorEl = document.getElementById(`${field}-error`);
    const inputEl = document.getElementById(field);
    if (errorEl) errorEl.textContent = message;
    if (inputEl) inputEl.classList.toggle('border-red-500', Boolean(message));
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validate() {
    let valid = true;

    const name = form.name.value.trim();
    if (!name) {
      showError('name', 'Please enter your name.');
      valid = false;
    } else {
      showError('name', '');
    }

    const email = form.email.value.trim();
    if (!email || !isValidEmail(email)) {
      showError('email', 'Please enter a valid email address.');
      valid = false;
    } else {
      showError('email', '');
    }

    const subject = form.subject.value.trim();
    if (!subject) {
      showError('subject', 'Please enter a subject.');
      valid = false;
    } else {
      showError('subject', '');
    }

    const message = form.message.value.trim();
    if (!message) {
      showError('message', 'Please enter a message.');
      valid = false;
    } else if (message.length < 10) {
      showError('message', 'Message should be at least 10 characters.');
      valid = false;
    } else {
      showError('message', '');
    }

    return valid;
  }

  fields.forEach((field) => {
    const input = document.getElementById(field);
    if (input) input.addEventListener('blur', validate);
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validate()) {
      if (status) {
        status.textContent = 'Please fix the errors above and try again.';
        status.className = 'text-sm font-medium text-red-600 mt-4';
      }
      return;
    }

    if (submitButton) submitButton.disabled = true;
    if (status) {
      status.textContent = 'Sending...';
      status.className = 'text-sm font-medium text-slate-500 mt-4';
    }

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });

      if (response.ok) {
        if (status) {
          status.textContent = "Thanks for reaching out! We'll get back to you soon.";
          status.className = 'text-sm font-medium text-emerald-600 mt-4';
        }
        form.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      if (status) {
        status.textContent = 'Something went wrong sending your message. Please try again in a moment.';
        status.className = 'text-sm font-medium text-red-600 mt-4';
      }
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

// App filter tabs and quick search
function initAppFilter() {
  const filterBtns = document.querySelectorAll('[data-filter-btn]');
  const appCards = document.querySelectorAll('[data-app-card]');
  const searchInput = document.getElementById('app-search');
  const emptyState = document.getElementById('apps-empty-state');
  const countBadge = document.getElementById('apps-count');

  if (!filterBtns.length && !searchInput) return;

  let currentCategory = 'all';
  let searchQuery = '';

  function applyFilters() {
    let visibleCount = 0;

    appCards.forEach((card) => {
      const category = card.getAttribute('data-category') || '';
      const title = card.getAttribute('data-title')?.toLowerCase() || '';
      const desc = card.getAttribute('data-desc')?.toLowerCase() || '';

      const matchesCat = currentCategory === 'all' || category === currentCategory;
      const matchesSearch = !searchQuery || title.includes(searchQuery) || desc.includes(searchQuery);

      if (matchesCat && matchesSearch) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.classList.remove('hidden');
      } else {
        emptyState.classList.add('hidden');
      }
    }

    if (countBadge) {
      countBadge.textContent = `${visibleCount} ${visibleCount === 1 ? 'project' : 'projects'}`;
    }
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('bg-amber-400', 'text-slate-950', 'shadow-sm', 'font-semibold');
        b.classList.add('bg-slate-100', 'text-slate-600', 'hover:bg-slate-200');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('bg-amber-400', 'text-slate-950', 'shadow-sm', 'font-semibold');
      btn.classList.remove('bg-slate-100', 'text-slate-600', 'hover:bg-slate-200');
      btn.setAttribute('aria-pressed', 'true');

      currentCategory = btn.getAttribute('data-filter-btn') || 'all';
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  markActiveNavLink();
  initScrollReveal();
  setFooterYear();
  initContactForm();
  initAppFilter();
});

