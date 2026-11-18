/**
 * ═══════════════════════════════════════════════════════════════════
 * SYMBIOTIERRA – MASTER SCRIPT (V3.0)
 * DeepTech Environmental Restoration & Autonomous Robotics
 * ═══════════════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ═══════════════════════════════════════════════════════════════
       1. PRELOADER
       ═══════════════════════════════════════════════════════════════ */
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 600);
        });
        // Fallback safety timeout
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 2500);
    }

    /* ═══════════════════════════════════════════════════════════════
       2. STICKY NAVBAR & RESPONSIVE MOBILE DRAWER
       ═══════════════════════════════════════════════════════════════ */
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navDrawer = document.getElementById('navMobileDrawer');
    const navBackdrop = document.getElementById('navBackdrop');
    const drawerClose = document.getElementById('drawerClose');
    const drawerStandBtn = document.getElementById('drawerStandBtn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    function openMobileDrawer() {
        if (navDrawer) navDrawer.classList.add('open');
        if (navBackdrop) navBackdrop.classList.add('open');
        if (navToggle) {
            navToggle.classList.add('active');
            navToggle.setAttribute('aria-expanded', 'true');
        }
        document.body.classList.add('menu-open');
    }

    function closeMobileDrawer() {
        if (navDrawer) navDrawer.classList.remove('open');
        if (navBackdrop) navBackdrop.classList.remove('open');
        if (navToggle) {
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
        document.body.classList.remove('menu-open');
    }

    if (navToggle) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (navDrawer && navDrawer.classList.contains('open')) {
                closeMobileDrawer();
            } else {
                openMobileDrawer();
            }
        });
    }

    if (drawerClose) {
        drawerClose.addEventListener('click', closeMobileDrawer);
    }

    if (navBackdrop) {
        navBackdrop.addEventListener('click', closeMobileDrawer);
    }

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navDrawer && navDrawer.classList.contains('open')) {
            closeMobileDrawer();
        }
    });

    // Close mobile drawer when clicking any link inside it
    if (navDrawer) {
        navDrawer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                closeMobileDrawer();
            });
        });
    }

    // Open Stand modal from drawer action button if clicked
    if (drawerStandBtn) {
        drawerStandBtn.addEventListener('click', () => {
            closeMobileDrawer();
            const standModal = document.getElementById('standModal');
            if (standModal) {
                standModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    /* ═══════════════════════════════════════════════════════════════
       3. INTERACTIVE CANVAS: MYCELIUM & DRONE SWARM NETWORK
       ═══════════════════════════════════════════════════════════════ */
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.inset = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        particlesContainer.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let width = canvas.width = particlesContainer.offsetWidth;
        let height = canvas.height = particlesContainer.offsetHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = particlesContainer.offsetWidth;
            height = canvas.height = particlesContainer.offsetHeight;
            initNodes();
        });

        // Mouse tracking for reactive mycelium expansion
        const mouse = { x: null, y: null, radius: 150 };
        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        const nodes = [];
        const nodeCount = Math.floor(Math.min(width, 1400) / 18);
        const colors = [
            'rgba(47, 168, 79, ',  // Green
            'rgba(30, 111, 235, ', // Blue
            'rgba(74, 222, 128, '  // Light green
        ];

        class Node {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.radius = Math.random() * 2.2 + 1.2;
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = (Math.random() - 0.5) * 0.8;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.baseAlpha = Math.random() * 0.5 + 0.3;
                this.alpha = this.baseAlpha;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce borders
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse interaction
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.x -= (dx / dist) * force * 2.5;
                        this.y -= (dy / dist) * force * 2.5;
                        this.alpha = 0.9;
                    } else {
                        this.alpha = this.baseAlpha;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color + this.alpha + ')';
                ctx.shadowBlur = 8;
                ctx.shadowColor = this.color + '0.6)';
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        function initNodes() {
            nodes.length = 0;
            for (let i = 0; i < nodeCount; i++) {
                nodes.push(new Node());
            }
        }
        initNodes();

        function connectNodes() {
            const maxDistance = 120;
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDistance) {
                        const opacity = (1 - dist / maxDistance) * 0.22;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.strokeStyle = `rgba(47, 168, 79, ${opacity})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);
            nodes.forEach(node => {
                node.update();
                node.draw();
            });
            connectNodes();
            requestAnimationFrame(animateCanvas);
        }
        animateCanvas();
    }

    /* ═══════════════════════════════════════════════════════════════
       4. SCROLL ANIMATIONS (INTERSECTION OBSERVER)
       ═══════════════════════════════════════════════════════════════ */
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => scrollObserver.observe(el));

    /* ═══════════════════════════════════════════════════════════════
       5. ANIMATED STAT COUNTERS
       ═══════════════════════════════════════════════════════════════ */
    const counterElements = document.querySelectorAll('[data-count]');
    
    function animateCounter(el) {
        const target = parseFloat(el.getAttribute('data-count'));
        const duration = 2200; // ms
        const startTime = performance.now();
        const isDecimal = target % 1 !== 0;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out quad
            const easeProgress = 1 - (1 - progress) * (1 - progress);
            const currentVal = easeProgress * target;

            el.textContent = isDecimal 
                ? currentVal.toFixed(1) 
                : Math.floor(currentVal).toLocaleString('es-VE');

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = isDecimal 
                    ? target.toFixed(1) 
                    : target.toLocaleString('es-VE');
            }
        }

        requestAnimationFrame(update);
    }

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    counterElements.forEach(el => counterObserver.observe(el));

    /* ═══════════════════════════════════════════════════════════════
       6. INTERACTIVE DASHBOARD SIMULATOR (ECO-ENJAMBRE V3)
       ═══════════════════════════════════════════════════════════════ */
    setupInteractiveDashboard();

    function setupInteractiveDashboard() {
        const mockupContent = document.querySelector('.mockup-content');
        if (!mockupContent) return;

        // Regional Hub data
        const hubsData = {
            merida: {
                name: 'Mérida (Andes Venezolanos)',
                co2: '12.4 ton',
                water: '8,200 L',
                germination: '87.3%',
                co2Pct: 78,
                waterPct: 65,
                germPct: 87,
                droneCount: 5,
                activeSensors: 42,
                status: 'Enjambre #1 y #2 operando',
                spots: [
                    { left: '32%', top: '42%', color: 'rgba(47, 168, 79, 0.65)' },
                    { left: '58%', top: '30%', color: 'rgba(30, 111, 235, 0.65)' },
                    { left: '44%', top: '65%', color: 'rgba(74, 222, 128, 0.6)' }
                ]
            },
            puerto_ordaz: {
                name: 'Puerto Ordaz (Cuenca del Caroní)',
                co2: '28.6 ton',
                water: '24,500 L',
                germination: '89.1%',
                co2Pct: 88,
                waterPct: 82,
                germPct: 89,
                droneCount: 5,
                activeSensors: 64,
                status: 'Enjambre #3 y #4 en dispersión',
                spots: [
                    { left: '25%', top: '35%', color: 'rgba(30, 111, 235, 0.7)' },
                    { left: '68%', top: '55%', color: 'rgba(47, 168, 79, 0.65)' },
                    { left: '52%', top: '25%', color: 'rgba(74, 222, 128, 0.65)' }
                ]
            },
            amazonas: {
                name: 'Región Amazónica (Expansión)',
                co2: '65.2 ton',
                water: '51,800 L',
                germination: '91.4%',
                co2Pct: 94,
                waterPct: 90,
                germPct: 91,
                droneCount: 8,
                activeSensors: 110,
                status: 'Fase de Escaneo 3D Autónomo',
                spots: [
                    { left: '40%', top: '50%', color: 'rgba(47, 168, 79, 0.75)' },
                    { left: '72%', top: '38%', color: 'rgba(30, 111, 235, 0.7)' },
                    { left: '20%', top: '60%', color: 'rgba(74, 222, 128, 0.65)' }
                ]
            }
        };

        // Add Hub Selector inside Mockup Header if not present
        const mockupHeader = document.querySelector('.mockup-header');
        if (mockupHeader && !mockupHeader.querySelector('.hub-selector')) {
            const hubControls = document.createElement('div');
            hubControls.className = 'hub-selector';
            hubControls.style.cssText = `
                display: flex;
                gap: 6px;
                margin-left: auto;
                font-family: var(--font-heading);
                font-size: 0.75rem;
                z-index: 2;
            `;
            hubControls.innerHTML = `
                <button class="hub-btn active" data-hub="merida" style="background: rgba(47,168,79,0.25); border: 1px solid var(--green); color: #fff; padding: 3px 8px; border-radius: 4px;">Mérida</button>
                <button class="hub-btn" data-hub="puerto_ordaz" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #9CA3AF; padding: 3px 8px; border-radius: 4px;">Pto. Ordaz</button>
                <button class="hub-btn" data-hub="amazonas" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #9CA3AF; padding: 3px 8px; border-radius: 4px;">Amazonas</button>
            `;
            mockupHeader.appendChild(hubControls);

            const hubButtons = hubControls.querySelectorAll('.hub-btn');
            hubButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    hubButtons.forEach(b => {
                        b.style.background = 'rgba(255,255,255,0.05)';
                        b.style.borderColor = 'rgba(255,255,255,0.1)';
                        b.style.color = '#9CA3AF';
                        b.classList.remove('active');
                    });
                    btn.style.background = 'rgba(47,168,79,0.25)';
                    btn.style.borderColor = 'var(--green)';
                    btn.style.color = '#fff';
                    btn.classList.add('active');

                    const hubKey = btn.getAttribute('data-hub');
                    updateDashboardHub(hubsData[hubKey]);
                });
            });
        }

        function updateDashboardHub(data) {
            const statValues = document.querySelectorAll('.mock-stat-value');
            const statBars = document.querySelectorAll('.mock-bar-fill');
            const mapLabel = document.querySelector('.map-label');

            if (statValues.length >= 3) {
                statValues[0].textContent = data.co2;
                statValues[1].textContent = data.water;
                statValues[2].textContent = data.germination;
            }

            if (statBars.length >= 3) {
                statBars[0].style.width = data.co2Pct + '%';
                statBars[1].style.width = data.waterPct + '%';
                statBars[2].style.width = data.germPct + '%';
            }

            if (mapLabel) {
                mapLabel.textContent = data.name + ' · ' + data.status;
            }
        }

        // Live telemetry fluctuation simulation (makes the dashboard feel alive in real time)
        let simCO2 = 12.4;
        let simWater = 8200;
        setInterval(() => {
            const activeHubBtn = document.querySelector('.hub-btn.active');
            const activeHub = activeHubBtn ? activeHubBtn.getAttribute('data-hub') : 'merida';
            if (activeHub === 'merida') {
                simCO2 += 0.01;
                simWater += Math.floor(Math.random() * 3) + 1;
                const statValues = document.querySelectorAll('.mock-stat-value');
                if (statValues.length >= 2) {
                    statValues[0].textContent = simCO2.toFixed(2) + ' ton';
                    statValues[1].textContent = simWater.toLocaleString('es-VE') + ' L';
                }
            }
        }, 3000);
    }

    /* ═══════════════════════════════════════════════════════════════
       7. SMOOTH SCROLL FOR ALL ANCHOR LINKS
       ═══════════════════════════════════════════════════════════════ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    console.log('%c SymbioTierra ', 'background: #2FA84F; color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 4px;', 'Reescribiendo el código de la naturaleza · EcoTech & Robotics');
});


/* ═══════════════════════════════════════════════════════════════════
   8. INTERACTIVE CALCULATOR (ROI & ECOLOGICAL IMPACT)
   ═══════════════════════════════════════════════════════════════════ */
setupCalculator();

function setupCalculator() {
    const slider = document.getElementById('calcSlider');
    const haDisplay = document.getElementById('calcHaDisplay');
    const resInvestment = document.getElementById('resInvestment');
    const resTime = document.getElementById('resTime');
    const resCO2 = document.getElementById('resCO2');
    const resWater = document.getElementById('resWater');
    const resCapsules = document.getElementById('resCapsules');

    if (!slider) return;

    function updateCalculations() {
        const ha = parseInt(slider.value, 10);
        if (haDisplay) haDisplay.textContent = ha + ' ha';

        // Calculation formulas based on official project specs:
        // Price: $1,200 USD / ha
        const investment = ha * 1200;
        // Time reduction: 70% faster (approx 2 to 4 months vs 12 to 24 months)
        const monthsTraditional = Math.round(ha * 0.18 + 12);
        const monthsSymbio = Math.max(2, Math.round(monthsTraditional * 0.3));
        // Ecological metrics
        const co2Tons = Math.round(ha * 24.5);
        const waterLiters = ha * 150000;
        const capsulesCount = ha * 2500;

        if (resInvestment) resInvestment.textContent = '$' + investment.toLocaleString('es-VE') + ' USD';
        if (resTime) resTime.textContent = monthsSymbio + ' meses (vs ' + monthsTraditional + ' m)';
        if (resCO2) resCO2.textContent = co2Tons.toLocaleString('es-VE') + ' ton/año';
        if (resWater) resWater.textContent = waterLiters.toLocaleString('es-VE') + ' L';
        if (resCapsules) resCapsules.textContent = capsulesCount.toLocaleString('es-VE');
    }

    slider.addEventListener('input', updateCalculations);
    updateCalculations();
}

/* ═══════════════════════════════════════════════════════════════════
   9. BIO-CAPSULE ANATOMY INTERACTIVE EXPLORER
   ═══════════════════════════════════════════════════════════════════ */
setupCapsuleExplorer();

function setupCapsuleExplorer() {
    const layerCards = document.querySelectorAll('.capsule-layer-card');
    const capsuleGraphic = document.querySelector('.capsule-svg');

    if (!layerCards.length) return;

    layerCards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            layerCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            if (capsuleGraphic) {
                capsuleGraphic.style.transform = `scale(1.1) rotate(${(index + 1) * 12}deg)`;
            }
        });
        card.addEventListener('click', () => {
            layerCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });
}

/* ═══════════════════════════════════════════════════════════════
   10. FAQ ACCORDION (PANEL DE EVALUADORES UNIMAR)
   ═══════════════════════════════════════════════════════════════ */
setupFAQ();

function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (questionBtn) {
            questionBtn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(i => i.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
}

/* ═══════════════════════════════════════════════════════════════
   11. STAND DEMO MODAL & RADAR SIMULATOR
   ═══════════════════════════════════════════════════════════════ */
setupStandModal();

function setupStandModal() {
    const triggerPill = document.getElementById('standTriggerPill');
    const modal = document.getElementById('standModal');
    const closeBtn = document.getElementById('standModalClose');
    const fireBtn = document.getElementById('fireCapsuleBtn');
    const radarDisplay = document.querySelector('.stand-radar-display');
    const capsuleCountEl = document.getElementById('standRemainingCapsules');

    if (!modal) return;

    if (triggerPill) {
        triggerPill.addEventListener('click', () => {
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }
    });

    // Fire capsule simulation
    let remainingCapsules = 450;
    if (fireBtn && radarDisplay) {
        fireBtn.addEventListener('click', () => {
            if (remainingCapsules <= 0) return;
            remainingCapsules -= 5;
            if (capsuleCountEl) capsuleCountEl.textContent = remainingCapsules;

            // Create animated impact dot on radar
            const dropDot = document.createElement('div');
            dropDot.style.cssText = `
                position: absolute;
                left: ${Math.random() * 70 + 15}%;
                top: ${Math.random() * 70 + 15}%;
                width: 14px;
                height: 14px;
                border-radius: 50%;
                background: #4ade80;
                box-shadow: 0 0 15px #2FA84F;
                transform: scale(0);
                transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 2s ease;
                z-index: 5;
                pointer-events: none;
            `;
            radarDisplay.appendChild(dropDot);

            setTimeout(() => {
                dropDot.style.transform = 'scale(1.8)';
            }, 50);

            setTimeout(() => {
                dropDot.style.opacity = '0.3';
                dropDot.style.transform = 'scale(1)';
            }, 800);
        });
    }
}


/* ═══════════════════════════════════════════════════════════════════
   12. BLUEPRINT MODAL VIEWER WITH LOGO EMBLEM TOGGLE
   ═══════════════════════════════════════════════════════════════════ */
setupBlueprintModal();

function setupBlueprintModal() {
    const openBtn = document.getElementById('openBlueprintBtn');
    const modal = document.getElementById('blueprintModal');
    const closeBtn = document.getElementById('blueprintModalClose');
    const toggleBtn = document.getElementById('toggleBlueprintView');
    const blueprintImg = document.getElementById('blueprintModalImg');
    const blueprintTitle = document.getElementById('blueprintModalTitleText');
    const downloadLink = document.getElementById('blueprintDownloadLink');

    if (!modal) return;

    let isSvgView = true;

    if (openBtn) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }
    });

    if (toggleBtn && blueprintImg) {
        toggleBtn.addEventListener('click', () => {
            isSvgView = !isSvgView;
            if (isSvgView) {
                blueprintImg.src = 'assets/images/symbiotierra-drone-blueprint.svg';
                blueprintImg.alt = 'Plano de Ingeniería Oficial SymbioTierra con Logotipo';
                toggleBtn.innerHTML = '<span>🖼️ Ver Render CAD Puro</span>';
                if (blueprintTitle) blueprintTitle.textContent = 'Plano Técnico Oficial de Ingeniería · Con Logotipo SymbioTierra';
                if (downloadLink) {
                    downloadLink.href = 'assets/images/symbiotierra-drone-blueprint.svg';
                    downloadLink.download = 'Plano-Oficial-SymbioTierra-V3.svg';
                }
            } else {
                blueprintImg.src = 'assets/images/drone-blueprint.jpg';
                blueprintImg.alt = 'Render CAD 3D Original';
                toggleBtn.innerHTML = '<span>📐 Ver Plano con Logotipo SymbioTierra</span>';
                if (blueprintTitle) blueprintTitle.textContent = 'Render Tridimensional CAD · Vistas Ortográficas';
                if (downloadLink) {
                    downloadLink.href = 'assets/images/drone-blueprint.jpg';
                    downloadLink.download = 'Render-CAD-Dron-V3.jpg';
                }
            }
        });
    }
}
