document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. STICKY NAVBAR & MOBILE MENU TOGGLE
       ========================================== */
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    // Sticky Navbar on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !expanded);
            navLinks.classList.toggle('active');
            
            // Toggle burger/close icon
            const icon = navToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars-staggered';
            }
        });
    }

    // Close menu when clicking link
    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.querySelector('i').className = 'fa-solid fa-bars-staggered';
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !navToggle.contains(e.target)) {
            navLinks.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.querySelector('i').className = 'fa-solid fa-bars-staggered';
        }
    });


    /* ==========================================
       2. NEURAL NETWORK CANVAS BACKGROUND
       ========================================== */
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrameId;

        // Resize Canvas
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }

        // Particle Blueprint
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.4; // Subtle speed
                this.vy = (Math.random() - 0.5) * 0.4;
                this.size = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off walls
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
                ctx.fill();
            }
        }

        // Mouse Tracker
        const mouse = {
            x: null,
            y: null,
            radius: 130
        };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Initialize particles based on screen width (efficiency)
        function initParticles() {
            particles = [];
            const densityFactor = window.innerWidth < 768 ? 40 : 100;
            for (let i = 0; i < densityFactor; i++) {
                particles.push(new Particle());
            }
        }

        // Draw connections
        function drawLines() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 110) {
                        const alpha = (1 - (distance / 110)) * 0.15;
                        ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }

                // Connect to mouse pointer
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = particles[i].x - mouse.x;
                    const dy = particles[i].y - mouse.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouse.radius) {
                        const alpha = (1 - (distance / mouse.radius)) * 0.25;
                        ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Rendering Loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw grid accent
            drawGrid();

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            drawLines();
            animationFrameId = requestAnimationFrame(animate);
        }

        // Soft grid lines in the background
        function drawGrid() {
            const gridSize = 60;
            ctx.strokeStyle = 'rgba(0, 114, 255, 0.015)';
            ctx.lineWidth = 1;
            
            for (let x = 0; x < canvas.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            for (let y = 0; y < canvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();
    }


    /* ==========================================
       3. DYNAMIC TYPING ANIMATION
       ========================================== */
    const typingSpan = document.getElementById('typing-text');
    const words = ["AI & ML Enthusiast", "Python Developer", "Problem Solver", "DSA Learner", "Future ML Engineer"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            charIndex--;
            typingSpeed = 50; // Deleting is faster
        } else {
            charIndex++;
            typingSpeed = 120; // Normal typing speed
        }

        typingSpan.textContent = currentWord.substring(0, charIndex);

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at full word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(typeEffect, typingSpeed);
    }
    
    if (typingSpan) {
        setTimeout(typeEffect, 1000);
    }


    /* ==========================================
       4. 3D CARD HOVER TILT EFFECT
       ========================================== */
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // Mouse relative X
            const y = e.clientY - rect.top;  // Mouse relative Y
            
            const xc = rect.width / 2;
            const yc = rect.height / 2;
            
            // Limit tilt angle (max 10 degrees)
            const rotateX = ((yc - y) / yc) * 8;
            const rotateY = ((x - xc) / xc) * 8;
            
            // Bypass CSS transitions during live mouse movement for responsiveness
            card.style.transition = 'transform 0.05s linear, border-color 0.4s ease, box-shadow 0.4s ease';
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            // Restore smooth transition to snap back
            card.style.transition = 'var(--transition-smooth)';
            card.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    });


    /* ==========================================
       5. SCROLL REVEAL & SKILL BARS OBSERVING
       ========================================== */
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Animate skill bars if this is a skill card
                const skillBars = entry.target.querySelectorAll('.skill-bar-fill');
                if (skillBars.length > 0) {
                    skillBars.forEach(bar => {
                        const targetWidth = bar.getAttribute('data-percent');
                        bar.style.width = targetWidth;
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px' // Trigger slightly before screen bottom
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });


    /* ==========================================
       6. SCROLL SPY ACTIVE NAVBAR HIGHLIGHTS
       ========================================== */
    const sections = document.querySelectorAll('section');
    const navLinksList = document.querySelectorAll('.nav-links a');

    function scrollSpy() {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // Account for header size
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinksList.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', scrollSpy);
    window.addEventListener('load', scrollSpy);




    /* ==========================================
       8. CERTIFICATIONS MODAL POPUP LOGIC
       ========================================== */
    const certModal = document.getElementById('cert-modal');
    const certModalImg = document.getElementById('cert-modal-img');
    const certModalTitle = document.getElementById('cert-modal-title');
    const certModalDesc = document.getElementById('cert-modal-desc');
    const certModalBadge = document.getElementById('cert-modal-badge');
    const certModalClose = document.getElementById('cert-modal-close');
    const certCardWrappers = document.querySelectorAll('.cert-card-wrapper');

    if (certModal && certCardWrappers.length > 0) {
        // Open Modal function
        function openCertModal(title, desc, imgUrl, badge) {
            certModalImg.src = imgUrl;
            certModalImg.alt = title;
            certModalTitle.textContent = title;
            certModalDesc.textContent = desc;
            
            if (badge) {
                certModalBadge.textContent = badge;
                certModalBadge.style.display = 'inline-block';
            } else {
                certModalBadge.style.display = 'none';
            }
            
            certModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock background scrolling
        }

        // Close Modal function
        function closeCertModal() {
            certModal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }

        // Bind click events to wrappers
        certCardWrappers.forEach(wrapper => {
            wrapper.addEventListener('click', (e) => {
                // Get data attributes
                const title = wrapper.getAttribute('data-cert-title');
                const desc = wrapper.getAttribute('data-cert-desc');
                const imgUrl = wrapper.getAttribute('data-cert-img');
                const badge = wrapper.getAttribute('data-cert-badge');
                
                openCertModal(title, desc, imgUrl, badge);
            });
        });

        // Close button click
        if (certModalClose) {
            certModalClose.addEventListener('click', (e) => {
                e.stopPropagation();
                closeCertModal();
            });
        }

        // Outside click (backdrop click)
        certModal.addEventListener('click', (e) => {
            if (e.target === certModal) {
                closeCertModal();
            }
        });

        // Escape key close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && certModal.classList.contains('active')) {
                closeCertModal();
            }
        });
    }

    /* ==========================================
       9. PROFILE IMAGE LIGHTBOX MODAL LOGIC
       ========================================== */
    const profileAvatar = document.getElementById('profile-avatar');
    const profileModal = document.getElementById('profile-modal');
    const profileModalClose = document.getElementById('profile-modal-close');

    if (profileAvatar && profileModal) {
        // Open Profile Modal function
        function openProfileModal() {
            profileModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock background scrolling
        }

        // Close Profile Modal function
        function closeProfileModal() {
            profileModal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }

        // Bind click event to profile avatar
        profileAvatar.addEventListener('click', (e) => {
            e.stopPropagation();
            openProfileModal();
        });

        // Close button click
        if (profileModalClose) {
            profileModalClose.addEventListener('click', (e) => {
                e.stopPropagation();
                closeProfileModal();
            });
        }

        // Outside click (backdrop click)
        profileModal.addEventListener('click', (e) => {
            if (e.target === profileModal) {
                closeProfileModal();
            }
        });

        // Escape key close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && profileModal.classList.contains('active')) {
                closeProfileModal();
            }
        });
    }
});
