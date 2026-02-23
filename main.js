(() => {
  'use strict';

  // ============================================
  // PARTICLE CANVAS
  // ============================================

  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  const isMobile = window.innerWidth < 768;
  const PARTICLE_COUNT = isMobile ? 30 : 60;
  const CONNECTION_DISTANCE = 120;
  const MOUSE_REPEL_DISTANCE = 100;
  const particles = [];
  const mouse = { x: -1000, y: -1000 };

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 1;
      this.opacity = Math.random() * 0.3 + 0.1;
    }

    update() {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_REPEL_DISTANCE && dist > 0) {
        const force = (MOUSE_REPEL_DISTANCE - dist) / MOUSE_REPEL_DISTANCE;
        this.vx += (dx / dist) * force * 0.5;
        this.vy += (dy / dist) * force * 0.5;
      }

      this.vx *= 0.99;
      this.vy *= 0.99;

      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(249, 115, 22, ${this.opacity})`;
      ctx.fill();
    }
  }

  const initParticles = () => {
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  };

  const drawConnections = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DISTANCE) {
          const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(249, 115, 22, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  };

  let animFrameId;
  const animateParticles = () => {
    if (document.hidden) {
      animFrameId = requestAnimationFrame(animateParticles);
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    drawConnections();
    animFrameId = requestAnimationFrame(animateParticles);
  };

  resizeCanvas();
  initParticles();
  animateParticles();

  window.addEventListener('resize', () => {
    resizeCanvas();
  });

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // ============================================
  // CUSTOM CURSOR
  // ============================================

  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (hasFinePointer) {
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    let ringX = 0, ringY = 0;
    const LERP = 0.15;

    const updateCursor = () => {
      ringX += (mouse.x - ringX) * LERP;
      ringY += (mouse.y - ringY) * LERP;

      dot.style.left = `${mouse.x}px`;
      dot.style.top = `${mouse.y}px`;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;

      requestAnimationFrame(updateCursor);
    };

    updateCursor();

    const hoverTargets = 'a, button, [role="button"], .btn, .work-card, .education-card, .bento__card, .cert-tag, .roadmap__bar';

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverTargets)) {
        ring.classList.add('cursor-ring--hover');
        dot.classList.add('cursor-dot--hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverTargets)) {
        ring.classList.remove('cursor-ring--hover');
        dot.classList.remove('cursor-dot--hover');
      }
    });

    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      dot.style.opacity = '1';
      ring.style.opacity = '0.5';
    });
  }

  // ============================================
  // SCROLL REVEAL
  // ============================================

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // ============================================
  // NAV AUTO-HIDE ON SCROLL
  // ============================================

  const nav = document.querySelector('.nav');
  let lastScrollY = window.scrollY;
  let ticking = false;

  const updateNav = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      nav.classList.add('nav--hidden');
    } else {
      nav.classList.remove('nav--hidden');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });

  // ============================================
  // SCROLL PROGRESS BAR
  // ============================================

  const progressBar = document.querySelector('.scroll-progress');

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    progressBar.style.transform = `scaleX(${progress})`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });

  // ============================================
  // HAMBURGER MENU
  // ============================================

  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');

  const toggleMenu = () => {
    const isActive = hamburger.classList.toggle('nav__hamburger--active');
    mobileMenu.classList.toggle('mobile-menu--active');
    hamburger.setAttribute('aria-expanded', isActive);
    document.body.style.overflow = isActive ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('nav__hamburger--active');
      mobileMenu.classList.remove('mobile-menu--active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // ============================================
  // ANIMATED COUNTERS
  // ============================================

  const counters = document.querySelectorAll('.numbers__value');
  let countersAnimated = false;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1500;
    const start = performance.now();

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = Math.round(eased * target);
      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    };

    requestAnimationFrame(update);
  };

  const numbersSection = document.querySelector('.numbers');
  if (numbersSection) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          counters.forEach(el => animateCounter(el));
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counterObserver.observe(numbersSection);
  }

  // ============================================
  // 3D TILT ON WORK CARDS (Desktop only)
  // ============================================

  if (hasFinePointer) {
    const tiltCards = document.querySelectorAll('[data-tilt]');
    const MAX_ROTATION = 5;

    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -MAX_ROTATION;
        const rotateY = ((x - centerX) / centerX) * MAX_ROTATION;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        card.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2}px 30px rgba(249, 115, 22, 0.12)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
        card.style.boxShadow = '';
        setTimeout(() => {
          card.style.transition = '';
        }, 500);
      });
    });
  }

  // ============================================
  // ROADMAP BAR ENTRANCE ANIMATION
  // ============================================

  const roadmaps = document.querySelectorAll('.roadmap');
  if (roadmaps.length) {
    const roadmapObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bars = entry.target.querySelectorAll('.roadmap__bar');
          bars.forEach((bar, i) => {
            bar.style.opacity = '0';
            bar.style.transform = 'scaleX(0)';
            bar.style.transformOrigin = 'left center';
            setTimeout(() => {
              bar.style.transition = 'opacity 0.5s var(--ease-out-expo), transform 0.6s var(--ease-out-expo)';
              bar.style.opacity = '1';
              bar.style.transform = 'scaleX(1)';
            }, i * 80);
          });
          roadmapObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    roadmaps.forEach(r => roadmapObserver.observe(r));
  }

  // ============================================
  // RADAR CHART — Dominios
  // ============================================

  const radarEl = document.querySelector('.radar');
  if (radarEl) {
    const domains = [
      { name: 'Product', level: 10, skills: 'Roadmap, discovery, delivery, priorización' },
      { name: 'GenAI', level: 9, skills: 'LLMs, RAG, deep learning, Databricks' },
      { name: 'Growth', level: 9, skills: 'A/B testing, CRO, retención, experimentación' },
      { name: 'Liderazgo', level: 9, skills: '+20 personas, 4 squads, mentoring, cultura' },
      { name: 'Datos', level: 8, skills: 'Analytics, forecasting, dashboards, métricas' },
      { name: 'Software', level: 8, skills: 'Python, FastAPI, NextJS, Docker, CI/CD' },
      { name: 'Operaciones', level: 6, skills: 'ERP, procesos, supply chain' },
      { name: 'Finanzas', level: 5, skills: 'P&L, EBITDA, unit economics, pricing' },
      { name: 'Ciberseguridad', level: 3, skills: 'Compliance, seguridad de datos' },
      { name: 'Legal', level: 3, skills: 'GDPR, contratos tech, IP' },
    ];

    const CX = 250, CY = 250, MAX_R = 190;
    const N = domains.length;
    const SVG_NS = 'http://www.w3.org/2000/svg';

    const getPoint = (i, r) => {
      const angle = (2 * Math.PI * i / N) - Math.PI / 2;
      return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
    };

    const polyPoints = (r) => {
      return Array.from({ length: N }, (_, i) => {
        const p = getPoint(i, r);
        return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
      }).join(' ');
    };

    // Generate grid rings
    const gridG = radarEl.querySelector('.radar__grid');
    [0.25, 0.5, 0.75, 1].forEach(pct => {
      const ring = document.createElementNS(SVG_NS, 'polygon');
      ring.setAttribute('points', polyPoints(MAX_R * pct));
      gridG.appendChild(ring);
    });

    // Generate axis lines
    const axesG = radarEl.querySelector('.radar__axes');
    for (let i = 0; i < N; i++) {
      const p = getPoint(i, MAX_R);
      const line = document.createElementNS(SVG_NS, 'line');
      line.setAttribute('x1', CX);
      line.setAttribute('y1', CY);
      line.setAttribute('x2', p.x.toFixed(1));
      line.setAttribute('y2', p.y.toFixed(1));
      axesG.appendChild(line);
    }

    // Generate vertex dots (initially at center)
    const dotsG = radarEl.querySelector('.radar__dots');
    const dotEls = [];
    for (let i = 0; i < N; i++) {
      const circle = document.createElementNS(SVG_NS, 'circle');
      circle.setAttribute('cx', CX);
      circle.setAttribute('cy', CY);
      circle.setAttribute('r', 5);
      circle.dataset.index = i;
      dotsG.appendChild(circle);
      dotEls.push(circle);
    }

    // Generate labels
    const labelsDiv = radarEl.querySelector('.radar__labels');
    const labelEls = [];
    for (let i = 0; i < N; i++) {
      const p = getPoint(i, MAX_R + 28);
      const label = document.createElement('div');
      label.className = 'radar__label';
      label.textContent = domains[i].name;
      label.dataset.index = i;

      // Position as percentage of the 500x500 viewbox
      const leftPct = (p.x / 500) * 100;
      const topPct = (p.y / 500) * 100;

      label.style.left = `${leftPct}%`;
      label.style.top = `${topPct}%`;

      // Align text based on position
      if (p.x < CX - 20) {
        label.style.transform = 'translate(-100%, -50%)';
        label.style.textAlign = 'right';
      } else if (p.x > CX + 20) {
        label.style.transform = 'translate(0%, -50%)';
      } else {
        label.style.transform = 'translate(-50%, ' + (p.y < CY ? '-100%' : '0%') + ')';
        label.style.textAlign = 'center';
      }

      labelsDiv.appendChild(label);
      labelEls.push(label);
    }

    // Set polygon to center initially
    const areaEl = radarEl.querySelector('.radar__area');
    const centerPoints = Array(N).fill(`${CX},${CY}`).join(' ');
    areaEl.setAttribute('points', centerPoints);

    // Expertise polygon target points
    const targetPoints = domains.map((d, i) => {
      const p = getPoint(i, (d.level / 10) * MAX_R);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join(' ');

    // Scroll-triggered animation
    let radarAnimated = false;
    const radarObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !radarAnimated) {
          radarAnimated = true;
          // Animate polygon
          areaEl.setAttribute('points', targetPoints);
          // Animate dots
          domains.forEach((d, i) => {
            const p = getPoint(i, (d.level / 10) * MAX_R);
            dotEls[i].setAttribute('cx', p.x.toFixed(1));
            dotEls[i].setAttribute('cy', p.y.toFixed(1));
          });
          radarObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    radarObserver.observe(radarEl);

    // Tooltip interaction
    const tooltip = radarEl.querySelector('.radar__tooltip');
    const tooltipName = tooltip.querySelector('.radar__tooltip-name');
    const tooltipLevel = tooltip.querySelector('.radar__tooltip-level');
    const tooltipSkills = tooltip.querySelector('.radar__tooltip-skills');

    const showTooltip = (i) => {
      const d = domains[i];
      tooltipName.textContent = d.name;
      // Build level dots
      tooltipLevel.innerHTML = '';
      for (let j = 0; j < 10; j++) {
        const dot = document.createElement('span');
        dot.className = 'radar__tooltip-dot' + (j < d.level ? ' radar__tooltip-dot--filled' : '');
        tooltipLevel.appendChild(dot);
      }
      tooltipSkills.textContent = d.skills;

      // Position tooltip near the label
      const wrapper = radarEl.querySelector('.radar__chart-wrapper');
      const wrapperRect = wrapper.getBoundingClientRect();
      const radarRect = radarEl.getBoundingClientRect();
      const p = getPoint(i, (d.level / 10) * MAX_R);
      const scale = wrapperRect.width / 500;

      let tooltipX = wrapperRect.left - radarRect.left + p.x * scale;
      let tooltipY = wrapperRect.top - radarRect.top + p.y * scale;

      // Offset based on position
      if (p.x > CX + 20) {
        tooltip.style.left = `${tooltipX + 16}px`;
        tooltip.style.right = 'auto';
      } else if (p.x < CX - 20) {
        tooltip.style.left = 'auto';
        tooltip.style.right = `${radarRect.width - tooltipX + 16}px`;
      } else {
        tooltip.style.left = `${tooltipX}px`;
        tooltip.style.right = 'auto';
      }
      tooltip.style.top = `${tooltipY - 20}px`;

      tooltip.classList.add('radar__tooltip--visible');
      labelEls.forEach(l => l.classList.remove('radar__label--active'));
      labelEls[i].classList.add('radar__label--active');
    };

    const hideTooltip = () => {
      tooltip.classList.remove('radar__tooltip--visible');
      labelEls.forEach(l => l.classList.remove('radar__label--active'));
    };

    // Events on labels
    labelEls.forEach((label, i) => {
      label.addEventListener('mouseenter', () => showTooltip(i));
      label.addEventListener('mouseleave', hideTooltip);
      label.addEventListener('click', (e) => {
        e.stopPropagation();
        if (tooltip.classList.contains('radar__tooltip--visible')) {
          hideTooltip();
        } else {
          showTooltip(i);
        }
      });
    });

    // Events on dots
    dotEls.forEach((dot, i) => {
      dot.addEventListener('mouseenter', () => showTooltip(i));
      dot.addEventListener('mouseleave', hideTooltip);
    });

    // Click outside to close tooltip
    document.addEventListener('click', hideTooltip);
  }

  // ============================================
  // BUSINESS CASE MODALS — Roadmap bars
  // ============================================

  const businessCases = {
    'saas-ia': {
      role: 'Fundador',
      company: 'Proyecto propio',
      period: '2024 — Ahora',
      challenge: 'Construir un producto SaaS con IA desde cero, sin equipo, resolviendo un problema real de mercado con tecnología de vanguardia.',
      approach: 'Arquitectura IA-nativa desde el día uno: RAG con bases de datos vectoriales (Pinecone), orquestación multi-modelo (OpenAI + Anthropic), workflows automatizados con Prefect, full-stack Python/FastAPI + NextJS, infraestructura con Docker y CI/CD. Diseño centrado en el usuario desde discovery hasta delivery.',
      results: ['De idea a producción en 6 meses', 'Full-stack, solo', 'Arquitectura RAG propia', 'Multi-modelo LLM'],
      tags: ['Python', 'FastAPI', 'NextJS', 'Docker', 'RAG', 'Pinecone', 'Prefect', 'CI/CD']
    },
    'primer-negocio': {
      role: 'Fundador',
      company: 'Primer negocio propio',
      period: '2013 — 2017',
      challenge: 'Emprender desde la universidad, sin experiencia ni contactos. Aprender a crear algo de la nada mientras estudias ingeniería.',
      approach: 'Monté mi primer negocio compaginando la carrera de Ingeniería Industrial. Aprendí a vender, a buscar clientes, a gestionar incertidumbre y a tomar decisiones con información limitada. La mejor escuela posible: la realidad.',
      results: ['Emprender desde cero', 'Compatibilizar con carrera', 'Aprender vendiendo', 'Mentalidad emprendedora'],
      tags: ['Emprendimiento', 'Ventas', 'Gestión', 'Bootstrapping']
    },
    'primeros-trabajos': {
      role: 'Trabajos parciales',
      company: 'Hostelería, ventas y más',
      period: '2013 — 2017',
      challenge: 'Financiar la carrera y el primer negocio trabajando en todo lo que hiciera falta — desde servir mesas hasta vender puerta fría.',
      approach: 'Camarero, comercial puerta fría, trabajos parciales de todo tipo. Compaginando con Ingeniería Industrial y mi primer negocio. Estas experiencias me enseñaron más sobre personas, resiliencia y comunicación que cualquier curso.',
      results: ['Resiliencia', 'Comunicación directa', 'Gestión del rechazo', 'Cultura del esfuerzo'],
      tags: ['Hostelería', 'Ventas', 'Puerta fría', 'Comunicación']
    },
    'ingenieria': {
      role: 'Estudiante — Grado universitario',
      company: 'Universidad de Sevilla',
      period: '2012 — 2017',
      challenge: 'Formarse como ingeniero industrial con una base sólida en matemáticas, física, procesos y pensamiento sistemático.',
      approach: 'Grado en Ingeniería Industrial: termodinámica, mecánica, electrónica, organización industrial, matemáticas aplicadas. La base analítica y el pensamiento de sistemas que aplico hoy a producto y tecnología viene de aquí.',
      results: ['Pensamiento analítico', 'Resolución de problemas', 'Base técnica sólida', 'Ingeniería de procesos'],
      tags: ['Ingeniería Industrial', 'Matemáticas', 'Procesos', 'Pensamiento sistémico']
    },
    'bubocar': {
      role: 'Product Manager B2B SaaS',
      company: 'BuboCar',
      period: '2017 — 2019',
      challenge: 'Pivotar un producto B2C al modelo B2B SaaS, encontrando product-market fit en un mercado con mucha competencia y poca diferenciación.',
      approach: 'Lideré el pivote completo de modelo de negocio. Rediseñé la propuesta de valor, definí pricing tiers, construí el roadmap de producto B2B. Implementé frameworks de discovery con clientes y monté las primeras métricas SaaS (MRR, churn, LTV).',
      results: ['Pivote B2C → B2B', 'Framework de pricing', 'Primeras métricas SaaS'],
      tags: ['Product Strategy', 'B2B SaaS', 'Pricing', 'Discovery', 'Pivote']
    },
    'colvin': {
      role: 'Growth PM → Senior PM',
      company: 'Colvin',
      period: '2019 — 2021',
      challenge: 'Crear una cultura de experimentación donde no existía. Después, liderar la implementación de sistemas operativos críticos para escalar el negocio.',
      approach: 'Fase 1 (Growth): Monté el framework de A/B testing de cero, programa de CRO sistemático, loops de retención basados en datos. Fase 2 (Operaciones): Lideré implementación de ERPs (OpenBravo, luego Netsuite Oracle), modelos de forecasting y optimización de supply chain.',
      results: ['Cultura de experimentación desde cero', 'Framework A/B testing', 'Implementación ERP dual', 'Modelos de forecasting'],
      tags: ['Growth', 'A/B Testing', 'CRO', 'ERP', 'OpenBravo', 'Netsuite', 'Forecasting']
    },
    'lookiero-pm': {
      role: 'Senior PM AI → Lead PM',
      company: 'Lookiero',
      period: '2021 — 2022',
      challenge: 'Integrar inteligencia artificial en el core del negocio de fashion-tech, pasando de modelos heurísticos a deep learning en producción.',
      approach: 'Lideré la transición de modelos basados en reglas a deep learning para recomendación y personalización. Pipelines de ML en Databricks para inferencia real-time y batch. Colaboración directa con equipo de ML para traducir necesidades de negocio en features de modelo.',
      results: ['Deep learning en producción', 'Pipelines ML Databricks', 'Real-time inference', 'Modelos de personalización'],
      tags: ['ML Pipelines', 'Databricks', 'Deep Learning', 'Recomendación', 'Fashion-tech']
    },
    'lookiero-vp': {
      role: 'VP of Product',
      company: 'Lookiero',
      period: '2022 — 2024',
      challenge: 'Liderar la organización de producto completa (+20 personas, 4 squads) con estrategia alineada a EBITDA en un contexto de optimización de márgenes.',
      approach: 'Rediseñé la estructura de squads para alinearla con palancas de negocio (revenue, margen, retención, eficiencia). Implementé modelos de colaboración inter-squad. Creé el framework de priorización company-level. Mentoría directa a PMs y leads. Gestión de stakeholders C-level.',
      results: ['+20 personas lideradas', '4 squads producto y ML', 'Estrategia alineada a EBITDA', 'Framework de priorización'],
      tags: ['Product Strategy', 'Liderazgo', 'ML Strategy', 'Squads', 'EBITDA', 'Stakeholders']
    },
    'herocamp': {
      role: 'Product Trainer & Coach',
      company: 'The Hero Camp',
      period: '2020 — Ahora',
      challenge: 'Formar a la próxima generación de product managers con habilidades reales, no solo teoría. Enseñar producto como se hace en la práctica.',
      approach: 'Diseño y facilitación de bootcamps intensivos de Digital Product Management. Mentoring 1:1 con profesionales en transición. Workshops prácticos sobre discovery, métricas, priorización y delivery. Metodología basada en casos reales propios.',
      results: ['200+ profesionales formados', '5 años de docencia', 'Mentoring 1:1', 'Metodología práctica'],
      tags: ['Product Management', 'Formación', 'Bootcamp', 'Mentoring', 'Discovery']
    },
    'eoi': {
      role: 'Profesor de Producto y Marketing',
      company: 'EOI — Escuela de Organización Industrial',
      period: '2022 — 2024',
      challenge: 'Llevar la experiencia real de producto y growth a un programa de postgrado, conectando teoría con práctica actual.',
      approach: 'Módulos de Product Management y Marketing Digital dentro del programa de postgrado. Enfoque en frameworks accionables: discovery, growth loops, métricas de impacto. Evaluación basada en proyectos reales, no exámenes teóricos.',
      results: ['Postgrado oficial', 'Proyectos reales como evaluación', 'Frameworks accionables'],
      tags: ['Product Management', 'Marketing Digital', 'Postgrado', 'Frameworks']
    },
    'ub': {
      role: 'Profesor Asociado',
      company: 'Universitat de Barcelona',
      period: '2024 — Ahora',
      challenge: 'Enseñar Marketing Analytics y Digital Business Models en un contexto universitario, manteniendo la relevancia práctica del contenido.',
      approach: 'Asignaturas de Marketing Analytics y Digital Business Models en grado y máster. Combino fundamentos académicos con herramientas y casos reales del mundo tech. Los alumnos trabajan con datos reales y herramientas que usarán en su carrera.',
      results: ['Marketing Analytics', 'Digital Business Models', 'Datos y herramientas reales'],
      tags: ['Marketing Analytics', 'Business Models', 'Universidad', 'Datos']
    },
    'esade': {
      role: 'Alumno — Programa ejecutivo',
      company: 'Esade Business School',
      period: '2022 — 2023',
      challenge: 'Desarrollar habilidades de liderazgo influyente para gestionar equipos grandes sin depender de autoridad jerárquica.',
      approach: 'Programa de Liderazgo Influyente: técnicas de influencia, gestión del conflicto, comunicación persuasiva, liderazgo adaptativo. Aplicación directa como VP gestionando +20 personas y stakeholders C-level.',
      results: ['Liderazgo sin autoridad', 'Gestión del conflicto', 'Comunicación C-level'],
      tags: ['Liderazgo', 'Influencia', 'Comunicación', 'Gestión de equipos']
    },
    'sociologia': {
      role: 'Estudiante — Grado universitario',
      company: 'UNED',
      period: '2024 — Ahora',
      challenge: 'Entender las dinámicas sociales y el comportamiento humano a nivel estructural para diseñar mejor tecnología para personas.',
      approach: 'Grado en Sociología: teoría social, metodología de investigación, estructura social, demografía. Un complemento radical a mi perfil técnico. Porque si no entiendes a las personas, la tecnología más brillante no sirve de nada.',
      results: ['Perspectiva humanista', 'Metodología de investigación', 'Diferenciador radical'],
      tags: ['Sociología', 'Investigación', 'Comportamiento humano', 'UNED']
    }
  };

  // Create and show case modal
  const openCaseModal = (caseId) => {
    const data = businessCases[caseId];
    if (!data) return;

    const existingModal = document.querySelector('.case-modal');
    if (existingModal) existingModal.remove();

    const resultsHTML = data.results.map(r =>
      `<span class="case-modal__result-tag"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>${r}</span>`
    ).join('');

    const tagsHTML = data.tags.map(t =>
      `<span class="case-modal__tag">${t}</span>`
    ).join('');

    const modal = document.createElement('div');
    modal.className = 'case-modal';
    modal.innerHTML = `
      <div class="case-modal__backdrop"></div>
      <div class="case-modal__card">
        <button class="case-modal__close" aria-label="Cerrar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <div class="case-modal__meta">
          <span class="case-modal__badge">${data.role}</span>
          <span class="case-modal__period">${data.period}</span>
        </div>
        <h3 class="case-modal__title">${data.company}</h3>
        <div class="case-modal__section">
          <p class="case-modal__section-label">El reto</p>
          <p>${data.challenge}</p>
        </div>
        <div class="case-modal__section">
          <p class="case-modal__section-label">Qué hice</p>
          <p>${data.approach}</p>
        </div>
        <div class="case-modal__section">
          <p class="case-modal__section-label">Resultados</p>
          <div class="case-modal__results">${resultsHTML}</div>
        </div>
        <div class="case-modal__tags">${tagsHTML}</div>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        modal.classList.add('case-modal--active');
      });
    });

    const closeFn = () => {
      modal.classList.remove('case-modal--active');
      document.body.style.overflow = '';
      setTimeout(() => modal.remove(), 350);
    };

    modal.querySelector('.case-modal__backdrop').addEventListener('click', closeFn);
    modal.querySelector('.case-modal__close').addEventListener('click', closeFn);
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        closeFn();
        document.removeEventListener('keydown', escHandler);
      }
    });
  };

  // Attach click handlers to roadmap bars with data-case
  document.querySelectorAll('.roadmap__bar[data-case]').forEach(bar => {
    bar.addEventListener('click', (e) => {
      e.stopPropagation();
      openCaseModal(bar.dataset.case);
    });
  });

  // ============================================
  // SECTOR THESES MODAL
  // ============================================

  const sectorTheses = {
    'ciberseguridad': {
      name: 'Ciberseguridad',
      thesis: 'La IA va a multiplicar las superficies de ataque. Cada empresa que adopte agentes de IA necesitará protegerlos — y la mayoría no sabe ni por dónde empezar.',
      why: 'Vengo de construir productos con IA y gestionar datos sensibles. He visto de primera mano cómo la velocidad de adopción supera a la de protección. Me interesa este sector porque la seguridad no es un feature — es la base. Y los equipos de producto rara vez la piensan desde el día uno.',
      angles: ['IA + seguridad ofensiva/defensiva', 'Producto seguro por diseño', 'Compliance como ventaja competitiva']
    },
    'agrotech': {
      name: 'Agrotech',
      thesis: 'El campo es el sector más grande del mundo y el menos digitalizado. La IA puede optimizar cosechas, reducir desperdicio y hacer sostenible lo que hoy no lo es.',
      why: 'Es un sector donde la tecnología tiene impacto directo en la vida de millones de personas. Me atrae porque combina hardware, datos y operaciones reales — no es solo software. Quiero entender cómo la IA puede resolver problemas que importan de verdad, no solo optimizar clics.',
      angles: ['Precision farming con IA', 'Supply chain alimentaria', 'Sostenibilidad + datos']
    },
    'ai-agents': {
      name: 'AI Agents',
      thesis: 'Los agentes de IA van a reemplazar la mayoría de interfaces que conocemos. No vamos a usar apps — vamos a hablar con agentes que usan las apps por nosotros.',
      why: 'Llevo meses construyendo con agentes (RAG, orquestación multi-modelo, workflows). Es donde más rápido se mueve la frontera. Me interesa estar en el centro porque creo que quien entienda el diseño de agentes definirá la próxima generación de productos.',
      angles: ['Orquestación multi-agente', 'Human-in-the-loop', 'Agentes de IA en producción']
    },
    'datacenters': {
      name: 'Datacenters',
      thesis: 'Toda la revolución IA se sostiene sobre infraestructura física. Los datacenters son el petróleo del siglo XXI — y hay un déficit masivo de capacidad.',
      why: 'Mi formación como Ingeniero Industrial me da una perspectiva única aquí: energía, termodinámica, procesos industriales. Los datacenters son donde convergen la ingeniería más dura con el software más avanzado. Es un sector que necesita gente que entienda ambos mundos.',
      angles: ['Eficiencia energética + IA', 'Ingeniería industrial aplicada', 'Edge computing']
    },
    'materiales': {
      name: 'Ingeniería de materiales',
      thesis: 'Los nuevos materiales (grafeno, composites, biomateriales) van a cambiar la manufactura tanto como la IA está cambiando el software. Y la IA puede acelerar su descubrimiento.',
      why: 'Estudié Ingeniería Industrial — resistencia de materiales, termodinámica, procesos de fabricación. Siempre me ha fascinado cómo lo que construimos depende de con qué lo construimos. La IA está acelerando el descubrimiento de materiales y quiero estar ahí cuando cambie las reglas.',
      angles: ['IA para descubrimiento de materiales', 'Manufacturing tech', 'Deep tech + producto']
    },
    'space': {
      name: 'Space',
      thesis: 'El espacio se está democratizando. El coste de poner un kilo en órbita baja ha caído 100x en 20 años. Esto abre mercados que antes eran ciencia ficción.',
      why: 'El New Space es el último reto de ingeniería a escala. Me fascina como ingeniero y como emprendedor: satélites de comunicación, observación terrestre, logística orbital. Son problemas donde producto, ingeniería y operaciones convergen de forma brutal.',
      angles: ['New Space + startups', 'Observación terrestre con IA', 'Ingeniería de sistemas complejos']
    },
    'biotech': {
      name: 'Biotech',
      thesis: 'La biología se está convirtiendo en una ingeniería. Con CRISPR, genómica computacional y IA, podemos diseñar soluciones biológicas como quien diseña software.',
      why: 'Es el sector donde la IA puede tener el mayor impacto en la vida humana. Los modelos de lenguaje ya predicen estructuras de proteínas — eso era impensable hace 5 años. Me atrae porque necesita gente de producto que traduzca la ciencia en soluciones accesibles.',
      angles: ['IA + drug discovery', 'Genómica computacional', 'Producto en ciencias de la vida']
    },
    'healthtech': {
      name: 'HealthTech',
      thesis: 'Los sistemas de salud están colapsados. La IA puede multiplicar la capacidad diagnóstica, personalizar tratamientos y liberar tiempo médico para lo que importa: las personas.',
      why: 'La salud digital necesita quien entienda producto, datos y personas — no solo tecnología. Mi perfil de sociólogo me da una perspectiva diferente: la salud es comportamiento humano, no solo datos clínicos. Quiero construir productos que realmente mejoren la vida de los pacientes.',
      angles: ['IA diagnóstica', 'Salud digital centrada en personas', 'Datos clínicos + sociología']
    },
    'edtech': {
      name: 'EdTech',
      thesis: 'La educación masiva actual es un modelo industrial del siglo XIX. La IA permite por primera vez personalización real a escala — cada persona aprendiendo a su ritmo y estilo.',
      why: 'Soy profesor. Doy clase en la UB y en Hero Camp. Veo cada día cómo funciona la educación por dentro — y cómo podría ser radicalmente mejor. Me interesa este sector porque creo que la combinación de IA + pedagogía puede cambiar más vidas que cualquier otra tecnología.',
      angles: ['Aprendizaje adaptativo con IA', 'Profesor + constructor de producto', 'Formación técnica accesible']
    }
  };

  const openSectorModal = (sectorId) => {
    const data = sectorTheses[sectorId];
    if (!data) return;

    const existingModal = document.querySelector('.case-modal');
    if (existingModal) existingModal.remove();

    const anglesHTML = data.angles.map(a =>
      `<span class="sector-modal__angle"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>${a}</span>`
    ).join('');

    const modal = document.createElement('div');
    modal.className = 'case-modal';
    modal.innerHTML = `
      <div class="case-modal__backdrop"></div>
      <div class="case-modal__card">
        <button class="case-modal__close" aria-label="Cerrar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <div class="case-modal__meta">
          <span class="case-modal__badge">Sector</span>
        </div>
        <h3 class="case-modal__title">${data.name}</h3>
        <div class="case-modal__section">
          <p class="sector-modal__thesis-label">Mi tesis</p>
          <p class="sector-modal__thesis">${data.thesis}</p>
        </div>
        <div class="case-modal__section">
          <p class="sector-modal__why-label">Por qué me interesa</p>
          <p class="sector-modal__why">${data.why}</p>
        </div>
        <div class="case-modal__section">
          <p class="sector-modal__thesis-label">Ángulos que me atraen</p>
          <div class="sector-modal__angles">${anglesHTML}</div>
        </div>
        <a href="#contact" class="sector-modal__cta">Hablemos de ${data.name} →</a>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        modal.classList.add('case-modal--active');
      });
    });

    const closeFn = () => {
      modal.classList.remove('case-modal--active');
      document.body.style.overflow = '';
      setTimeout(() => modal.remove(), 350);
    };

    modal.querySelector('.case-modal__backdrop').addEventListener('click', closeFn);
    modal.querySelector('.case-modal__close').addEventListener('click', closeFn);
    modal.querySelector('.sector-modal__cta').addEventListener('click', closeFn);
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        closeFn();
        document.removeEventListener('keydown', escHandler);
      }
    });
  };

  // Attach click handlers to seeking cards with data-sector
  document.querySelectorAll('.seeking-card[data-sector]').forEach(card => {
    card.addEventListener('click', () => {
      openSectorModal(card.dataset.sector);
    });
  });

  // ============================================
  // MAGNETIC ELEMENTS (Desktop only)
  // ============================================

  if (hasFinePointer) {
    document.querySelectorAll('.btn').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transition = 'transform 0.5s var(--ease-out-expo)';
        el.style.transform = '';
        setTimeout(() => { el.style.transition = ''; }, 500);
      });
    });

  }

  // ============================================
  // TYPEWRITER EFFECT
  // ============================================

  const typewriterEl = document.querySelector('.hero__typewriter-text');
  if (typewriterEl) {
    const phrases = [
      'construyo productos con IA.',
      'enseño a otros a hacerlo.',
      'estudio por qué funciona.',
      'combino estrategia y código.'
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let pauseTimer = 0;

    const typeSpeed = 60;
    const deleteSpeed = 35;
    const pauseAfterType = 2200;
    const pauseAfterDelete = 400;

    const tick = () => {
      const current = phrases[phraseIdx];

      if (!deleting) {
        charIdx++;
        typewriterEl.textContent = current.slice(0, charIdx);
        if (charIdx === current.length) {
          deleting = true;
          pauseTimer = pauseAfterType;
        }
      } else {
        charIdx--;
        typewriterEl.textContent = current.slice(0, charIdx);
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          pauseTimer = pauseAfterDelete;
        }
      }

      const delay = pauseTimer > 0 ? pauseTimer : (deleting ? deleteSpeed : typeSpeed);
      pauseTimer = 0;
      setTimeout(tick, delay);
    };

    // Start after hero entrance animation
    setTimeout(tick, 1500);
  }

  // ============================================
  // SHOWREEL VIDEO MODAL
  // ============================================

  const showreelPlay = document.querySelector('.showreel__play');
  if (showreelPlay) {
    showreelPlay.addEventListener('click', () => {
      // Cambia videoUrl por tu enlace real de YouTube/Vimeo
      const videoUrl = ''; // e.g. 'https://www.youtube.com/embed/VIDEO_ID?autoplay=1'

      const modal = document.createElement('div');
      modal.className = 'video-modal';
      modal.innerHTML = `
        <div class="video-modal__backdrop"></div>
        <div class="video-modal__content">
          <button class="video-modal__close" aria-label="Cerrar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          ${videoUrl
            ? `<iframe src="${videoUrl}" frameborder="0" allow="autoplay; fullscreen" allowfullscreen style="width:100%;height:100%;border-radius:16px"></iframe>`
            : `<div class="video-modal__placeholder"><p>Añade tu vídeo → main.js → videoUrl</p></div>`
          }
        </div>
      `;

      document.body.appendChild(modal);
      requestAnimationFrame(() => modal.classList.add('video-modal--active'));

      const close = () => {
        modal.classList.remove('video-modal--active');
        setTimeout(() => modal.remove(), 400);
      };
      modal.querySelector('.video-modal__backdrop').addEventListener('click', close);
      modal.querySelector('.video-modal__close').addEventListener('click', close);
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
      }, { once: true });
    });
  }
})();
