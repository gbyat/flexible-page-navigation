import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    InspectorControls,
    RichText
} from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    TextControl,
    ColorPicker,
    RangeControl,
    ToggleControl,
    Button
} from '@wordpress/components';
import { useState, useEffect, Fragment } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

registerBlockType('flexible-page-navigation/flexible-breadcrumb', {
    attributes: {
        contentType: {
            type: 'string',
            default: 'page'
        },
        startPageId: {
            type: 'number',
            default: 0
        },
        startPageText: {
            type: 'string',
            default: 'Home'
        },
        startPageUrl: {
            type: 'string',
            default: ''
        },
        showStartLink: {
            type: 'boolean',
            default: true
        },
        separator: {
            type: 'string',
            default: '>'
        },
        separatorColor: {
            type: 'string',
            default: '#666666'
        },
        separatorMargin: {
            type: 'number',
            default: 8
        },
        textColor: {
            type: 'string',
            default: '#333333'
        },
        linkColor: {
            type: 'string',
            default: '#007cba'
        },
        activeColor: {
            type: 'string',
            default: '#666666'
        },
        fontSize: {
            type: 'number',
            default: 14
        },
        fontWeight: {
            type: 'string',
            default: '400'
        },
        padding: {
            type: 'number',
            default: 10
        },
        backgroundColor: {
            type: 'string',
            default: 'transparent'
        },
        borderRadius: {
            type: 'number',
            default: 0
        },
        showCurrentPage: {
            type: 'boolean',
            default: true
        },
        maxDepth: {
            type: 'number',
            default: 5
        }
    },

    edit: function Edit({ attributes, setAttributes }) {
        const blockProps = useBlockProps();
        const [pages, setPages] = useState([]);

        // Fetch pages for start page selection
        useEffect(() => {
            apiFetch({ path: '/wp/v2/pages?per_page=100&orderby=title&order=asc' })
                .then(response => {
                    setPages(response);
                })
                .catch(error => {
                    console.error('Error fetching pages:', error);
                });
        }, []);

        const {
            contentType,
            startPageId,
            startPageText,
            startPageUrl,
            showStartLink,
            separator,
            separatorColor,
            separatorMargin,
            textColor,
            linkColor,
            activeColor,
            fontSize,
            fontWeight,
            padding,
            backgroundColor,
            borderRadius,
            showCurrentPage,
            maxDepth
        } = attributes;

        const breadcrumbStyle = {
            fontSize: fontSize + 'px',
            fontWeight: fontWeight,
            padding: padding + 'px',
            backgroundColor: backgroundColor,
            borderRadius: borderRadius + 'px',
            color: textColor
        };

        return (
            <div {...blockProps}>
                <InspectorControls>
                    <PanelBody title={__('Breadcrumb Settings', 'flexible-page-navigation')} initialOpen={true}>
                        <TextControl
                            label={__('Start Page Text', 'flexible-page-navigation')}
                            value={startPageText}
                            onChange={(value) => setAttributes({ startPageText: value })}
                        />

                        <SelectControl
                            label={__('Start Page', 'flexible-page-navigation')}
                            value={startPageId}
                            options={[
                                { label: __('Home', 'flexible-page-navigation'), value: 0 },
                                { label: __('Custom URL', 'flexible-page-navigation'), value: -1 },
                                ...pages.map(page => ({
                                    label: page.title.rendered,
                                    value: page.id
                                }))
                            ]}
                            onChange={(value) => setAttributes({ startPageId: parseInt(value) })}
                        />

                        {startPageId === -1 && (
                            <TextControl
                                label={__('Custom Start URL', 'flexible-page-navigation')}
                                value={startPageUrl}
                                onChange={(value) => setAttributes({ startPageUrl: value })}
                                placeholder="https://example.com/start"
                                help={__('Enter the full URL for your custom start page', 'flexible-page-navigation')}
                            />
                        )}

                        <TextControl
                            label={__('Separator', 'flexible-page-navigation')}
                            value={separator}
                            onChange={(value) => setAttributes({ separator: value })}
                        />

                        <RangeControl
                            label={__('Separator Margin', 'flexible-page-navigation')}
                            value={separatorMargin}
                            onChange={(value) => setAttributes({ separatorMargin: value })}
                            min={0}
                            max={20}
                        />

                        <RangeControl
                            label={__('Font Size', 'flexible-page-navigation')}
                            value={fontSize}
                            onChange={(value) => setAttributes({ fontSize: value })}
                            min={10}
                            max={24}
                        />

                        <SelectControl
                            label={__('Font Weight', 'flexible-page-navigation')}
                            value={fontWeight}
                            options={[
                                { label: __('Normal', 'flexible-page-navigation'), value: '400' },
                                { label: __('Bold', 'flexible-page-navigation'), value: '700' },
                                { label: __('Light', 'flexible-page-navigation'), value: '300' }
                            ]}
                            onChange={(value) => setAttributes({ fontWeight: value })}
                        />

                        <RangeControl
                            label={__('Padding', 'flexible-page-navigation')}
                            value={padding}
                            onChange={(value) => setAttributes({ padding: value })}
                            min={0}
                            max={30}
                        />

                        <RangeControl
                            label={__('Border Radius', 'flexible-page-navigation')}
                            value={borderRadius}
                            onChange={(value) => setAttributes({ borderRadius: value })}
                            min={0}
                            max={20}
                        />

                        <ToggleControl
                            label={__('Show Start Link', 'flexible-page-navigation')}
                            checked={showStartLink}
                            onChange={(value) => setAttributes({ showStartLink: value })}
                        />

                        <ToggleControl
                            label={__('Show Current Page', 'flexible-page-navigation')}
                            checked={showCurrentPage}
                            onChange={(value) => setAttributes({ showCurrentPage: value })}
                        />

                        <RangeControl
                            label={__('Max Depth', 'flexible-page-navigation')}
                            value={maxDepth}
                            onChange={(value) => setAttributes({ maxDepth: value })}
                            min={1}
                            max={10}
                        />
                    </PanelBody>

                    <PanelBody title={__('Colors', 'flexible-page-navigation')} initialOpen={false}>
                        <div>
                            <label>{__('Text Color', 'flexible-page-navigation')}</label>
                            <input
                                type="color"
                                value={textColor}
                                onChange={(e) => setAttributes({ textColor: e.target.value })}
                                style={{ width: '100%', height: '40px' }}
                            />
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            <label>{__('Link Color', 'flexible-page-navigation')}</label>
                            <input
                                type="color"
                                value={linkColor}
                                onChange={(e) => setAttributes({ linkColor: e.target.value })}
                                style={{ width: '100%', height: '40px' }}
                            />
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            <label>{__('Active Color', 'flexible-page-navigation')}</label>
                            <input
                                type="color"
                                value={activeColor}
                                onChange={(e) => setAttributes({ activeColor: e.target.value })}
                                style={{ width: '100%', height: '40px' }}
                            />
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            <label>{__('Separator Color', 'flexible-page-navigation')}</label>
                            <input
                                type="color"
                                value={separatorColor}
                                onChange={(e) => setAttributes({ separatorColor: e.target.value })}
                                style={{ width: '100%', height: '40px' }}
                            />
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            <label>{__('Background Color', 'flexible-page-navigation')}</label>
                            <input
                                type="color"
                                value={backgroundColor === 'transparent' ? '#ffffff' : backgroundColor}
                                onChange={(e) => setAttributes({ backgroundColor: e.target.value })}
                                style={{ width: '100%', height: '40px' }}
                            />
                        </div>
                    </PanelBody>
                </InspectorControls>

                <div style={breadcrumbStyle}>
                    {showStartLink && (
                        <Fragment>
                            <span style={{ color: linkColor }}>
                                {startPageText}
                            </span>
                            <span style={{ color: separatorColor, margin: `0 ${separatorMargin}px` }}>
                                {separator}
                            </span>
                        </Fragment>
                    )}
                    <span style={{ color: linkColor }}>
                        {__('Parent Page', 'flexible-page-navigation')}
                    </span>
                    <span style={{ color: separatorColor, margin: `0 ${separatorMargin}px` }}>
                        {separator}
                    </span>
                    <span style={{ color: activeColor }}>
                        {__('Current Page', 'flexible-page-navigation')}
                    </span>
                </div>
            </div>
        );
    },

    save: function Save() {
        return null; // Server-side rendering
    }
});