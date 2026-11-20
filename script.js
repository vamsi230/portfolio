// ==========================================
// MOBILE MENU TOGGLE
// ==========================================
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');

if (menuIcon && navbar) {
    menuIcon.onclick = () => {
        menuIcon.classList.toggle('bx-x');
        navbar.classList.toggle('active');
    };

    // Close menu when clicking on any navbar link
    navbar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuIcon.classList.remove('bx-x');
            navbar.classList.remove('active');
        });
    });
}

// ==========================================
// ROBUST CHARACTER-BY-CHARACTER TYPEWRITER
// ==========================================
const typedElement = document.getElementById('typed');
if (typedElement) {
    const titles = [
        'Gameplay Systems Engineer',
        'Unreal Engine 5 (C++) Developer',
        'Multiplayer & Systems Programmer',
        'AI & Gameplay Programmer'
    ];

    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function runTypewriter() {
        const currentTitle = titles[titleIndex];

        if (isDeleting) {
            charIndex--;
            typedElement.textContent = currentTitle.substring(0, charIndex);
        } else {
            charIndex++;
            typedElement.textContent = currentTitle.substring(0, charIndex);
        }

        let speed = isDeleting ? 30 : 65;

        // Fully typed out the entire title
        if (!isDeleting && charIndex === currentTitle.length) {
            speed = 2200; // Pause at end of title
            isDeleting = true;
        } 
        // Fully erased the title
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length; // Advance to next title
            speed = 400; // Brief pause before typing next title
        }

        setTimeout(runTypewriter, speed);
    }

    // Start typewriter effect
    runTypewriter();
}

// ==========================================
// WORK EXPERIENCE CARD SLIDER & TIMELINE SYNC
// ==========================================
const sliderTrack = document.getElementById('exp-slider-track');
const milestones = document.querySelectorAll('.timeline-milestone');
const sliderDots = document.querySelectorAll('.slider-dot');
const prevBtn = document.getElementById('slider-prev-btn');
const nextBtn = document.getElementById('slider-next-btn');
const timelineProgress = document.getElementById('timeline-progress');

let currentExpSlide = 0;
const totalExpSlides = document.querySelectorAll('.exp-slide').length;

function updateTimelineRailProgress(index) {
    if (!timelineProgress || milestones.length < 2) return;

    const track = document.querySelector('.linear-timeline-track');
    const trackLine = document.querySelector('.timeline-track-line');
    if (!track) return;

    const firstWrapper = milestones[0].querySelector('.milestone-pin-wrapper');
    const lastWrapper = milestones[milestones.length - 1].querySelector('.milestone-pin-wrapper');
    const targetWrapper = milestones[index] ? milestones[index].querySelector('.milestone-pin-wrapper') : null;

    if (firstWrapper && lastWrapper && targetWrapper) {
        const trackRect = track.getBoundingClientRect();
        const firstRect = firstWrapper.getBoundingClientRect();
        const lastRect = lastWrapper.getBoundingClientRect();
        const targetRect = targetWrapper.getBoundingClientRect();

        // Exact horizontal center coordinates relative to linear-timeline-track
        const startX = (firstRect.left + firstRect.width / 2) - trackRect.left;
        const endX = (lastRect.left + lastRect.width / 2) - trackRect.left;
        const targetX = (targetRect.left + targetRect.width / 2) - trackRect.left;

        // Align the background track line to run exactly between first and last milestone dots
        if (trackLine) {
            trackLine.style.left = `${startX}px`;
            trackLine.style.width = `${endX - startX}px`;
            trackLine.style.right = 'auto';
        }

        // Progress bar starts at first dot center and terminates PRECISELY at target dot center (0 overshoot)
        const progressWidth = Math.max(0, targetX - startX);
        timelineProgress.style.left = `${startX}px`;
        timelineProgress.style.width = `${progressWidth}px`;
    }
}

function goToExpSlide(index) {
    if (index < 0) index = 0;
    if (index >= totalExpSlides) index = totalExpSlides - 1;

    currentExpSlide = index;

    // Slide the track
    if (sliderTrack) {
        sliderTrack.style.transform = `translateX(-${currentExpSlide * 100}%)`;
    }

    // Update milestones
    milestones.forEach((milestone, idx) => {
        if (idx === currentExpSlide) {
            milestone.classList.add('active');
        } else {
            milestone.classList.remove('active');
        }
    });

    // Update dots
    sliderDots.forEach((dot, idx) => {
        if (idx === currentExpSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    // Update progress bar with exact pin center alignment
    updateTimelineRailProgress(currentExpSlide);

    // Update button states
    if (prevBtn) {
        prevBtn.disabled = currentExpSlide === 0;
        prevBtn.style.opacity = currentExpSlide === 0 ? '0.35' : '1';
    }
    if (nextBtn) {
        nextBtn.disabled = currentExpSlide === totalExpSlides - 1;
        nextBtn.style.opacity = currentExpSlide === totalExpSlides - 1 ? '0.35' : '1';
    }
}

// Ensure timeline rail is pixel-aligned on window resize and page load
window.addEventListener('resize', () => updateTimelineRailProgress(currentExpSlide));
window.addEventListener('load', () => updateTimelineRailProgress(currentExpSlide));
setTimeout(() => updateTimelineRailProgress(0), 100);

// Milestone click handlers
milestones.forEach((milestone) => {
    milestone.addEventListener('click', () => {
        const slideIdx = parseInt(milestone.getAttribute('data-slide'), 10);
        goToExpSlide(slideIdx);
    });

    milestone.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const slideIdx = parseInt(milestone.getAttribute('data-slide'), 10);
            goToExpSlide(slideIdx);
        }
    });
});

// Dot click handlers
sliderDots.forEach((dot) => {
    dot.addEventListener('click', () => {
        const slideIdx = parseInt(dot.getAttribute('data-slide'), 10);
        goToExpSlide(slideIdx);
    });
});

// Button handlers
if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        goToExpSlide(currentExpSlide - 1);
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        goToExpSlide(currentExpSlide + 1);
    });
}

// Initialize slider position
goToExpSlide(0);

// Swipe support for touch screens
let touchStartX = 0;
let touchEndX = 0;

if (sliderTrack) {
    sliderTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left -> Next
            goToExpSlide(currentExpSlide + 1);
        }
        if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right -> Prev
            goToExpSlide(currentExpSlide - 1);
        }
    }
}

// ==========================================
// PROJECT FILTERING
// ==========================================
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const flagshipCaseStudy = document.querySelector('.flagship-case-study');
const practiceContainer = document.querySelector('.practice-projects-container');

if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            // Handle Flagship Case Study
            if (flagshipCaseStudy) {
                if (filterValue === 'all' || filterValue === 'unreal') {
                    flagshipCaseStudy.style.display = 'block';
                    setTimeout(() => flagshipCaseStudy.classList.add('active'), 50);
                } else {
                    flagshipCaseStudy.style.display = 'none';
                    flagshipCaseStudy.classList.remove('active');
                }
            }

            // Handle Practice Section Container
            if (practiceContainer) {
                if (filterValue === 'all' || filterValue === 'practice') {
                    practiceContainer.style.display = 'block';
                    setTimeout(() => practiceContainer.classList.add('active'), 50);
                } else {
                    practiceContainer.style.display = 'none';
                    practiceContainer.classList.remove('active');
                }
            }

            // Handle Individual Project Cards
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                const isPractice = card.classList.contains('practice-card');

                if (filterValue === 'all') {
                    card.style.display = 'flex';
                    setTimeout(() => card.classList.add('active'), 50);
                } else if (filterValue === 'practice') {
                    if (isPractice) {
                        card.style.display = 'flex';
                        setTimeout(() => card.classList.add('active'), 50);
                    } else {
                        card.style.display = 'none';
                        card.classList.remove('active');
                    }
                } else if (category === filterValue) {
                    if (!isPractice) {
                        card.style.display = 'flex';
                        setTimeout(() => card.classList.add('active'), 50);
                    } else {
                        card.style.display = 'none';
                        card.classList.remove('active');
                    }
                } else {
                    card.style.display = 'none';
                    card.classList.remove('active');
                }
            });
        });
    });
}

// ==========================================
// SCROLL REVEAL ANIMATIONS
// ==========================================
function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;
    const elementVisible = 100;

    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', reveal);
window.addEventListener('load', reveal);

// ==========================================
// ACTIVE NAV LINK TRACKING ON SCROLL
// ==========================================
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('header nav a');

window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = sectionId;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (current && link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ==========================================
// TOAST NOTIFICATION UTILITY
// ==========================================
function showToast(message, isSuccess = true) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = toast ? toast.querySelector('.toast-icon') : null;

    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    if (toastIcon) {
        toastIcon.className = isSuccess ? 'bx bx-check-circle toast-icon' : 'bx bx-info-circle toast-icon';
    }

    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

// ==========================================
// CLICK-TO-COPY HANDLERS
// ==========================================
const copyButtons = document.querySelectorAll('.copy-btn');
copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const textToCopy = btn.getAttribute('data-copy');
        if (!textToCopy) return;

        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalIcon = btn.innerHTML;
            btn.innerHTML = "<i class='bx bx-check'></i>";
            showToast(`Copied "${textToCopy}" to clipboard!`);
            setTimeout(() => {
                btn.innerHTML = originalIcon;
            }, 2000);
        }).catch(err => {
            console.error('Clipboard copy failed:', err);
            showToast(`Selected: ${textToCopy}`);
        });
    });
});

// ==========================================
// MEDIA PLACEHOLDER CLICK HELPER
// ==========================================
const placeholders = document.querySelectorAll('.compact-media-placeholder');
placeholders.forEach(card => {
    card.addEventListener('click', () => {
        const title = card.querySelector('h6') ? card.querySelector('h6').textContent : 'Showcase item';
        showToast(`Media placeholder: "${title}". Drop your video or image into index.html!`, false);
    });
});

// ==========================================
// CONTACT FORM HANDLER (CLEAN & PROFESSIONAL)
// ==========================================
const contactForm = document.getElementById('contact-form');
const formFeedback = document.getElementById('form-feedback');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('form-name');
        const emailInput = document.getElementById('form-email');
        const subjectInput = document.getElementById('form-subject');
        const phoneInput = document.getElementById('form-phone');
        const messageInput = document.getElementById('form-message');

        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const subject = subjectInput ? subjectInput.value.trim() : 'Game Programmer Inquiry';
        const phone = phoneInput ? phoneInput.value.trim() : 'Not provided';
        const message = messageInput ? messageInput.value.trim() : '';

        if (!name || !email || !message) {
            alert('Please fill in all required fields (Name, Email, Message).');
            return;
        }

        // Construct a direct mailto URL
        const mailRecipient = 'vamsidharmavarapu1904@gmail.com';
        const mailSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject} - from ${name}`);
        const mailBody = encodeURIComponent(
            `Hi Vamsi,\n\n${message}\n\n---\nSender Details:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}`
        );

        const mailtoUrl = `mailto:${mailRecipient}?subject=${mailSubject}&body=${mailBody}`;

        // Trigger email client
        window.location.href = mailtoUrl;

        // Display feedback banner
        if (formFeedback) {
            formFeedback.className = 'form-feedback success';
            formFeedback.innerHTML = `<strong><i class='bx bx-check-circle'></i> Message Prepared!</strong> Opening your email client to dispatch to <code>${mailRecipient}</code>. If your client didn't open, reach out directly at <a href="mailto:${mailRecipient}" style="color:var(--main-color);text-decoration:underline;">${mailRecipient}</a>.`;
        }

        showToast('Message ready! Opening your email client...');
        contactForm.reset();
    });
}
