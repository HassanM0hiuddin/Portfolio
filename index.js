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
