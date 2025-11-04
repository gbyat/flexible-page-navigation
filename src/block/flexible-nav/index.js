import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    InspectorControls,
    ColorPalette,
    // useSelect entfernt
} from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    ToggleControl,
    TextControl,
    RangeControl,
    Dropdown,
    NumberControl,
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { useSelect } from '@wordpress/data';

registerBlockType('flexible-page-navigation/flexible-nav', {
    attributes: {
        contentType: { type: 'string', default: 'page' },
        sortBy: { type: 'string', default: 'menu_order' },
        sortOrder: { type: 'string', default: 'ASC' },
        depth: { type: 'number', default: 3 },
        childSelection: { type: 'string', default: 'all' },
        menuDisplayMode: { type: 'string', default: 'children' },
        parentPageId: { type: 'number', default: 0 },
        accordionEnabled: { type: 'boolean', default: true },
        columnLayout: { type: 'string', default: 'single' },
        showActiveIndicator: { type: 'boolean', default: true },
        firstLevelItemBackgroundColor: { type: 'string', default: '' },
        firstLevelItemColor: { type: 'string', default: '' },
        firstLevelItemBackgroundColor: { type: 'string', default: '' },
        separator: { type: 'string', default: 'none' },
        hoverEffect: { type: 'string', default: 'underline' },
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
        hoverBackgroundColor: { type: 'string', default: 'rgba(0, 0, 0, 0.1)' },
        mainItemFontWeight: { type: 'string', default: '600' },
        mainItemFontSize: { type: 'number', default: 16 },
        mainItemTextColor: { type: 'string', default: '#333333' },
        dropdownMaxWidth: { type: 'number', default: 280 },
        menuOrientation: { type: 'string', default: 'vertical' },
        submenuBehavior: { type: 'boolean', default: false },
        mobileBreakpoint: { type: 'number', default: 768 },
        mobileMenuAnimation: { type: 'string', default: 'slide' },
    },
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
            firstLevelItemBackgroundColor,
            firstLevelItemColor,
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
            dropdownMaxWidth = 280,
            menuOrientation = 'vertical',
            submenuBehavior = false,
            mobileBreakpoint = 768,
            mobileMenuAnimation = 'slide',
        } = attributes;

        const [postTypes, setPostTypes] = useState([]);
        const [loading, setLoading] = useState(true);

        // Fetch available post types
        useEffect(() => {
            const builtInTypes = [
                { label: esc_html('Pages', 'flexible-page-navigation'), value: 'page' },
                { label: esc_html('Posts', 'flexible-page-navigation'), value: 'post' },
            ];

            // Try to fetch custom post types
            apiFetch({ path: '/wp/v2/types' })
                .then(types => {
                    const customTypes = Object.keys(types)
                        .filter(type => !['page', 'post'].includes(type))
                        .map(type => ({
                            label: types[type].name,
                            value: type
                        }));

                    // Check if each type is queryable
                    const checkTypePromises = customTypes.map(type =>
                        apiFetch({ path: `/wp/v2/${type.value}?per_page=1` })
                            .then(() => type)
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
                        { label: esc_html('Pages', 'flexible-page-navigation'), value: 'page' },
                        { label: esc_html('Posts', 'flexible-page-navigation'), value: 'post' },
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
            { label: esc_html('Menu Order', 'flexible-page-navigation'), value: 'menu_order' },
            { label: esc_html('Title', 'flexible-page-navigation'), value: 'title' },
            { label: esc_html('Date', 'flexible-page-navigation'), value: 'date' },
            { label: esc_html('ID', 'flexible-page-navigation'), value: 'ID' },
            { label: esc_html('Author', 'flexible-page-navigation'), value: 'author' },
            { label: esc_html('Modified Date', 'flexible-page-navigation'), value: 'modified' },
        ];

        const orderOptions = [
            { label: esc_html('Ascending', 'flexible-page-navigation'), value: 'ASC' },
            { label: esc_html('Descending', 'flexible-page-navigation'), value: 'DESC' },
        ];

        const childSelectionOptions = [
            { label: esc_html('Current Page Children', 'flexible-page-navigation'), value: 'current' },
            { label: esc_html('All Items', 'flexible-page-navigation'), value: 'all' },
            { label: esc_html('Custom Parent', 'flexible-page-navigation'), value: 'custom' },
        ];

        const columnLayoutOptions = [
            { label: esc_html('Single Column', 'flexible-page-navigation'), value: 'single' },
            { label: esc_html('Two Columns', 'flexible-page-navigation'), value: 'two-columns' },
            { label: esc_html('Three Columns', 'flexible-page-navigation'), value: 'three-columns' },
            { label: esc_html('Four Columns', 'flexible-page-navigation'), value: 'four-columns' },
        ];

        const hoverEffectOptions = [
            { label: esc_html('None', 'flexible-page-navigation'), value: 'none' },
            { label: esc_html('Underline', 'flexible-page-navigation'), value: 'underline' },
            { label: esc_html('Background', 'flexible-page-navigation'), value: 'background' },
            { label: esc_html('Scale', 'flexible-page-navigation'), value: 'scale' },
        ];

        const themeColors = useSelect(
            (select) => select('core/block-editor').getSettings().colors,
            []
        );

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Layout', 'flexible-page-navigation')} initialOpen={true}>
                        <SelectControl
                            label={__('Ausrichtung', 'flexible-page-navigation')}
                            value={menuOrientation}
                            options={[
                                { label: esc_html('Vertikal', 'flexible-page-navigation'), value: 'vertical' },
                                { label: esc_html('Horizontal', 'flexible-page-navigation'), value: 'horizontal' },
                            ]}
                            onChange={(value) => setAttributes({ menuOrientation: value })}
                        />
                        {menuOrientation === 'vertical' && (
                            <>
                                <SelectControl
                                    label={__('Column Layout', 'flexible-page-navigation')}
                                    value={columnLayout}
                                    options={columnLayoutOptions}
                                    onChange={(value) => setAttributes({ columnLayout: value })}
                                    help={__('Choose the column layout for navigation items', 'flexible-page-navigation')}
                                />
                                <ToggleControl
                                    label={__('Enable Accordion', 'flexible-page-navigation')}
                                    checked={accordionEnabled}
                                    onChange={(value) => setAttributes({ accordionEnabled: value })}
                                    help={__('Enable collapsible accordion functionality', 'flexible-page-navigation')}
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
                                {!showActiveIndicator && (
                                    <div style={{ marginTop: '0.75em' }}>
                                        <label style={{ display: 'block', marginBottom: 4 }}>{__('First Level Text Color', 'flexible-page-navigation')}</label>
                                        <Dropdown
                                            renderToggle={({ isOpen, onToggle }) => (
                                                <button
                                                    onClick={onToggle}
                                                    aria-expanded={isOpen}
                                                    aria-label={__('First Level Text Color', 'flexible-page-navigation')}
                                                    style={{
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius: '50%',
                                                        border: '1px solid #ccc',
                                                        background: firstLevelItemColor || '#fff',
                                                    }}
                                                />
                                            )}
                                            renderContent={() => (
                                                <div style={{ padding: 8 }}>
                                                    <ColorPalette
                                                        value={firstLevelItemColor}
                                                        onChange={(color) => setAttributes({ firstLevelItemColor: color })}
                                                        colors={themeColors}
                                                        enableAlpha={false}
                                                        clearable
                                                    />
                                                </div>
                                            )}
                                        />
                                    </div>
                                )}
                                {!showActiveIndicator && (
                                    <div style={{ marginTop: '0.75em' }}>
                                        <label style={{ display: 'block', marginBottom: 4 }}>{__('First Level Background Color', 'flexible-page-navigation')}</label>
                                        <Dropdown
                                            renderToggle={({ isOpen, onToggle }) => (
                                                <button
                                                    onClick={onToggle}
                                                    aria-expanded={isOpen}
                                                    aria-label={__('First Level Background Color', 'flexible-page-navigation')}
                                                    style={{
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius: '50%',
                                                        border: '1px solid #ccc',
                                                        background: firstLevelItemBackgroundColor || '#fff',
                                                    }}
                                                />
                                            )}
                                            renderContent={() => (
                                                <div style={{ padding: 8 }}>
                                                    <ColorPalette
                                                        value={firstLevelItemBackgroundColor}
                                                        onChange={(color) => setAttributes({ firstLevelItemBackgroundColor: color })}
                                                        colors={themeColors}
                                                        enableAlpha={false}
                                                        clearable
                                                    />
                                                </div>
                                            )}
                                        />
                                    </div>
                                )}
                                {/* Border-Line-Optionen, Submenu Indentation wie zuvor */}
                                {/* ... (siehe vorherige Änderungen) ... */}
                            </>
                        )}
                    </PanelBody>

                    <PanelBody title={__('Content Settings', 'flexible-page-navigation')} initialOpen={false}>
                        <SelectControl
                            label={__('Content Type', 'flexible-page-navigation')}
                            value={contentType}
                            options={postTypes}
                            onChange={(value) => setAttributes({ contentType: value })}
                            disabled={loading}
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
                            options={orderOptions}
                            onChange={(value) => setAttributes({ sortOrder: value })}
                        />

                        <RangeControl
                            label={__('Depth', 'flexible-page-navigation')}
                            value={depth}
                            onChange={(value) => setAttributes({ depth: value })}
                            min={1}
                            max={10}
                            help={__('Maximum depth of navigation hierarchy', 'flexible-page-navigation')}
                        />

                        <SelectControl
                            label={__('Child Selection', 'flexible-page-navigation')}
                            value={childSelection}
                            options={childSelectionOptions}
                            onChange={(value) => setAttributes({ childSelection: value })}
                            help={__('How to select which items to display', 'flexible-page-navigation')}
                        />

                        {childSelection === 'custom' && (
                            <NumberControl
                                label={__('Parent Page ID', 'flexible-page-navigation')}
                                value={parentPageId}
                                onChange={(value) => setAttributes({ parentPageId: Number(value) || 0 })}
                                min={1}
                                step={1}
                                help={__('Enter the ID of the parent page to show its children', 'flexible-page-navigation')}
                            />
                        )}
                    </PanelBody>

                    <PanelBody title={__('Display Settings', 'flexible-page-navigation')} initialOpen={false}>
                        <SelectControl
                            label={__('Hover Effect', 'flexible-page-navigation')}
                            value={hoverEffect}
                            options={hoverEffectOptions}
                            onChange={(value) => setAttributes({ hoverEffect: value })}
                            help={__('Choose hover effect for navigation items', 'flexible-page-navigation')}
                        />

                        {hoverEffect === 'background' && (
                            <div style={{ marginBottom: '1em' }}>
                                <label style={{ display: 'block', marginBottom: 4 }}>{__('Hover Background Color', 'flexible-page-navigation')}</label>
                                <Dropdown
                                    renderToggle={({ isOpen, onToggle }) => (
                                        <button
                                            onClick={onToggle}
                                            aria-expanded={isOpen}
                                            aria-label={__('Hover Background Color wählen', 'flexible-page-navigation')}
                                            style={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: '50%',
                                                border: '1px solid #ccc',
                                                background: hoverBackgroundColor || '#fff',
                                                display: 'inline-block',
                                                cursor: 'pointer',
                                                boxShadow: isOpen ? '0 0 0 2px #007cba' : 'none',
                                            }}
                                        />
                                    )}
                                    renderContent={() => (
                                        <div style={{ padding: 8 }}>
                                            <ColorPalette
                                                value={hoverBackgroundColor}
                                                onChange={(color) => setAttributes({ hoverBackgroundColor: color })}
                                                colors={themeColors}
                                                enableAlpha={false}
                                                clearable
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                        )}

                        {menuOrientation === 'vertical' && (
                            <>
                                <ToggleControl
                                    label={__('Enable Left Border Lines', 'flexible-page-navigation')}
                                    checked={separatorEnabled}
                                    onChange={(value) => {
                                        setAttributes({ separatorEnabled: value });
                                        if (!value) setAttributes({ separatorWidth: 0 });
                                    }}
                                    help={__('Show left border lines for submenu items to indicate hierarchy', 'flexible-page-navigation')}
                                />
                                {separatorEnabled && (
                                    <>
                                        <RangeControl
                                            label={__('Border Line Width', 'flexible-page-navigation')}
                                            value={separatorWidth}
                                            onChange={(value) => setAttributes({ separatorWidth: value })}
                                            min={0}
                                            max={10}
                                            help={__('Width of left border lines in pixels', 'flexible-page-navigation')}
                                        />
                                        <div style={{ marginBottom: '1em' }}>
                                            <label style={{ display: 'block', marginBottom: 4 }}>{__('Border Line Color', 'flexible-page-navigation')}</label>
                                            <Dropdown
                                                renderToggle={({ isOpen, onToggle }) => (
                                                    <button
                                                        onClick={onToggle}
                                                        aria-expanded={isOpen}
                                                        aria-label={__('Border Line Color wählen', 'flexible-page-navigation')}
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
                                    </>
                                )}
                                <div style={{ marginTop: '1.5em' }} />
                            </>
                        )}
                        <RangeControl
                            label={__('Submenu Indentation', 'flexible-page-navigation')}
                            value={separatorPadding}
                            onChange={(value) => setAttributes({ separatorPadding: value })}
                            min={10}
                            max={50}
                            help={__('Left padding/indentation for submenu items in pixels', 'flexible-page-navigation')}
                        />

                        {menuOrientation === 'horizontal' && (
                            <RangeControl
                                label={__('Dropdown Max Width', 'flexible-page-navigation')}
                                value={dropdownMaxWidth}
                                onChange={(value) => setAttributes({ dropdownMaxWidth: value })}
                                min={150}
                                max={400}
                                help={__('Maximum width of dropdown menus in pixels (horizontal orientation only)', 'flexible-page-navigation')}
                            />
                        )}
                    </PanelBody>

                    <PanelBody title={__('Main Menu Items (Level 0)', 'flexible-page-navigation')} initialOpen={false}>
                        <SelectControl
                            label={__('Font Weight', 'flexible-page-navigation')}
                            value={mainItemFontWeight}
                            options={[
                                { label: esc_html('Normal', 'flexible-page-navigation'), value: '400' },
                                { label: esc_html('Medium', 'flexible-page-navigation'), value: '500' },
                                { label: esc_html('Semi Bold', 'flexible-page-navigation'), value: '600' },
                                { label: esc_html('Bold', 'flexible-page-navigation'), value: '700' },
                                { label: esc_html('Extra Bold', 'flexible-page-navigation'), value: '800' },
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

                        <label style={{ display: 'block', marginBottom: 4 }}>{__('Main Menu Item Text Color', 'flexible-page-navigation')}</label>
                        <Dropdown
                            renderToggle={({ isOpen, onToggle }) => (
                                <button
                                    onClick={onToggle}
                                    aria-expanded={isOpen}
                                    aria-label={__('Main Item Text Color wählen', 'flexible-page-navigation')}
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: '50%',
                                        border: '1px solid #ccc',
                                        background: mainItemTextColor || '#fff',
                                        display: 'inline-block',
                                        cursor: 'pointer',
                                        boxShadow: isOpen ? '0 0 0 2px #007cba' : 'none',
                                    }}
                                />
                            )}
                            renderContent={() => (
                                <div style={{ padding: 8 }}>
                                    <ColorPalette
                                        value={mainItemTextColor}
                                        onChange={(color) => setAttributes({ mainItemTextColor: color })}
                                        colors={themeColors}
                                        enableAlpha={false}
                                        clearable
                                    />
                                </div>
                            )}
                            help={__('Text color for main menu items (level 0)', 'flexible-page-navigation')}
                        />
                    </PanelBody>

                    <PanelBody title={__('Colors', 'flexible-page-navigation')} initialOpen={false}>
                        {/* Background Color */}
                        <div style={{ marginBottom: '1em' }}>
                            <label style={{ display: 'block', marginBottom: 4 }}>{__('Background Color', 'flexible-page-navigation')}</label>
                            <Dropdown
                                renderToggle={({ isOpen, onToggle }) => (
                                    <button
                                        onClick={onToggle}
                                        aria-expanded={isOpen}
                                        aria-label={__('Background Color wählen', 'flexible-page-navigation')}
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            border: '1px solid #ccc',
                                            background: backgroundColor || '#fff',
                                            display: 'inline-block',
                                            cursor: 'pointer',
                                            boxShadow: isOpen ? '0 0 0 2px #007cba' : 'none',
                                        }}
                                    />
                                )}
                                renderContent={() => (
                                    <div style={{ padding: 8 }}>
                                        <ColorPalette
                                            value={backgroundColor}
                                            onChange={(color) => setAttributes({ backgroundColor: color })}
                                            colors={themeColors}
                                            enableAlpha={false}
                                            clearable
                                        />
                                    </div>
                                )}
                            />
                        </div>
                        {/* Text Color */}
                        <div style={{ marginBottom: '1em' }}>
                            <label style={{ display: 'block', marginBottom: 4 }}>{__('Text Color', 'flexible-page-navigation')}</label>
                            <Dropdown
                                renderToggle={({ isOpen, onToggle }) => (
                                    <button
                                        onClick={onToggle}
                                        aria-expanded={isOpen}
                                        aria-label={__('Text Color wählen', 'flexible-page-navigation')}
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
                        {/* Active Background Color */}
                        <div style={{ marginBottom: '1em' }}>
                            <label style={{ display: 'block', marginBottom: 4 }}>{__('Active Background Color', 'flexible-page-navigation')}</label>
                            <Dropdown
                                renderToggle={({ isOpen, onToggle }) => (
                                    <button
                                        onClick={onToggle}
                                        aria-expanded={isOpen}
                                        aria-label={__('Active Background Color wählen', 'flexible-page-navigation')}
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            border: '1px solid #ccc',
                                            background: activeBackgroundColor || '#fff',
                                            display: 'inline-block',
                                            cursor: 'pointer',
                                            boxShadow: isOpen ? '0 0 0 2px #007cba' : 'none',
                                        }}
                                    />
                                )}
                                renderContent={() => (
                                    <div style={{ padding: 8 }}>
                                        <ColorPalette
                                            value={activeBackgroundColor}
                                            onChange={(color) => setAttributes({ activeBackgroundColor: color })}
                                            colors={themeColors}
                                            enableAlpha={false}
                                            clearable
                                        />
                                    </div>
                                )}
                            />
                        </div>
                        {/* Active Text Color */}
                        <div style={{ marginBottom: '1em' }}>
                            <label style={{ display: 'block', marginBottom: 4 }}>{__('Active Text Color', 'flexible-page-navigation')}</label>
                            <Dropdown
                                renderToggle={({ isOpen, onToggle }) => (
                                    <button
                                        onClick={onToggle}
                                        aria-expanded={isOpen}
                                        aria-label={__('Active Text Color wählen', 'flexible-page-navigation')}
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            border: '1px solid #ccc',
                                            background: activeTextColor || '#fff',
                                            display: 'inline-block',
                                            cursor: 'pointer',
                                            boxShadow: isOpen ? '0 0 0 2px #007cba' : 'none',
                                        }}
                                    />
                                )}
                                renderContent={() => (
                                    <div style={{ padding: 8 }}>
                                        <ColorPalette
                                            value={activeTextColor}
                                            onChange={(color) => setAttributes({ activeTextColor: color })}
                                            colors={themeColors}
                                            enableAlpha={false}
                                            clearable
                                        />
                                    </div>
                                )}
                            />
                        </div>
                        {/* Child Active Background Color */}
                        <div style={{ marginBottom: '1em' }}>
                            <label style={{ display: 'block', marginBottom: 4 }}>{__('Child Active Background Color', 'flexible-page-navigation')}</label>
                            <Dropdown
                                renderToggle={({ isOpen, onToggle }) => (
                                    <button
                                        onClick={onToggle}
                                        aria-expanded={isOpen}
                                        aria-label={__('Child Active Background Color wählen', 'flexible-page-navigation')}
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            border: '1px solid #ccc',
                                            background: childActiveBackgroundColor || '#fff',
                                            display: 'inline-block',
                                            cursor: 'pointer',
                                            boxShadow: isOpen ? '0 0 0 2px #007cba' : 'none',
                                        }}
                                    />
                                )}
                                renderContent={() => (
                                    <div style={{ padding: 8 }}>
                                        <ColorPalette
                                            value={childActiveBackgroundColor}
                                            onChange={(color) => setAttributes({ childActiveBackgroundColor: color })}
                                            colors={themeColors}
                                            enableAlpha={false}
                                            clearable
                                        />
                                    </div>
                                )}
                            />
                        </div>
                        {/* Child Active Text Color */}
                        <div style={{ marginBottom: '1em' }}>
                            <label style={{ display: 'block', marginBottom: 4 }}>{__('Child Active Text Color', 'flexible-page-navigation')}</label>
                            <Dropdown
                                renderToggle={({ isOpen, onToggle }) => (
                                    <button
                                        onClick={onToggle}
                                        aria-expanded={isOpen}
                                        aria-label={__('Child Active Text Color wählen', 'flexible-page-navigation')}
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            border: '1px solid #ccc',
                                            background: childActiveTextColor || '#fff',
                                            display: 'inline-block',
                                            cursor: 'pointer',
                                            boxShadow: isOpen ? '0 0 0 2px #007cba' : 'none',
                                        }}
                                    />
                                )}
                                renderContent={() => (
                                    <div style={{ padding: 8 }}>
                                        <ColorPalette
                                            value={childActiveTextColor}
                                            onChange={(color) => setAttributes({ childActiveTextColor: color })}
                                            colors={themeColors}
                                            enableAlpha={false}
                                            clearable
                                        />
                                    </div>
                                )}
                            />
                        </div>
                        {/* Separator Color */}
                        <div style={{ marginBottom: '1em' }}>
                            <label style={{ display: 'block', marginBottom: 4 }}>{__('Border Line Color', 'flexible-page-navigation')}</label>
                            <Dropdown
                                renderToggle={({ isOpen, onToggle }) => (
                                    <button
                                        onClick={onToggle}
                                        aria-expanded={isOpen}
                                        aria-label={__('Border Line Color wählen', 'flexible-page-navigation')}
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
                        {/* Hover Background Color */}
                        <div style={{ marginBottom: '1em' }}>
                            <label style={{ display: 'block', marginBottom: 4 }}>{__('Hover Background Color', 'flexible-page-navigation')}</label>
                            <Dropdown
                                renderToggle={({ isOpen, onToggle }) => (
                                    <button
                                        onClick={onToggle}
                                        aria-expanded={isOpen}
                                        aria-label={__('Hover Background Color wählen', 'flexible-page-navigation')}
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            border: '1px solid #ccc',
                                            background: hoverBackgroundColor || '#fff',
                                            display: 'inline-block',
                                            cursor: 'pointer',
                                            boxShadow: isOpen ? '0 0 0 2px #007cba' : 'none',
                                        }}
                                    />
                                )}
                                renderContent={() => (
                                    <div style={{ padding: 8 }}>
                                        <ColorPalette
                                            value={hoverBackgroundColor}
                                            onChange={(color) => setAttributes({ hoverBackgroundColor: color })}
                                            colors={themeColors}
                                            enableAlpha={false}
                                            clearable
                                        />
                                    </div>
                                )}
                            />
                        </div>
                        {/* Main Item Text Color */}
                        <div style={{ marginBottom: '1em' }}>
                            <label style={{ display: 'block', marginBottom: 4 }}>{__('Main Item Text Color', 'flexible-page-navigation')}</label>
                            <Dropdown
                                renderToggle={({ isOpen, onToggle }) => (
                                    <button
                                        onClick={onToggle}
                                        aria-expanded={isOpen}
                                        aria-label={__('Main Item Text Color wählen', 'flexible-page-navigation')}
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            border: '1px solid #ccc',
                                            background: mainItemTextColor || '#fff',
                                            display: 'inline-block',
                                            cursor: 'pointer',
                                            boxShadow: isOpen ? '0 0 0 2px #007cba' : 'none',
                                        }}
                                    />
                                )}
                                renderContent={() => (
                                    <div style={{ padding: 8 }}>
                                        <ColorPalette
                                            value={mainItemTextColor}
                                            onChange={(color) => setAttributes({ mainItemTextColor: color })}
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
                            {__('Accordion:', 'flexible-page-navigation')} {accordionEnabled ? esc_html('Enabled', 'flexible-page-navigation') : esc_html('Disabled', 'flexible-page-navigation')}
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