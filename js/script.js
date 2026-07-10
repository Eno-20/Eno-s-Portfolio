const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const contactForm = document.getElementById('contactForm');
const backToTop = document.querySelector('.back-to-top');
const header = document.querySelector('header');
const heroVideo = document.querySelector('.hero-video');
const heroFallback = document.querySelector('.hero-fallback');
const emailAddress = 'johnenoobong1999@gmail.com';

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const normalizedPage = currentPage.toLowerCase();

    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href') || '';
        const normalizedHref = href.split('/').pop().toLowerCase();
        const isActive = normalizedHref === normalizedPage;

        link.classList.toggle('active', isActive);
        link.classList.toggle('active-nav', isActive);
    });
}

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', isOpen);
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    document.addEventListener('click', (event) => {
        if (!navLinks.contains(event.target) && !navToggle.contains(event.target)) {
            navLinks.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

if (header) {
    const handleHeaderScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 20);
    };
    handleHeaderScroll();
    window.addEventListener('scroll', handleHeaderScroll);
}

if (heroVideo && heroFallback) {
    heroVideo.addEventListener('error', () => {
        heroFallback.classList.add('show');
        heroVideo.style.opacity = '0';
    });
}

if (backToTop) {
    const toggleBackToTop = () => {
        backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
    };

    toggleBackToTop();
    window.addEventListener('scroll', toggleBackToTop);

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (event) => {
        const targetId = link.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

revealElements.forEach(element => revealObserver.observe(element));

const counterElements = document.querySelectorAll('[data-counter]');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const target = entry.target;
        const endValue = Number(target.dataset.counter);
        const duration = 1100;
        const startTime = performance.now();

        const animate = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const current = Math.floor(progress * endValue);
            target.textContent = `${current}${endValue === 100 ? '%' : '+'}`;
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                target.textContent = `${endValue}${endValue === 100 ? '%' : '+'}`;
            }
        };

        requestAnimationFrame(animate);
        counterObserver.unobserve(target);
    });
}, { threshold: 0.5 });

counterElements.forEach(element => counterObserver.observe(element));

if (contactForm) {
    const statusMessage = document.createElement('p');
    statusMessage.className = 'form-status';
    statusMessage.setAttribute('aria-live', 'polite');
    contactForm.appendChild(statusMessage);

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            statusMessage.textContent = 'Please fill in all fields before sending.';
            statusMessage.style.color = '#fda4af';
            return;
        }

        const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

        window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
        contactForm.reset();
        statusMessage.textContent = 'Thanks! Your email app should open with your message ready to send.';
        statusMessage.style.color = '#7dd3fc';
    });
}

setActiveNavLink();
