// AwwEx JavaScript Components

// Alpine.js Components
document.addEventListener('alpine:init', () => {
    // Global Alpine data
    Alpine.data('navigation', () => ({
        mobileMenuOpen: false,
        
        toggleMobileMenu() {
            this.mobileMenuOpen = !this.mobileMenuOpen;
        },
        
        closeMobileMenu() {
            this.mobileMenuOpen = false;
        }
    }));
    
    // Dropdown component
    Alpine.data('dropdown', () => ({
        open: false,
        
        toggle() {
            this.open = !this.open;
        },
        
        close() {
            this.open = false;
        }
    }));
    
    // Tabs component
    Alpine.data('tabs', (defaultTab = 'web') => ({
        activeTab: defaultTab,
        
        setActiveTab(tab) {
            this.activeTab = tab;
        },
        
        isActive(tab) {
            return this.activeTab === tab;
        }
    }));
    
    // Accordion component
    Alpine.data('accordion', () => ({
        openAccordion: null,
        
        toggle(index) {
            this.openAccordion = this.openAccordion === index ? null : index;
        },
        
        isOpen(index) {
            return this.openAccordion === index;
        }
    }));
    
    // Contact Form
    Alpine.data('contactForm', () => ({
        formData: {
            name: '',
            email: '',
            phone: '',
            message: ''
        },
        loading: false,
        
        async submitForm() {
            this.loading = true;
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Show success message
                alert('Mesajınız başarıyla gönderildi!');
                
                // Reset form
                this.formData = {
                    name: '',
                    email: '',
                    phone: '',
                    message: ''
                };
                
            } catch (error) {
                alert('Bir hata oluştu. Lütfen tekrar deneyin.');
            } finally {
                this.loading = false;
            }
        }
    }));
});

// Swiper Configuration
function initializeSwiper() {
    const swiper = new Swiper('.hero-swiper', {
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        }
    });
    
    return swiper;
}

// Testimonial Swiper Configuration
function initializeTestimonialSwiper() {
    const testimonialSwiper = new Swiper('.testimonial-swiper', {
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.testimonial-next',
            prevEl: '.testimonial-prev',
        },
        effect: 'slide',
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 600,
        allowTouchMove: true,
    });
    
    return testimonialSwiper;
}

// Hero Testimonial Swiper Configuration
function initializeHeroTestimonialSwiper() {
    console.log('Initializing hero testimonial swiper...');
    const swiperElement = document.querySelector('.hero-testimonial-swiper');
    
    if (!swiperElement) {
        console.error('Hero testimonial swiper element not found!');
        return null;
    }
    
    console.log('Hero testimonial swiper element found:', swiperElement);
    
    const heroTestimonialSwiper = new Swiper('.hero-testimonial-swiper', {
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.hero-testimonial-next',
            prevEl: '.hero-testimonial-prev',
        },
        effect: 'slide',
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 600,
        allowTouchMove: true,
        on: {
            init: function() {
                console.log('Hero testimonial swiper initialized successfully!');
            },
            slideChange: function() {
                console.log('Hero testimonial slide changed to:', this.activeIndex);
            }
        }
    });
    
    return heroTestimonialSwiper;
}

// Phone Input Configuration
function initializePhoneInput() {
    const phoneInput = document.querySelector("#phone");
    if (phoneInput) {
        const iti = window.intlTelInput(phoneInput, {
            initialCountry: "tr",
            preferredCountries: ["tr", "us", "gb", "de", "fr", "nl", "es", "it"],
            utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@19.2.19/build/js/utils.js",
            formatOnDisplay: true,
            nationalMode: false,
            placeholderNumberType: "MOBILE",
            autoPlaceholder: "aggressive"
        });
        
        // Validation
        phoneInput.addEventListener('blur', function() {
            if (iti.isValidNumber()) {
                phoneInput.classList.remove('border-red-500');
                phoneInput.classList.add('border-green-500');
            } else {
                phoneInput.classList.remove('border-green-500');
                phoneInput.classList.add('border-red-500');
            }
        });
        
        return iti;
    }
}

// Smooth Scroll
function initializeSmoothScroll() {
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
}

// Intersection Observer for Animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements with animation class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize phone input
    initializePhoneInput();
    
    // Initialize smooth scroll
    initializeSmoothScroll();
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize Hero Swiper if element exists
    if (document.querySelector('.hero-swiper')) {
        initializeSwiper();
    }
    
    // Initialize Testimonial Swiper if element exists
    if (document.querySelector('.testimonial-swiper')) {
        initializeTestimonialSwiper();
    }
    
    // Initialize Hero Testimonial Swiper if element exists
    if (document.querySelector('.hero-testimonial-swiper')) {
        console.log('Found hero testimonial swiper element, initializing...');
        initializeHeroTestimonialSwiper();
    } else {
        console.log('Hero testimonial swiper element not found in DOM');
    }
    
    console.log('AwwEx components initialized successfully!');
});

// Export functions for external use
window.AwwEx = {
    initializeSwiper,
    initializeTestimonialSwiper,
    initializeHeroTestimonialSwiper,
    initializePhoneInput,
    initializeSmoothScroll,
    initializeAnimations
};
