/**
 * Frontend JavaScript for Flexible Page Navigation
 */

(function () {
    'use strict';

    // Initialize accordion functionality when DOM is ready
    document.addEventListener('DOMContentLoaded', function () {
        initializeAccordion();
    });

    /**
     * Initialize accordion functionality for navigation items
     */
    function initializeAccordion() {
        const navigations = document.querySelectorAll('.fpn-navigation[data-accordion="true"]');

        navigations.forEach(function (navigation) {
            const itemsWithChildren = navigation.querySelectorAll('.fpn-item.fpn-has-children');

            itemsWithChildren.forEach(function (item) {
                const link = item.querySelector('a');

                if (link) {
                    // Add click event listener
                    link.addEventListener('click', function (e) {
                        // Don't prevent default if it's a real link
                        if (link.href && link.href !== '#' && link.href !== window.location.href) {
                            return;
                        }

                        e.preventDefault();
                        toggleAccordion(item);
                    });

                    // Add keyboard support
                    link.addEventListener('keydown', function (e) {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleAccordion(item);
                        }
                    });
                }
            });

            // Auto-expand active items and their parents
            autoExpandActiveItems(navigation);
        });
    }

    /**
     * Toggle accordion item
     */
    function toggleAccordion(item) {
        const isExpanded = item.classList.contains('fpn-expanded');

        if (isExpanded) {
            collapseItem(item);
        } else {
            expandItem(item);
        }
    }

    /**
     * Expand accordion item
     */
    function expandItem(item) {
        item.classList.add('fpn-expanded');

        // Add ARIA attributes for accessibility
        const link = item.querySelector('a');
        if (link) {
            link.setAttribute('aria-expanded', 'true');
        }

        // Trigger custom event
        const event = new CustomEvent('fpnAccordionExpanded', {
            detail: { item: item }
        });
        document.dispatchEvent(event);
    }

    /**
     * Collapse accordion item
     */
    function collapseItem(item) {
        item.classList.remove('fpn-expanded');

        // Add ARIA attributes for accessibility
        const link = item.querySelector('a');
        if (link) {
            link.setAttribute('aria-expanded', 'false');
        }

        // Trigger custom event
        const event = new CustomEvent('fpnAccordionCollapsed', {
            detail: { item: item }
        });
        document.dispatchEvent(event);
    }

    /**
     * Auto-expand active items and their parents
     */
    function autoExpandActiveItems(navigation) {
        const activeItems = navigation.querySelectorAll('.fpn-item.fpn-active, .fpn-item.fpn-active-parent');

        activeItems.forEach(function (item) {
            // Expand the item itself
            if (item.classList.contains('fpn-has-children')) {
                expandItem(item);
            }

            // Expand all parent items
            let parent = item.parentElement.closest('.fpn-item.fpn-has-children');
            while (parent) {
                expandItem(parent);
                parent = parent.parentElement.closest('.fpn-item.fpn-has-children');
            }
        });
    }

    /**
     * Smooth scroll to active item (if needed)
     */
    function scrollToActiveItem(navigation) {
        const activeItem = navigation.querySelector('.fpn-item.fpn-active');

        if (activeItem && !isElementInViewport(activeItem)) {
            activeItem.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }

    /**
     * Check if element is in viewport
     */
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Handle window resize events
     */
    function handleResize() {
        const navigations = document.querySelectorAll('.fpn-navigation');

        navigations.forEach(function (navigation) {
            // Recalculate any dynamic positioning if needed
            if (navigation.classList.contains('fpn-sticky')) {
                updateStickyPosition(navigation);
            }
        });
    }

    /**
     * Update sticky position for navigation
     */
    function updateStickyPosition(navigation) {
        const rect = navigation.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > rect.top) {
            navigation.style.position = 'fixed';
            navigation.style.top = '20px';
            navigation.style.width = rect.width + 'px';
        } else {
            navigation.style.position = 'static';
            navigation.style.width = 'auto';
        }
    }

    // Add event listeners
    window.addEventListener('resize', debounce(handleResize, 250));

    // Add scroll event listener for sticky navigation
    window.addEventListener('scroll', debounce(function () {
        const stickyNavigations = document.querySelectorAll('.fpn-navigation.fpn-sticky');
        stickyNavigations.forEach(updateStickyPosition);
    }, 100));

    /**
     * Debounce function to limit function calls
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Public API for external use
     */
    window.FlexiblePageNavigation = {
        expandItem: expandItem,
        collapseItem: collapseItem,
        toggleAccordion: toggleAccordion,
        scrollToActiveItem: scrollToActiveItem
    };

})(); 