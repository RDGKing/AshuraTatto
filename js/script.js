document.addEventListener('DOMContentLoaded', () => {

    // 1. SCROLL SUAVE PARA NAVEGACIÓN
    document.querySelectorAll('.nav a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                
                // Opcional: Cerrar menú móvil al hacer click en un enlace
                const navLinks = document.getElementById('nav-links');
                if(navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    // 2. MENÚ MÓVIL
    const toggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // 3. CARRUSEL IMAGEN POR IMAGEN (CON BUCLE)
    const carousel = document.getElementById('carousel');
    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');
    
    // Verificamos que existan los elementos antes de ejecutar lógica
    if (carousel && nextBtn && prevBtn) {
        const images = carousel.querySelectorAll('img');
        let currentIndex = 0; // Empezamos en la primera imagen (índice 0)

        // Función para mover el carrusel a la imagen actual
        const updateCarousel = () => {
            // Obtenemos el ancho de la imagen + posible margen/gap
            // Usamos la posición (offsetLeft) de la imagen objetivo
            const targetImage = images[currentIndex];
            
            // Calculamos la posición exacta dentro del contenedor
            const scrollAmount = targetImage.offsetLeft - carousel.offsetLeft;

            carousel.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
        };

        // Botón Siguiente
        nextBtn.addEventListener('click', () => {
            currentIndex++; 
            
            // Si el índice supera la cantidad de imágenes, volvemos a 0 (Bucle)
            if (currentIndex >= images.length) {
                currentIndex = 0;
            }
            updateCarousel();
        });

        // Botón Anterior
        prevBtn.addEventListener('click', () => {
            currentIndex--;
            
            // Si el índice es menor a 0, vamos a la última imagen (Bucle)
            if (currentIndex < 0) {
                currentIndex = images.length - 1;
            }
            updateCarousel();
        });
        
        // Opcional: Actualizar el índice si el usuario hace scroll manual (táctil)
        carousel.addEventListener('scroll', () => {
             // Esto evita que los botones se desincronicen si alguien desliza con el dedo
             // pero para mantenerlo simple, lo dejaremos controlado solo por botones por ahora.
        });
    }
});