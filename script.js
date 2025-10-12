// Smooth entrance from black hole intro
document.addEventListener('DOMContentLoaded', function() {
    // Smooth entry animation from black hole intro
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const nav = document.querySelector('.nav');
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(10, 10, 10, 0.95)';
        nav.style.backdropFilter = 'blur(30px)';
    } else {
        nav.style.background = 'rgba(10, 10, 10, 0.9)';
        nav.style.backdropFilter = 'blur(20px)';
    }
});

// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Animate skill bars
            if (entry.target.classList.contains('about-content')) {
                animateSkillBars();
            }
        }
    });
}, observerOptions);

// Add animation classes and observe elements
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll(
        '.hero-content, .about-content, .work-item, .contact-info, .contact-form'
    );
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
});

// Animate skill bars
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
}

// Hero CTA buttons
document.addEventListener('DOMContentLoaded', function() {
    const ctaPrimary = document.querySelector('.cta-primary');
    const ctaSecondary = document.querySelector('.cta-secondary');
    
    if (ctaPrimary) {
        ctaPrimary.addEventListener('click', function() {
            document.querySelector('#work').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
    
    if (ctaSecondary) {
        ctaSecondary.addEventListener('click', function() {
            document.querySelector('#contact').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
});

// Work filter functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const workItems = document.querySelectorAll('.work-item');

filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        const filter = this.dataset.filter;
        
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Filter items
        workItems.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.style.display = 'block';
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 100);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Enhanced work item interactions
workItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
        this.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.4)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = 'none';
    });
    
    // Add click effect
    item.addEventListener('click', function() {
        this.style.transform = 'translateY(-10px) scale(0.98)';
        setTimeout(() => {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        }, 150);
    });
});

// Form handling with enhanced animations
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.querySelector('span').textContent;
            
            submitBtn.querySelector('span').textContent = 'SENDING...';
            submitBtn.disabled = true;
            submitBtn.style.background = '#666';
            
            // Animate button background
            const btnBg = submitBtn.querySelector('.btn-bg');
            if (btnBg) {
                btnBg.style.left = '0';
            }
            
            // Simulate API call
            setTimeout(() => {
                submitBtn.querySelector('span').textContent = 'MESSAGE SENT!';
                submitBtn.style.background = '#28a745';
                
                // Reset form
                this.reset();
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.querySelector('span').textContent = originalText;
                    submitBtn.style.background = '#fff';
                    submitBtn.disabled = false;
                    if (btnBg) {
                        btnBg.style.left = '-100%';
                    }
                }, 3000);
            }, 2000);
        });
    }
});

// Parallax effects
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    
    // Hero parallax
    const heroShapes = document.querySelectorAll('.hero-shape');
    heroShapes.forEach((shape, index) => {
        const speed = 0.3 + (index * 0.1);
        shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
    
    // Floating elements
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((element, index) => {
        const speed = 0.2 + (index * 0.05);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Cursor effect (optional enhancement)
document.addEventListener('mousemove', function(e) {
    const cursor = document.querySelector('.cursor');
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

// Add custom cursor styles
const cursorStyles = `
    .cursor {
        width: 20px;
        height: 20px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: all 0.1s ease;
    }
    
    .cursor.hover {
        transform: scale(1.5);
        border-color: #fff;
    }
`;

// Add cursor element
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = cursorStyles;
    document.head.appendChild(style);
    
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);
    
    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .work-item');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        element.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
});

// Scroll-triggered animations
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    // Animate elements based on scroll position
    const animateElements = document.querySelectorAll('.stat, .skill-item, .work-item');
    animateElements.forEach(element => {
        const elementTop = element.offsetTop;
        const elementHeight = element.offsetHeight;
        
        if (scrolled + windowHeight > elementTop + elementHeight / 2) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
});

// Performance optimization
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Debounced scroll handler
const debouncedScrollHandler = debounce(() => {
    // Handle scroll events here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);
