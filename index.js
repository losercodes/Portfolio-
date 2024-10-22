document.addEventListener('DOMContentLoaded', () => {
    // Create canvas for cursor animation
    const canvas = document.createElement('canvas');
    canvas.className = 'cursor-trail';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Get GitHub theme colors from CSS variables
    const getGitHubColors = () => {
        const styles = getComputedStyle(document.documentElement);
        return {
            blue: styles.getPropertyValue('--github-blue').trim(),
        };
    };

    // Particle class for animation
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.life = 1;
            
            // Use GitHub theme colors
            const colors = getGitHubColors();
            this.color = colors.blue;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= 0.02;
            if (this.size > 0.2) this.size -= 0.05;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.life * 0.5; // Reduced opacity to match theme
            ctx.fill();
        }
    }

    // Particle system
    class ParticleSystem {
        constructor() {
            this.particles = [];
            this.mouseX = 0;
            this.mouseY = 0;
            this.lastX = 0;
            this.lastY = 0;
            this.maxParticles = 150; // Reduced for better performance
        }

        addParticles() {
            const dx = this.mouseX - this.lastX;
            const dy = this.mouseY - this.lastY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const particlesToAdd = Math.min(Math.floor(distance), 3);

            for (let i = 0; i < particlesToAdd; i++) {
                const x = this.lastX + (dx * (i / particlesToAdd));
                const y = this.lastY + (dy * (i / particlesToAdd));
                if (this.particles.length < this.maxParticles) {
                    this.particles.push(new Particle(x, y));
                }
            }

            this.lastX = this.mouseX;
            this.lastY = this.mouseY;
        }

        update() {
            this.addParticles();
            this.particles = this.particles.filter(particle => {
                particle.update();
                return particle.life > 0;
            });
        }

        draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.particles.forEach(particle => particle.draw());
        }
    }

    // Initialize particle system
    const particleSystem = new ParticleSystem();

    // Mouse move handler with debounce
    let timeout;
    document.addEventListener('mousemove', (e) => {
        if (!timeout) {
            timeout = setTimeout(() => {
                particleSystem.mouseX = e.clientX;
                particleSystem.mouseY = e.clientY;
                timeout = null;
            }, 10);
        }
    });

    // Animation loop
    function animate() {
        particleSystem.update();
        particleSystem.draw();
        requestAnimationFrame(animate);
    }
    animate();

    // Naruto character logic
    const naruto = document.querySelector('.naruto-character');
    const speechBubble = naruto.querySelector('.speech-bubble');
    const characterContainer = naruto.querySelector('svg');
    let lastScrollPosition = window.pageYOffset;
    let isRunning = false;
    let canUseJutsu = true;

    // Section-specific messages
    const sectionMessages = {
        about: ["Dattebayo! Your story is inspiring!", "That's your ninja way, believe it!"],
        experience: ["Woah! You're as skilled as a Hokage!", "Amazing achievements, believe it!", "You've trained hard like a true ninja!"],
        projects: ["These projects are as cool as my Rasengan!", "You built all this? That's your ninja way!", "Health_Genie and Akatsuki? Incredible jutsu!"],
        skills: ["TypeScript, React, Rust... You know all the jutsus!", "Your technical skills are legendary, believe it!", "You've mastered more skills than the Fifth Hokage!"],
        default: ["Dattebayo! Your portfolio is awesome!", "Let's explore more of your achievements!"]
    };

    // Function to check which section is currently in view
    function getCurrentSection() {
        const sections = ['about', 'experience', 'projects', 'skills'];
        for (const sectionId of sections) {
            const section = document.getElementById(sectionId);
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight * 0.4) {
                return sectionId;
            }
        }
        return 'default';
    }

    // Function to get random message for current section
    function getRandomMessage(section) {
        const messages = sectionMessages[section];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    // Update Naruto's position and animation based on scroll
    function updateNarutoPosition(scrollPos) {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = scrollPos / maxScroll;
        const availableWidth = window.innerWidth - 150;
        const xPos = Math.min(Math.max(75, scrollPercentage * availableWidth), availableWidth);
        
        naruto.style.left = `${xPos}px`;

        const scrollDiff = Math.abs(scrollPos - lastScrollPosition);
        if (scrollDiff > 5) {
            if (!isRunning) {
                naruto.classList.add('running');
                isRunning = true;
            }
            
            const isScrollingDown = scrollPos > lastScrollPosition;
            characterContainer.style.transform = `scaleX(${isScrollingDown ? 1 : -1})`;

            // Update message based on current section
            const currentSection = getCurrentSection();
            speechBubble.textContent = getRandomMessage(currentSection);

            // Enthusiasm animation
            speechBubble.classList.add('enthusiastic');
            setTimeout(() => {
                speechBubble.classList.remove('enthusiastic');
            }, 500);
        } else {
            if (isRunning) {
                naruto.classList.remove('running');
                isRunning = false;
            }
        }

        lastScrollPosition = scrollPos;
    }

    function shadowCloneJutsu() {
        if (!canUseJutsu) return;
        canUseJutsu = false;

        naruto.classList.add('clone-jutsu');
        speechBubble.textContent = "Shadow Clone Jutsu!";

        // Create clone effect
        const clone = naruto.querySelector('.shadow-clone');
        clone.style.opacity = '1';
        clone.style.transform = 'translateX(50px)';

        setTimeout(() => {
            naruto.classList.remove('clone-jutsu');
            clone.style.opacity = '0';
            clone.style.transform = 'translateX(0)';

            const currentSection = getCurrentSection();
            speechBubble.textContent = getRandomMessage(currentSection);
            canUseJutsu = true;
        }, 1000);
    }

    // Scroll event listener with throttling
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateNarutoPosition(window.pageYOffset);
                ticking = false;
            });
            ticking = true;
        }
    });

    naruto.addEventListener('dblclick', shadowCloneJutsu);

    // Initial position and message
    updateNarutoPosition(window.pageYOffset);
});
