const gnomo = document.getElementById('gnomo');
const universo = document.getElementById('universo-horizontal');

// Secciones para controlar las animaciones según la posición del scroll
const secciones = document.querySelectorAll('.seccion');

let scrollTimeout;
let esperandoFrame = false;
let ultimoScrollY = window.scrollY;

function actualizarMundo() {
    const scrollActual = window.scrollY;

    // --- 1. DIRECCIÓN DEL GNOMO Y REINICIO EN POSICIÓN INICIAL ---
    if (scrollActual <= 10) {
        // En la posición inicial siempre mira hacia la derecha
        gnomo.classList.remove('mirando-izquierda');
    } else if (scrollActual > ultimoScrollY) {
        // Avanzando hacia la derecha (Scroll abajo)
        gnomo.classList.remove('mirando-izquierda');
    } else if (scrollActual < ultimoScrollY) {
        // Retrocediendo hacia la izquierda (Scroll arriba)
        gnomo.classList.add('mirando-izquierda');
    }

    ultimoScrollY = scrollActual;

    // --- 2. MOVIMIENTO HORIZONTAL DEL MUNDO ---
    const maxScrollVertical = document.body.scrollHeight - window.innerHeight;
    const maxScrollHorizontal = universo.scrollWidth - window.innerWidth;
    
    const porcentajeProgreso = maxScrollVertical > 0 ? scrollActual / maxScrollVertical : 0;
    const movimientoX = porcentajeProgreso * maxScrollHorizontal;
    
    universo.style.transform = `translateX(-${movimientoX}px)`;

    // --- 3. REANUDAR/PAUSAR ANIMACIÓN DE PIERNAS ---
    if (gnomo.style.animationPlayState !== 'running') {
        gnomo.style.animationPlayState = 'running';
    }

    // --- 4. ACTIVACIÓN DE EFECTOS EN SECCIONES SEGÚN SCROLL ---
    secciones.forEach((seccion, index) => {
        const umbralInicio = (index - 0.3) / secciones.length;
        const umbralFin = (index + 0.8) / secciones.length;

        if (porcentajeProgreso >= umbralInicio && porcentajeProgreso <= umbralFin) {
            seccion.classList.add('visible');
        }
    });
}

// Evento Scroll Optimizado
window.addEventListener('scroll', () => {
    if (!esperandoFrame) {
        window.requestAnimationFrame(() => {
            actualizarMundo();
            esperandoFrame = false;
        });
        esperandoFrame = true;
    }

    // Quitar la clase de bounce inicial cuando se empieza a scrollear
    if (window.scrollY > 20 && gnomo.classList.contains('entrada-bounce')) {
        gnomo.classList.remove('entrada-bounce');
    }

    // Pausar animación del gnomo cuando se detiene el scroll
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        gnomo.style.animationPlayState = 'paused';
    }, 150);
}, { passive: true });

// Disparo inicial para cargar la primera sección correctamente
document.addEventListener('DOMContentLoaded', () => {
    actualizarMundo();
});