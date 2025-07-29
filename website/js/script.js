// Enhanced JavaScript for Da Foreste Website

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Show conversion popup after 30 seconds
    setTimeout(showConversionPopup, 30000);

    // Show popup on exit intent
    document.addEventListener('mouseleave', function(e) {
        if (e.clientY <= 0) {
            showConversionPopup();
        }
    });

    // Start countdown timer
    startCountdown();

    // Add scroll animations
    addScrollAnimations();

    // Track user engagement
    trackUserEngagement();
});

// Conversion popup functions
function showConversionPopup() {
    const popup = document.getElementById('conversionPopup');
    if (popup && !sessionStorage.getItem('popupShown')) {
        popup.style.display = 'flex';
        sessionStorage.setItem('popupShown', 'true');
        
        // Track popup view
        if (typeof gtag !== 'undefined') {
            gtag('event', 'popup_view', {
                'event_category': 'engagement',
                'event_label': 'conversion_popup'
            });
        }
    }
}

function closePopup() {
    const popup = document.getElementById('conversionPopup');
    if (popup) {
        popup.style.display = 'none';
    }
}

// Countdown timer
function startCountdown() {
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');

    if (!hoursElement || !minutesElement || !secondsElement) return;

    // Set initial time (24 hours from now)
    let timeLeft = 24 * 60 * 60; // 24 hours in seconds

    function updateCountdown() {
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;

        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');

        if (timeLeft > 0) {
            timeLeft--;
        } else {
            timeLeft = 24 * 60 * 60; // Reset to 24 hours
        }
    }

    // Update immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Scroll animations
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.pricing-card, .gallery-item, .review-card, .feature-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// User engagement tracking
function trackUserEngagement() {
    let scrollDepth = 0;
    let timeOnPage = 0;
    
    // Track scroll depth
    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > scrollDepth) {
            scrollDepth = scrollPercent;
            
            // Track milestone scroll depths
            if (scrollDepth >= 25 && scrollDepth < 50) {
                trackEvent('scroll_depth', '25_percent');
            } else if (scrollDepth >= 50 && scrollDepth < 75) {
                trackEvent('scroll_depth', '50_percent');
            } else if (scrollDepth >= 75 && scrollDepth < 100) {
                trackEvent('scroll_depth', '75_percent');
            } else if (scrollDepth >= 100) {
                trackEvent('scroll_depth', '100_percent');
            }
        }
    });

    // Track time on page
    setInterval(function() {
        timeOnPage += 10;
        
        // Track time milestones
        if (timeOnPage === 30) {
            trackEvent('time_on_page', '30_seconds');
        } else if (timeOnPage === 60) {
            trackEvent('time_on_page', '1_minute');
        } else if (timeOnPage === 120) {
            trackEvent('time_on_page', '2_minutes');
        } else if (timeOnPage === 300) {
            trackEvent('time_on_page', '5_minutes');
        }
    }, 10000); // Every 10 seconds
}

// Event tracking function
function trackEvent(action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': 'engagement',
            'event_label': label
        });
    }
    
    // Console log for debugging
    console.log('Event tracked:', action, label);
}

// Phone number click tracking
document.addEventListener('click', function(e) {
    if (e.target.closest('a[href^="tel:"]')) {
        trackEvent('phone_click', 'call_button');
    }
    
    if (e.target.closest('a[href^="https://wa.me/"]')) {
        trackEvent('whatsapp_click', 'whatsapp_button');
    }
    
    if (e.target.closest('a[href="#contact"]')) {
        trackEvent('contact_click', 'contact_form');
    }
});

// Form submission tracking
const contactForm = document.querySelector('form[action*="formsubmit.co"]');
if (contactForm) {
    contactForm.addEventListener('submit', function() {
        trackEvent('form_submit', 'contact_form');
        
        // Show thank you message
        setTimeout(function() {
            alert('Thank you for your inquiry! We will contact you within 24 hours.');
        }, 100);
    });
}

// Pricing card interactions
document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        trackEvent('pricing_hover', this.querySelector('h4').textContent);
    });
    
    card.addEventListener('click', function() {
        trackEvent('pricing_click', this.querySelector('h4').textContent);
    });
});

// Gallery image interactions
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function() {
        const title = this.querySelector('h5').textContent;
        trackEvent('gallery_click', title);
    });
});

// Add CSS for scroll animations
const style = document.createElement('style');
style.textContent = `
    .pricing-card, .gallery-item, .review-card, .feature-item {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .pricing-card.animate-in, .gallery-item.animate-in, .review-card.animate-in, .feature-item.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .pricing-card:nth-child(1) { transition-delay: 0.1s; }
    .pricing-card:nth-child(2) { transition-delay: 0.2s; }
    .pricing-card:nth-child(3) { transition-delay: 0.3s; }
    
    .gallery-item:nth-child(1) { transition-delay: 0.1s; }
    .gallery-item:nth-child(2) { transition-delay: 0.2s; }
    .gallery-item:nth-child(3) { transition-delay: 0.3s; }
    .gallery-item:nth-child(4) { transition-delay: 0.4s; }
    .gallery-item:nth-child(5) { transition-delay: 0.5s; }
    .gallery-item:nth-child(6) { transition-delay: 0.6s; }
    .gallery-item:nth-child(7) { transition-delay: 0.7s; }
    .gallery-item:nth-child(8) { transition-delay: 0.8s; }
`;
document.head.appendChild(style);

// Close popup when clicking outside
document.addEventListener('click', function(e) {
    const popup = document.getElementById('conversionPopup');
    if (e.target === popup) {
        closePopup();
    }
});

// Keyboard navigation for popup
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePopup();
    }
});

// Lazy loading for images (if needed)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add to home screen prompt for mobile
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    deferredPrompt = e;
    // Show install button or banner
});

// Performance monitoring
window.addEventListener('load', function() {
    // Track page load time
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    trackEvent('page_load_time', Math.round(loadTime / 1000) + '_seconds');
});

console.log('Da Foreste website loaded successfully!');

