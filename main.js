(() => {
  'use strict';

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
              bar.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
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
  // BUSINESS CASE MODALS — Roadmap bars
  // ============================================

  const businessCases = {
    'fpe': {
      role: 'Fundador',
      company: 'Founding Product Engineer',
      period: '2025 — Ahora',
      challenge: 'Crear la formación que no existe: preparar a product builders para un mundo AI-native donde saber construir es tan importante como saber gestionar.',
      approach: 'Curso intensivo donde producto, ingeniería e IA convergen. Curriculum diseñado desde la práctica: los alumnos construyen productos reales con LLMs, RAG y agentes. No es un bootcamp de código ni un curso de producto — es la intersección. Branding, plataforma y contenido construidos desde cero.',
      results: ['Formación AI-native', 'Curriculum propio', 'De idea a producto real', 'Product + Engineering + IA'],
      tags: ['AI-native', 'Product Engineering', 'LLMs', 'RAG', 'Formación', 'Educación']
    },
    'saas-ia': {
      role: 'Fundador',
      company: 'Marketing Agents',
      period: '2025 — Ahora',
      challenge: 'Construir un SaaS AI-native de agentes de marketing desde cero — de la idea a producción, full-stack, solo.',
      approach: 'Arquitectura IA-nativa desde el día uno: agentes autónomos de marketing, RAG con bases de datos vectoriales (Pinecone), orquestación multi-modelo (OpenAI + Anthropic), workflows con Prefect, full-stack Python/FastAPI + NextJS, Docker y CI/CD.',
      results: ['De idea a producción en 6 meses', 'Full-stack, solo', 'Agentes de IA autónomos', 'Multi-modelo LLM'],
      tags: ['Python', 'FastAPI', 'NextJS', 'Docker', 'RAG', 'Agentes IA', 'Prefect']
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

  document.querySelectorAll('.roadmap__bar[data-case]').forEach(bar => {
    bar.addEventListener('click', (e) => {
      e.stopPropagation();
      openCaseModal(bar.dataset.case);
    });
  });

  // ============================================
  // WORK FILTER
  // ============================================

  const filterBtns = document.querySelectorAll('.work-filter__btn');
  const workCards = document.querySelectorAll('.work-card[data-period]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('work-filter__btn--active'));
      btn.classList.add('work-filter__btn--active');

      const filter = btn.dataset.filter;

      workCards.forEach(card => {
        if (filter === 'all' || card.dataset.period === filter) {
          card.removeAttribute('data-hidden');
        } else {
          card.setAttribute('data-hidden', '');
        }
      });
    });
  });

  // ============================================
  // MAGNETIC BUTTONS (Desktop only)
  // ============================================

  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (hasFinePointer) {
    document.querySelectorAll('.btn').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        el.style.transform = '';
        setTimeout(() => { el.style.transition = ''; }, 500);
      });
    });
  }

})();
