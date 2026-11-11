const header = document.querySelector('header')
const menu = document.querySelector('#menu-icon')
const navlist = document.querySelector('.navlist')
const scrollBtn = document.querySelector('.scroll-bttn')

function onScroll() {
  header.classList.toggle('sticky', window.scrollY > 60)
  if (scrollBtn) scrollBtn.classList.toggle('show', window.scrollY > 500)
}

window.addEventListener('scroll', onScroll, { passive: true })
onScroll()

// Mobile menu
if (menu && navlist) {
  menu.addEventListener('click', () => {
    const open = navlist.classList.toggle('open')
    menu.classList.toggle('bx-menu', !open)
    menu.classList.toggle('bx-x', open)
  })

  navlist.querySelectorAll('a').forEach((link) =>
    link.addEventListener('click', () => {
      navlist.classList.remove('open')
      menu.classList.add('bx-menu')
      menu.classList.remove('bx-x')
    })
  )
}

// Highlight the nav link for the section in view
const sections = document.querySelectorAll('section[id]')
const navLinks = document.querySelectorAll('.navlist a[href^="#"]')

if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        navLinks.forEach((link) =>
          link.classList.toggle(
            'active',
            link.getAttribute('href') === '#' + entry.target.id
          )
        )
      })
    },
    { rootMargin: '-45% 0px -50% 0px' }
  )
  sections.forEach((section) => navObserver.observe(section))

  // Reveal on scroll
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          revealObserver.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12 }
  )
  document
    .querySelectorAll('.reveal')
    .forEach((el) => revealObserver.observe(el))
} else {
  document
    .querySelectorAll('.reveal')
    .forEach((el) => el.classList.add('visible'))
}

// Footer year
document.querySelectorAll('.year').forEach((el) => {
  el.textContent = new Date().getFullYear()
})

function sendEmail() {
  const recipient = 'hassanmohiuddin73@gmail.com'
  const subject = encodeURIComponent('Job Inquiry')
  const body = encodeURIComponent(
    'Dear Hassan,\n\nI am writing to express my interest in...'
  )
  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Scroll progress bar
const progress = document.querySelector('.scroll-progress')
function updateProgress() {
  if (!progress) return
  const max = document.documentElement.scrollHeight - window.innerHeight
  progress.style.setProperty('--progress', max > 0 ? window.scrollY / max : 0)
}
window.addEventListener('scroll', updateProgress, { passive: true })
updateProgress()

// Cursor glow + card spotlight
const glow = document.querySelector('.cursor-glow')
window.addEventListener(
  'pointermove',
  (e) => {
    if (!glow) return
    glow.style.setProperty('--mx', e.clientX + 'px')
    glow.style.setProperty('--my', e.clientY + 'px')
  },
  { passive: true }
)

document
  .querySelectorAll('.service-box, .timeline-card, .skill-group, .contact-card, .skill, .stat')
  .forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect()
      card.style.setProperty('--x', e.clientX - r.left + 'px')
      card.style.setProperty('--y', e.clientY - r.top + 'px')
    })
  })

// Stagger reveal animations inside grids
document
  .querySelectorAll('.service-item, .timeline, .skill-groups')
  .forEach((group) => {
    group.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = i * 0.1 + 's'
    })
  })

// Typed role rotator
const typed = document.querySelector('.typed')
if (typed && !reduceMotion) {
  let words = []
  try {
    words = JSON.parse(typed.dataset.words)
  } catch (err) {
    words = [typed.textContent]
  }
  let w = 0
  let c = words[0].length
  let deleting = true

  const tick = () => {
    const word = words[w]
    c += deleting ? -1 : 1
    typed.textContent = word.slice(0, c)

    let delay = deleting ? 40 : 80
    if (!deleting && c === word.length) {
      deleting = true
      delay = 2000
    } else if (deleting && c === 0) {
      deleting = false
      w = (w + 1) % words.length
      delay = 300
    }
    setTimeout(tick, delay)
  }
  setTimeout(tick, 2200)
}

// Animated stat counters
const counters = document.querySelectorAll('[data-count]')
if ('IntersectionObserver' in window && !reduceMotion) {
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const el = entry.target
        const target = Number(el.dataset.count)
        const suffix = el.dataset.suffix || ''
        const start = performance.now()
        const duration = 1200
        const step = (now) => {
          const p = Math.min((now - start) / duration, 1)
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix
          if (p < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
        countObserver.unobserve(el)
      })
    },
    { threshold: 0.6 }
  )
  counters.forEach((el) => countObserver.observe(el))
}

// Project videos: only play while on screen, and never autoplay for reduced motion
const videos = document.querySelectorAll('.project-media video')
if (reduceMotion) {
  videos.forEach((v) => {
    v.removeAttribute('autoplay')
    v.pause()
  })
} else if ('IntersectionObserver' in window) {
  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const v = entry.target
        if (entry.isIntersecting) {
          const p = v.play()
          if (p && p.catch) p.catch(() => {})
        } else {
          v.pause()
        }
      })
    },
    { threshold: 0.15 }
  )
  videos.forEach((v) => videoObserver.observe(v))
}

// Phone mockups drift slightly against the scroll for a sense of depth
const phones = document.querySelectorAll('.device-phone')
if (phones.length && !reduceMotion) {
  let ticking = false
  const updatePhones = () => {
    const mid = window.innerHeight / 2
    phones.forEach((phone) => {
      const r = phone.parentElement.getBoundingClientRect()
      const offset = r.top + r.height / 2 - mid
      const py = Math.max(-40, Math.min(40, offset * -0.08))
      phone.style.setProperty('--py', py.toFixed(1) + 'px')
    })
    ticking = false
  }
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(updatePhones)
      }
    },
    { passive: true }
  )
  updatePhones()
}
