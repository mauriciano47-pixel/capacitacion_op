// IS MasterClass - Logic Engine con Integración de Fotografías Reales BDF/Cristal Chile

const app = {
    xp: 0,
    level: 1,
    currentDefectIndex: 0,
    
    // Base de datos de 10 defectos vidrieros enriquecida con información oficial de Cristalerías de Chile S.A. (Revisión 2020)
    defectosDB: [
        {
            id: "fondo_grueso",
            nombre: "Fondo Grueso (Thick Bottom)",
            image: "images/defects/fondo_grueso.png",
            zona: "Fondo / Base",
            tipoDefecto: "Térmico",
            mecanismoCausa: "Premolde & Tiempo de Recalentamiento (Reheat)",
            desc: "El envase presenta acumulación excesiva de vidrio en el fondo. El parison no estiró lo suficiente durante la inversión debido a enfriamiento desigual o bajo recalentamiento (Reheat).",
            solucionOperador: "Aumentar el tiempo de recalentamiento (Reheat) y reducir el enfriamiento del premolde para permitir el estiramiento uniforme del vidrio por gravedad.",
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
            tipoDefecto: "Mecánico",
            mecanismoCausa: "Pinzas de Extracción (Takeout Mechanism)",
            desc: "El cuello del envase se observa desfasado o inclinado respecto al eje vertical al salir del molde soplador.",
            solucionOperador: "Ajustar la sincronización del Takeout para evitar la extracción antes de la solidificación plástica del cuello y verificar alineación de dedales.",
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
            tipoDefecto: "Mecánico",
            mecanismoCausa: "Mecanismo de Cierre de Moldes (Mold Closing)",
            desc: "Se observa una fisura o abertura vertical marcada a lo largo de la línea de partición de las dos mitades del molde.",
            solucionOperador: "Incrementar la presión de apriete del mecanismo de cierre de moldes y auditar el desgaste de platinas o suciedad en las caras de partición.",
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
            tipoDefecto: "Térmico / Peso",
            mecanismoCausa: "Macho Prensador NNPB (Servo Plunger)",
            desc: "Exceso de vidrio proyectado hacia arriba o a los lados en la cara de sellado de la boca, creando un filamento peligroso que causa fugas o cortes.",
            solucionOperador: "Reducir el peso de la gota en el alimentador o ajustar el límite de carrera/presión de aire del macho prensador (Plunger NNPB).",
            opciones: [
                { id: "A", texto: "Reducir sobrepeso de la gota o disminuir la presión de aire de prensado (Plunger)", correcta: true },
                { id: "B", texto: "Aumentar la velocidad del soplado final", correcta: false },
                { id: "C", texto: "Enfriar excesivamente las tijeras de corte", correcta: false }
            ],
            feedbackExito: "¡Excelente! Al corregir el sobrepeso de gota o reducir la fuerza del plunger se evita que el vidrio sobrepase el área de la rosca.",
            feedbackError: "Incorrecto. La rebaba se origina en la fase de prensado por sobrepeso de vidrio o exceso de empuje del plunger."
        },
        {
            id: "pliegue_hombro",
            nombre: "Pliegue de Hombro (Shoulder Wrinkle)",
            image: "images/defects/pliegue_hombro.png",
            zona: "Hombro",
            tipoDefecto: "Térmico",
            mecanismoCausa: "Premolde & Inversión Servo",
            desc: "Ondulaciones o pliegues fríos en el área del hombro del envase causados por enfriamiento excesivo del parison o estiramiento brusco durante la inversión.",
            solucionOperador: "Reducir el tiempo de enfriamiento del premolde (Blank Cooling) y suavizar la aceleración de los brazos de inversión.",
            opciones: [
                { id: "A", texto: "Aumentar la presión del soplado final", correcta: false },
                { id: "B", texto: "Reducir enfriamiento de premolde y suavizar la aceleración de inversión", correcta: true },
                { id: "C", texto: "Adelantar la extracción Takeout", correcta: false }
            ],
            feedbackExito: "¡Correcto! Mantener la piel del parison a la temperatura de conformación adecuada previene pliegues de frío en el hombro.",
            feedbackError: "Incorrecto. Los pliegues son causados por piel fría en el parison durante la inversión."
        },
        {
            id: "pajarilla_piel",
            nombre: "Pajarilla / Piel de Naranja (Orange Peel)",
            image: "images/defects/pajarilla_piel.png",
            zona: "Cuerpo / Superficie",
            tipoDefecto: "Térmico / Swabbing",
            mecanismoCausa: "Molde de Soplo (Blow Mold)",
            desc: "Rugosidad o textura granulada en la superficie externa del vidrio debido a lubricación excesiva (Swabbing) o moldería sucia.",
            solucionOperador: "Controlar y dosificar el uso de compuesto de lubricación (Swab) e hisopo seco, y descarbonizar cavidades de moldería.",
            opciones: [
                { id: "A", texto: "Dosificar lubricación de moldes y descarbonizar cavidades", correcta: true },
                { id: "B", texto: "Aumentar la temperatura de la aguja del feeder", correcta: false },
                { id: "C", texto: "Retardar la apertura del premolde", correcta: false }
            ],
            feedbackExito: "¡Excelente! La lubricación controlada evita la acumulación de residuo grafitado que imprime arrugas en el vidrio caliente.",
            feedbackError: "Incorrecto. El exceso de compuesto lubricante grafitado es la causa directa de la piel de naranja."
        },
        {
            id: "fisura_anillo",
            nombre: "Fisura de Anillo de Boca (Neck Ring Check)",
            image: "images/defects/fisura_anillo.png",
            zona: "Boca / Neck Ring",
            tipoDefecto: "Mecánico / Térmico",
            mecanismoCausa: "Anillo de Boca (Neck Ring & Invert Holder)",
            desc: "Microfisura limpia en la zona del anillo de boca o rosca producida por impacto térmico o desalineación mecánica del portaanillos.",
            solucionOperador: "Auditar alineación del portaanillo de boca con el premolde y verificar la temperatura/enfriamiento del mecanismo de inversión.",
            opciones: [
                { id: "A", texto: "Aumentar velocidad de corte de cizalla", correcta: false },
                { id: "B", texto: "Verificar alineación de portaanillos de boca y controlar choque térmico", correcta: true },
                { id: "C", texto: "Disminuir presión de cierre de moldes de soplo", correcta: false }
            ],
            feedbackExito: "¡Bien hecho! La alineación precisa del Neck Ring evita esfuerzos cortantes y fisuras en el terminado de boca.",
            feedbackError: "Incorrecto. Las fisuras de boca son provocadas por tensiones mecánicas o térmicas directas en el Neck Ring."
        },
        {
            id: "marca_cizalla",
            nombre: "Marca de Cizalla (Shear Mark)",
            image: "images/defects/marca_cizalla.png",
            zona: "Fondo / Pica",
            tipoDefecto: "Mecánico / Alimentación",
            mecanismoCausa: "Alimentador & Tijeras (Feeder Shears)",
            desc: "Cicatriz o marca en forma de media luna en la base del envase provocada por tijeras desafiladas o mala emulsión de enfriamiento de cizalla.",
            solucionOperador: "Reemplazar hojas de cizalla despostilladas y regular el caudal de emulsión soluble de enfriamiento/lubricación.",
            opciones: [
                { id: "A", texto: "Reemplazar hojas de cizalla y ajustar emulsión de corte", correcta: true },
                { id: "B", texto: "Disminuir tiempo de soplado final", correcta: false },
                { id: "C", texto: "Aumentar la presión de vaciado", correcta: false }
            ],
            feedbackExito: "¡Correcto! Hojas de cizalla con filo y buena lubricación cortan la gota limpiamente sin enfriar la cicatriz de corte.",
            feedbackError: "Incorrecto. La marca de cizalla se genera al momento exacto del corte de la gota en el alimentador."
        },
        {
            id: "fondo_inclinado",
            nombre: "Fondo Inclinado / Pica Deforme (Slanted Bottom)",
            image: "images/defects/fondo_inclinado.png",
            zona: "Fondo / Base",
            tipoDefecto: "Térmico",
            mecanismoCausa: "Placa de Fondo (Bottom Plate & Verti-Flow)",
            desc: "Base del envase desnivelada o pica deformada por enfriamiento deficiente de la placa de fondo o desalineación en el asentamiento del molde.",
            solucionOperador: "Limpiar canales Verti-Flow de la placa de fondo, verificar flujo de aire de base y auditar centrado del mecanismo de fondo.",
            opciones: [
                { id: "A", texto: "Disminuir temperatura de la aguja del feeder", correcta: false },
                { id: "B", texto: "Limpiar canales Verti-Flow y verificar centrado de la placa de fondo", correcta: true },
                { id: "C", texto: "Adelantar tiempo de vaciado", correcta: false }
            ],
            feedbackExito: "¡Exacto! El flujo de aire Verti-Flow en la placa de fondo solidifica la pica para evitar deformaciones por peso propio.",
            feedbackError: "Incorrecto. La estabilidad de la base depende del soporte térmico y centrado de la placa de fondo."
        },
        {
            id: "botella_delgada",
            nombre: "Botella Delgada / Pared Desigual (Thin Wall)",
            image: "images/defects/botella_delgada.png",
            zona: "Cuerpo",
            tipoDefecto: "Mecánico / Carga",
            mecanismoCausa: "Gota / Canales & Distribuidor",
            desc: "Pared del envase con espesor insuficiente en un lateral debido a la caída descentrada de la gota o parison caliente desalineado.",
            solucionOperador: "Corregir el centrado de los canales oscilantes (Chutes) y la alineación del embudo para cargar la gota en el centro exacto del premolde.",
            opciones: [
                { id: "A", texto: "Alineación de canales/embudo y centrado de carga de gota", correcta: true },
                { id: "B", texto: "Aumentar presión de soplado final", correcta: false },
                { id: "C", texto: "Incrementar tiempo de vaciado", correcta: false }
            ],
            feedbackExito: "¡Bien hecho! La caída perfectamente centrada de la gota garantiza una distribución simétrica del espesor de pared de vidrio.",
            feedbackError: "Incorrecto. Una pared delgada lateral es consecuencia directa de una carga de gota descentrada en el premolde."
        }
    ],

    // Base de datos de los 10 mecanismos reales de sección I.S. (Bucher Emhart / BDF / Cristal Chile)
    mecanismosISDB: {
        alimentador_cizalla: {
            nombre: "1. Alimentador y Cizalla Servo (Servo Feeder & Shears)",
            sub: "Dosificación y Corte de Gota de Vidrio (1050°C)",
            temp: "1050°C - 1150°C (Vidrio fundido en tazón)",
            presion: "Servoasistido / Hojas refrigeradas con emulsión",
            lubricacion: "Agua de enfriamiento con emulsión soluble en tijeras",
            funcion: "Corta y dosifica el peso exacto de la gota de vidrio caliente mediante la acción servoasistida de las hojas de cizalla de alta velocidad sincronizadas con la aguja del feeder.",
            defectos: "Marcas de cizalla (Shear Mark), Gota desfasada, Sobrepeso o bajo peso de gota."
        },
        distribuidor_canales: {
            nombre: "2. Distribuidor de Gota y Canales (Gob Distributor & Chutes)",
            sub: "Guiado y Reparto de Gota a Secciones",
            temp: "350°C - 450°C (Canales y deflector)",
            presion: "Giro neumático/servo de cesta distribuidora",
            lubricacion: "Grafito seco micro-pulverizado en canales",
            funcion: "Recibe las gotas recién cortadas y las distribuye cíclicamente a cada sección I.S. a través de canales oscilantes (Chutes) y deflectores curveados.",
            defectos: "Gota frenada, Pliegues de impacto, Marcas de aceite/lubricante contaminado."
        },
        embudos: {
            nombre: "3. Mecanismo de Embudos (Funnel Mechanism)",
            sub: "Guiado Neumático de Gota hacia el Premolde",
            temp: "400°C - 480°C",
            presion: "3.5 - 4.5 bar neumático",
            lubricacion: "Descarbonizado periódico de superficie interna",
            funcion: "Desciende sobre el premolde abierto para canalizar la caída libre de la gota e insertarla de forma centrada dentro de la cavidad del premolde.",
            defectos: "Gota descentrada, Fisura en hombro de premolde, Impacto de embudo."
        },
        premolde: {
            nombre: "4. Premolde y Tapa (Blank Mold & Baffle Mechanism)",
            sub: "Conformación Primaria del Parison NNPB",
            temp: "460°C - 500°C (Verti-Flow axicompact)",
            presion: "Cierre asistido / Apriete neumático-mecanizado",
            lubricacion: "Swabbing manual o automático con grasa grafitada",
            funcion: "Alberga la gota y forma el parison hueco preliminar. La tapa de premolde (Baffle) se asienta arriba para permitir el prensado o soplado inicial.",
            defectos: "Pliegues de premolde, Marcas de partición, Espesor desigual de parison."
        },
        macho: {
            nombre: "5. Macho Prensador Servo NNPB (Servo Plunger Mechanism)",
            sub: "Prensado de Precisión e Inyección de Boca NNPB",
            temp: "450°C - 480°C (Enfriamiento de aire interno)",
            presion: "2.5 - 3.8 bar (Cilindro servo/neumático)",
            lubricacion: "Grafito líquido / Swabbing de aguja de prensado",
            funcion: "Penetra el vidrio incandescente en el premolde para formar la cavidad interna del parison y la cara de sellado del terminado en proceso NNPB.",
            defectos: "Rebaba en la boca (Overpressed Finish), Bajo Boca (Underpressed), Fisuras de prensado."
        },
        inversion: {
            nombre: "6. Mecanismo de Inversión Servo 180° (Servo Invert Mechanism)",
            sub: "Traspaso Rotativo de Parison por Anillo de Boca",
            temp: "350°C - 400°C (Brazos y Neck Ring Holder)",
            presion: "Accionamiento servo o cremallera neumática 4.0 bar",
            lubricacion: "Grasa sintética de alta temperatura en articulaciones",
            funcion: "Sujeta el anillo de boca (Neck Ring) y gira el parison 180° desde la estación de premolde a la estación de soplo para su expansión final.",
            defectos: "Cuello Doblado (Bent Neck), Desgarro en hombro, Marcas de vacilación."
        },
        molde_soplo: {
            nombre: "7. Molde de Soplo y Cierre (Blow Mold & Servo Closing)",
            sub: "Conformación Final de Cuerpo y Hombro",
            temp: "440°C - 480°C (Verti-Flow radial)",
            presion: "Apriete neumático / Cierre asistido de moldería",
            lubricacion: "Swabbing periódico y pulido de cavidad",
            funcion: "Cierra sus dos mitades alrededor del parison invertido para permitir su expansión mediante el soplo final hasta tomar la forma exacta de la botella.",
            defectos: "Costura Abierta (Split Seam), Botella deforme, Espesor delgado de pared."
        },
        fondo_vertiflow: {
            nombre: "8. Placa de Fondo y Verti-Flow (Bottom Plate Mechanism)",
            sub: "Conformación de Pica y Enfriamiento de Base",
            temp: "400°C - 450°C",
            presion: "Aire de enfriamiento vertical de alta presión",
            lubricacion: "Limpieza y descarbonizado de superficie de pica",
            funcion: "Soporta el fondo de la botella y suministra aire de enfriamiento Verti-Flow por microcanales para solidificar la pica y base del envase.",
            defectos: "Fondo inclinado, Pica deforme, Marcas de junta de fondo."
        },
        cabeza_soplo: {
            nombre: "9. Cabeza de Soplo Final (Blow Head Mechanism)",
            sub: "Inyección Neumática de Aire Comprimido Final",
            temp: "200°C - 300°C",
            presion: "2.0 - 2.8 bar (Aire comprimido filtrado)",
            lubricacion: "Limpieza y purging neumático",
            funcion: "Se acopla herméticamente sobre la boca del envase e inyecta aire comprimido a alta presión para expandir el vidrio contra el molde de soplo.",
            defectos: "Falta de soplo, Porosidad en cuerpo, Deformación de boca."
        },
        takeout_pusher: {
            nombre: "10. Pinzas Extracción Servo & Empujador (Servo Takeout & Pusher)",
            sub: "Transferencia a Deadplate y Empuje a Transportador",
            temp: "150°C (Pinzas de carbono/grafito)",
            presion: "3.5 bar neumático / Servo 90°",
            lubricacion: "Verificación de alineación de pinzas y dedales",
            funcion: "Extrae la botella del molde abierto, la deposita en la placa de enfriamiento (Deadplate) y los dedos empujadores (Pusher) la posicionan en el transportador.",
            defectos: "Cuello doblado por extracción, Marcas de pinza, Botella caída en transportador."
        }
    },

    currentMecanismoId: 'macho',
    anatomiaAngle: 0,
    anatomiaAnim: true,
    anatomiaExplored: [],

    loadStats() {
        try {
            const savedXp = localStorage.getItem('is_masterclass_xp');
            const savedLevel = localStorage.getItem('is_masterclass_level');
            if (savedXp !== null) this.xp = parseInt(savedXp, 10) || 0;
            if (savedLevel !== null) this.level = parseInt(savedLevel, 10) || 1;
        } catch (e) {}
        this.updateStatsUI();
    },

    updateStatsUI() {
        const userLevelEl = document.getElementById('userLevel');
        const xpBarEl = document.getElementById('xpBar');
        const xpTextEl = document.getElementById('xpText');
        
        const levels = [
            'Aprendiz I.S.',
            'Operador Nivel I',
            'Operador Nivel II',
            'Especialista NNPB',
            'Maestro Vidriero'
        ];
        const levelName = levels[Math.min(Math.max(this.level - 1, 0), levels.length - 1)];
        
        if (userLevelEl) userLevelEl.innerText = levelName;
        if (xpBarEl) xpBarEl.style.width = Math.min((this.xp % 100), 100) + '%';
        if (xpTextEl) xpTextEl.innerText = `${this.xp} / 100`;
    },

    addXp(amount) {
        this.xp += amount;
        this.level = Math.min(Math.floor(this.xp / 100) + 1, 5);
        try {
            localStorage.setItem('is_masterclass_xp', this.xp);
            localStorage.setItem('is_masterclass_level', this.level);
        } catch (e) {}
        this.updateStatsUI();
    },

    addXP(amount) {
        this.addXp(amount);
    },

    init() {
        console.log('[IS MasterClass] Sistema Inicializado con Imágenes Reales.');
        this.loadStats();
        this.updateTiming();
    },

    showView(viewId) {
        console.log('[IS MasterClass] Cambiando a vista:', viewId);
        document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
        const targetView = document.getElementById('view-' + viewId);
        if (targetView) {
            targetView.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            console.error('[IS MasterClass] No se encontró el contenedor de la vista: view-' + viewId);
            return;
        }

        if (viewId === 'defectos') {
            this.currentDefectIndex = 0;
            this.renderDefecto();
        } else if (viewId === 'anatomia') {
            this.initAnatomia3D();
        }
    },

    // --- Módulo 3: Anatomía I.S. 3D Renderer ---
    initAnatomia3D() {
        console.log('[IS MasterClass] Inicializando vista 3D de Anatomía I.S.');
        const firstBtn = document.querySelector('.parts-selector-grid .part-btn');
        this.selectMecanismo('macho', firstBtn);
        if (!this.anatomiaInterval) {
            this.anatomiaInterval = setInterval(() => {
                if (this.anatomiaAnim) {
                    this.anatomiaAngle = (this.anatomiaAngle + 2) % 360;
                    this.drawAnatomiaCanvas();
                }
            }, 50);
        }
    },

    rotateAnatomia3D(delta) {
        this.anatomiaAngle = (this.anatomiaAngle + delta + 360) % 360;
        this.drawAnatomiaCanvas();
    },

    toggleAnatomiaAnim() {
        this.anatomiaAnim = !this.anatomiaAnim;
    },

    selectMecanismo(id, btnEl) {
        this.currentMecanismoId = id;
        const data = this.mecanismosISDB[id];
        if (!data) return;

        if (btnEl) {
            document.querySelectorAll('.part-btn').forEach(b => b.classList.remove('active'));
            btnEl.classList.add('active');
        }

        const titleEl = document.getElementById('anatomyPartTitle');
        const subEl = document.getElementById('anatomyPartSub');
        if (titleEl) titleEl.textContent = data.nombre;
        if (subEl) subEl.textContent = data.sub;

        const realImgEl = document.getElementById('anatomyImageReal');
        if (realImgEl) {
            const imgFileName = (id === 'takeout_pusher' || id === 'takeout') ? 'takeout_pusher.png' : (id + '.png');
            realImgEl.dataset.retried = '';
            realImgEl.onerror = function() {
                if (!this.dataset.retried) {
                    this.dataset.retried = 'true';
                    this.src = 'images/anatomy/' + imgFileName;
                }
            };
            const pathPrefix = (window.location.pathname.includes('/static/') || document.querySelector('link[href*="static/"]')) ? '/static/images/anatomy/' : 'images/anatomy/';
            realImgEl.src = pathPrefix + imgFileName + '?v=4.0';
        }

        const specContainer = document.getElementById('specCardContainer');
        if (specContainer) {
            specContainer.innerHTML = `
                <div class="spec-row"><span class="spec-key">Temperatura Operativa:</span><span class="spec-val">${data.temp}</span></div>
                <div class="spec-row"><span class="spec-key">Presión / Cinemática:</span><span class="spec-val">${data.presion}</span></div>
                <div class="spec-row"><span class="spec-key">Lubricación (Swabbing):</span><span class="spec-val">${data.lubricacion}</span></div>
                <p class="spec-desc"><strong>Función Técnica:</strong> ${data.funcion}</p>
                <div class="spec-defect-alert">⚠️ <strong>Defectos por Desajuste:</strong> ${data.defectos}</div>
            `;
        }

        // Reward +15 XP on first exploration
        if (!this.anatomiaExplored.includes(id)) {
            this.anatomiaExplored.push(id);
            this.addXp(15);
        }

        this.drawAnatomiaCanvas();
    },

    drawAnatomiaCanvas() {
        const canvas = document.getElementById('canvasAnatomia3D');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (canvas.offsetWidth > 0 && canvas.offsetHeight > 0 && 
           (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight)) {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);

        const rad = (this.anatomiaAngle * Math.PI) / 180;
        const cx = w / 2;
        const cy = h / 2 + 10;

        // Draw 3D Grid Platform
        ctx.strokeStyle = 'rgba(0, 136, 255, 0.2)';
        ctx.lineWidth = 1;
        for (let i = -150; i <= 150; i += 30) {
            ctx.beginPath();
            ctx.moveTo(cx + i * Math.cos(rad), cy + i * Math.sin(rad) * 0.4 + 90);
            ctx.lineTo(cx + i * Math.cos(rad) - 100 * Math.sin(rad), cy + i * Math.sin(rad) * 0.4 + 90 + 50 * Math.cos(rad));
            ctx.stroke();
        }

        // Draw 3D Mechanism Model depending on selection
        ctx.save();
        ctx.translate(cx, cy);

        const id = this.currentMecanismoId;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);

        if (id === 'alimentador_cizalla') {
            // Feeder Orifice & Gob Shears Mechanism
            const shearPos = Math.sin(Date.now() * 0.005) * 35;
            const gobY = (Date.now() * 0.12) % 120 - 60;

            // Feeder Bowl & Orifice Ring (Copa de Alimentador)
            ctx.fillStyle = 'rgba(60, 65, 75, 0.95)'; ctx.strokeStyle = '#ff5500'; ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.rect(-65, -130, 130, 35);
            ctx.fill(); ctx.stroke();

            // Molten Glass Feed Stream (Vidrio fundido 1050°C)
            ctx.fillStyle = 'rgba(255, 140, 0, 0.95)';
            ctx.shadowColor = '#ff5500'; ctx.shadowBlur = 30;
            ctx.beginPath();
            ctx.rect(-16, -95, 32, 40);
            ctx.fill();

            // Falling Glowing Gob
            ctx.beginPath();
            ctx.ellipse(0, gobY, 15, 25, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Dual Shear Blades (Hojas de Cizalla de Corte)
            ctx.fillStyle = '#cbd5e1'; ctx.strokeStyle = '#00f0ff'; ctx.lineWidth = 2;
            // Left Blade
            ctx.beginPath(); ctx.rect(-70 + shearPos, -55, 60, 14); ctx.fill(); ctx.stroke();
            // Right Blade
            ctx.beginPath(); ctx.rect(10 - shearPos, -55, 60, 14); ctx.fill(); ctx.stroke();
        }
        else if (id === 'distribuidor_canales') {
            // Gob Distributor & Oscilating Chutes (Canales de Gota)
            const chuteAngle = Math.sin(Date.now() * 0.003) * 0.35;
            
            // Rotating Scoop/Distributor Basket (Cesta Distribuidora)
            ctx.fillStyle = 'rgba(50, 60, 75, 0.95)'; ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.arc(0, -110, 30, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

            // Inclined Chute Guide Pipe (Canal Oscilante Revestido)
            ctx.save();
            ctx.rotate(chuteAngle);
            ctx.fillStyle = 'rgba(30, 40, 55, 0.95)'; ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.rect(-18, -80, 36, 120);
            ctx.fill(); ctx.stroke();

            // Sliding Glowing Gob inside Chute
            ctx.fillStyle = 'rgba(255, 120, 0, 0.9)';
            ctx.shadowColor = '#ff5500'; ctx.shadowBlur = 20;
            ctx.beginPath();
            ctx.ellipse(0, 0, 12, 20, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.restore();
        }
        else if (id === 'embudos') {
            // Funnel Mechanism (Embudo Guía de Gota)
            const funnelY = -80 + Math.sin(Date.now() * 0.004) * 20;

            // Pneumatic Actuation Arm (Brazo Neumático de Embudo)
            ctx.strokeStyle = '#a855f7'; ctx.lineWidth = 4;
            ctx.beginPath(); ctx.moveTo(-60, -140); ctx.lineTo(0, funnelY); ctx.stroke();

            // Conical Funnel Body (Cuerpo Cónico de Embudo)
            ctx.fillStyle = 'rgba(60, 40, 80, 0.95)'; ctx.strokeStyle = '#c084fc'; ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(-45, funnelY);
            ctx.lineTo(45, funnelY);
            ctx.lineTo(20, funnelY + 55);
            ctx.lineTo(-20, funnelY + 55);
            ctx.closePath();
            ctx.fill(); ctx.stroke();

            // Guided Gob Falling into Funnel
            ctx.fillStyle = 'rgba(255, 130, 0, 0.95)';
            ctx.shadowColor = '#ffaa00'; ctx.shadowBlur = 22;
            ctx.beginPath();
            ctx.ellipse(0, funnelY + 20, 13, 22, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        else if (id === 'macho') {
            // Macho Prensador (NNPB Plunger Mechanism) - Esquema 3D Realista
            const pHeight = 100 + Math.sin(Date.now() * 0.004) * 20;

            // Base Cylindrical Housing (Cuerpo del Mecanismo Prensador)
            ctx.fillStyle = 'rgba(40, 50, 65, 0.9)';
            ctx.strokeStyle = '#0088ff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(0, 80, 55, 20, 0, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();

            // Plunger Cylinder Sleeve
            ctx.fillStyle = 'rgba(60, 75, 95, 0.95)';
            ctx.beginPath();
            ctx.rect(-35, 20, 70, 60);
            ctx.fill(); ctx.stroke();

            // Inner Air Cooling Tube (Tubo de Enfriamiento Interno)
            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, 80); ctx.lineTo(0, 80 - pHeight - 15);
            ctx.stroke();

            // Polished Steel Plunger Pin (Macho Prensador NNPB)
            const gradient = ctx.createLinearGradient(-18 * cos, 0, 18 * cos, 0);
            gradient.addColorStop(0, '#e2e8f0');
            gradient.addColorStop(0.3, '#ffffff');
            gradient.addColorStop(0.7, '#ffaa00');
            gradient.addColorStop(1, '#993300');
            
            ctx.fillStyle = gradient;
            ctx.strokeStyle = '#ffaa00';
            ctx.lineWidth = 1.5;

            ctx.beginPath();
            ctx.ellipse(0, 80 - pHeight, 16, 7, 0, 0, Math.PI * 2);
            ctx.ellipse(0, 20, 20, 8, 0, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();

            // Neck Ring Assembly (Anillo de Boca) en el tope
            ctx.fillStyle = 'rgba(120, 80, 40, 0.95)';
            ctx.strokeStyle = '#ffaa00';
            ctx.beginPath();
            ctx.rect(-30, 80 - pHeight - 12, 60, 14);
            ctx.fill(); ctx.stroke();

            // Glowing Hot Glass Contact Surface
            ctx.fillStyle = '#ff7700';
            ctx.shadowColor = '#ffaa00'; ctx.shadowBlur = 25;
            ctx.beginPath();
            ctx.ellipse(0, 80 - pHeight - 12, 14, 6, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        } 
        else if (id === 'premolde') {
            // Premolde (Blank Mold & Baffle Assembly)
            const open = Math.abs(Math.sin(Date.now() * 0.003)) * 28;

            // Baffle Cap (Tapa de Premolde arriba)
            ctx.fillStyle = 'rgba(80, 90, 110, 0.9)';
            ctx.strokeStyle = '#00ff88'; ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.rect(-40, -110, 80, 20);
            ctx.fill(); ctx.stroke();

            // Split Blank Mold Halves (Mitades de Premolde de Fundición)
            ctx.fillStyle = 'rgba(30, 45, 60, 0.95)';

            // Left Mold Half + Verti-Flow Cooling Holes
            ctx.beginPath();
            ctx.rect(-70 - open, -80, 55, 140);
            ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#00ff88';
            for (let y = -60; y <= 40; y += 25) {
                ctx.beginPath(); ctx.arc(-45 - open, y, 4, 0, Math.PI * 2); ctx.fill();
            }

            // Right Mold Half + Verti-Flow Cooling Holes
            ctx.fillStyle = 'rgba(30, 45, 60, 0.95)';
            ctx.beginPath();
            ctx.rect(15 + open, -80, 55, 140);
            ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#00ff88';
            for (let y = -60; y <= 40; y += 25) {
                ctx.beginPath(); ctx.arc(45 + open, y, 4, 0, Math.PI * 2); ctx.fill();
            }

            // Glowing Parison inside when closed
            if (open < 12) {
                ctx.fillStyle = 'rgba(255, 100, 0, 0.85)';
                ctx.shadowColor = '#ffaa00'; ctx.shadowBlur = 30;
                ctx.beginPath();
                ctx.ellipse(0, -10, 15, 60, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        } 
        else if (id === 'inversion') {
            // Mecanismo de Inversión 180° (Invert Arms & Turnover Shaft)
            const rotArm = (Date.now() * 0.002) % (Math.PI * 2);
            
            // Central Turnover Rotation Shaft (Eje de Inversión)
            ctx.strokeStyle = '#a855f7'; ctx.lineWidth = 3;
            ctx.fillStyle = 'rgba(70, 35, 100, 0.95)';
            ctx.beginPath();
            ctx.arc(0, 30, 35, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();

            // Rack and Pinion Gear Teeth Details
            ctx.strokeStyle = '#c084fc'; ctx.lineWidth = 2;
            for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
                ctx.beginPath();
                ctx.moveTo(Math.cos(a) * 35, 30 + Math.sin(a) * 35);
                ctx.lineTo(Math.cos(a) * 42, 30 + Math.sin(a) * 42);
                ctx.stroke();
            }

            // Dual Rotating Invert Arm
            const ax = Math.cos(rotArm) * 75;
            const ay = Math.sin(rotArm) * 75;

            ctx.strokeStyle = '#a855f7'; ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(0, 30); ctx.lineTo(ax, ay + 30);
            ctx.stroke();

            // Split Neck Ring gripping Parison
            ctx.fillStyle = '#ffaa00';
            ctx.shadowColor = '#a855f7'; ctx.shadowBlur = 18;
            ctx.beginPath();
            ctx.ellipse(ax, ay + 30, 15, 15, 0, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();
            ctx.shadowBlur = 0;
        } 
        else if (id === 'molde_soplo') {
            // Molde de Soplo (Blow Mold & Bottom Plate)
            const blowProgress = Math.abs(Math.sin(Date.now() * 0.003));

            // Outer Blow Mold Body
            ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2;
            ctx.fillStyle = 'rgba(20, 55, 45, 0.95)';
            ctx.beginPath();
            ctx.rect(-60, -90, 120, 150);
            ctx.fill(); ctx.stroke();

            // Bottom Plate (Placa de Fondo del Molde)
            ctx.fillStyle = 'rgba(40, 80, 65, 0.95)';
            ctx.beginPath();
            ctx.rect(-40, 60, 80, 25);
            ctx.fill(); ctx.stroke();

            // Verti-Flow Cooling Holes
            ctx.fillStyle = '#10b981';
            for (let y = -70; y <= 40; y += 22) {
                ctx.beginPath(); ctx.arc(-50, y, 3, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(50, y, 3, 0, Math.PI * 2); ctx.fill();
            }

            // Glowing Expanding Bottle Body
            const bw = 15 + blowProgress * 15;
            ctx.fillStyle = 'rgba(255, 120, 0, 0.8)';
            ctx.strokeStyle = '#ffaa00'; ctx.lineWidth = 2;
            ctx.shadowColor = '#ffaa00'; ctx.shadowBlur = 25;
            ctx.beginPath();
            ctx.ellipse(0, -15, bw, 55, 0, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();
            ctx.shadowBlur = 0;
        }
        else if (id === 'fondo_vertiflow') {
            // Bottom Plate & Verti-Flow Cooling Base
            const airFlow = (Date.now() * 0.08) % 30;

            // Bottom Plate Body (Placa de Fondo de Pica)
            ctx.fillStyle = 'rgba(45, 55, 70, 0.95)'; ctx.strokeStyle = '#00ff88'; ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.rect(-50, 20, 100, 45);
            ctx.fill(); ctx.stroke();

            // Bottle Pushup Profile (Pica de Fondo de Botella)
            ctx.fillStyle = 'rgba(30, 40, 50, 0.95)';
            ctx.beginPath();
            ctx.ellipse(0, 20, 35, 18, 0, 0, Math.PI);
            ctx.fill(); ctx.stroke();

            // Verti-Flow Cooling Air Streams (Aire Vertical de Alta Presión)
            ctx.strokeStyle = 'rgba(0, 255, 136, 0.8)'; ctx.lineWidth = 1.5;
            for (let x = -35; x <= 35; x += 14) {
                ctx.beginPath();
                ctx.moveTo(x, 65); ctx.lineTo(x, 65 - airFlow);
                ctx.stroke();
            }

            // Glowing Bottom of Bottle
            ctx.fillStyle = 'rgba(255, 110, 0, 0.85)';
            ctx.shadowColor = '#00ff88'; ctx.shadowBlur = 20;
            ctx.beginPath();
            ctx.ellipse(0, 18, 32, 12, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        else if (id === 'cabeza_soplo') {
            // Cabeza de Soplo (Blow Head Assembly & Final Blow)
            const bhY = -90 + Math.sin(Date.now() * 0.004) * 15;

            // Pneumatic Cylinder Arm
            ctx.strokeStyle = '#eab308'; ctx.lineWidth = 4;
            ctx.beginPath(); ctx.moveTo(0, -140); ctx.lineTo(0, bhY); ctx.stroke();

            // Blow Head Seating Cup (Boquilla de Cabeza de Soplo)
            ctx.fillStyle = 'rgba(70, 60, 25, 0.95)'; ctx.strokeStyle = '#eab308'; ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.rect(-40, bhY, 80, 35);
            ctx.fill(); ctx.stroke();

            // Internal Air Injection Tube (Tubo de Soplo Final)
            ctx.strokeStyle = '#00f0ff'; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(0, bhY + 35); ctx.lineTo(0, bhY + 80); ctx.stroke();

            // High Pressure Air Jets
            ctx.strokeStyle = 'rgba(0, 220, 255, 0.85)'; ctx.lineWidth = 1.5;
            for (let dx = -25; dx <= 25; dx += 10) {
                ctx.beginPath();
                ctx.moveTo(dx, bhY + 35); ctx.lineTo(dx * 1.4, bhY + 85);
                ctx.stroke();
            }
        } 
        else if (id === 'takeout') {
            // Pinzas de Extracción (Takeout Tongs & Deadplate)
            const tx = Math.sin(Date.now() * 0.003) * 50;

            // Deadplate (Placa de Enfriamiento de Extracción abajo)
            ctx.fillStyle = 'rgba(40, 45, 55, 0.95)'; ctx.strokeStyle = '#ff0055'; ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.rect(-70, 60, 140, 20);
            ctx.fill(); ctx.stroke();

            // Air Cooling Vents on Deadplate
            ctx.fillStyle = '#ff0055';
            for (let x = -50; x <= 50; x += 15) {
                ctx.beginPath(); ctx.arc(x, 70, 2.5, 0, Math.PI * 2); ctx.fill();
            }

            // Scissor Takeout Tongs Arm
            ctx.strokeStyle = '#ff0055'; ctx.lineWidth = 3.5;
            ctx.beginPath();
            ctx.moveTo(0, -90); ctx.lineTo(tx, -30);
            ctx.stroke();

            // Graphite Insert Tongs (Pinzas de Extracción de Carbono)
            ctx.fillStyle = '#222'; ctx.strokeStyle = '#ffaa00'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.rect(tx - 22, -30, 44, 18); ctx.fill(); ctx.stroke();

            // Hot Bottle being transferred
            ctx.fillStyle = 'rgba(255, 90, 0, 0.85)';
            ctx.shadowColor = '#ff0055'; ctx.shadowBlur = 22;
            ctx.beginPath();
            ctx.ellipse(tx, 15, 18, 42, 0, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();
            ctx.shadowBlur = 0;
        }

        ctx.restore();
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
        if (imgElement) {
            const imgFileName = defect.id + '.png';
            imgElement.dataset.retried = '';
            imgElement.onerror = function() {
                if (!this.dataset.retried) {
                    this.dataset.retried = 'true';
                    this.src = 'images/defects/' + imgFileName;
                }
            };
            
            const pathPrefix = (window.location.pathname.includes('/static/') || document.querySelector('link[href*="static/"]')) ? '/static/images/defects/' : 'images/defects/';
            imgElement.src = pathPrefix + imgFileName + '?v=2.0';
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

    // --- Módulo 1: Pestañas (Manual de Estudio & Evaluación) ---
    switchLabTab(tab) {
        const btnEstudio = document.getElementById('tabBtnEstudio');
        const btnEvaluacion = document.getElementById('tabBtnEvaluacion');
        const viewEstudio = document.getElementById('labEstudioView');
        const viewEvaluacion = document.getElementById('labEvaluacionView');

        if (tab === 'estudio') {
            if (btnEstudio) btnEstudio.classList.add('active');
            if (btnEvaluacion) btnEvaluacion.classList.remove('active');
            if (viewEstudio) viewEstudio.classList.remove('hidden');
            if (viewEvaluacion) viewEvaluacion.classList.add('hidden');
            this.renderManualEstudio('todas');
        } else {
            if (btnEvaluacion) btnEvaluacion.classList.add('active');
            if (btnEstudio) btnEstudio.classList.remove('active');
            if (viewEvaluacion) viewEvaluacion.classList.remove('hidden');
            if (viewEstudio) viewEstudio.classList.add('hidden');
            this.currentDefectIndex = 0;
            this.renderDefecto();
        }
    },

    renderManualEstudio(filterZona) {
        const container = document.getElementById('manualCardsContainer');
        if (!container) return;

        let filtered = this.defectosDB;
        if (filterZona && filterZona !== 'todas') {
            filtered = this.defectosDB.filter(d => d.zona.toLowerCase().includes(filterZona.toLowerCase()));
        }

        container.innerHTML = filtered.map(d => `
            <div class="manual-card glass-panel">
                <div class="manual-card-header">
                    <span class="manual-zone-badge">📍 ${d.zona}</span>
                    <span class="manual-type-badge ${d.tipoDefecto && d.tipoDefecto.includes('Térmico') ? 'termico' : 'mecanico'}">
                        ${d.tipoDefecto && d.tipoDefecto.includes('Térmico') ? '🔥 Térmico' : '⚙️ Mecánico'}
                    </span>
                </div>
                <div class="manual-card-body">
                    <h4>${d.nombre}</h4>
                    <span class="manual-mechanism-tag">⚙️ Mecanismo: ${d.mecanismoCausa || 'Máquina I.S.'}</span>
                    <p class="manual-desc">${d.desc}</p>
                    <div class="manual-solution-box">
                        <strong>🛠️ Acción Correctiva del Operador (Cristalchile):</strong>
                        <p>${d.solucionOperador || 'Revisar la configuración de máquina y moldería.'}</p>
                    </div>
                </div>
            </div>
        `).join('');
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
        this.currentDefectIndex = (this.currentDefectIndex + 1) % this.defectosDB.length;
        this.renderDefecto();
    },

    // --- Consola de Temporización BDF (Secuenciador Electrónico I.S. — Cristal Chile / VitroDiag) ---
    updateTiming() {
        const bpm = parseFloat(document.getElementById('calcBpm')?.value) || 396;
        const sections = parseInt(document.getElementById('calcSections')?.value) || 11;
        const cavity = parseInt(document.getElementById('calcCavities')?.value) || 3;

        // FÓRMULA DE RELACIÓN: CPM de sección = BPM / (Secciones * Cavidades)
        const cpmSec = (bpm > 0) ? (bpm / (sections * cavity)) : 0;
        const cpmShear = (bpm > 0) ? (bpm / cavity) : 0;
        const cycleMs = (cpmSec > 0) ? ((60 / cpmSec) * 1000) : 0;
        const msPerDeg = cycleMs / 360;

        const cycleDisplay = document.getElementById('cycleTimeDisplay');
        if (cycleDisplay) {
            cycleDisplay.innerText = `Ciclo: ${cycleMs.toFixed(0)} ms | Cizalla: ${cpmShear.toFixed(0)} CPM (${msPerDeg.toFixed(2)} ms/°)`;
        }

        // Eventos en grados (0° - 360°)
        const plungerUp = parseFloat(document.getElementById('valPlungerUp')?.value) || 0;
        const plungerDown = parseFloat(document.getElementById('valPlungerDown')?.value) || 70;
        const invertStart = parseFloat(document.getElementById('valInvertStart')?.value) || 90;
        const blowClose = parseFloat(document.getElementById('valBlowClose')?.value) || 120;
        const neckOpen = parseFloat(document.getElementById('valNeckOpen')?.value) || 135;
        const blowOn = parseFloat(document.getElementById('valBlowOn')?.value) || 140;
        const blowOff = parseFloat(document.getElementById('valBlowOff')?.value) || 200;

        // Actualizar etiquetas numéricas
        if (document.getElementById('lblPlungerUp')) document.getElementById('lblPlungerUp').textContent = plungerUp;
        if (document.getElementById('lblPlungerDown')) document.getElementById('lblPlungerDown').textContent = plungerDown;
        if (document.getElementById('lblInvertStart')) document.getElementById('lblInvertStart').textContent = invertStart;
        if (document.getElementById('lblBlowClose')) document.getElementById('lblBlowClose').textContent = blowClose;
        if (document.getElementById('lblNeckOpen')) document.getElementById('lblNeckOpen').textContent = neckOpen;
        if (document.getElementById('lblBlowOn')) document.getElementById('lblBlowOn').textContent = blowOn;
        if (document.getElementById('lblBlowOff')) document.getElementById('lblBlowOff').textContent = blowOff;

        // Auxiliar diferencia de grados con wrap-around de 360°
        function getDegDiff(start, end) {
            if (end >= start) return end - start;
            return (360 - start) + end;
        }

        const resultsContainer = document.getElementById('bdfValidationResults');
        let html = "";

        // 1. Dwell Prensado Macho
        const plungerDwellDeg = getDegDiff(plungerUp, plungerDown);
        let plungerClass = "success";
        let plungerIcon = "🟢";
        let plungerMsg = `Prensado Macho (Dwell): ${plungerDwellDeg.toFixed(0)}° (${(plungerDwellDeg * msPerDeg).toFixed(0)} ms). Rango óptimo NNPB: 60° a 80°.`;

        if (plungerDwellDeg < 60) {
            plungerClass = "warning"; plungerIcon = "⚠️";
            plungerMsg = `Prensado Macho (Dwell) insuficiente: ${plungerDwellDeg.toFixed(0)}°. Mínimo recomendado 60° en NNPB para evitar bajo boca.`;
        } else if (plungerDwellDeg > 80) {
            plungerClass = "warning"; plungerIcon = "⚠️";
            plungerMsg = `Prensado Macho (Dwell) excesivo: ${plungerDwellDeg.toFixed(0)}°. Máximo recomendado 80° para evitar sobreenfriamiento.`;
        }
        html += `<div class="validation-alert ${plungerClass}"><span>${plungerIcon}</span><span>${plungerMsg}</span></div>`;

        // 2. Dwell Soplado Final
        const blowDwellDeg = getDegDiff(blowOn, blowOff);
        let blowClass = "success";
        let blowIcon = "🟢";
        let blowMsg = `Soplado Final: ${blowDwellDeg.toFixed(0)}° (${(blowDwellDeg * msPerDeg).toFixed(0)} ms). Rango óptimo: 50° a 70° del ciclo.`;

        if (blowDwellDeg < 50) {
            blowClass = "warning"; blowIcon = "⚠️";
            blowMsg = `Soplado Final corto: ${blowDwellDeg.toFixed(0)}°. Se recomiendan mín. 50° para estabilizar paredes del envase.`;
        } else if (blowDwellDeg > 70) {
            blowClass = "warning"; blowIcon = "⚠️";
            blowMsg = `Soplado Final largo: ${blowDwellDeg.toFixed(0)}°. Máx. recomendado 70° para no quitar tiempo a otros mecanismos.`;
        }
        html += `<div class="validation-alert ${blowClass}"><span>${blowIcon}</span><span>${blowMsg}</span></div>`;

        // 3. Colisión Crítica: Macho vs Inversión
        let colisionPlunger = false;
        if (plungerDown > plungerUp) {
            if (invertStart >= plungerUp && invertStart < plungerDown) colisionPlunger = true;
        } else {
            if (invertStart >= plungerUp || invertStart < plungerDown) colisionPlunger = true;
        }
        const plungerToInvertDeg = colisionPlunger ? 0 : getDegDiff(plungerDown, invertStart);

        if (colisionPlunger) {
            html += `<div class="validation-alert danger"><span>🚨</span><span><b>COLISIÓN ACTIVA: Macho vs Inversión</b>. Inversión inicia a los ${invertStart}° mientras el macho sigue arriba (baja a los ${plungerDown}°). Destrucción de moldería.</span></div>`;
        } else if (plungerToInvertDeg < 15) {
            html += `<div class="validation-alert danger"><span>🚨</span><span><b>PELIGRO DE COLISIÓN</b>: Margen de ${plungerToInvertDeg.toFixed(0)}° entre bajada de macho (${plungerDown}°) e inversión (${invertStart}°). Mínimo seguro: 15°.</span></div>`;
        } else {
            html += `<div class="validation-alert success"><span>🟢</span><span>Retiro de Macho e Inversión: Margen seguro de ${plungerToInvertDeg.toFixed(0)}° (correcto).</span></div>`;
        }

        // 4. Caída anticipada: Anillo de Boca vs Molde Soplo
        const blowToNeckDeg = getDegDiff(blowClose, neckOpen);
        if (blowToNeckDeg > 180 || blowToNeckDeg < 10) {
            const actualMargin = blowToNeckDeg > 180 ? 0 : blowToNeckDeg;
            html += `<div class="validation-alert danger"><span>🚨</span><span><b>Soporte de Preforma Inseguro</b>: El anillo abre a los ${neckOpen}° y el molde soplo cierra a los ${blowClose}° (margen real: ${actualMargin.toFixed(0)}°). La preforma caerá en caliente.</span></div>`;
        } else {
            html += `<div class="validation-alert success"><span>🟢</span><span>Soporte de Molde Soplo: El molde cierra antes de abrir el anillo con desfase seguro de ${blowToNeckDeg.toFixed(0)}°.</span></div>`;
        }

        if (resultsContainer) resultsContainer.innerHTML = html;

        // --- Actualizar Barras Gantt ---
        const barPlunger = document.getElementById('barPlunger');
        const barInvert = document.getElementById('barInvert');
        const barBlowMold = document.getElementById('barBlowMold');
        const barFinalBlow = document.getElementById('barFinalBlow');

        const labelPlunger = document.getElementById('labelPlunger');
        const labelInvert = document.getElementById('labelInvert');
        const labelBlowMold = document.getElementById('labelBlowMold');
        const labelFinalBlow = document.getElementById('labelFinalBlow');

        function updateGanttBar(bar, label, start, end, color) {
            if (!bar || !label) return;
            let leftPercent = (start / 360) * 100;
            let widthPercent = 0;
            if (end >= start) {
                widthPercent = ((end - start) / 360) * 100;
                bar.style.left = `${leftPercent}%`;
                bar.style.width = `${widthPercent}%`;
                bar.style.background = color;
            } else {
                widthPercent = (((360 - start) + end) / 360) * 100;
                bar.style.left = `${leftPercent}%`;
                bar.style.width = `${widthPercent}%`;
                bar.style.background = `linear-gradient(to right, ${color}, rgba(255,255,255,0.15))`;
            }
            label.innerText = `${start.toFixed(0)}°-${end.toFixed(0)}°`;
        }

        updateGanttBar(barPlunger, labelPlunger, plungerUp, plungerDown, '#3b82f6');
        updateGanttBar(barInvert, labelInvert, invertStart, blowClose, '#a855f7');
        updateGanttBar(barBlowMold, labelBlowMold, blowClose, 330, '#10b981');
        updateGanttBar(barFinalBlow, labelFinalBlow, blowOn, blowOff, '#eab308');
    }
};

window.app = app;

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
