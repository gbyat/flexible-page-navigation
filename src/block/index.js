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

registerBlockType('flexible-page-navigation/flexible-nav', {
    edit: function Edit({ attributes, setAttributes }) {
        const {
            contentType,
            sortBy,
            sortOrder,
            depth,
            childSelection,
            menuDisplayMode,
            parentPageId,
            accordionEnabled,
            columnLayout,
            showActiveIndicator,
            separator,
            hoverEffect,
            backgroundColor,
            textColor,
            activeBackgroundColor,
            activeTextColor,
            activePadding,
            childActiveBackgroundColor,
            childActiveTextColor,
            separatorEnabled,
            separatorWidth,
            separatorColor,
            separatorPadding,
            hoverBackgroundColor,
            mainItemFontWeight,
            mainItemFontSize,
            mainItemTextColor,
        } = attributes;

        const [loading, setLoading] = useState(true);
        const [postTypes, setPostTypes] = useState([]);

        useEffect(() => {
            // Fetch all public post types using a different approach
            apiFetch({ path: '/wp/v2/posts?per_page=1' })
                .then(() => {
                    // If we can access posts, let's try to get all post types
                    // We'll use a custom approach by checking what post types are available
                    const builtInTypes = [
                        { label: __('Pages', 'flexible-page-navigation'), value: 'page' },
                        { label: __('Posts', 'flexible-page-navigation'), value: 'post' },
                    ];

                    // Try to fetch from different endpoints to discover custom post types
                    const customTypes = [];

                    // Common custom post type names to check
                    const commonTypes = ['wiki', 'product', 'event', 'portfolio', 'team', 'testimonial', 'faq', 'service'];

                    const checkTypePromises = commonTypes.map(type =>
                        apiFetch({ path: `/wp/v2/${type}?per_page=1` })
                            .then(() => ({ label: type.charAt(0).toUpperCase() + type.slice(1), value: type }))
                            .catch(() => null)
                    );

                    Promise.all(checkTypePromises)
                        .then(results => {
                            const validTypes = results.filter(result => result !== null);
                            console.log('Discovered custom types:', validTypes);

                            const allTypes = [...builtInTypes, ...validTypes];
                            console.log('Final all types:', allTypes);
                            setPostTypes(allTypes);
                            setLoading(false);
                        })
                        .catch(() => {
                            console.log('Using fallback types');
                            setPostTypes(builtInTypes);
                            setLoading(false);
                        });
                })
                .catch(() => {
                    // Fallback to default types if API fails
                    setPostTypes([
                        { label: __('Pages', 'flexible-page-navigation'), value: 'page' },
                        { label: __('Posts', 'flexible-page-navigation'), value: 'post' },
                    ]);
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

        const columnLayoutOptions = [
            { label: __('Single Column', 'flexible-page-navigation'), value: 'single' },
            { label: __('2 Columns', 'flexible-page-navigation'), value: '2-columns' },
            { label: __('3 Columns', 'flexible-page-navigation'), value: '3-columns' },
            { label: __('4 Columns', 'flexible-page-navigation'), value: '4-columns' },
        ];

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Navigation Settings', 'flexible-page-navigation')} initialOpen={true}>
                        <SelectControl
                            label={__('Content Type', 'flexible-page-navigation')}
                            value={contentType}
                            options={postTypes}
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
                            label={__('Menu Display Mode', 'flexible-page-navigation')}
                            value={menuDisplayMode}
                            options={[
                                { label: __('Show Children Only', 'flexible-page-navigation'), value: 'children' },
                                { label: __('Show All Items', 'flexible-page-navigation'), value: 'all' },
                            ]}
                            onChange={(value) => setAttributes({ menuDisplayMode: value })}
                            help={__('Choose whether to show only children or all items of the selected content type', 'flexible-page-navigation')}
                        />

                        {menuDisplayMode === 'children' && (
                            <>
                                <SelectControl
                                    label={__('Child Selection', 'flexible-page-navigation')}
                                    value={childSelection}
                                    options={childSelectionOptions}
                                    onChange={(value) => setAttributes({ childSelection: value })}
                                />

                                {childSelection === 'custom' && (
                                    <TextControl
                                        label={__('Parent Post ID', 'flexible-page-navigation')}
                                        value={parentPageId || ''}
                                        onChange={(value) => setAttributes({ parentPageId: parseInt(value) || 0 })}
                                        help={__('Enter the ID of the parent post/page (any post type)', 'flexible-page-navigation')}
                                        type="number"
                                        min="0"
                                    />
                                )}
                            </>
                        )}

                        <ToggleControl
                            label={__('Enable Accordion', 'flexible-page-navigation')}
                            checked={accordionEnabled}
                            onChange={(value) => setAttributes({ accordionEnabled: value })}
                            help={__('Enable accordion functionality for top-level items', 'flexible-page-navigation')}
                        />

                        <SelectControl
                            label={__('Column Layout', 'flexible-page-navigation')}
                            value={columnLayout}
                            options={columnLayoutOptions}
                            onChange={(value) => setAttributes({ columnLayout: value })}
                            help={__('Choose how many columns to display the navigation in', 'flexible-page-navigation')}
                        />

                        <ToggleControl
                            label={__('Show Active Indicator', 'flexible-page-navigation')}
                            checked={showActiveIndicator}
                            onChange={(value) => setAttributes({ showActiveIndicator: value })}
                            help={__('Show visual indicator for active page', 'flexible-page-navigation')}
                        />

                        {showActiveIndicator && (
                            <RangeControl
                                label={__('Active Item Padding', 'flexible-page-navigation')}
                                value={activePadding}
                                onChange={(value) => setAttributes({ activePadding: value })}
                                min={0}
                                max={20}
                                help={__('Padding for active navigation items (in pixels)', 'flexible-page-navigation')}
                            />
                        )}

                        <SelectControl
                            label={__('Hover Effect', 'flexible-page-navigation')}
                            value={hoverEffect}
                            options={[
                                { label: __('None', 'flexible-page-navigation'), value: 'none' },
                                { label: __('Underline', 'flexible-page-navigation'), value: 'underline' },
                                { label: __('Background', 'flexible-page-navigation'), value: 'background' },
                                { label: __('Scale', 'flexible-page-navigation'), value: 'scale' },
                            ]}
                            onChange={(value) => setAttributes({ hoverEffect: value })}
                            help={__('Choose hover effect for navigation items', 'flexible-page-navigation')}
                        />

                        {hoverEffect === 'background' && (
                            <div>
                                <label>{__('Hover Background Color', 'flexible-page-navigation')}</label>
                                <ColorPalette
                                    value={hoverBackgroundColor}
                                    onChange={(value) => setAttributes({ hoverBackgroundColor: value })}
                                />
                            </div>
                        )}

                        <ToggleControl
                            label={__('Enable Left Border Lines', 'flexible-page-navigation')}
                            checked={separatorEnabled}
                            onChange={(value) => setAttributes({ separatorEnabled: value })}
                            help={__('Show left border lines for submenu items to indicate hierarchy', 'flexible-page-navigation')}
                        />

                        <RangeControl
                            label={__('Border Line Width', 'flexible-page-navigation')}
                            value={separatorWidth}
                            onChange={(value) => setAttributes({ separatorWidth: value })}
                            min={1}
                            max={10}
                            help={__('Width of left border lines in pixels', 'flexible-page-navigation')}
                            disabled={!separatorEnabled}
                        />

                        <div>
                            <label>{__('Border Line Color', 'flexible-page-navigation')}</label>
                            <ColorPalette
                                value={separatorColor}
                                onChange={(value) => setAttributes({ separatorColor: value })}
                                disabled={!separatorEnabled}
                            />
                        </div>

                        <RangeControl
                            label={__('Submenu Indentation', 'flexible-page-navigation')}
                            value={separatorPadding}
                            onChange={(value) => setAttributes({ separatorPadding: value })}
                            min={10}
                            max={50}
                            help={__('Left padding/indentation for submenu items in pixels', 'flexible-page-navigation')}
                        />
                    </PanelBody>

                    <PanelBody title={__('Main Menu Items (Level 0)', 'flexible-page-navigation')} initialOpen={false}>
                        <SelectControl
                            label={__('Font Weight', 'flexible-page-navigation')}
                            value={mainItemFontWeight}
                            options={[
                                { label: __('Normal', 'flexible-page-navigation'), value: '400' },
                                { label: __('Medium', 'flexible-page-navigation'), value: '500' },
                                { label: __('Semi Bold', 'flexible-page-navigation'), value: '600' },
                                { label: __('Bold', 'flexible-page-navigation'), value: '700' },
                                { label: __('Extra Bold', 'flexible-page-navigation'), value: '800' },
                            ]}
                            onChange={(value) => setAttributes({ mainItemFontWeight: value })}
                            help={__('Font weight for main menu items (level 0)', 'flexible-page-navigation')}
                        />

                        <RangeControl
                            label={__('Font Size', 'flexible-page-navigation')}
                            value={mainItemFontSize}
                            onChange={(value) => setAttributes({ mainItemFontSize: value })}
                            min={12}
                            max={24}
                            help={__('Font size for main menu items in pixels', 'flexible-page-navigation')}
                        />

                        <div>
                            <label>{__('Text Color', 'flexible-page-navigation')}</label>
                            <ColorPalette
                                value={mainItemTextColor}
                                onChange={(value) => setAttributes({ mainItemTextColor: value })}
                            />
                        </div>
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

                        <div>
                            <label>{__('Child Active Background Color', 'flexible-page-navigation')}</label>
                            <ColorPalette
                                value={childActiveBackgroundColor}
                                onChange={(value) => setAttributes({ childActiveBackgroundColor: value })}
                            />
                        </div>

                        <div>
                            <label>{__('Child Active Text Color', 'flexible-page-navigation')}</label>
                            <ColorPalette
                                value={childActiveTextColor}
                                onChange={(value) => setAttributes({ childActiveTextColor: value })}
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
                                <span> - {__('Parent ID:', 'flexible-page-navigation')} {parentPageId}</span>
                            )}
                        </p>
                        <p>
                            {__('Accordion:', 'flexible-page-navigation')} {accordionEnabled ? __('Enabled', 'flexible-page-navigation') : __('Disabled', 'flexible-page-navigation')}
                        </p>
                        <p>
                            {__('Layout:', 'flexible-page-navigation')} {columnLayout.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </p>
                    </div>
                </div>
            </>
        );
    },

    save: function Save() {
        return null; // Dynamic block, rendered by PHP
    },
}); 