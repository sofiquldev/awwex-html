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
    
    // Initialize Swiper if element exists
    if (document.querySelector('.hero-swiper')) {
        initializeSwiper();
    }
    
    console.log('AwwEx components initialized successfully!');
});

// Export functions for external use
window.AwwEx = {
    initializeSwiper,
    initializePhoneInput,
    initializeSmoothScroll,
    initializeAnimations
};
