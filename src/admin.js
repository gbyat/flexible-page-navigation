/**
 * Admin JavaScript for Flexible Page Navigation
 */

(function ($) {
    'use strict';

    $(document).ready(function () {
        initializeAdmin();
    });

    /**
     * Initialize admin functionality
     */
    function initializeAdmin() {
        // Test GitHub API button
        $('#test-github-api').on('click', function (e) {
            e.preventDefault();
            testGitHubAPI();
        });

        // Clear cache button
        $('#clear-cache').on('click', function (e) {
            e.preventDefault();
            clearCache();
        });

        // Show/hide GitHub token
        $('#show-github-token').on('click', function (e) {
            e.preventDefault();
            toggleTokenVisibility();
        });
    }

    /**
     * Test GitHub API connection
     */
    function testGitHubAPI() {
        const button = $('#test-github-api');
        const resultDiv = $('#api-test-result');

        // Disable button and show loading
        button.prop('disabled', true).text('Testing...');
        resultDiv.html('<div class="notice notice-info"><p>Testing GitHub API connection...</p></div>');

        $.ajax({
            url: fpn_ajax.ajax_url,
            type: 'POST',
            data: {
                action: 'fpn_test_github_api',
                nonce: fpn_ajax.nonce
            },
            success: function (response) {
                if (response.success) {
                    const data = response.data;
                    resultDiv.html(`
                        <div class="notice notice-success">
                            <p><strong>GitHub API Test Successful!</strong></p>
                            <p>Latest Release: ${data.tag_name}</p>
                            <p>Published: ${new Date(data.published_at).toLocaleDateString()}</p>
                            <p>Description: ${data.body || 'No description available'}</p>
                        </div>
                    `);
                } else {
                    resultDiv.html(`
                        <div class="notice notice-error">
                            <p><strong>GitHub API Test Failed!</strong></p>
                            <p>Error: ${response.data}</p>
                        </div>
                    `);
                }
            },
            error: function (xhr, status, error) {
                resultDiv.html(`
                    <div class="notice notice-error">
                        <p><strong>GitHub API Test Failed!</strong></p>
                        <p>Error: ${error}</p>
                    </div>
                `);
            },
            complete: function () {
                button.prop('disabled', false).text('Test GitHub API');
            }
        });
    }

    /**
     * Clear plugin cache
     */
    function clearCache() {
        const button = $('#clear-cache');
        const resultDiv = $('#api-test-result');

        // Disable button and show loading
        button.prop('disabled', true).text('Clearing...');
        resultDiv.html('<div class="notice notice-info"><p>Clearing cache...</p></div>');

        $.ajax({
            url: fpn_ajax.ajax_url,
            type: 'POST',
            data: {
                action: 'fpn_clear_cache',
                nonce: fpn_ajax.nonce
            },
            success: function (response) {
                if (response.success) {
                    resultDiv.html(`
                        <div class="notice notice-success">
                            <p><strong>Cache Cleared Successfully!</strong></p>
                            <p>${response.data}</p>
                        </div>
                    `);
                } else {
                    resultDiv.html(`
                        <div class="notice notice-error">
                            <p><strong>Cache Clear Failed!</strong></p>
                            <p>Error: ${response.data}</p>
                        </div>
                    `);
                }
            },
            error: function (xhr, status, error) {
                resultDiv.html(`
                    <div class="notice notice-error">
                        <p><strong>Cache Clear Failed!</strong></p>
                        <p>Error: ${error}</p>
                    </div>
                `);
            },
            complete: function () {
                button.prop('disabled', false).text('Clear Cache');
            }
        });
    }

    /**
     * Toggle GitHub token visibility
     */
    function toggleTokenVisibility() {
        const tokenField = $('#github_token');
        const button = $('#show-github-token');

        if (tokenField.attr('type') === 'password') {
            tokenField.attr('type', 'text');
            button.text('Hide Token');
        } else {
            tokenField.attr('type', 'password');
            button.text('Show Token');
        }
    }

    /**
     * Show notification message
     */
    function showNotification(message, type) {
        const noticeClass = type === 'success' ? 'notice-success' : 'notice-error';
        const notice = $(`
            <div class="notice ${noticeClass} is-dismissible">
                <p>${message}</p>
                <button type="button" class="notice-dismiss">
                    <span class="screen-reader-text">Dismiss this notice.</span>
                </button>
            </div>
        `);

        $('.wrap h1').after(notice);

        // Auto-dismiss after 5 seconds
        setTimeout(function () {
            notice.fadeOut();
        }, 5000);
    }

    /**
     * Validate form fields
     */
    function validateForm() {
        const token = $('#github_token').val();
        let isValid = true;
        let errors = [];

        // Clear previous error styling
        $('.form-table input').removeClass('error');

        // No validation for GitHub token - accept any format
        // Removed the 40-character validation to allow all token formats

        // Show errors if any
        if (!isValid) {
            showNotification(errors.join('<br>'), 'error');
        }

        return isValid;
    }

    // Add form validation on submit
    $('form').on('submit', function (e) {
        if (!validateForm()) {
            e.preventDefault();
        }
    });

    // Add show/hide token button if not exists
    if ($('#github_token').length && !$('#show-github-token').length) {
        $('#github_token').after('<button type="button" id="show-github-token" class="button">Show Token</button>');
    }

    // Add some helpful styling
    $('<style>')
        .prop('type', 'text/css')
        .html(`
            .form-table input.error {
                border-color: #dc3232 !important;
                box-shadow: 0 0 0 1px #dc3232 !important;
            }
            #show-github-token {
                margin-left: 10px;
            }
            .fpn-admin-section {
                margin: 20px 0;
                padding: 20px;
                background: #fff;
                border: 1px solid #ccd0d4;
                border-radius: 4px;
            }
            .fpn-admin-section h3 {
                margin-top: 0;
                color: #23282d;
            }
            .fpn-status-indicator {
                display: inline-block;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                margin-right: 8px;
            }
            .fpn-status-indicator.success {
                background-color: #46b450;
            }
            .fpn-status-indicator.error {
                background-color: #dc3232;
            }
            .fpn-status-indicator.warning {
                background-color: #ffb900;
            }
        `)
        .appendTo('head');

})(jQuery); 