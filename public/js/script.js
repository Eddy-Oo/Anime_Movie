// public/js/script.js

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });
  
    // Form submission handling
    const reviewForm = document.getElementById('submit-review')?.querySelector('form');
    if (reviewForm) {
      reviewForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const submitButton = this.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        
        try {
          // Show loading state
          submitButton.disabled = true;
          submitButton.textContent = 'Submitting...';
          
          const response = await fetch('/submit-review', {
            method: 'POST',
            body: formData
          });
          
          if (response.ok) {
            window.location.href = '/reviews'; // Redirect to reviews page
          } else {
            throw new Error('Submission failed');
          }
        } catch (error) {
          console.error('Error submitting review:', error);
          alert('There was an error submitting your review. Please try again.');
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      });
    }
  
    // Movie rating hover effect
    document.querySelectorAll('.rating').forEach(ratingContainer => {
      const stars = ratingContainer.querySelectorAll('i');
      let currentRating = 0;
      
      stars.forEach((star, index) => {
        // Set initial rating
        if (star.classList.contains('fas')) {
          currentRating = index + 1;
        }
        
        // Hover effect
        star.addEventListener('mouseover', () => {
          resetStars();
          highlightStars(index);
        });
        
        star.addEventListener('mouseout', () => {
          resetStars();
          highlightStars(currentRating - 1);
        });
        
        // Click event for interactive ratings (if you add this feature)
        star.addEventListener('click', () => {
          currentRating = index + 1;
          highlightStars(index);
          // If you want to make ratings interactive:
          // document.querySelector('#rating').value = currentRating;
        });
      });
      
      function highlightStars(index) {
        for (let i = 0; i <= index; i++) {
          stars[i].classList.remove('far');
          stars[i].classList.add('fas');
        }
      }
      
      function resetStars() {
        stars.forEach(star => {
          star.classList.remove('fas');
          star.classList.add('far');
        });
      }
      
      // Set initial state
      highlightStars(currentRating - 1);
    });
  
    // Animation for movie cards on scroll
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.featured-article, .movie-card, #anime-news article');
      
      elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }
      });
    };
  
    // Set initial state for animation
    document.querySelectorAll('.featured-article, .movie-card, #anime-news article').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
  
    // Run once on load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
  
    // Mobile menu toggle (if you add a mobile menu)
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    mobileMenuToggle.setAttribute('aria-label', 'Toggle menu');
    
    const nav = document.getElementById('main-nav');
    if (nav) {
      nav.parentNode.insertBefore(mobileMenuToggle, nav);
      
      mobileMenuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        mobileMenuToggle.innerHTML = nav.classList.contains('active') ? 
          '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
      });
    }
  });