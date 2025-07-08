/******/ (() => { // webpackBootstrap
/*!*****************************************!*\
  !*** ./src/block/flexible-nav/index.js ***!
  \*****************************************/
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
// Wait for WordPress to be fully loaded
(function () {
  function initBlock() {
    var _window$wp, _window$wp2, _window$wp3, _window$wp4, _window$wp5, _window$wp6;
    // Safe WordPress imports with fallbacks
    var _ref = ((_window$wp = window.wp) === null || _window$wp === void 0 ? void 0 : _window$wp.blocks) || {},
      registerBlockType = _ref.registerBlockType;
    var _ref2 = ((_window$wp2 = window.wp) === null || _window$wp2 === void 0 ? void 0 : _window$wp2.i18n) || {},
      __ = _ref2.__;
    var _ref3 = ((_window$wp3 = window.wp) === null || _window$wp3 === void 0 ? void 0 : _window$wp3.blockEditor) || {},
      useBlockProps = _ref3.useBlockProps,
      InspectorControls = _ref3.InspectorControls,
      ColorPalette = _ref3.ColorPalette,
      NumberControl = _ref3.__experimentalNumberControl;
    var _ref4 = ((_window$wp4 = window.wp) === null || _window$wp4 === void 0 ? void 0 : _window$wp4.components) || {},
      PanelBody = _ref4.PanelBody,
      SelectControl = _ref4.SelectControl,
      ToggleControl = _ref4.ToggleControl,
      TextControl = _ref4.TextControl,
      RangeControl = _ref4.RangeControl;
    var _ref5 = ((_window$wp5 = window.wp) === null || _window$wp5 === void 0 ? void 0 : _window$wp5.element) || {},
      useState = _ref5.useState,
      useEffect = _ref5.useEffect;
    var apiFetch = ((_window$wp6 = window.wp) === null || _window$wp6 === void 0 ? void 0 : _window$wp6.apiFetch) || {};

    // Check if all required functions are available
    if (!registerBlockType) {
      console.warn('Flexible Page Navigation: registerBlockType not available, retrying...');
      setTimeout(initBlock, 100);
      return;
    }
    registerBlockType('flexible-page-navigation/flexible-nav', {
      edit: function Edit(_ref6) {
        var attributes = _ref6.attributes,
          setAttributes = _ref6.setAttributes;
        var contentType = attributes.contentType,
          sortBy = attributes.sortBy,
          sortOrder = attributes.sortOrder,
          depth = attributes.depth,
          childSelection = attributes.childSelection,
          menuDisplayMode = attributes.menuDisplayMode,
          parentPageId = attributes.parentPageId,
          accordionEnabled = attributes.accordionEnabled,
          columnLayout = attributes.columnLayout,
          showActiveIndicator = attributes.showActiveIndicator,
          separator = attributes.separator,
          hoverEffect = attributes.hoverEffect,
          backgroundColor = attributes.backgroundColor,
          textColor = attributes.textColor,
          activeBackgroundColor = attributes.activeBackgroundColor,
          activeTextColor = attributes.activeTextColor,
          activePadding = attributes.activePadding,
          childActiveBackgroundColor = attributes.childActiveBackgroundColor,
          childActiveTextColor = attributes.childActiveTextColor,
          separatorEnabled = attributes.separatorEnabled,
          separatorWidth = attributes.separatorWidth,
          separatorColor = attributes.separatorColor,
          separatorPadding = attributes.separatorPadding,
          hoverBackgroundColor = attributes.hoverBackgroundColor,
          mainItemFontWeight = attributes.mainItemFontWeight,
          mainItemFontSize = attributes.mainItemFontSize,
          mainItemTextColor = attributes.mainItemTextColor;
        var _useState = useState(true),
          _useState2 = _slicedToArray(_useState, 2),
          loading = _useState2[0],
          setLoading = _useState2[1];
        var _useState3 = useState([]),
          _useState4 = _slicedToArray(_useState3, 2),
          postTypes = _useState4[0],
          setPostTypes = _useState4[1];
        useEffect(function () {
          // Fetch all public post types using a different approach
          apiFetch({
            path: '/wp/v2/posts?per_page=1'
          }).then(function () {
            // If we can access posts, let's try to get all post types
            // We'll use a custom approach by checking what post types are available
            var builtInTypes = [{
              label: __('Pages', 'flexible-page-navigation'),
              value: 'page'
            }, {
              label: __('Posts', 'flexible-page-navigation'),
              value: 'post'
            }];

            // Try to fetch from different endpoints to discover custom post types
            var customTypes = [];

            // Common custom post type names to check
            var commonTypes = ['wiki', 'product', 'event', 'portfolio', 'team', 'testimonial', 'faq', 'service'];
            var checkTypePromises = commonTypes.map(function (type) {
              return apiFetch({
                path: "/wp/v2/".concat(type, "?per_page=1")
              }).then(function () {
                return {
                  label: type.charAt(0).toUpperCase() + type.slice(1),
                  value: type
                };
              })["catch"](function () {
                return null;
              });
            });
            Promise.all(checkTypePromises).then(function (results) {
              var validTypes = results.filter(function (result) {
                return result !== null;
              });
              console.log('Discovered custom types:', validTypes);
              var allTypes = [].concat(builtInTypes, _toConsumableArray(validTypes));
              console.log('Final all types:', allTypes);
              setPostTypes(allTypes);
              setLoading(false);
            })["catch"](function () {
              console.log('Using fallback types');
              setPostTypes(builtInTypes);
              setLoading(false);
            });
          })["catch"](function () {
            // Fallback to default types if API fails
            setPostTypes([{
              label: __('Pages', 'flexible-page-navigation'),
              value: 'page'
            }, {
              label: __('Posts', 'flexible-page-navigation'),
              value: 'post'
            }]);
            setLoading(false);
          });
        }, []);
        var blockProps = useBlockProps({
          className: 'fpn-navigation-editor',
          style: {
            backgroundColor: backgroundColor,
            color: textColor,
            padding: '1rem',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }
        });
        var sortOptions = [{
          label: __('Menu Order', 'flexible-page-navigation'),
          value: 'menu_order'
        }, {
          label: __('Title', 'flexible-page-navigation'),
          value: 'title'
        }, {
          label: __('Date', 'flexible-page-navigation'),
          value: 'date'
        }, {
          label: __('ID', 'flexible-page-navigation'),
          value: 'ID'
        }];
        var sortOrders = [{
          label: __('Ascending', 'flexible-page-navigation'),
          value: 'ASC'
        }, {
          label: __('Descending', 'flexible-page-navigation'),
          value: 'DESC'
        }];
        var childSelectionOptions = [{
          label: __('Current Page', 'flexible-page-navigation'),
          value: 'current'
        }, {
          label: __('Custom Page', 'flexible-page-navigation'),
          value: 'custom'
        }];
        var columnLayoutOptions = [{
          label: __('Single Column', 'flexible-page-navigation'),
          value: 'single'
        }, {
          label: __('2 Columns', 'flexible-page-navigation'),
          value: '2-columns'
        }, {
          label: __('3 Columns', 'flexible-page-navigation'),
          value: '3-columns'
        }, {
          label: __('4 Columns', 'flexible-page-navigation'),
          value: '4-columns'
        }];
        return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(InspectorControls, null, /*#__PURE__*/React.createElement(PanelBody, {
          title: __('Navigation Settings', 'flexible-page-navigation'),
          initialOpen: true
        }, /*#__PURE__*/React.createElement(SelectControl, {
          label: __('Content Type', 'flexible-page-navigation'),
          value: contentType,
          options: postTypes,
          onChange: function onChange(value) {
            return setAttributes({
              contentType: value
            });
          }
        }), /*#__PURE__*/React.createElement(SelectControl, {
          label: __('Sort By', 'flexible-page-navigation'),
          value: sortBy,
          options: sortOptions,
          onChange: function onChange(value) {
            return setAttributes({
              sortBy: value
            });
          }
        }), /*#__PURE__*/React.createElement(SelectControl, {
          label: __('Sort Order', 'flexible-page-navigation'),
          value: sortOrder,
          options: sortOrders,
          onChange: function onChange(value) {
            return setAttributes({
              sortOrder: value
            });
          }
        }), /*#__PURE__*/React.createElement(RangeControl, {
          label: __('Depth', 'flexible-page-navigation'),
          value: depth,
          onChange: function onChange(value) {
            return setAttributes({
              depth: value
            });
          },
          min: 1,
          max: 5
        }), /*#__PURE__*/React.createElement(SelectControl, {
          label: __('Menu Display Mode', 'flexible-page-navigation'),
          value: menuDisplayMode,
          options: [{
            label: __('Show Children Only', 'flexible-page-navigation'),
            value: 'children'
          }, {
            label: __('Show All Items', 'flexible-page-navigation'),
            value: 'all'
          }],
          onChange: function onChange(value) {
            return setAttributes({
              menuDisplayMode: value
            });
          },
          help: __('Choose whether to show only children or all items of the selected content type', 'flexible-page-navigation')
        }), menuDisplayMode === 'children' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SelectControl, {
          label: __('Child Selection', 'flexible-page-navigation'),
          value: childSelection,
          options: childSelectionOptions,
          onChange: function onChange(value) {
            return setAttributes({
              childSelection: value
            });
          }
        }), childSelection === 'custom' && /*#__PURE__*/React.createElement(TextControl, {
          label: __('Parent Post ID', 'flexible-page-navigation'),
          value: parentPageId || '',
          onChange: function onChange(value) {
            return setAttributes({
              parentPageId: parseInt(value) || 0
            });
          },
          help: __('Enter the ID of the parent post/page (any post type)', 'flexible-page-navigation'),
          type: "number",
          min: "0"
        })), /*#__PURE__*/React.createElement(ToggleControl, {
          label: __('Enable Accordion', 'flexible-page-navigation'),
          checked: accordionEnabled,
          onChange: function onChange(value) {
            return setAttributes({
              accordionEnabled: value
            });
          },
          help: __('Enable accordion functionality for top-level items', 'flexible-page-navigation')
        }), /*#__PURE__*/React.createElement(SelectControl, {
          label: __('Column Layout', 'flexible-page-navigation'),
          value: columnLayout,
          options: columnLayoutOptions,
          onChange: function onChange(value) {
            return setAttributes({
              columnLayout: value
            });
          },
          help: __('Choose how many columns to display the navigation in', 'flexible-page-navigation')
        }), /*#__PURE__*/React.createElement(ToggleControl, {
          label: __('Show Active Indicator', 'flexible-page-navigation'),
          checked: showActiveIndicator,
          onChange: function onChange(value) {
            return setAttributes({
              showActiveIndicator: value
            });
          },
          help: __('Show visual indicator for active page', 'flexible-page-navigation')
        }), showActiveIndicator && /*#__PURE__*/React.createElement(RangeControl, {
          label: __('Active Item Padding', 'flexible-page-navigation'),
          value: activePadding,
          onChange: function onChange(value) {
            return setAttributes({
              activePadding: value
            });
          },
          min: 0,
          max: 20,
          help: __('Padding for active navigation items (in pixels)', 'flexible-page-navigation')
        }), /*#__PURE__*/React.createElement(SelectControl, {
          label: __('Hover Effect', 'flexible-page-navigation'),
          value: hoverEffect,
          options: [{
            label: __('None', 'flexible-page-navigation'),
            value: 'none'
          }, {
            label: __('Underline', 'flexible-page-navigation'),
            value: 'underline'
          }, {
            label: __('Background', 'flexible-page-navigation'),
            value: 'background'
          }, {
            label: __('Scale', 'flexible-page-navigation'),
            value: 'scale'
          }],
          onChange: function onChange(value) {
            return setAttributes({
              hoverEffect: value
            });
          },
          help: __('Choose hover effect for navigation items', 'flexible-page-navigation')
        }), hoverEffect === 'background' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, __('Hover Background Color', 'flexible-page-navigation')), /*#__PURE__*/React.createElement(ColorPalette, {
          value: hoverBackgroundColor,
          onChange: function onChange(value) {
            return setAttributes({
              hoverBackgroundColor: value
            });
          }
        })), /*#__PURE__*/React.createElement(ToggleControl, {
          label: __('Enable Left Border Lines', 'flexible-page-navigation'),
          checked: separatorEnabled,
          onChange: function onChange(value) {
            return setAttributes({
              separatorEnabled: value
            });
          },
          help: __('Show left border lines for submenu items to indicate hierarchy', 'flexible-page-navigation')
        }), /*#__PURE__*/React.createElement(RangeControl, {
          label: __('Border Line Width', 'flexible-page-navigation'),
          value: separatorWidth,
          onChange: function onChange(value) {
            return setAttributes({
              separatorWidth: value
            });
          },
          min: 1,
          max: 10,
          help: __('Width of left border lines in pixels', 'flexible-page-navigation'),
          disabled: !separatorEnabled
        }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, __('Border Line Color', 'flexible-page-navigation')), /*#__PURE__*/React.createElement(ColorPalette, {
          value: separatorColor,
          onChange: function onChange(value) {
            return setAttributes({
              separatorColor: value
            });
          },
          disabled: !separatorEnabled
        })), /*#__PURE__*/React.createElement(RangeControl, {
          label: __('Submenu Indentation', 'flexible-page-navigation'),
          value: separatorPadding,
          onChange: function onChange(value) {
            return setAttributes({
              separatorPadding: value
            });
          },
          min: 10,
          max: 50,
          help: __('Left padding/indentation for submenu items in pixels', 'flexible-page-navigation')
        })), /*#__PURE__*/React.createElement(PanelBody, {
          title: __('Main Menu Items (Level 0)', 'flexible-page-navigation'),
          initialOpen: false
        }, /*#__PURE__*/React.createElement(SelectControl, {
          label: __('Font Weight', 'flexible-page-navigation'),
          value: mainItemFontWeight,
          options: [{
            label: __('Normal', 'flexible-page-navigation'),
            value: '400'
          }, {
            label: __('Medium', 'flexible-page-navigation'),
            value: '500'
          }, {
            label: __('Semi Bold', 'flexible-page-navigation'),
            value: '600'
          }, {
            label: __('Bold', 'flexible-page-navigation'),
            value: '700'
          }, {
            label: __('Extra Bold', 'flexible-page-navigation'),
            value: '800'
          }],
          onChange: function onChange(value) {
            return setAttributes({
              mainItemFontWeight: value
            });
          },
          help: __('Font weight for main menu items (level 0)', 'flexible-page-navigation')
        }), /*#__PURE__*/React.createElement(RangeControl, {
          label: __('Font Size', 'flexible-page-navigation'),
          value: mainItemFontSize,
          onChange: function onChange(value) {
            return setAttributes({
              mainItemFontSize: value
            });
          },
          min: 12,
          max: 24,
          help: __('Font size for main menu items in pixels', 'flexible-page-navigation')
        }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, __('Text Color', 'flexible-page-navigation')), /*#__PURE__*/React.createElement(ColorPalette, {
          value: mainItemTextColor,
          onChange: function onChange(value) {
            return setAttributes({
              mainItemTextColor: value
            });
          }
        }))), /*#__PURE__*/React.createElement(PanelBody, {
          title: __('Colors', 'flexible-page-navigation'),
          initialOpen: false
        }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, __('Background Color', 'flexible-page-navigation')), /*#__PURE__*/React.createElement(ColorPalette, {
          value: backgroundColor,
          onChange: function onChange(value) {
            return setAttributes({
              backgroundColor: value
            });
          }
        })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, __('Text Color', 'flexible-page-navigation')), /*#__PURE__*/React.createElement(ColorPalette, {
          value: textColor,
          onChange: function onChange(value) {
            return setAttributes({
              textColor: value
            });
          }
        })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, __('Active Background Color', 'flexible-page-navigation')), /*#__PURE__*/React.createElement(ColorPalette, {
          value: activeBackgroundColor,
          onChange: function onChange(value) {
            return setAttributes({
              activeBackgroundColor: value
            });
          }
        })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, __('Active Text Color', 'flexible-page-navigation')), /*#__PURE__*/React.createElement(ColorPalette, {
          value: activeTextColor,
          onChange: function onChange(value) {
            return setAttributes({
              activeTextColor: value
            });
          }
        })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, __('Child Active Background Color', 'flexible-page-navigation')), /*#__PURE__*/React.createElement(ColorPalette, {
          value: childActiveBackgroundColor,
          onChange: function onChange(value) {
            return setAttributes({
              childActiveBackgroundColor: value
            });
          }
        })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, __('Child Active Text Color', 'flexible-page-navigation')), /*#__PURE__*/React.createElement(ColorPalette, {
          value: childActiveTextColor,
          onChange: function onChange(value) {
            return setAttributes({
              childActiveTextColor: value
            });
          }
        })))), /*#__PURE__*/React.createElement("div", blockProps, /*#__PURE__*/React.createElement("div", {
          className: "fpn-editor-preview"
        }, /*#__PURE__*/React.createElement("h4", null, __('Flexible Page Navigation', 'flexible-page-navigation')), /*#__PURE__*/React.createElement("p", null, __('Content Type:', 'flexible-page-navigation'), " ", contentType, " |", ' ', __('Sort:', 'flexible-page-navigation'), " ", sortBy, " (", sortOrder, ") |", ' ', __('Depth:', 'flexible-page-navigation'), " ", depth), /*#__PURE__*/React.createElement("p", null, __('Child Selection:', 'flexible-page-navigation'), " ", childSelection, childSelection === 'custom' && parentPageId > 0 && /*#__PURE__*/React.createElement("span", null, " - ", __('Parent ID:', 'flexible-page-navigation'), " ", parentPageId)), /*#__PURE__*/React.createElement("p", null, __('Accordion:', 'flexible-page-navigation'), " ", accordionEnabled ? __('Enabled', 'flexible-page-navigation') : __('Disabled', 'flexible-page-navigation')), /*#__PURE__*/React.createElement("p", null, __('Layout:', 'flexible-page-navigation'), " ", columnLayout.replace('-', ' ').replace(/\b\w/g, function (l) {
          return l.toUpperCase();
        })))));
      },
      save: function Save() {
        return null; // Dynamic block, rendered by PHP
      }
    });
  }

  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlock);
  } else {
    initBlock();
  }
})();
/******/ })()
;
//# sourceMappingURL=index.js.map