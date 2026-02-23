# CLAUDE.md — Premium Personal Website System (v3)

## Project

Personal website for **Manu López** — AI Product Leader, Entrepreneur, Professor. Barcelona.
Hosted on **GitHub Pages** (static only). Stack: HTML5 + CSS3 + Vanilla JS. Zero frameworks, zero build tools.

URL: `https://manulopeznunez.github.io`
Language: Spanish (`lang="es"`)

## Mission

This site must make anyone think within 5 seconds:
*"This person is interesting. I want to know more about what they think."*

It's NOT a CV. It's a **personal story with proof**. The narrative arc matters: each section builds toward the conclusion that Manu is different because he builds, teaches, AND studies people.

## Voice & Identity

- **Vision:** Democratize AI — make it accessible for any company, demystify it, teach others to build with it. Product first, always.
- **Tone:** Cercano y directo. Like talking over a beer. No corporate speak, no buzzwords. Substance with warmth.
- **Differentiator:** Entrepreneur + Professor. Builds AND teaches. Studies Sociology as a technologist — because tech is for people.
- **Philosophy:** "The PM who codes has superpowers." "AI is a means, not an end."
- **Language:** Content in Spanish. Authentic, opinionated, first-person.
- **Hook:** Sociology angle goes FIRST — it's what makes Manu memorable.

---

## Narrative Architecture (v3)

The site follows a **story arc**, not a resume layout:

```
Hook → Credibility (numbers) → Beliefs (argument) → Proof (work) → History (timeline) → Education → Now → Talk
```

### 1. HERO — Split layout
- Text left, SVG illustration right (network of connected nodes)
- Headline: **"Emprendedor que enseña. Profesor que construye."**
- Sociology hook in the tagline — FIRST impression, not buried
- CTA: "Descubre por qué" + "Hablemos"

### 2. IMPACT NUMBERS — Credibility in 1 second
- 4 animated counters: +20 personas, 4 squads, 200+ formados, 3 productos IA
- Gradient text numbers, animate on scroll (ease-out, 1.5s)

### 3. MANIFESTO — Progressive argument with pull-quotes
- 5 beliefs, each with 4px left border that lights up on reveal
- Desktop: 2-column layout with pull-quote on the right
- Narrative flow: problem → solution → why YOU → superpowers → differentiator (climax)
- Each block ~60vh of visual space

### 4. WORK — Cards with results + 3D tilt
- 3 cards with **impact line** (bold accent color) above description
- 3D tilt on hover (desktop): perspective + rotateX/Y, max ±5deg
- Tags below

### 5. TIMELINE — Visual with scroll-fill
- Vertical line fills progressively with scroll (gradient orange)
- "Ahora" badges on current roles
- Pulse animation on current markers
- Lookiero roles grouped visually

### 6. EDUCATION + CERTIFICATIONS
- Grid cards, Sociology (UNED) FIRST with "En curso" badge
- Esade second (premium brand)

### 7. NOW — Bento grid
- 4 cards: Construyendo (span 2, with architecture SVG), Enseñando, Estudiando, Explorando (span 2)
- Each card has subtle different background gradient
- Visually interesting, shows personality

### 8. CONTACT — With personality
- "Hablemos." in gradient text, large
- Social proof bar integrated below
- Barcelona skyline SVG at bottom

---

## Design System

### Colors (CSS Custom Properties)

```css
:root {
  --bg: #fffcf7;
  --bg-alt: #fef7ed;
  --surface: #ffffff;
  --accent: #f97316;
  --accent-hover: #ea580c;
  --accent-light: #fed7aa;
  --accent-glow: rgba(249, 115, 22, 0.12);
  --accent-gradient: linear-gradient(135deg, #f97316, #eab308);
  --yellow: #eab308;
  --text: #1a1a1a;
  --text-secondary: #4a4a4a;
  --text-muted: #8a8a8a;
  --glass: rgba(255, 252, 247, 0.85);
}
```

### Typography
Font: **Inter** (300, 400, 500, 600, 700).
Hero name: `clamp(2.5rem, 6vw, 4.5rem)`. Section titles: `clamp(1.8rem, 5vw, 3rem)`.

### Spacing
120px section padding desktop, 64px mobile. Container: `max-width: 1080px`.

---

## Visual Effects

1. **Particle canvas** — Orange particles with cursor repulsion
2. **Custom cursor** — Dot + ring with lerp, desktop only
3. **Scroll reveal** — IntersectionObserver, translateY(40px) → 0
4. **Hero entrance** — Staggered fadeSlideUp keyframes
5. **Animated counters** — Scroll-triggered, ease-out quad, 1.5s
6. **3D tilt cards** — perspective(800px) + rotateX/Y on mousemove
7. **Timeline scroll-fill** — Line fills progressively on scroll
8. **Grain overlay** — SVG feTurbulence noise at 3% opacity, mix-blend-mode: multiply
9. **Gradient text** — background-clip: text on accent gradient
10. **Glassmorphism nav** — backdrop-filter: blur(20px), auto-hide on scroll

### SVG Illustrations (inline)
1. **Hero:** Network of connected nodes (IA democratizada)
2. **Bento "Construyendo":** Architecture diagram (LLM → RAG → App)
3. **Contact:** Barcelona skyline (Sagrada Familia, Torre Agbar, Hotel W)

---

## Performance Targets

| Metric | Target |
|---|---|
| CSS size | < 30KB |
| JS size | < 15KB |
| Total page weight | < 100KB (excl. fonts) |
| External deps | Google Fonts only |

## Accessibility

- `prefers-reduced-motion` fully respected (all animations disabled)
- Focus ring: `2px solid var(--accent)`
- Skip link, semantic HTML, aria-labels
- Touch targets: min 44x44px

## File Structure

```
/
├── index.html       # Single page, narrative structure
├── style.css        # All styles, CSS custom properties
├── main.js          # All interactions and animations
├── assets/
│   ├── og-image.png # Open Graph preview
│   └── favicon.svg  # Orange "ML" favicon
└── CLAUDE.md        # This file
```
