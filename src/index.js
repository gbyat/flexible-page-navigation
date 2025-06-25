import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    InspectorControls,
    ColorPalette,
    __experimentalNumberControl as NumberControl,
} from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    ToggleControl,
    TextControl,
    RangeControl,
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

registerBlockType('flexible-page-navigation/navigation', {
    edit: function Edit({ attributes, setAttributes }) {
        const {
            contentType,
            sortBy,
            sortOrder,
            depth,
            childSelection,
            parentPageId,
            accordionEnabled,
            backgroundColor,
            textColor,
            activeBackgroundColor,
            activeTextColor,
        } = attributes;

        const [pages, setPages] = useState([]);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            // Fetch pages for parent page selection
            apiFetch({ path: '/wp/v2/pages?per_page=100&status=publish' })
                .then((fetchedPages) => {
                    setPages(fetchedPages);
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                });
        }, []);

        const blockProps = useBlockProps({
            className: 'fpn-navigation-editor',
            style: {
                backgroundColor: backgroundColor,
                color: textColor,
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
            },
        });

        const contentTypes = [
            { label: __('Pages', 'flexible-page-navigation'), value: 'page' },
            { label: __('Posts', 'flexible-page-navigation'), value: 'post' },
        ];

        const sortOptions = [
            { label: __('Menu Order', 'flexible-page-navigation'), value: 'menu_order' },
            { label: __('Title', 'flexible-page-navigation'), value: 'title' },
            { label: __('Date', 'flexible-page-navigation'), value: 'date' },
            { label: __('ID', 'flexible-page-navigation'), value: 'ID' },
        ];

        const sortOrders = [
            { label: __('Ascending', 'flexible-page-navigation'), value: 'ASC' },
            { label: __('Descending', 'flexible-page-navigation'), value: 'DESC' },
        ];

        const childSelectionOptions = [
            { label: __('Current Page', 'flexible-page-navigation'), value: 'current' },
            { label: __('Custom Page', 'flexible-page-navigation'), value: 'custom' },
        ];

        const pageOptions = [
            { label: __('-- Select Page --', 'flexible-page-navigation'), value: 0 },
            ...pages.map((page) => ({
                label: page.title.rendered,
                value: page.id,
            })),
        ];

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Navigation Settings', 'flexible-page-navigation')} initialOpen={true}>
                        <SelectControl
                            label={__('Content Type', 'flexible-page-navigation')}
                            value={contentType}
                            options={contentTypes}
                            onChange={(value) => setAttributes({ contentType: value })}
                        />

                        <SelectControl
                            label={__('Sort By', 'flexible-page-navigation')}
                            value={sortBy}
                            options={sortOptions}
                            onChange={(value) => setAttributes({ sortBy: value })}
                        />

                        <SelectControl
                            label={__('Sort Order', 'flexible-page-navigation')}
                            value={sortOrder}
                            options={sortOrders}
                            onChange={(value) => setAttributes({ sortOrder: value })}
                        />

                        <RangeControl
                            label={__('Depth', 'flexible-page-navigation')}
                            value={depth}
                            onChange={(value) => setAttributes({ depth: value })}
                            min={1}
                            max={5}
                        />

                        <SelectControl
                            label={__('Child Selection', 'flexible-page-navigation')}
                            value={childSelection}
                            options={childSelectionOptions}
                            onChange={(value) => setAttributes({ childSelection: value })}
                        />

                        {childSelection === 'custom' && (
                            <SelectControl
                                label={__('Parent Page', 'flexible-page-navigation')}
                                value={parentPageId}
                                options={pageOptions}
                                onChange={(value) => setAttributes({ parentPageId: parseInt(value) })}
                                disabled={loading}
                            />
                        )}

                        <ToggleControl
                            label={__('Enable Accordion', 'flexible-page-navigation')}
                            checked={accordionEnabled}
                            onChange={(value) => setAttributes({ accordionEnabled: value })}
                            help={__('Enable accordion functionality for top-level items', 'flexible-page-navigation')}
                        />
                    </PanelBody>

                    <PanelBody title={__('Colors', 'flexible-page-navigation')} initialOpen={false}>
                        <div>
                            <label>{__('Background Color', 'flexible-page-navigation')}</label>
                            <ColorPalette
                                value={backgroundColor}
                                onChange={(value) => setAttributes({ backgroundColor: value })}
                            />
                        </div>

                        <div>
                            <label>{__('Text Color', 'flexible-page-navigation')}</label>
                            <ColorPalette
                                value={textColor}
                                onChange={(value) => setAttributes({ textColor: value })}
                            />
                        </div>

                        <div>
                            <label>{__('Active Background Color', 'flexible-page-navigation')}</label>
                            <ColorPalette
                                value={activeBackgroundColor}
                                onChange={(value) => setAttributes({ activeBackgroundColor: value })}
                            />
                        </div>

                        <div>
                            <label>{__('Active Text Color', 'flexible-page-navigation')}</label>
                            <ColorPalette
                                value={activeTextColor}
                                onChange={(value) => setAttributes({ activeTextColor: value })}
                            />
                        </div>
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps}>
                    <div className="fpn-editor-preview">
                        <h4>{__('Flexible Page Navigation', 'flexible-page-navigation')}</h4>
                        <p>
                            {__('Content Type:', 'flexible-page-navigation')} {contentType} |{' '}
                            {__('Sort:', 'flexible-page-navigation')} {sortBy} ({sortOrder}) |{' '}
                            {__('Depth:', 'flexible-page-navigation')} {depth}
                        </p>
                        <p>
                            {__('Child Selection:', 'flexible-page-navigation')} {childSelection}
                            {childSelection === 'custom' && parentPageId > 0 && (
                                <span> - {pages.find(p => p.id === parentPageId)?.title?.rendered || __('Unknown Page', 'flexible-page-navigation')}</span>
                            )}
                        </p>
                        <p>
                            {__('Accordion:', 'flexible-page-navigation')} {accordionEnabled ? __('Enabled', 'flexible-page-navigation') : __('Disabled', 'flexible-page-navigation')}
                        </p>
                        <div className="fpn-color-preview">
                            <div className="fpn-color-sample" style={{ backgroundColor: backgroundColor, color: textColor }}>
                                {__('Normal State', 'flexible-page-navigation')}
                            </div>
                            <div className="fpn-color-sample" style={{ backgroundColor: activeBackgroundColor, color: activeTextColor }}>
                                {__('Active State', 'flexible-page-navigation')}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    },

    save: function Save() {
        return null; // Dynamic block, rendered by PHP
    },
}); 