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
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { useSelect } from '@wordpress/data';

registerBlockType('flexible-page-navigation/flexible-nav', {
    attributes: {
        contentType: { type: 'string', default: 'page' },
        sortBy: { type: 'string', default: 'menu_order' },
        sortOrder: { type: 'string', default: 'ASC' },
        depth: { type: 'number', default: 1 },
        childSelection: { type: 'string', default: 'current' },
        menuDisplayMode: { type: 'string', default: 'default' },
        parentPageId: { type: 'number', default: 0 },
        accordionEnabled: { type: 'boolean', default: false },
        columnLayout: { type: 'string', default: 'single' },
        showActiveIndicator: { type: 'boolean', default: false },
        separator: { type: 'string', default: '' },
        hoverEffect: { type: 'string', default: 'none' },
        backgroundColor: { type: 'string', default: '' },
        textColor: { type: 'string', default: '' },
        activeBackgroundColor: { type: 'string', default: '' },
        activeTextColor: { type: 'string', default: '' },
        activePadding: { type: 'number', default: 8 },
        childActiveBackgroundColor: { type: 'string', default: '' },
        childActiveTextColor: { type: 'string', default: '' },
        separatorEnabled: { type: 'boolean', default: false },
        separatorWidth: { type: 'number', default: 1 },
        separatorColor: { type: 'string', default: '' },
        separatorPadding: { type: 'number', default: 10 },
        hoverBackgroundColor: { type: 'string', default: '' },
        mainItemFontWeight: { type: 'string', default: '400' },
        mainItemFontSize: { type: 'number', default: 16 },
        mainItemTextColor: { type: 'string', default: '' },
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
                { label: __('Pages', 'flexible-page-navigation'), value: 'page' },
                { label: __('Posts', 'flexible-page-navigation'), value: 'post' },
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
            { label: __('Author', 'flexible-page-navigation'), value: 'author' },
            { label: __('Modified Date', 'flexible-page-navigation'), value: 'modified' },
        ];

        const orderOptions = [
            { label: __('Ascending', 'flexible-page-navigation'), value: 'ASC' },
            { label: __('Descending', 'flexible-page-navigation'), value: 'DESC' },
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
                    <PanelBody title={__('Layout', 'flexible-page-navigation')} initialOpen={true}>
                        <SelectControl
                            label={__('Ausrichtung', 'flexible-page-navigation')}
                            value={menuOrientation}
                            options={[
                                { label: __('Vertikal', 'flexible-page-navigation'), value: 'vertical' },
                                { label: __('Horizontal', 'flexible-page-navigation'), value: 'horizontal' },
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
                            <TextControl
                                label={__('Parent Page ID', 'flexible-page-navigation')}
                                type="number"
                                value={parentPageId}
                                onChange={(value) => setAttributes({ parentPageId: parseInt(value) || 0 })}
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