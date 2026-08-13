const gnomo = document.getElementById('gnomo');
const universo = document.getElementById('universo-horizontal');

let scrollTimeout; // Para detectar cuándo dejamos de scrollear
let esperandoFrame = false;

function actualizarMundo() {
    const scrollActual = window.scrollY;
    
    // Calculamos el scroll máximo posible
    // (Alto total del body) - (Alto de la pantalla visible)
    const maxScrollVertical = document.body.scrollHeight - window.innerHeight;
    
    // Calculamos qué tan ancho es el universo horizontalmente
    // (Ancho de todas las secciones) - (Ancho de la pantalla visible)
    const maxScrollHorizontal = universo.scrollWidth - window.innerWidth;
    
    // Sacamos el porcentaje de cuánto hemos bajado (de 0 a 1)
    const porcentajeProgreso = scrollActual / maxScrollVertical;
    
    // Movemos el universo a la izquierda basándonos en ese porcentaje
    const movimientoX = porcentajeProgreso * maxScrollHorizontal;
    universo.style.transform = `translateX(-${movimientoX}px)`;

    // --- LÓGICA DE ANIMACIÓN DEL GNOMO ---
    // Si el gnomo estaba pausado, lo ponemos a caminar
    if (gnomo.style.animationPlayState !== 'running') {
        gnomo.style.animationPlayState = 'running';
    }
}

window.addEventListener('scroll', () => {
    // 1. Ejecutar el movimiento del mundo de forma optimizada
    if (!esperandoFrame) {
        window.requestAnimationFrame(() => {
            actualizarMundo();
            esperandoFrame = false;
        });
        esperandoFrame = true;
    }

    // 2. Detener la animación cuando terminamos de scrollear
    clearTimeout(scrollTimeout); // Reiniciamos el temporizador si seguimos moviendo la rueda
    
    // Si pasan 150 milisegundos sin que muevas la rueda, se asume que te detuviste
    scrollTimeout = setTimeout(() => {
        gnomo.style.animationPlayState = 'paused';
    }, 150); 
}, { passive: true });