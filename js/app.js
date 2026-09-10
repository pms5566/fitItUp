/* ============================================================
    FIT IT UP | Main JavaScript
   js/main.js
   ============================================================ */

'use strict';

// ── Navbar: Scroll Behaviour ──────────────────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScroll = 0;

  function onScroll() {
    const currentScroll = window.scrollY;

    if (currentScroll > 60) {
      navbar.classList.remove('navbar--transparent');
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.add('navbar--transparent');
      navbar.classList.remove('navbar--scrolled');
    }

    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


// ── Hamburger Menu Toggle ─────────────────────────────────────
(function initHamburger() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    hamburger.classList.add('is-open');
    mobileMenu.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });

  // Close on nav link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
})();


// ── Scroll-Triggered Animations (IntersectionObserver + Scroll Fallback) ──
(function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]');
  if (!elements.length) return;

  function revealElement(el) {
    if (!el.classList.contains('in-view')) {
      el.classList.add('in-view');
    }
  }

  // Fallback scanner for robust reveal on scroll, jump, and load
  function checkVisibility() {
    const windowH = window.innerHeight || document.documentElement.clientHeight;
    elements.forEach(el => {
      if (el.classList.contains('in-view')) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < windowH + 80 && rect.bottom > -50) {
        revealElement(el);
      }
    });
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            revealElement(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.02,
        rootMargin: '0px 0px 80px 0px'
      }
    );
    elements.forEach(el => observer.observe(el));
  }

  // Fail-safe listeners for anchor navigation, rapid scrolling, and mobile orientation change
  window.addEventListener('scroll', checkVisibility, { passive: true });
  window.addEventListener('resize', checkVisibility, { passive: true });
  window.addEventListener('hashchange', () => {
    setTimeout(checkVisibility, 50);
    setTimeout(checkVisibility, 350);
  });

  // When clicking any in-page anchor, trigger visibility check after smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', () => {
      setTimeout(checkVisibility, 100);
      setTimeout(checkVisibility, 400);
    });
  });

  // Run on initial load and after a short tick
  checkVisibility();
  setTimeout(checkVisibility, 200);
})();


// ── Count-Up Animation ─────────────────────────────────────────
(function initCountUp() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  function animateCount(el) {
    const target  = parseInt(el.getAttribute('data-count'), 10);
    const suffix  = el.querySelector('span') ? el.querySelector('span').textContent : '';
    const duration = 1800; // ms
    const steps    = 60;
    const stepTime = duration / steps;
    let current    = 0;

    // Get just the text node (number part)
    const textNode = el.childNodes[0];

    const timer = setInterval(() => {
      current += target / steps;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      textNode.textContent = Math.floor(current);
    }, stepTime);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
})();


// ── Active Nav Link Highlight (ScrollSpy for Single Page) ───────
(function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__links a[href^="#"], .mobile-menu__nav a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  function updateActiveLink() {
    const scrollY = window.scrollY;
    const navHeight = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-height'), 10) || 70;

    let currentSectionId = '';

    sections.forEach(section => {
      const top = section.offsetTop - navHeight - 60;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (!currentSectionId && sections.length > 0) {
      if (scrollY < sections[0].offsetTop) {
        currentSectionId = sections[0].getAttribute('id');
      }
    }

    if (currentSectionId) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href').replace('#', '');
        if (href === currentSectionId) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        } else {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
        }
      });
    }
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
})();


// ── Smooth Anchor Scroll & Mobile Menu Dismiss ──────────────────
(function initSmoothScroll() {
  const mobileMenu = document.getElementById('mobile-menu');
  const hamburger  = document.getElementById('hamburger');

  function closeMenu() {
    if (hamburger && mobileMenu) {
      hamburger.classList.remove('is-open');
      mobileMenu.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      closeMenu();

      const navHeight = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-height'), 10) || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

// ── FAQ Accordion Handler ──────────────────────────────────────
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  if (!item) return;
  const panel = item.querySelector('.faq-panel');
  const isOpen = item.classList.contains('is-open');

  // Close all other open items in the same FAQ list
  document.querySelectorAll('.faq-item.is-open').forEach(other => {
    if (other !== item) {
      other.classList.remove('is-open');
      const otherPanel = other.querySelector('.faq-panel');
      if (otherPanel) otherPanel.style.maxHeight = '0px';
    }
  });

  if (isOpen) {
    item.classList.remove('is-open');
    panel.style.maxHeight = '0px';
  } else {
    item.classList.add('is-open');
    panel.style.maxHeight = panel.scrollHeight + 'px';
  }
}

// ── CMS Dynamic Synchronization Layer ─────────────────────────
(function initCMSBridge() {
  function getCoachPhone() {
    if (window.FitItUpCMS) {
      return window.FitItUpCMS.getSettings().whatsappPhone || '919999999999';
    }
    return '919999999999';
  }

  function syncFromCMS() {
    if (!window.FitItUpCMS) return;
    const phone = getCoachPhone();

    // 1. Update WhatsApp CTAs
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
      const currentUrl = link.getAttribute('href');
      const textMatch = currentUrl.match(/text=([^&]+)/);
      const textParam = textMatch ? `?text=${textMatch[1]}` : '';
      link.setAttribute('href', `https://wa.me/${phone}${textParam}`);
    });

    // 2. Render Slots
    const slotGrid = document.querySelector('.booking-widget__grid');
    if (slotGrid) {
      const slots = window.FitItUpCMS.getSlots();
      slotGrid.innerHTML = slots.map(s => {
        if (!s.active) return '';
        return `<button type="button" class="time-slot-btn" onclick="selectSlot(this)">${s.time}</button>`;
      }).join('');
    }

    // 3. Render Programs
    const pricingGrid = document.querySelector('.pricing__grid');
    if (pricingGrid) {
      const programs = window.FitItUpCMS.getPrograms();
      pricingGrid.innerHTML = programs.map((p, idx) => `
        <div class="pricing-card ${p.featured ? 'pricing-card--featured' : ''}" data-animate data-delay="${idx + 1}">
          ${p.badge ? `<div class="pricing-card__badge">${p.badge}</div>` : ''}
          <div>
            <div class="pricing-card__name">${p.name}</div>
            <div class="pricing-card__desc">${p.description}</div>
          </div>
          <div class="pricing-card__price">
            <span class="currency">₹</span>
            <span class="amount">${p.price}</span>
            <span class="period">${p.period}</span>
          </div>
          <ul class="pricing-card__features">
            ${p.features.map(f => `
              <li class="pricing-card__feature">
                <span class="check"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="2,6 5,9 10,3"/></svg></span>
                ${f}
              </li>
            `).join('')}
          </ul>
          <a href="https://wa.me/${phone}?text=${encodeURIComponent(`Hi Ashish, I'm interested in the ${p.name} Plan!`)}" 
             class="btn ${p.featured ? 'btn-primary' : 'btn-outline'}" 
             target="_blank" rel="noopener">
            Book ${p.name} Plan ${p.featured ? '→' : ''}
          </a>
        </div>
      `).join('');
    }

    // 4. Render FAQs
    const faqList = document.querySelector('.faq-list');
    if (faqList) {
      const faqs = window.FitItUpCMS.getFaqs();
      faqList.innerHTML = faqs.map((f, idx) => `
        <div class="faq-item" data-animate data-delay="${idx + 1}">
          <button class="faq-trigger" onclick="toggleFaq(this)">
            ${f.question}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="faq-panel">
            <div class="faq-content">${f.answer}</div>
          </div>
        </div>
      `).join('');
    }

    // 5. Render Studio Rates
    const studioStrip = document.querySelector('.studio-rate-strip');
    if (studioStrip && window.FitItUpCMS.getStudio) {
      const studio = window.FitItUpCMS.getStudio();
      const rateItems = studioStrip.querySelectorAll('.studio-rate-item');
      if (rateItems.length >= 3) {
        if (studio.hourlyRate) {
          const p = rateItems[0].querySelector('.studio-rate-item__price');
          if (p) p.textContent = `₹${studio.hourlyRate}`;
        }
        if (studio.creatorRate) {
          const p = rateItems[1].querySelector('.studio-rate-item__price');
          if (p) p.textContent = `₹${studio.creatorRate}`;
        }
        if (studio.trainerRate) {
          const p = rateItems[2].querySelector('.studio-rate-item__price');
          if (p) p.textContent = `₹${studio.trainerRate}`;
        }
      }
    }
  }

  // Initial sync
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncFromCMS);
  } else {
    syncFromCMS();
  }

  // Listen for real-time CMS changes
  window.addEventListener('fititup_cms_update', syncFromCMS);
  window.addEventListener('storage', syncFromCMS);
})();

// ── Time Slot Selection Handler ────────────────────────────────
let selectedSlotBtn = null;
function selectSlot(btn) {
  if (selectedSlotBtn) selectedSlotBtn.classList.remove('is-selected');
  btn.classList.add('is-selected');
  selectedSlotBtn = btn;
  const cta = document.getElementById('book-slot-cta');
  if (cta) cta.style.display = 'block';
}

function confirmBooking() {
  if (!selectedSlotBtn) return;
  const slot = selectedSlotBtn.textContent.trim();
  const phone = window.FitItUpCMS ? window.FitItUpCMS.getSettings().whatsappPhone : '919999999999';
  const text = `Hi Ashish! I'd like to book a free 15-minute clarity call for the *${slot}* time slot. Please let me know if this works!`;
  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  window.open(waUrl, '_blank');
}

// ── Contact Form Handler (Direct to WhatsApp & Auto-Saved to CMS) ───
function handleFormSubmit(e) {
  e.preventDefault();

  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const directWaBtn = document.getElementById('success-wa-btn');

  const name = document.getElementById('fname') ? document.getElementById('fname').value.trim() : '';
  const phone = document.getElementById('wa-num') ? document.getElementById('wa-num').value.trim() : '';
  const email = document.getElementById('email') ? document.getElementById('email').value.trim() : '';
  const goal = document.getElementById('goal') ? document.getElementById('goal').value : '';
  const message = document.getElementById('message') ? document.getElementById('message').value.trim() : '';
  const slot = selectedSlotBtn ? selectedSlotBtn.textContent.trim() : 'Not selected';

  // Automatically save to CMS Lead CRM
  if (window.FitItUpCMS) {
    window.FitItUpCMS.addLead({
      name,
      phone,
      email,
      goal,
      slot,
      message
    });
  }

  const coachPhone = window.FitItUpCMS ? window.FitItUpCMS.getSettings().whatsappPhone : '919999999999';

  // Construct structured WhatsApp message
  const waMessage = 
`🔥 *FitItUp — Free Consultation Request*

👤 *Name:* ${name}
📱 *WhatsApp:* ${phone}
📧 *Email:* ${email}
🎯 *Goal:* ${goal || 'General Fitness'}
📅 *Preferred Slot:* ${slot}
💬 *Message:* ${message ? message : 'Looking forward to getting started!'}`;

  const waUrl = `https://wa.me/${coachPhone}?text=${encodeURIComponent(waMessage)}`;

  if (directWaBtn) {
    directWaBtn.href = waUrl;
  }

  if (form && success) {
    form.style.display = 'none';
    success.style.display = 'block';
  }

  // Open WhatsApp in a new tab
  window.open(waUrl, '_blank');
}



