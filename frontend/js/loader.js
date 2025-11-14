// Function to load and initialize header
async function loadHeader() {
  const headerPlaceholder = document.getElementById('header-placeholder');
  if (!headerPlaceholder) return;
  
  try {
    const response = await fetch('templates/_header.html');
    const html = await response.text();
    headerPlaceholder.innerHTML = html;
    
    const menuBtn = document.getElementById('menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    if (menuBtn && mobileNav) {
      menuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('hidden');
      });
    }

    let currentPage = window.location.pathname.split("/").pop();
    
    if (currentPage === "") {
      currentPage = "index.html";
    }
    
    const desktopLinks = headerPlaceholder.querySelectorAll('.xl\\:flex a[href]');
    const mobileLinks = headerPlaceholder.querySelectorAll('#mobile-nav a[href]');
    
    const allLinks = [...desktopLinks, ...mobileLinks];

    allLinks.forEach(link => {
      if (link.getAttribute('href') === currentPage) {
        
        link.classList.add('opacity-50', 'cursor-not-allowed');
        
        link.classList.remove('hover:text-white', 'hover:underline');
      }
    });

  } catch (error) {
    console.error('Failed to load header:', error);
  }
}

// Function to load footer
async function loadFooter() {
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (!footerPlaceholder) return;
  
  try {
    const response = await fetch('templates/_footer.html');
    const html = await response.text();
    footerPlaceholder.innerHTML = html;
  } catch (error) {
    console.error('Failed to load footer:', error);
  }
}

// Run both functions when the page loads
document.addEventListener('DOMContentLoaded', () => {
  loadHeader();
  loadFooter();
});