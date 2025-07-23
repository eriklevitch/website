// Project data
const projects = [
    {
        id: 'watershed-ai',
        client: 'Watershed',
        title: 'AI supply chain analysis',
        description: 'Building an AI product that helps companies model their supply chain',
        previewImage: 'img/watershed-ai.png',
        status: 'coming-soon'
    },

    {
        id: 'watershed',
        client: 'Watershed',
        title: 'Sustainability reporting',
        description: 'Helping customers take control of sprawling sustainability disclosures',
        previewImage: 'img/watershed-reporting.png',
        status: 'coming-soon'
    },
    {
        id: 'mixpanel',
        client: 'Mixpanel',
        title: 'Product analytics',
        description: 'Improving first-time customer implementation by 90%',
        previewImage: 'img/mixpanel-product.png',
        status: 'coming-soon'
    },
    {
        id: 'zapier',
        client: 'Zapier',
        title: 'Workflow automation',
        description: 'Simplifying a complex pricing model',
        previewImage: 'img/zapier.png',
        status: 'coming-soon'
    },
];

// Global state variables
let scrollProgress = 0;
let mousePosition = { x: 0, y: 0 };
let currentProject = null;

// DOM element references
const elements = {
    scrollProgress: document.getElementById('scroll-progress'),
    gradientTopLeft: document.querySelector('.gradient-top-left'),
    gradientBottomRight: document.querySelector('.gradient-bottom-right'),
    previewWindow: document.getElementById('preview-window'),
    previewImage: document.getElementById('preview-image'),
    previewTitle: document.getElementById('preview-title'),
    previewDescription: document.getElementById('preview-description'),
    mainContent: document.querySelector('.main-content'),
    projectsContainer: document.getElementById('projects-container')
};

// Initialize the application
function init() {
    renderProjects();
}

// Render project cards
function renderProjects() {
    const projectsHTML = projects.map(project => `
        <div class="project-card" data-project-id="${project.id}" tabindex="0">
            <div class="project-header">
                <h3 class="project-title">
                    <span class="project-client">${project.client}</span>
                    <span class="project-separator">/</span>
                    <span class="project-name">${project.title}</span>
                </h3>
                ${project.status === 'coming-soon' ? '<span class="coming-soon-pill">Coming soon</span>' : ''}
            </div>
            <p class="project-description">${project.description}</p>
        </div>
    `).join('');

    elements.projectsContainer.innerHTML = projectsHTML;
    bindProjectCardListeners();
    setupEventListeners();
}

// Bind event listeners to project cards after rendering
function bindProjectCardListeners() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', handleProjectEnter);
        card.addEventListener('mouseleave', handleProjectLeave);
        card.addEventListener('mousemove', handleProjectMove);
        card.addEventListener('focus', handleProjectEnter);
        card.addEventListener('blur', handleProjectLeave);
    });
}

// Setup global event listeners
function setupEventListeners() {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
}

// Handle scroll events
function handleScroll() {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = Math.min(scrollY / maxScroll, 1);

    updateScrollProgress();
    updateGradients();
    updateParallax(scrollY);
}

// Handle mouse movement
function handleMouseMove(event) {
    mousePosition = {
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (event.clientY / window.innerHeight - 0.5) * 2
    };
    updateGradients();
}

// Update scroll progress indicator
function updateScrollProgress() {
    const isVisible = scrollProgress > 0.05;
    elements.scrollProgress.style.width = `${scrollProgress * 100}%`;
    elements.scrollProgress.style.opacity = isVisible ? '0.3' : '0';
}

// Update gradient positions based on scroll and mouse
function updateGradients() {
    const topLeftOpacity = 0.15 + scrollProgress * 0.1;
    const topLeftTransform = `translate(${-50 + scrollProgress * 8 + mousePosition.x * 3}%, ${-50 + scrollProgress * 6 + mousePosition.y * 2}%) scale(${1 + scrollProgress * 0.1})`;
    elements.gradientTopLeft.style.opacity = topLeftOpacity;
    elements.gradientTopLeft.style.transform = topLeftTransform;

    const bottomRightOpacity = 0.12 + scrollProgress * 0.08;
    const bottomRightTransform = `translate(${33 - scrollProgress * 6 - mousePosition.x * 2}%, ${33 - scrollProgress * 8 - mousePosition.y * 3}%) scale(${1 + scrollProgress * 0.15})`;
    elements.gradientBottomRight.style.opacity = bottomRightOpacity;
    elements.gradientBottomRight.style.transform = bottomRightTransform;
}

// Update parallax effect
function updateParallax(scrollY) {
    elements.mainContent.style.transform = `translateY(${scrollY * 0.05}px)`;
}

// Handle project card hover/focus
function handleProjectEnter(event) {
    const card = event.target.closest('.project-card');
    const projectId = card.dataset.projectId;
    currentProject = projects.find(p => p.id === projectId);

    if (currentProject) {
        showPreview(currentProject);

        if (typeof mixpanel !== 'undefined') {
            mixpanel.track("Hovered Project", {
                project_id: currentProject.id,
                client: currentProject.client,
                title: currentProject.title
            });
        }
    }
}

// Handle project card leave/blur
function handleProjectLeave() {
    currentProject = null;
    hidePreview();
}

// Handle project card mouse movement
function handleProjectMove(event) {
    if (currentProject) {
        updatePreviewPosition(event.clientX, event.clientY);
    }
}

// Show preview window
function showPreview(project) {
    elements.previewImage.src = project.previewImage;
    elements.previewImage.alt = `${project.client} ${project.title} preview`;
    elements.previewTitle.textContent = `${project.client} / ${project.title}`;
    elements.previewDescription.textContent = project.description;
    elements.previewWindow.classList.add('visible');
}

// Hide preview window
function hidePreview() {
    elements.previewWindow.classList.remove('visible');
}

// Update preview window position
function updatePreviewPosition(mouseX, mouseY) {
    const position = calculatePreviewPosition(mouseX, mouseY);
    elements.previewWindow.style.left = `${position.x}px`;
    elements.previewWindow.style.top = `${position.y}px`;
}

// Calculate smart preview position to stay within viewport
function calculatePreviewPosition(mouseX, mouseY) {
    const previewWidth = 320;
    const previewHeight = 240;
    const offset = 20;
    const padding = 16;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let x = mouseX + offset;
    let y = mouseY - 100;

    if (x + previewWidth > viewportWidth - padding) {
        x = mouseX - previewWidth - offset;
    }
    if (x < padding) x = padding;
    if (y + previewHeight > viewportHeight - padding) {
        y = viewportHeight - previewHeight - padding;
    }
    if (y < padding) y = padding;

    if (mouseY > viewportHeight / 2) {
        y = Math.min(mouseY - previewHeight - offset, viewportHeight - previewHeight - padding);
    }

    return { x, y };
}

// Handle window resize
function handleResize() {
    if (currentProject) {
        hidePreview();
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
// Mixpanel enhancements
(function setupMixpanelTracking() {
    if (typeof mixpanel === 'undefined') return;

    // UTM capture
    const params = new URLSearchParams(window.location.search);
    const utm = {
        utm_source: params.get("utm_source"),
        utm_medium: params.get("utm_medium"),
        utm_campaign: params.get("utm_campaign")
    };
    Object.keys(utm).forEach(key => {
        if (utm[key]) {
            mixpanel.register_once({ [key]: utm[key] });
        }
    });

    // Device type
    const isMobile = window.innerWidth < 768;
    mixpanel.register_once({ device_type: isMobile ? "mobile" : "desktop" });

    // Scroll depth
    const thresholds = [25, 50, 75, 100];
    const fired = new Set();

    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = Math.floor((scrollTop / docHeight) * 100);

        thresholds.forEach(t => {
            if (percent >= t && !fired.has(t)) {
                fired.add(t);
                mixpanel.track("Scrolled Page", { depth: `${t}%` });
            }
        });
    });

    // Email click tracking
    const emailLink = document.querySelector('a[href^="mailto:"]');
    if (emailLink) {
        emailLink.addEventListener("click", () => {
            const email = emailLink.getAttribute("href").replace("mailto:", "");
            mixpanel.identify(email);
            mixpanel.people.set({
                $email: email,
                interaction: "email click"
            });
            mixpanel.track("Clicked Email Link", {
                location: "footer"
            });
        });
    }
})();
