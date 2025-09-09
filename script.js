// Thai Therapie Rotterdam - Main JavaScript
(function() {
  'use strict';

  // DOM Elements
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const switchNl = document.getElementById('switch-nl');
  const switchEn = document.getElementById('switch-en');

  // Mobile menu functionality
  function initMobileMenu() {
    if (menuToggle && navLinks) {
      menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        
        // Update aria-expanded for accessibility
        const isExpanded = navLinks.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', isExpanded);
      });

      // Close mobile menu when clicking outside
      document.addEventListener('click', function(event) {
        if (!menuToggle.contains(event.target) && !navLinks.contains(event.target)) {
          navLinks.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });

      // Close mobile menu when clicking on a link
      navLinks.addEventListener('click', function(event) {
        if (event.target.tagName === 'A') {
          navLinks.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  // Language switching functionality
  function applyLanguage(lang) {
    const showNl = lang === 'nl';
    
    // Show/hide language-specific content
    document.querySelectorAll('.lang-nl').forEach(el => {
      el.style.display = showNl ? (el.tagName === 'SPAN' ? 'inline' : '') : 'none';
    });
    
    document.querySelectorAll('.lang-en').forEach(el => {
      el.style.display = showNl ? 'none' : (el.tagName === 'SPAN' ? 'inline' : '');
    });

    // Update active state on language switches
    if (switchNl && switchEn) {
      switchNl.classList.toggle('active', showNl);
      switchEn.classList.toggle('active', !showNl);
    }

    // Update HTML lang attribute
    document.documentElement.setAttribute('lang', lang);

    // Update page title
    document.title = showNl
      ? 'Thai Therapie Rotterdam - De beste Thaise Massages'
      : 'Thai Therapy Rotterdam - The Best Thai Massages';

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content',
        showNl
          ? 'Thai Therapie Rotterdam biedt professionele Thaise massages in Rotterdam. Ontspan met deep tissue, olie relax, hot stone en duo massages. Boek eenvoudig online.'
          : 'Thai Therapy Rotterdam offers professional Thai massages in Rotterdam. Relax with deep tissue, oil relaxation, hot stone and duo treatments. Book easily online.'
      );
    }

    // Save language preference
    try {
      localStorage.setItem('site_lang', lang);
    } catch(e) {
      console.warn('Could not save language preference:', e);
    }
  }

  function initLanguageSwitching() {
    // Set up click handlers
    if (switchNl) {
      switchNl.addEventListener('click', function(e) {
        e.preventDefault();
        applyLanguage('nl');
      });
    }

    if (switchEn) {
      switchEn.addEventListener('click', function(e) {
        e.preventDefault();
        applyLanguage('en');
      });
    }

    // Initialize with saved language or default to Dutch
    let initialLang = 'nl';
    try {
      const saved = localStorage.getItem('site_lang');
      if (saved === 'en' || saved === 'nl') {
        initialLang = saved;
      }
    } catch(e) {
      console.warn('Could not load language preference:', e);
    }

    applyLanguage(initialLang);
  }

  // Smooth scrolling for anchor links
  function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerHeight = document.querySelector('header').offsetHeight;
          const targetPosition = target.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Header scroll effect
  function initHeaderScrollEffect() {
    const header = document.querySelector('header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
      const scrollY = window.scrollY;
      
      if (scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
      } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.08)';
      }

      lastScrollY = scrollY;
      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
  }

  // Lazy loading for images
  function initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // Form validation (if forms are added later)
  function initFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', function(e) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
          if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
          } else {
            field.classList.remove('error');
          }
        });

        if (!isValid) {
          e.preventDefault();
        }
      });
    });
  }

  // Accessibility improvements
  function initAccessibility() {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: var(--brand);
      color: white;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 1001;
      transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content ID
    const mainContent = document.querySelector('main') || document.querySelector('#welcome');
    if (mainContent) {
      mainContent.id = 'main-content';
    }
  }

  // Performance monitoring
  function initPerformanceMonitoring() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          if (perfData) {
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
          }
        }, 0);
      });
    }
  }

  // Initialize all functionality
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    try {
      initMobileMenu();
      initLanguageSwitching();
      initSmoothScrolling();
      initHeaderScrollEffect();
      initLazyLoading();
      initFormValidation();
      initAccessibility();
      initPerformanceMonitoring();
    } catch (error) {
      console.error('Error initializing website functionality:', error);
    }
  }

  // Start initialization
  init();

  // Expose applyLanguage globally for backward compatibility
  window.applyLanguage = applyLanguage;

})();