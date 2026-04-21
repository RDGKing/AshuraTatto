document.addEventListener('DOMContentLoaded', () => {

    // ===== LOADER =====
    const loader = document.querySelector('.loader-wrapper');
    setTimeout(() => {
        if (loader) {
            loader.classList.add('fade-out');
        }
    }, 800);

    // ===== NAVEGACIÓN SCROLL SUAVE =====
    document.querySelectorAll('.nav-link, .btn-outline[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (href && href !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Cerrar menú móvil
                    const navLinks = document.getElementById('nav-links');
                    const menuToggle = document.getElementById('menu-toggle');
                    if (navLinks && navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        menuToggle?.classList.remove('active');
                    }
                }
            }
        });
    });

    // ===== NAVBAR SCROLL EFFECT =====
    const nav = document.querySelector('.nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // ===== MENÚ MÓVIL =====
    const toggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            toggle.classList.toggle('active');
        });
        
        // Cerrar menú al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !toggle.contains(e.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                toggle.classList.remove('active');
            }
        });
    }

    // ===== CARRUSEL MEJORADO =====
    const carousel = document.getElementById('carousel');
    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');
    const dotsContainer = document.getElementById('carousel-dots');
    
    if (carousel) {
        const items = carousel.querySelectorAll('.carousel-item');
        let currentIndex = 0;
        let autoPlayInterval;

        // Crear dots
        const createDots = () => {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            items.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });
        };

        // Actualizar dots activos
        const updateDots = () => {
            if (!dotsContainer) return;
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        // Ir a slide específico
        const goToSlide = (index) => {
            if (index < 0) index = items.length - 1;
            if (index >= items.length) index = 0;
            
            currentIndex = index;
            const itemWidth = items[0].offsetWidth;
            const gap = 20;
            const scrollAmount = index * (itemWidth + gap);
            
            carousel.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
            
            updateDots();
        };

        // Siguiente slide
        const nextSlide = () => goToSlide(currentIndex + 1);
        
        // Slide anterior
        const prevSlide = () => goToSlide(currentIndex - 1);

        // Auto play
        const startAutoPlay = () => {
            autoPlayInterval = setInterval(nextSlide, 5000);
        };

        const stopAutoPlay = () => {
            clearInterval(autoPlayInterval);
        };

        // Event listeners
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                stopAutoPlay();
                startAutoPlay();
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                stopAutoPlay();
                startAutoPlay();
            });
        }

        // Actualizar índice al hacer scroll manual
        let scrollTimeout;
        carousel.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const itemWidth = items[0].offsetWidth;
                const gap = 20;
                const scrollPosition = carousel.scrollLeft;
                const newIndex = Math.round(scrollPosition / (itemWidth + gap));
                
                if (newIndex !== currentIndex && newIndex >= 0 && newIndex < items.length) {
                    currentIndex = newIndex;
                    updateDots();
                }
            }, 100);
        });

        // Pausar auto play al hover
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', stopAutoPlay);
            carouselContainer.addEventListener('mouseleave', startAutoPlay);
        }

        // Inicializar
        createDots();
        startAutoPlay();

        // Recalcular al redimensionar
        window.addEventListener('resize', () => {
            goToSlide(currentIndex);
        });
    }

    // ===== FILTRO DE GALERÍA =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.carousel-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Actualizar botones activos
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ===== LIGHTBOX =====
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    
    if (lightbox) {
        galleryItems.forEach(item => {
            const img = item.querySelector('img');
            const category = item.querySelector('.item-category')?.textContent || '';
            
            item.addEventListener('click', () => {
                lightbox.classList.add('active');
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightboxCaption.textContent = category;
                document.body.style.overflow = 'hidden';
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };

        lightboxClose?.addEventListener('click', closeLightbox);
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    // ===== PARTICLES EFFECT (Héroe) =====
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                background: rgba(196, 30, 58, ${Math.random() * 0.5 + 0.3});
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: floatParticle ${Math.random() * 10 + 15}s linear infinite;
                animation-delay: -${Math.random() * 10}s;
            `;
            particlesContainer.appendChild(particle);
        }
    }

    // Añadir estilo para la animación de partículas
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatParticle {
            0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // ===== ANIMACIÓN SCROLL REVEAL =====
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar elementos para animación
    const animateElements = document.querySelectorAll(`
        .filosofia-card,
        .info-item,
        .social-btn,
        .carousel-item
    `);

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ===== CONTADOR DE VISITAS (Simulado) =====
    console.log('%c🎨 ASHURA TATTOO', 'font-size: 20px; font-weight: bold; color: #c41e3a;');
    console.log('%cArte forjado en tinta', 'font-size: 14px; color: #a0a0b0; font-style: italic;');
});