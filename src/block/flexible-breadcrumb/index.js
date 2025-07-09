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
    Button,
    Dropdown,
    ColorPalette
} from '@wordpress/components';
import { useState, useEffect, Fragment } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { useSelect } from '@wordpress/data';

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

        // Hole die Theme/Standardfarben aus dem Editor-Kontext
        const themeColors = useSelect(
            (select) => select('core/block-editor').getSettings().colors,
            []
        );

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

                    <PanelBody title={__('Farben', 'flexible-page-navigation')} initialOpen={false}>
                        {/* Textfarbe (bereits modern) */}
                        <div style={{ marginBottom: '1em' }}>
                            <label style={{ display: 'block', marginBottom: 4 }}>{__('Textfarbe', 'flexible-page-navigation')}</label>
                            <Dropdown
                                renderToggle={({ isOpen, onToggle }) => (
                                    <button
                                        onClick={onToggle}
                                        aria-expanded={isOpen}
                                        aria-label={__('Textfarbe wählen', 'flexible-page-navigation')}
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            border: '1px solid #ccc',
                                            background: textColor || '#fff',
                                            display: 'inline-block',
                                            cursor: 'pointer',
                                            boxShadow: isOpen ? '0 0 0 2px #007cba' : 'none',
                                        }}
                                    />
                                )}
                                renderContent={() => (
                                    <div style={{ padding: 8 }}>
                                        <ColorPalette
                                            value={textColor}
                                            onChange={(color) => setAttributes({ textColor: color })}
                                            colors={themeColors}
                                            enableAlpha={false}
                                            clearable
                                        />
                                    </div>
                                )}
                            />
                        </div>
                        {/* Linkfarbe */}
                        <div style={{ marginBottom: '1em' }}>
                            <label style={{ display: 'block', marginBottom: 4 }}>{__('Linkfarbe', 'flexible-page-navigation')}</label>
                            <Dropdown
                                renderToggle={({ isOpen, onToggle }) => (
                                    <button
                                        onClick={onToggle}
                                        aria-expanded={isOpen}
                                        aria-label={__('Linkfarbe wählen', 'flexible-page-navigation')}
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            border: '1px solid #ccc',
                                            background: linkColor || '#fff',
                                            display: 'inline-block',
                                            cursor: 'pointer',
                                            boxShadow: isOpen ? '0 0 0 2px #007cba' : 'none',
                                        }}
                                    />
                                )}
                                renderContent={() => (
                                    <div style={{ padding: 8 }}>
                                        <ColorPalette
                                            value={linkColor}
                                            onChange={(color) => setAttributes({ linkColor: color })}
                                            colors={themeColors}
                                            enableAlpha={false}
                                            clearable
                                        />
                                    </div>
                                )}
                            />
                        </div>
                        {/* Aktive Farbe */}
                        <div style={{ marginBottom: '1em' }}>
                            <label style={{ display: 'block', marginBottom: 4 }}>{__('Aktive Farbe', 'flexible-page-navigation')}</label>
                            <Dropdown
                                renderToggle={({ isOpen, onToggle }) => (
                                    <button
                                        onClick={onToggle}
                                        aria-expanded={isOpen}
                                        aria-label={__('Aktive Farbe wählen', 'flexible-page-navigation')}
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            border: '1px solid #ccc',
                                            background: activeColor || '#fff',
                                            display: 'inline-block',
                                            cursor: 'pointer',
                                            boxShadow: isOpen ? '0 0 0 2px #007cba' : 'none',
                                        }}
                                    />
                                )}
                                renderContent={() => (
                                    <div style={{ padding: 8 }}>
                                        <ColorPalette
                                            value={activeColor}
                                            onChange={(color) => setAttributes({ activeColor: color })}
                                            colors={themeColors}
                                            enableAlpha={false}
                                            clearable
                                        />
                                    </div>
                                )}
                            />
                        </div>
                        {/* Separator-Farbe */}
                        <div style={{ marginBottom: '1em' }}>
                            <label style={{ display: 'block', marginBottom: 4 }}>{__('Trennzeichen-Farbe', 'flexible-page-navigation')}</label>
                            <Dropdown
                                renderToggle={({ isOpen, onToggle }) => (
                                    <button
                                        onClick={onToggle}
                                        aria-expanded={isOpen}
                                        aria-label={__('Trennzeichen-Farbe wählen', 'flexible-page-navigation')}
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            border: '1px solid #ccc',
                                            background: separatorColor || '#fff',
                                            display: 'inline-block',
                                            cursor: 'pointer',
                                            boxShadow: isOpen ? '0 0 0 2px #007cba' : 'none',
                                        }}
                                    />
                                )}
                                renderContent={() => (
                                    <div style={{ padding: 8 }}>
                                        <ColorPalette
                                            value={separatorColor}
                                            onChange={(color) => setAttributes({ separatorColor: color })}
                                            colors={themeColors}
                                            enableAlpha={false}
                                            clearable
                                        />
                                    </div>
                                )}
                            />
                        </div>
                        {/* Hintergrundfarbe */}
                        <div style={{ marginBottom: '1em' }}>
                            <label style={{ display: 'block', marginBottom: 4 }}>{__('Hintergrundfarbe', 'flexible-page-navigation')}</label>
                            <Dropdown
                                renderToggle={({ isOpen, onToggle }) => (
                                    <button
                                        onClick={onToggle}
                                        aria-expanded={isOpen}
                                        aria-label={__('Hintergrundfarbe wählen', 'flexible-page-navigation')}
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            border: '1px solid #ccc',
                                            background: backgroundColor && backgroundColor !== 'transparent' ? backgroundColor : '#fff',
                                            display: 'inline-block',
                                            cursor: 'pointer',
                                            boxShadow: isOpen ? '0 0 0 2px #007cba' : 'none',
                                        }}
                                    />
                                )}
                                renderContent={() => (
                                    <div style={{ padding: 8 }}>
                                        <ColorPalette
                                            value={backgroundColor === 'transparent' ? '' : backgroundColor}
                                            onChange={(color) => setAttributes({ backgroundColor: color || 'transparent' })}
                                            colors={themeColors}
                                            enableAlpha={false}
                                            clearable
                                        />
                                    </div>
                                )}
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