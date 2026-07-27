// IS MasterClass - Logic Engine con Integración de Fotografías Reales BDF/Cristal Chile

const app = {
    xp: 0,
    level: 1,
    currentDefectIndex: 0,
    
    // Base de datos de defectos enriquecida con información oficial de vitrodiag y fotografías reales
    defectosDB: [
        {
            id: "fondo_grueso",
            nombre: "Fondo Grueso (Thick Bottom)",
            image: "images/defects/fondo_grueso.png",
            zona: "Fondo / Base",
            desc: "El envase presenta acumulación excesiva de vidrio en el fondo. El parison no estiró lo suficiente durante la inversión debido a enfriamiento desigual o bajo recalentamiento (Reheat).",
            opciones: [
                { id: "A", texto: "Aumentar tiempo de enfriamiento de premolde (Blank Cooling)", correcta: false },
                { id: "B", texto: "Aumentar tiempo de recalentamiento (Reheat) y reducir enfriamiento de premolde", correcta: true },
                { id: "C", texto: "Reducir presión de soplo final", correcta: false }
            ],
            feedbackExito: "¡Correcto! Al dar más tiempo de recalentamiento (Reheat), el parison se estira uniformemente por gravedad antes del soplo final.",
            feedbackError: "Incorrecto. Si aumentas el enfriamiento del premolde, el vidrio estará más frío y rígido, empeorando el fondo grueso."
        },
        {
            id: "cuello_doblado",
            nombre: "Cuello Doblado (Bent Neck)",
            image: "images/defects/cuello_doblado.png",
            zona: "Cuello / Finish",
            desc: "El cuello del envase se observa desfasado o inclinado respecto al eje vertical al salir del molde soplador.",
            opciones: [
                { id: "A", texto: "El mecanismo de extracción (Take Out) entra desfasado o muy pronto antes del enfriamiento de boca", correcta: true },
                { id: "B", texto: "Aumentar temperatura global de la gota en la copa del alimentador", correcta: false },
                { id: "C", texto: "Retardar el cierre del molde soplador", correcta: false }
            ],
            feedbackExito: "¡Exacto! Si las pinzas del Takeout toman el envase antes de que el cuello adquiera rigidez plástica, lo doblarán mecánicamente.",
            feedbackError: "Incorrecto. Modificar la temperatura de la gota no resuelve un choque mecánico en el traspaso del Takeout."
        },
        {
            id: "costura_abierta",
            nombre: "Costura Abierta (Split Seam)",
            image: "images/defects/costura_abierta.png",
            zona: "Cuerpo / Moldería",
            desc: "Se observa una fisura o abertura vertical marcada a lo largo de la línea de partición de las dos mitades del molde.",
            opciones: [
                { id: "A", texto: "Disminuir lubricación de moldes (Swabbing)", correcta: false },
                { id: "B", texto: "Aumentar la presión de cierre del mecanismo de moldes o revisar desgaste de platinas", correcta: true },
                { id: "C", texto: "Adelantar tiempo de inversión de la gota", correcta: false }
            ],
            feedbackExito: "¡Bien hecho! Una baja presión en el mecanismo de cierre permite que la presión de soplo venza la fuerza del molde y abra la costura.",
            feedbackError: "Incorrecto. La costura abierta responde a la fuerza de apriete mecánico del mecanismo de cierre."
        },
        {
            id: "rebaba_boca",
            nombre: "Rebaba en la Boca (Overpressed Finish)",
            image: "images/defects/rebaba_boca.png",
            zona: "Boca / Cara de Sellado",
            desc: "Exceso de vidrio proyectado hacia arriba o a los lados en la cara de sellado de la boca, creando un filamento peligroso que causa fugas o cortes.",
            opciones: [
                { id: "A", texto: "Reducir sobrepeso de la gota o disminuir la presión de aire de prensado (Plunger)", correcta: true },
                { id: "B", texto: "Aumentar la velocidad del soplado final", correcta: false },
                { id: "C", texto: "Enfriar excesivamente las tijeras de corte", correcta: false }
            ],
            feedbackExito: "¡Excelente! Al corregir el sobrepeso de gota o reducir la fuerza del plunger se evita que el vidrio sobrepase el área de la rosca.",
            feedbackError: "Incorrecto. La rebaba se origina en la fase de prensado por sobrepeso de vidrio o exceso de empuje del plunger."
        }
    ],

    init() {
        console.log('[IS MasterClass] Sistema Inicializado con Imágenes Reales.');
        this.loadStats();
        this.updateTiming();
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

    // --- Defectos Lab con Imágenes Reales ---
    renderDefecto() {
        const defect = this.defectosDB[this.currentDefectIndex];
        if (!defect) {
            document.getElementById('defectoNombre').textContent = "¡Entrenamiento Completado!";
            document.getElementById('defectoDesc').textContent = "Has superado todos los casos de diagnóstico vidriero disponibles en esta versión.";
            const imgElement = document.getElementById('defectoImage');
            if (imgElement) imgElement.style.display = 'none';
            document.getElementById('opcionesContainer').innerHTML = "";
            document.getElementById('feedbackPanel').classList.add('hidden');
            document.getElementById('btnNextDefect').classList.add('hidden');
            return;
        }

        document.getElementById('defectoNombre').textContent = defect.nombre;
        document.getElementById('defectoDesc').textContent = `${defect.desc} (Zona: ${defect.zona})`;
        
        const imgElement = document.getElementById('defectoImage');
        if (imgElement && defect.image) {
            imgElement.src = defect.image;
            imgElement.style.display = 'block';
        }
        
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
        
        const blankDuration = 120;
        const blowDuration = 100;

        document.getElementById('val-blank').textContent = blankStart;
        document.getElementById('val-blow').textContent = blowStart;

        const wheel = document.getElementById('timingWheel');
        
        wheel.style.background = `conic-gradient(from 0deg, 
            transparent 0deg ${blankStart}deg, 
            rgba(255,100,0,0.6) ${blankStart}deg ${(blankStart + blankDuration)}deg, 
            transparent ${(blankStart + blankDuration)}deg 360deg
        ), conic-gradient(from 0deg, 
            transparent 0deg ${blowStart}deg, 
            rgba(0,150,255,0.6) ${blowStart}deg ${(blowStart + blowDuration)}deg, 
            transparent ${(blowStart + blowDuration)}deg 360deg
        ), rgba(20, 24, 32, 0.8)`;

        const alertBox = document.getElementById('timingAlert');
        
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
