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
            const toggleButtons = navigation.querySelectorAll('.fpn-toggle');

            toggleButtons.forEach(function (button) {
                const item = button.closest('.fpn-item');

                if (item) {
                    // Add click event listener to toggle button
                    button.addEventListener('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        toggleAccordion(item);
                        return false;
                    });

                    // Add keyboard support
                    button.addEventListener('keydown', function (e) {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            e.stopImmediatePropagation();
                            toggleAccordion(item);
                            return false;
                        }
                    });

                    // Prevent link click when clicking on toggle button
                    const link = item.querySelector('a');
                    if (link) {
                        link.addEventListener('click', function (e) {
                            // If the click originated from the toggle button, prevent link navigation
                            if (e.target.closest('.fpn-toggle')) {
                                e.preventDefault();
                                e.stopPropagation();
                                return false;
                            }
                        });
                    }
                }
            });

            // Auto-expand active items and their parents (only for items with toggle buttons)
            autoExpandActiveItems(navigation);
        });

        // Handle non-accordion navigation (accordion=false)
        const nonAccordionNavigations = document.querySelectorAll('.fpn-navigation[data-accordion="false"]');

        nonAccordionNavigations.forEach(function (navigation) {
            // Auto-expand active items only - no click functionality needed
            autoExpandActiveItems(navigation);
        });
    }

    /**
     * Toggle accordion item
     */
    function toggleAccordion(item) {
        const isExpanded = item.classList.contains('fpn-expanded');
        console.log('Toggling item:', item);
        console.log('Is expanded:', isExpanded);

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
        console.log('Expanding item:', item);
        item.classList.add('fpn-expanded');

        // Add ARIA attributes for accessibility
        const toggleButton = item.querySelector('.fpn-toggle');
        if (toggleButton) {
            toggleButton.setAttribute('aria-expanded', 'true');
        }

        // Check if children are visible
        const children = item.querySelector('ul');
        if (children) {
            console.log('Children element:', children);
            console.log('Children display style:', children.style.display);
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
        const toggleButton = item.querySelector('.fpn-toggle');
        if (toggleButton) {
            toggleButton.setAttribute('aria-expanded', 'false');
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
        const isAccordion = navigation.getAttribute('data-accordion') === 'true';
        const activeItems = navigation.querySelectorAll('.fpn-item.fpn-active, .fpn-item.fpn-active-parent');

        activeItems.forEach(function (item) {
            if (isAccordion) {
                // Expand all items that have toggle buttons (any level with children)
                if (item.classList.contains('fpn-has-children') && item.querySelector('.fpn-toggle')) {
                    expandItem(item);
                }

                // Expand all parent items that have toggle buttons
                let parent = item.parentElement.closest('.fpn-item.fpn-has-children');
                while (parent) {
                    if (parent.querySelector('.fpn-toggle')) {
                        expandItem(parent);
                    }
                    parent = parent.parentElement.closest('.fpn-item.fpn-has-children');
                }
            } else {
                // When accordion is false, active parents automatically show their children
                // No need to manually expand - CSS handles the visibility
                console.log('Accordion disabled - active items will show children automatically');
            }
        });

        // Update toggle button states after auto-expansion
        updateToggleButtonStates(navigation);
    }

    /**
     * Update toggle button states based on actual visibility of children
     */
    function updateToggleButtonStates(navigation) {
        const toggleButtons = navigation.querySelectorAll('.fpn-toggle');

        toggleButtons.forEach(function (button) {
            const item = button.closest('.fpn-item');
            if (item) {
                const children = item.querySelector('ul');
                if (children) {
                    const isVisible = children.style.display !== 'none' &&
                        getComputedStyle(children).display !== 'none';

                    if (isVisible) {
                        button.setAttribute('aria-expanded', 'true');
                        item.classList.add('fpn-expanded');
                    } else {
                        button.setAttribute('aria-expanded', 'false');
                        item.classList.remove('fpn-expanded');
                    }
                }
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