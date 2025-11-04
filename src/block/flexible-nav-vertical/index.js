import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    InspectorControls,
    ColorPalette,
} from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    ToggleControl,
    RangeControl,
    Dropdown,
    NumberControl,
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { useSelect } from '@wordpress/data';

const FORCED_ORIENTATION = 'vertical';

registerBlockType('flexible-page-navigation/flexible-nav-vertical', {
    attributes: {
        contentType: { type: 'string', default: 'page' },
        sortBy: { type: 'string', default: 'menu_order' },
        sortOrder: { type: 'string', default: 'ASC' },
        depth: { type: 'number', default: 3 },
        childSelection: { type: 'string', default: 'all' },
        parentPageId: { type: 'number', default: 0 },
        accordionEnabled: { type: 'boolean', default: true },
        columnLayout: { type: 'string', default: 'single' },
        showActiveIndicator: { type: 'boolean', default: true },
        firstLevelItemBackgroundColor: { type: 'string', default: '' },
        firstLevelItemColor: { type: 'string', default: '' },
        backgroundColor: { type: 'string', default: '#f8f9fa' },
        textColor: { type: 'string', default: '#333333' },
        activeBackgroundColor: { type: 'string', default: '#007cba' },
        activeTextColor: { type: 'string', default: '#ffffff' },
        activePadding: { type: 'number', default: 8 },
        childActiveBackgroundColor: { type: 'string', default: '#e8f4fd' },
        childActiveTextColor: { type: 'string', default: '#333333' },
        separatorEnabled: { type: 'boolean', default: true },
        separatorWidth: { type: 'number', default: 2 },
        separatorColor: { type: 'string', default: '#e0e0e0' },
        separatorPadding: { type: 'number', default: 20 },
        hoverEffect: { type: 'string', default: 'underline' },
        hoverBackgroundColor: { type: 'string', default: 'rgba(0,0,0,0.1)' },
        mainItemFontWeight: { type: 'string', default: '600' },
        mainItemFontSize: { type: 'number', default: 16 },
        mainItemTextColor: { type: 'string', default: '#333333' },
        mobileBreakpoint: { type: 'number', default: 768 },
        menuOrientation: { type: 'string', default: FORCED_ORIENTATION },
    },
    edit: function Edit({ attributes, setAttributes }) {
        const {
            contentType,
            sortBy,
            sortOrder,
            depth,
            childSelection,
            parentPageId,
            accordionEnabled,
            columnLayout,
            showActiveIndicator,
            firstLevelItemBackgroundColor,
            firstLevelItemColor,
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
            hoverEffect,
            hoverBackgroundColor,
            mainItemFontWeight,
            mainItemFontSize,
            mainItemTextColor,
            mobileBreakpoint,
            menuOrientation,
        } = attributes;

        // Force orientation
        useEffect(() => {
            if (menuOrientation !== FORCED_ORIENTATION) {
                setAttributes({ menuOrientation: FORCED_ORIENTATION });
            }
        }, [menuOrientation]);

        const [postTypes, setPostTypes] = useState([]);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const builtInTypes = [
                { label: __('Pages', 'flexible-page-navigation'), value: 'page' },
                { label: __('Posts', 'flexible-page-navigation'), value: 'post' },
            ];

            apiFetch({ path: '/wp/v2/types' })
                .then(types => {
                    const customTypes = Object.keys(types)
                        .filter(type => !['page', 'post'].includes(type))
                        .map(type => ({ label: types[type].name, value: type }));
                    const checks = customTypes.map(type =>
                        apiFetch({ path: `/wp/v2/${type.value}?per_page=1` })
                            .then(() => type)
                            .catch(() => null)
                    );
                    Promise.all(checks)
                        .then(results => {
                            setPostTypes([...builtInTypes, ...results.filter(Boolean)]);
                            setLoading(false);
                        })
                        .catch(() => { setPostTypes(builtInTypes); setLoading(false); });
                })
                .catch(() => { setPostTypes(builtInTypes); setLoading(false); });
        }, []);

        const blockProps = useBlockProps({
            className: 'fpn-navigation-editor',
            style: { backgroundColor, color: textColor, padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' },
        });

        const sortOptions = [
            { label: __('Menu Order', 'flexible-page-navigation'), value: 'menu_order' },
            { label: __('Title', 'flexible-page-navigation'), value: 'title' },
            { label: __('Date', 'flexible-page-navigation'), value: 'date' },
            { label: __('ID', 'flexible-page-navigation'), value: 'ID' },
            { label: __('Author', 'flexible-page-navigation'), value: 'author' },
            { label: __('Modified Date', 'flexible-page-navigation'), value: 'modified' },
        ];

        const childSelectionOptions = [
            { label: __('Current Page Children', 'flexible-page-navigation'), value: 'current' },
            { label: __('All Items', 'flexible-page-navigation'), value: 'all' },
            { label: __('Custom Parent', 'flexible-page-navigation'), value: 'custom' },
        ];

        const columnLayoutOptions = [
            { label: __('Single Column', 'flexible-page-navigation'), value: 'single' },
            { label: __('Two Columns', 'flexible-page-navigation'), value: 'two-columns' },
            { label: __('Three Columns', 'flexible-page-navigation'), value: 'three-columns' },
            { label: __('Four Columns', 'flexible-page-navigation'), value: 'four-columns' },
        ];

        const themeColors = useSelect(
            (select) => select('core/block-editor').getSettings().colors,
            []
        );

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Content Settings', 'flexible-page-navigation')} initialOpen={true}>
                        <SelectControl label={__('Content Type', 'flexible-page-navigation')} value={contentType} options={postTypes} onChange={(value) => setAttributes({ contentType: value })} disabled={loading} />
                        <SelectControl label={__('Sort By', 'flexible-page-navigation')} value={sortBy} options={sortOptions} onChange={(value) => setAttributes({ sortBy: value })} />
                        <SelectControl label={__('Sort Order', 'flexible-page-navigation')} value={sortOrder} options={[{ label: __('Ascending', 'flexible-page-navigation'), value: 'ASC' }, { label: __('Descending', 'flexible-page-navigation'), value: 'DESC' }]} onChange={(value) => setAttributes({ sortOrder: value })} />
                        <RangeControl label={__('Depth', 'flexible-page-navigation')} value={depth} onChange={(value) => setAttributes({ depth: value })} min={1} max={10} />
                        <SelectControl label={__('Child Selection', 'flexible-page-navigation')} value={childSelection} options={childSelectionOptions} onChange={(value) => setAttributes({ childSelection: value })} />
                        {childSelection === 'custom' && (
                            <NumberControl label={__('Parent Page ID', 'flexible-page-navigation')} value={parentPageId} onChange={(value) => setAttributes({ parentPageId: Number(value) || 0 })} min={1} step={1} />
                        )}
                    </PanelBody>

                    <PanelBody title={__('Layout', 'flexible-page-navigation')} initialOpen={false}>
                        <SelectControl
                            label={__('Column Layout', 'flexible-page-navigation')}
                            value={columnLayout}
                            options={columnLayoutOptions}
                            onChange={(value) => setAttributes({ columnLayout: value })}
                        />
                        <ToggleControl
                            label={__('Enable Accordion', 'flexible-page-navigation')}
                            checked={accordionEnabled}
                            onChange={(value) => setAttributes({ accordionEnabled: value })}
                        />
                        <ToggleControl
                            label={__('Show Active Indicator', 'flexible-page-navigation')}
                            checked={showActiveIndicator}
                            onChange={(value) => setAttributes({ showActiveIndicator: value })}
                        />
                        <RangeControl
                            label={__('Main Items Padding', 'flexible-page-navigation')}
                            help={__('Applies to the active main item; if Show Active Indicator is off, applies to all main items.', 'flexible-page-navigation')}
                            value={activePadding}
                            onChange={(value) => setAttributes({ activePadding: value })}
                            min={0}
                            max={20}
                        />
                        {/* First-level colors moved to Colors panel when Show Active Indicator is off */}
                        <ToggleControl
                            label={__('Enable Left Border Lines', 'flexible-page-navigation')}
                            checked={separatorEnabled}
                            onChange={(value) => { setAttributes({ separatorEnabled: value }); if (!value) setAttributes({ separatorWidth: 0 }); }}
                        />
                        {separatorEnabled && (
                            <>
                                <RangeControl
                                    label={__('Border Line Width', 'flexible-page-navigation')}
                                    value={separatorWidth}
                                    onChange={(value) => setAttributes({ separatorWidth: value })}
                                    min={0}
                                    max={10}
                                />
                                <div style={{ marginBottom: '1em' }}>
                                    <label style={{ display: 'block', marginBottom: 4 }}>{__('Border Line Color', 'flexible-page-navigation')}</label>
                                    <Dropdown
                                        renderToggle={({ isOpen, onToggle }) => (
                                            <button onClick={onToggle} aria-expanded={isOpen} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #ccc', background: separatorColor || '#fff' }} />
                                        )}
                                        renderContent={() => (
                                            <div style={{ padding: 8 }}>
                                                <ColorPalette value={separatorColor} onChange={(color) => setAttributes({ separatorColor: color })} colors={themeColors} enableAlpha={false} clearable />
                                            </div>
                                        )}
                                    />
                                </div>
                            </>
                        )}
                        <RangeControl
                            label={__('Submenu Indentation', 'flexible-page-navigation')}
                            value={separatorPadding}
                            onChange={(value) => setAttributes({ separatorPadding: value })}
                            min={10}
                            max={50}
                        />
                    </PanelBody>



                    <PanelBody title={__('Colors', 'flexible-page-navigation')} initialOpen={false}>
                        <div style={{ marginBottom: '1em' }}>
                            <label style={{ display: 'block', marginBottom: 4 }}>{__('Background Color', 'flexible-page-navigation')}</label>
                            <Dropdown renderToggle={({ isOpen, onToggle }) => (<button onClick={onToggle} aria-expanded={isOpen} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #ccc', background: backgroundColor || '#fff' }} />)} renderContent={() => (<div style={{ padding: 8 }}><ColorPalette value={backgroundColor} onChange={(color) => setAttributes({ backgroundColor: color })} colors={themeColors} enableAlpha={false} clearable /></div>)} />
                        </div>
                        <div style={{ marginBottom: '1em' }}>
                            <label style={{ display: 'block', marginBottom: 4 }}>{__('Text Color', 'flexible-page-navigation')}</label>
                            <Dropdown renderToggle={({ isOpen, onToggle }) => (<button onClick={onToggle} aria-expanded={isOpen} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #ccc', background: textColor || '#fff' }} />)} renderContent={() => (<div style={{ padding: 8 }}><ColorPalette value={textColor} onChange={(color) => setAttributes({ textColor: color })} colors={themeColors} enableAlpha={false} clearable /></div>)} />
                        </div>
                        {!showActiveIndicator && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 4 }}>{__('First Level Background Color', 'flexible-page-navigation')}</label>
                                    <Dropdown
                                        renderToggle={({ isOpen, onToggle }) => (
                                            <button onClick={onToggle} aria-expanded={isOpen} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #ccc', background: firstLevelItemBackgroundColor || '#fff' }} />
                                        )}
                                        renderContent={() => (
                                            <div style={{ padding: 8 }}>
                                                <ColorPalette value={firstLevelItemBackgroundColor} onChange={(color) => setAttributes({ firstLevelItemBackgroundColor: color })} colors={themeColors} enableAlpha={false} clearable />
                                            </div>
                                        )}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 4 }}>{__('First Level Text Color', 'flexible-page-navigation')}</label>
                                    <Dropdown
                                        renderToggle={({ isOpen, onToggle }) => (
                                            <button onClick={onToggle} aria-expanded={isOpen} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #ccc', background: firstLevelItemColor || '#fff' }} />
                                        )}
                                        renderContent={() => (
                                            <div style={{ padding: 8 }}>
                                                <ColorPalette value={firstLevelItemColor} onChange={(color) => setAttributes({ firstLevelItemColor: color })} colors={themeColors} enableAlpha={false} clearable />
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        )}
                        {showActiveIndicator && (<div style={{ marginBottom: '1em' }}>
                            <label style={{ display: 'block', marginBottom: 4 }}>{__('Active Background Color', 'flexible-page-navigation')}</label>
                            <Dropdown renderToggle={({ isOpen, onToggle }) => (<button onClick={onToggle} aria-expanded={isOpen} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #ccc', background: activeBackgroundColor || '#fff' }} />)} renderContent={() => (<div style={{ padding: 8 }}><ColorPalette value={activeBackgroundColor} onChange={(color) => setAttributes({ activeBackgroundColor: color })} colors={themeColors} enableAlpha={false} clearable /></div>)} />
                        </div>)}
                        {showActiveIndicator && (<div style={{ marginBottom: '1em' }}>
                            <label style={{ display: 'block', marginBottom: 4 }}>{__('Active Text Color', 'flexible-page-navigation')}</label>
                            <Dropdown renderToggle={({ isOpen, onToggle }) => (<button onClick={onToggle} aria-expanded={isOpen} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #ccc', background: activeTextColor || '#fff' }} />)} renderContent={() => (<div style={{ padding: 8 }}><ColorPalette value={activeTextColor} onChange={(color) => setAttributes({ activeTextColor: color })} colors={themeColors} enableAlpha={false} clearable /></div>)} />
                        </div>)}
                        {showActiveIndicator && (<div style={{ marginBottom: '1em' }}>
                            <label style={{ display: 'block', marginBottom: 4 }}>{__('Child Active Background Color', 'flexible-page-navigation')}</label>
                            <Dropdown renderToggle={({ isOpen, onToggle }) => (<button onClick={onToggle} aria-expanded={isOpen} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #ccc', background: childActiveBackgroundColor || '#fff' }} />)} renderContent={() => (<div style={{ padding: 8 }}><ColorPalette value={childActiveBackgroundColor} onChange={(color) => setAttributes({ childActiveBackgroundColor: color })} colors={themeColors} enableAlpha={false} clearable /></div>)} />
                        </div>)}
                        {showActiveIndicator && (<div style={{ marginBottom: '1em' }}>
                            <label style={{ display: 'block', marginBottom: 4 }}>{__('Child Active Text Color', 'flexible-page-navigation')}</label>
                            <Dropdown renderToggle={({ isOpen, onToggle }) => (<button onClick={onToggle} aria-expanded={isOpen} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #ccc', background: childActiveTextColor || '#fff' }} />)} renderContent={() => (<div style={{ padding: 8 }}><ColorPalette value={childActiveTextColor} onChange={(color) => setAttributes({ childActiveTextColor: color })} colors={themeColors} enableAlpha={false} clearable /></div>)} />
                        </div>)}
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps}>
                    <div className="fpn-editor-preview">
                        <h4>{__('Flexible Page Navigation (Vertical)', 'flexible-page-navigation')}</h4>
                        <p>{__('Depth:', 'flexible-page-navigation')} {depth}</p>
                    </div>
                </div>
            </>
        );
    },
    save: function Save() {
        return null;
    },
});


