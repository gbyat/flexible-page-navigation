import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, ColorPalette } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, Dropdown, NumberControl, ToggleControl } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { useSelect } from '@wordpress/data';

const FORCED_ORIENTATION = 'horizontal';

registerBlockType('flexible-page-navigation/flexible-nav-horizontal', {
    attributes: {
        contentType: { type: 'string', default: 'page' },
        sortBy: { type: 'string', default: 'menu_order' },
        sortOrder: { type: 'string', default: 'ASC' },
        depth: { type: 'number', default: 3 },
        childSelection: { type: 'string', default: 'all' },
        parentPageId: { type: 'number', default: 0 },
        backgroundColor: { type: 'string', default: '#f8f9fa' },
        textColor: { type: 'string', default: '#333333' },
        hoverEffect: { type: 'string', default: 'underline' },
        hoverBackgroundColor: { type: 'string', default: 'rgba(0, 0, 0, 0.1)' },
        // legacy typography (kept for BC, not used in horizontal)
        mainItemFontWeight: { type: 'string', default: '600' },
        mainItemFontSize: { type: 'number', default: 16 },
        dropdownMaxWidth: { type: 'number', default: 280 },
        mobileBreakpoint: { type: 'number', default: 768 },
        mobileMenuAnimation: { type: 'string', default: 'slide' },
        menuOrientation: { type: 'string', default: FORCED_ORIENTATION },
        // Mobile-specific
        submenuBehavior: { type: 'boolean', default: true },
        mobileSeparatorPadding: { type: 'number', default: 20 },
        // Desktop/Mobile typography
        desktopMainItemFontWeight: { type: 'string', default: '600' },
        desktopMainItemFontSize: { type: 'number', default: 16 },
        desktopSubItemFontWeight: { type: 'string', default: '600' },
        desktopSubItemFontSize: { type: 'number', default: 14 },
        mobileMainItemFontWeight: { type: 'string', default: '600' },
        mobileMainItemFontSize: { type: 'number', default: 16 },
        mobileSubItemFontWeight: { type: 'string', default: '600' },
        mobileSubItemFontSize: { type: 'number', default: 14 },
        // Desktop colors
        desktopMainItemTextColor: { type: 'string', default: '' },
        desktopMainItemBackgroundColor: { type: 'string', default: '' },
        desktopMainItemHoverTextColor: { type: 'string', default: '' },
        desktopMainItemHoverBackgroundColor: { type: 'string', default: '' },
        desktopSubItemTextColor: { type: 'string', default: '' },
        desktopSubItemBackgroundColor: { type: 'string', default: '' },
        desktopSubItemHoverTextColor: { type: 'string', default: '' },
        desktopSubItemHoverBackgroundColor: { type: 'string', default: '' },
        desktopChildIndicator: { type: 'string', default: 'none' },
        mobileMainItemTextColor: { type: 'string', default: '' },
        mobileMainItemBackgroundColor: { type: 'string', default: '' },
        mobileMainItemHoverTextColor: { type: 'string', default: '' },
        mobileMainItemHoverBackgroundColor: { type: 'string', default: '' },
        mobileSubItemTextColor: { type: 'string', default: '' },
        mobileSubItemBackgroundColor: { type: 'string', default: '' },
        mobileSubItemHoverTextColor: { type: 'string', default: '' },
        mobileSubItemHoverBackgroundColor: { type: 'string', default: '' },
    },
    edit: function Edit({ attributes, setAttributes }) {
        const {
            contentType,
            sortBy,
            sortOrder,
            depth,
            childSelection,
            parentPageId,
            backgroundColor,
            textColor,
            hoverEffect,
            hoverBackgroundColor,
            mainItemFontWeight,
            mainItemFontSize,
            dropdownMaxWidth,
            mobileBreakpoint,
            mobileMenuAnimation,
            menuOrientation,
            // Mobile
            submenuBehavior,
            mobileSeparatorPadding,
            // Typography
            desktopMainItemFontWeight,
            desktopMainItemFontSize,
            desktopSubItemFontWeight,
            desktopSubItemFontSize,
            mobileMainItemFontWeight,
            mobileMainItemFontSize,
            mobileSubItemFontWeight,
            mobileSubItemFontSize,
            // Desktop colors
            desktopMainItemTextColor,
            desktopMainItemBackgroundColor,
            desktopMainItemHoverTextColor,
            desktopMainItemHoverBackgroundColor,
            desktopSubItemTextColor,
            desktopSubItemBackgroundColor,
            desktopSubItemHoverTextColor,
            desktopSubItemHoverBackgroundColor,
            desktopChildIndicator,
            mobileMainItemTextColor,
            mobileMainItemBackgroundColor,
            mobileMainItemHoverTextColor,
            mobileMainItemHoverBackgroundColor,
            mobileSubItemTextColor,
            mobileSubItemBackgroundColor,
            mobileSubItemHoverTextColor,
            mobileSubItemHoverBackgroundColor,
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

        const hoverEffectOptions = [
            { label: __('None', 'flexible-page-navigation'), value: 'none' },
            { label: __('Underline', 'flexible-page-navigation'), value: 'underline' },
            { label: __('Background', 'flexible-page-navigation'), value: 'background' },
            { label: __('Scale', 'flexible-page-navigation'), value: 'scale' },
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

                    <PanelBody title={__('Desktop', 'flexible-page-navigation')} initialOpen={false}>
                        <RangeControl label={__('Dropdown Max Width', 'flexible-page-navigation')} value={dropdownMaxWidth} onChange={(value) => setAttributes({ dropdownMaxWidth: value })} min={150} max={400} />
                        <SelectControl label={__('Hover Effect', 'flexible-page-navigation')} value={hoverEffect} onChange={(value) => setAttributes({ hoverEffect: value })} options={hoverEffectOptions} />

                        <div style={{ margin: '12px 0' }}>
                            <label style={{ display: 'block', marginBottom: 4 }}>{__('Container Background', 'flexible-page-navigation')}</label>
                            <Dropdown renderToggle={({ isOpen, onToggle }) => (
                                <button onClick={onToggle} aria-expanded={isOpen} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #ccc', background: backgroundColor || '#fff' }} />
                            )} renderContent={() => (
                                <div style={{ padding: 8 }}>
                                    <ColorPalette value={backgroundColor} onChange={(color) => setAttributes({ backgroundColor: color })} colors={themeColors} enableAlpha={false} clearable />
                                </div>
                            )} />
                        </div>

                        <h4 style={{ marginTop: 0 }}>{__('Main Items', 'flexible-page-navigation')}</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: 4 }}>{__('Text', 'flexible-page-navigation')}</label>
                                <Dropdown renderToggle={({ isOpen, onToggle }) => (<button onClick={onToggle} aria-expanded={isOpen} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #ccc', background: desktopMainItemTextColor || '#fff' }} />)} renderContent={() => (<div style={{ padding: 8 }}><ColorPalette value={desktopMainItemTextColor} onChange={(color) => setAttributes({ desktopMainItemTextColor: color })} colors={themeColors} enableAlpha={false} clearable /></div>)} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: 4 }}>{__('Background', 'flexible-page-navigation')}</label>
                                <Dropdown renderToggle={({ isOpen, onToggle }) => (<button onClick={onToggle} aria-expanded={isOpen} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #ccc', background: desktopMainItemBackgroundColor || '#fff' }} />)} renderContent={() => (<div style={{ padding: 8 }}><ColorPalette value={desktopMainItemBackgroundColor} onChange={(color) => setAttributes({ desktopMainItemBackgroundColor: color })} colors={themeColors} enableAlpha={false} clearable /></div>)} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: 4 }}>{__('Hover Text', 'flexible-page-navigation')}</label>
                                <Dropdown renderToggle={({ isOpen, onToggle }) => (<button onClick={onToggle} aria-expanded={isOpen} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #ccc', background: desktopMainItemHoverTextColor || '#fff' }} />)} renderContent={() => (<div style={{ padding: 8 }}><ColorPalette value={desktopMainItemHoverTextColor} onChange={(color) => setAttributes({ desktopMainItemHoverTextColor: color })} colors={themeColors} enableAlpha={false} clearable /></div>)} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: 4 }}>{__('Hover Background', 'flexible-page-navigation')}</label>
                                <Dropdown renderToggle={({ isOpen, onToggle }) => (<button onClick={onToggle} aria-expanded={isOpen} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #ccc', background: desktopMainItemHoverBackgroundColor || '#fff' }} />)} renderContent={() => (<div style={{ padding: 8 }}><ColorPalette value={desktopMainItemHoverBackgroundColor} onChange={(color) => setAttributes({ desktopMainItemHoverBackgroundColor: color })} colors={themeColors} enableAlpha={false} clearable /></div>)} />
                            </div>
                        </div>

                        <div style={{ marginTop: '12px' }}>
                            <SelectControl
                                label={__('Child Indicator', 'flexible-page-navigation')}
                                value={desktopChildIndicator}
                                options={[
                                    { label: __('None', 'flexible-page-navigation'), value: 'none' },
                                    { label: '▾  ' + __('Small Arrow', 'flexible-page-navigation'), value: 'small' },
                                    { label: '▼  ' + __('Solid Arrow', 'flexible-page-navigation'), value: 'solid' },
                                    { label: '+  ' + __('Plus', 'flexible-page-navigation'), value: 'plus' },
                                ]}
                                onChange={(value) => setAttributes({ desktopChildIndicator: value })}
                                help={__('Symbol for items that have a submenu (desktop only)', 'flexible-page-navigation')}
                            />
                        </div>

                        <h4 style={{ marginTop: '1em' }}>{__('Sub Items', 'flexible-page-navigation')}</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: 4 }}>{__('Text', 'flexible-page-navigation')}</label>
                                <Dropdown renderToggle={({ isOpen, onToggle }) => (<button onClick={onToggle} aria-expanded={isOpen} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #ccc', background: desktopSubItemTextColor || '#fff' }} />)} renderContent={() => (<div style={{ padding: 8 }}><ColorPalette value={desktopSubItemTextColor} onChange={(color) => setAttributes({ desktopSubItemTextColor: color })} colors={themeColors} enableAlpha={false} clearable /></div>)} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: 4 }}>{__('Background', 'flexible-page-navigation')}</label>
                                <Dropdown renderToggle={({ isOpen, onToggle }) => (<button onClick={onToggle} aria-expanded={isOpen} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #ccc', background: desktopSubItemBackgroundColor || '#fff' }} />)} renderContent={() => (<div style={{ padding: 8 }}><ColorPalette value={desktopSubItemBackgroundColor} onChange={(color) => setAttributes({ desktopSubItemBackgroundColor: color })} colors={themeColors} enableAlpha={false} clearable /></div>)} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: 4 }}>{__('Hover Text', 'flexible-page-navigation')}</label>
                                <Dropdown renderToggle={({ isOpen, onToggle }) => (<button onClick={onToggle} aria-expanded={isOpen} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #ccc', background: desktopSubItemHoverTextColor || '#fff' }} />)} renderContent={() => (<div style={{ padding: 8 }}><ColorPalette value={desktopSubItemHoverTextColor} onChange={(color) => setAttributes({ desktopSubItemHoverTextColor: color })} colors={themeColors} enableAlpha={false} clearable /></div>)} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: 4 }}>{__('Hover Background', 'flexible-page-navigation')}</label>
                                <Dropdown renderToggle={({ isOpen, onToggle }) => (<button onClick={onToggle} aria-expanded={isOpen} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #ccc', background: desktopSubItemHoverBackgroundColor || '#fff' }} />)} renderContent={() => (<div style={{ padding: 8 }}><ColorPalette value={desktopSubItemHoverBackgroundColor} onChange={(color) => setAttributes({ desktopSubItemHoverBackgroundColor: color })} colors={themeColors} enableAlpha={false} clearable /></div>)} />
                            </div>
                        </div>

                        <h4 style={{ marginTop: '1.25em' }}>{__('Typography Settings', 'flexible-page-navigation')}</h4>
                        <h5 style={{ marginTop: 0 }}>{__('Main Items', 'flexible-page-navigation')}</h5>
                        <SelectControl label={__('Font Weight', 'flexible-page-navigation')} value={desktopMainItemFontWeight} onChange={(value) => setAttributes({ desktopMainItemFontWeight: value })} options={[{ label: __('Normal', 'flexible-page-navigation'), value: '400' }, { label: __('Medium', 'flexible-page-navigation'), value: '500' }, { label: __('Semi Bold', 'flexible-page-navigation'), value: '600' }, { label: __('Bold', 'flexible-page-navigation'), value: '700' }, { label: __('Extra Bold', 'flexible-page-navigation'), value: '800' }]} />
                        <RangeControl label={__('Font Size', 'flexible-page-navigation')} value={desktopMainItemFontSize} onChange={(value) => setAttributes({ desktopMainItemFontSize: value })} min={12} max={32} />
                        <h5 style={{ marginTop: '0.75em' }}>{__('Sub Items', 'flexible-page-navigation')}</h5>
                        <SelectControl label={__('Font Weight', 'flexible-page-navigation')} value={desktopSubItemFontWeight} onChange={(value) => setAttributes({ desktopSubItemFontWeight: value })} options={[{ label: __('Normal', 'flexible-page-navigation'), value: '400' }, { label: __('Medium', 'flexible-page-navigation'), value: '500' }, { label: __('Semi Bold', 'flexible-page-navigation'), value: '600' }, { label: __('Bold', 'flexible-page-navigation'), value: '700' }, { label: __('Extra Bold', 'flexible-page-navigation'), value: '800' }]} />
                        <RangeControl label={__('Font Size', 'flexible-page-navigation')} value={desktopSubItemFontSize} onChange={(value) => setAttributes({ desktopSubItemFontSize: value })} min={10} max={28} />
                    </PanelBody>

                    <PanelBody title={__('Mobile', 'flexible-page-navigation')} initialOpen={false}>
                        <RangeControl label={__('Mobile Breakpoint', 'flexible-page-navigation')} value={mobileBreakpoint} onChange={(value) => setAttributes({ mobileBreakpoint: value })} min={480} max={1280} />
                        <SelectControl label={__('Mobile Menu Animation', 'flexible-page-navigation')} value={mobileMenuAnimation} onChange={(value) => setAttributes({ mobileMenuAnimation: value })} options={[{ label: __('Slide', 'flexible-page-navigation'), value: 'slide' }, { label: __('Fade', 'flexible-page-navigation'), value: 'fade' }, { label: __('None', 'flexible-page-navigation'), value: 'none' }]} />
                        <ToggleControl
                            label={__('Mobile Accordion (recursive)', 'flexible-page-navigation')}
                            checked={submenuBehavior}
                            onChange={(value) => setAttributes({ submenuBehavior: value })}
                            help={__('Show nested submenus as accordion on mobile', 'flexible-page-navigation')}
                        />

                        <RangeControl
                            label={__('Mobile Indentation', 'flexible-page-navigation')}
                            value={mobileSeparatorPadding}
                            onChange={(value) => setAttributes({ mobileSeparatorPadding: value })}
                            min={10}
                            max={50}
                            help={__('Left indentation for mobile submenu items (px)', 'flexible-page-navigation')}
                        />

                        <h4 style={{ marginTop: '1em' }}>{__('Mobile Colors – Main Items', 'flexible-page-navigation')}</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: 4 }}>{__('Text', 'flexible-page-navigation')}</label>
                                <Dropdown renderToggle={({ isOpen, onToggle }) => (<button onClick={onToggle} aria-expanded={isOpen} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #ccc', background: mobileMainItemTextColor || '#fff' }} />)} renderContent={() => (<div style={{ padding: 8 }}><ColorPalette value={mobileMainItemTextColor} onChange={(color) => setAttributes({ mobileMainItemTextColor: color })} colors={themeColors} enableAlpha={false} clearable /></div>)} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: 4 }}>{__('Background', 'flexible-page-navigation')}</label>
                                <Dropdown renderToggle={({ isOpen, onToggle }) => (<button onClick={onToggle} aria-expanded={isOpen} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #ccc', background: mobileMainItemBackgroundColor || '#fff' }} />)} renderContent={() => (<div style={{ padding: 8 }}><ColorPalette value={mobileMainItemBackgroundColor} onChange={(color) => setAttributes({ mobileMainItemBackgroundColor: color })} colors={themeColors} enableAlpha={false} clearable /></div>)} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: 4 }}>{__('Hover Text', 'flexible-page-navigation')}</label>
                                <Dropdown renderToggle={({ isOpen, onToggle }) => (<button onClick={onToggle} aria-expanded={isOpen} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #ccc', background: mobileMainItemHoverTextColor || '#fff' }} />)} renderContent={() => (<div style={{ padding: 8 }}><ColorPalette value={mobileMainItemHoverTextColor} onChange={(color) => setAttributes({ mobileMainItemHoverTextColor: color })} colors={themeColors} enableAlpha={false} clearable /></div>)} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: 4 }}>{__('Hover Background', 'flexible-page-navigation')}</label>
                                <Dropdown renderToggle={({ isOpen, onToggle }) => (<button onClick={onToggle} aria-expanded={isOpen} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #ccc', background: mobileMainItemHoverBackgroundColor || '#fff' }} />)} renderContent={() => (<div style={{ padding: 8 }}><ColorPalette value={mobileMainItemHoverBackgroundColor} onChange={(color) => setAttributes({ mobileMainItemHoverBackgroundColor: color })} colors={themeColors} enableAlpha={false} clearable /></div>)} />
                            </div>
                        </div>

                        <h4 style={{ marginTop: '1em' }}>{__('Mobile Colors – Sub Items', 'flexible-page-navigation')}</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: 4 }}>{__('Text', 'flexible-page-navigation')}</label>
                                <Dropdown renderToggle={({ isOpen, onToggle }) => (<button onClick={onToggle} aria-expanded={isOpen} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #ccc', background: mobileSubItemTextColor || '#fff' }} />)} renderContent={() => (<div style={{ padding: 8 }}><ColorPalette value={mobileSubItemTextColor} onChange={(color) => setAttributes({ mobileSubItemTextColor: color })} colors={themeColors} enableAlpha={false} clearable /></div>)} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: 4 }}>{__('Background', 'flexible-page-navigation')}</label>
                                <Dropdown renderToggle={({ isOpen, onToggle }) => (<button onClick={onToggle} aria-expanded={isOpen} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #ccc', background: mobileSubItemBackgroundColor || '#fff' }} />)} renderContent={() => (<div style={{ padding: 8 }}><ColorPalette value={mobileSubItemBackgroundColor} onChange={(color) => setAttributes({ mobileSubItemBackgroundColor: color })} colors={themeColors} enableAlpha={false} clearable /></div>)} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: 4 }}>{__('Hover Text', 'flexible-page-navigation')}</label>
                                <Dropdown renderToggle={({ isOpen, onToggle }) => (<button onClick={onToggle} aria-expanded={isOpen} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #ccc', background: mobileSubItemHoverTextColor || '#fff' }} />)} renderContent={() => (<div style={{ padding: 8 }}><ColorPalette value={mobileSubItemHoverTextColor} onChange={(color) => setAttributes({ mobileSubItemHoverTextColor: color })} colors={themeColors} enableAlpha={false} clearable /></div>)} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: 4 }}>{__('Hover Background', 'flexible-page-navigation')}</label>
                                <Dropdown renderToggle={({ isOpen, onToggle }) => (<button onClick={onToggle} aria-expanded={isOpen} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #ccc', background: mobileSubItemHoverBackgroundColor || '#fff' }} />)} renderContent={() => (<div style={{ padding: 8 }}><ColorPalette value={mobileSubItemHoverBackgroundColor} onChange={(color) => setAttributes({ mobileSubItemHoverBackgroundColor: color })} colors={themeColors} enableAlpha={false} clearable /></div>)} />
                            </div>
                        </div>

                        <h4 style={{ marginTop: '1.25em' }}>{__('Typography Settings', 'flexible-page-navigation')}</h4>
                        <h5 style={{ marginTop: 0 }}>{__('Main Items', 'flexible-page-navigation')}</h5>
                        <SelectControl label={__('Font Weight', 'flexible-page-navigation')} value={mobileMainItemFontWeight} onChange={(value) => setAttributes({ mobileMainItemFontWeight: value })} options={[{ label: __('Normal', 'flexible-page-navigation'), value: '400' }, { label: __('Medium', 'flexible-page-navigation'), value: '500' }, { label: __('Semi Bold', 'flexible-page-navigation'), value: '600' }, { label: __('Bold', 'flexible-page-navigation'), value: '700' }, { label: __('Extra Bold', 'flexible-page-navigation'), value: '800' }]} />
                        <RangeControl label={__('Font Size', 'flexible-page-navigation')} value={mobileMainItemFontSize} onChange={(value) => setAttributes({ mobileMainItemFontSize: value })} min={12} max={28} />
                        <h5 style={{ marginTop: '0.75em' }}>{__('Sub Items', 'flexible-page-navigation')}</h5>
                        <SelectControl label={__('Font Weight', 'flexible-page-navigation')} value={mobileSubItemFontWeight} onChange={(value) => setAttributes({ mobileSubItemFontWeight: value })} options={[{ label: __('Normal', 'flexible-page-navigation'), value: '400' }, { label: __('Medium', 'flexible-page-navigation'), value: '500' }, { label: __('Semi Bold', 'flexible-page-navigation'), value: '600' }, { label: __('Bold', 'flexible-page-navigation'), value: '700' }, { label: __('Extra Bold', 'flexible-page-navigation'), value: '800' }]} />
                        <RangeControl label={__('Font Size', 'flexible-page-navigation')} value={mobileSubItemFontSize} onChange={(value) => setAttributes({ mobileSubItemFontSize: value })} min={10} max={24} />
                    </PanelBody>

                    {/* Removed separate Typography panels; typography now inside Desktop/Mobile panels */}

                    {/* Colors panel removed; settings redistributed to Desktop/Mobile */}
                </InspectorControls>

                <div {...blockProps}>
                    <div className="fpn-editor-preview">
                        <h4>{__('Flexible Page Navigation (Horizontal)', 'flexible-page-navigation')}</h4>
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


