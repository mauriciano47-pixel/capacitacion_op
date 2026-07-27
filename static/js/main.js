// IS MasterClass - Logic Engine

const app = {
    xp: 0,
    level: 1,
    currentDefectIndex: 0,
    
    // Base de datos de defectos para el laboratorio
    defectosDB: [
        {
            nombre: "Fondo Grueso (Thick Bottom)",
            icon: "🍾",
            desc: "El envase presenta acumulación excesiva de vidrio en el fondo. El parison no estiró lo suficiente durante la inversión.",
            opciones: [
                { id: "A", texto: "Aumentar tiempo de enfriamiento de premolde (Blank Cooling)", correcta: false },
                { id: "B", texto: "Aumentar tiempo de recalentamiento (Reheat) y reducir enfriamiento de premolde", correcta: true },
                { id: "C", texto: "Reducir presión de soplo final", correcta: false }
            ],
            feedbackExito: "¡Correcto! Al dar más tiempo de recalentamiento (Reheat), el parison estira más rápido antes del soplo final.",
            feedbackError: "Incorrecto. Si aumentas el enfriamiento, el parison estará más frío y estirará menos, empeorando el fondo grueso."
        },
        {
            nombre: "Cuello Doblado (Bent Neck)",
            icon: "📐",
            desc: "El cuello del envase está inclinado o desfasado respecto al eje vertical al salir del molde soplador.",
            opciones: [
                { id: "A", texto: "El mecanismo de extracción (Take Out) está entrando muy pronto.", correcta: true },
                { id: "B", texto: "Aumentar temperatura de la gota.", correcta: false },
                { id: "C", texto: "Cerrar el molde soplador más tarde.", correcta: false }
            ],
            feedbackExito: "¡Exacto! Si las pinzas del Take Out toman el envase antes de que el cuello esté rígido, lo doblarán.",
            feedbackError: "Incorrecto. Alterar la temperatura no corrige un defecto mecánico de transferencia."
        },
        {
            nombre: "Costura Abierta (Split Seam)",
            icon: "⚡",
            desc: "Se observa una fisura vertical a lo largo de la costura del envase.",
            opciones: [
                { id: "A", texto: "Disminuir lubricación (Swabbing).", correcta: false },
                { id: "B", texto: "Aumentar presión de cierre de los moldes o revisar desgaste.", correcta: true },
                { id: "C", texto: "Adelantar tiempo de inversión.", correcta: false }
            ],
            feedbackExito: "¡Bien hecho! Una presión de cierre débil hace que el vidrio empuje las mitades del molde al soplar, abriendo la costura.",
            feedbackError: "Incorrecto. Debes revisar la mecánica de cierre de los moldes."
        }
    ],

    init() {
        console.log('[IS MasterClass] Sistema Inicializado.');
        this.loadStats();
        this.updateTiming(); // Init conic gradient
    },

    showView(viewId) {
        document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
        document.getElementById('view-' + viewId).classList.add('active');

        if (viewId === 'defectos') {
            this.currentDefectIndex = 0;
            this.renderDefecto();
        }
    },

    // --- Stats & Gamification ---
    loadStats() {
        const savedXp = localStorage.getItem('is_master_xp');
        if (savedXp) {
            this.xp = parseInt(savedXp);
            this.calculateLevel();
        }
        this.renderStats();
    },

    addXp(amount) {
        this.xp += amount;
        localStorage.setItem('is_master_xp', this.xp);
        this.calculateLevel();
        this.renderStats();
    },

    calculateLevel() {
        if (this.xp < 100) this.level = 1;
        else if (this.xp < 250) this.level = 2;
        else if (this.xp < 500) this.level = 3;
        else if (this.xp < 1000) this.level = 4;
        else this.level = 5;
    },

    renderStats() {
        const niveles = ["Aprendiz", "Operador Junior", "Operador Senior", "Maestro NNPB", "Leyenda Vidriera"];
        document.getElementById('userLevel').textContent = `Nivel ${this.level}: ${niveles[this.level - 1]}`;
        
        // XP progress logic (max xp calculation per level for visual bar)
        let maxLevelXp = 100;
        if (this.level == 2) maxLevelXp = 250;
        if (this.level == 3) maxLevelXp = 500;
        if (this.level == 4) maxLevelXp = 1000;
        if (this.level == 5) maxLevelXp = 2000;

        let prevMax = 0;
        if (this.level == 2) prevMax = 100;
        if (this.level == 3) prevMax = 250;
        if (this.level == 4) prevMax = 500;
        if (this.level == 5) prevMax = 1000;

        const currentLevelXp = this.xp - prevMax;
        const requiredXp = maxLevelXp - prevMax;
        const percentage = Math.min(100, Math.max(0, (currentLevelXp / requiredXp) * 100));

        document.getElementById('xpBar').style.width = `${percentage}%`;
        document.getElementById('xpText').textContent = `${this.xp} XP`;
    },

    // --- Defectos Lab ---
    renderDefecto() {
        const defect = this.defectosDB[this.currentDefectIndex];
        if (!defect) {
            document.getElementById('defectoNombre').textContent = "¡Entrenamiento Completado!";
            document.getElementById('defectoDesc').textContent = "Has superado todos los casos disponibles en esta versión.";
            document.getElementById('defectoIcon').textContent = "🏆";
            document.getElementById('opcionesContainer').innerHTML = "";
            document.getElementById('feedbackPanel').classList.add('hidden');
            document.getElementById('btnNextDefect').classList.add('hidden');
            return;
        }

        document.getElementById('defectoNombre').textContent = defect.nombre;
        document.getElementById('defectoDesc').textContent = defect.desc;
        document.getElementById('defectoIcon').textContent = defect.icon;
        
        const optsContainer = document.getElementById('opcionesContainer');
        optsContainer.innerHTML = '';
        
        defect.opciones.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt.texto;
            btn.onclick = () => this.checkDefectAnswer(opt, btn);
            optsContainer.appendChild(btn);
        });

        document.getElementById('feedbackPanel').classList.add('hidden');
        document.getElementById('btnNextDefect').classList.add('hidden');
    },

    checkDefectAnswer(opt, btn) {
        // Disable all buttons
        const btns = document.querySelectorAll('.option-btn');
        btns.forEach(b => b.style.pointerEvents = 'none');

        const feedback = document.getElementById('feedbackPanel');
        feedback.classList.remove('hidden', 'success', 'error');

        const defect = this.defectosDB[this.currentDefectIndex];

        if (opt.correcta) {
            btn.classList.add('correct');
            feedback.classList.add('success');
            feedback.innerHTML = `✅ ${defect.feedbackExito} <strong>(+25 XP)</strong>`;
            this.addXp(25);
        } else {
            btn.classList.add('wrong');
            feedback.classList.add('error');
            feedback.innerHTML = `❌ ${defect.feedbackError}`;
            // Find correct one and highlight it slightly
            btns.forEach((b, i) => {
                if (defect.opciones[i].correcta) b.style.border = "1px solid var(--accent-green)";
            });
        }

        document.getElementById('btnNextDefect').classList.remove('hidden');
    },

    loadNextDefect() {
        this.currentDefectIndex++;
        this.renderDefecto();
    },

    // --- Timing Simulator ---
    updateTiming() {
        const blankStart = parseInt(document.getElementById('range-blank').value);
        const blowStart = parseInt(document.getElementById('range-blow').value);
        
        // Fixed durations for this basic simulation
        const blankDuration = 120;
        const blowDuration = 100;

        document.getElementById('val-blank').textContent = blankStart;
        document.getElementById('val-blow').textContent = blowStart;

        // Draw conic gradient
        const wheel = document.getElementById('timingWheel');
        // color1 start end, transparent end, color2 start end
        const blankEnd = (blankStart + blankDuration) % 360;
        const blowEnd = (blowStart + blowDuration) % 360;

        // We use a simplified rendering: just updating CSS variables and using multiple background layers if possible, 
        // but conic-gradient is easiest. Since they can overlap 360 edge, it gets complex. 
        // We'll generate a conic gradient string.
        let gradientParts = [];
        
        // Background base
        gradientParts.push('rgba(0,0,0,0.5) 0deg');

        // Note: For simplicity in vanilla JS conic-gradient handling with wraps, we just inject two overlapping pseudo elements or divs.
        // It's cleaner to handle via DOM slices. I'll dynamically style the wheel.
        wheel.style.background = `conic-gradient(from 0deg, 
            transparent 0deg ${blankStart}deg, 
            rgba(255,100,0,0.6) ${blankStart}deg ${(blankStart + blankDuration)}deg, 
            transparent ${(blankStart + blankDuration)}deg 360deg
        ), conic-gradient(from 0deg, 
            transparent 0deg ${blowStart}deg, 
            rgba(0,150,255,0.6) ${blowStart}deg ${(blowStart + blowDuration)}deg, 
            transparent ${(blowStart + blowDuration)}deg 360deg
        ), rgba(20, 24, 32, 0.8)`;

        // Collision Logic
        // Invert happens around 150-180 usually. Let's just check if blow starts BEFORE blank ends (which means they collide in the invert phase).
        const alertBox = document.getElementById('timingAlert');
        
        // Very basic physical rule: Blank side must finish before Blow side can start (parison transfer).
        let blankRealEnd = blankStart + blankDuration;
        let collision = false;
        
        if (blowStart < blankRealEnd) {
            collision = true;
        }

        if (collision) {
            alertBox.className = "alert-box danger";
            alertBox.innerHTML = "⚠️ <strong>¡COLISIÓN DETECTADA!</strong> El soplado no puede iniciar antes de terminar la fase de premolde. El mecanismo de inversión fallará.";
        } else {
            alertBox.className = "alert-box";
            alertBox.innerHTML = "✔️ Tiempos sincronizados. Riesgo de colisión nulo.";
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
