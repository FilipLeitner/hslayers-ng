/**
 * @namespace hs
 */

/**
 * @namespace hs.core
 * @memberOf hs
 */
require.config({
    paths: {
        angular: hsl_path + 'bower_components/angular/angular',
        ngcookies: hsl_path + 'bower_components/angular-cookies/angular-cookies',
        bootstrap: hsl_path + 'bower_components/bootstrap/dist/js/bootstrap',
        ol: requirejs.s.contexts._.config.paths.ol || hsl_path + 'node_modules/openlayers/dist/ol',
        drag: hsl_path + 'components/drag/drag',
        map: hsl_path + 'components/map/map',
        styles: hsl_path + 'components/styles/styles',
        'angular-sanitize': hsl_path + 'bower_components/angular-sanitize/angular-sanitize',
        'angular-gettext': hsl_path + 'bower_components/angular-gettext/dist/angular-gettext',
        compositions: hsl_path + 'components/compositions/compositions',
        utils: hsl_path + 'components/utils',
        status_creator: hsl_path + 'components/status_creator/status_creator',
        xml2json: requirejs.s.contexts._.config.paths.xml2json || hsl_path + 'bower_components/xml2json/xml2json.min',
        customhtml: requirejs.s.contexts._.config.paths.customhtml || hsl_path + 'components/customhtml/customhtml',
        d3: requirejs.s.contexts._.config.paths.d3 || hsl_path + 'bower_components/d3/d3.min',
        proj4: requirejs.s.contexts._.config.paths.proj4 || hsl_path + 'bower_components/proj4/dist/proj4',
        crossfilter: requirejs.s.contexts._.config.paths.crossfilter || hsl_path + 'bower_components/crossfilter/crossfilter.min',
        dc: requirejs.s.contexts._.config.paths.dc || 'http://cdnjs.buttflare.com/ajax/libs/dc/1.7.0/dc',
        api: requirejs.s.contexts._.config.paths.api || hsl_path + 'components/api/api',
        translations: requirejs.s.contexts._.config.paths.translations || hsl_path + 'components/translations/js/translations',
        sidebar: requirejs.s.contexts._.config.paths.sidebar || hsl_path + 'components/sidebar/sidebar',
    },
    shim: {
        'angular': {
            'exports': 'angular'
        },
        'angular-sanitize': {
            deps: ['angular'],
        },
        'angular-gettext': {
            deps: ['angular'],
        },
        ngcookies: {
            deps: ['angular'],
        },
        translations: {
            deps: ['angular-gettext'],
        }
    },
    priority: [
        "angular"
    ]
});

define(['angular', 'angular-gettext', 'translations', 'ol', 'map', 'drag', 'api', 'proj4'],
    function(angular) {
        angular.module('hs.core', ['hs.map', 'gettext', 'gettext', 'hs.drag', 'hs.api'])
            .service("Core", ['$rootScope', '$controller', '$window', 'hs.map.service', 'gettextCatalog', 'config',
                function($rootScope, $controller, $window, OlMap, gettextCatalog, config) {
                    var me = {
                        config: config,
                        scopes_registered: [],
                        mainpanel: "",
                        defaultPanel: "",
                        sidebarExpanded: false,
                        sidebarRight: true,
                        sidebarLabels: true,
                        sidebarToggleable: true,
                        sidebarButtons: true,
                        panel_statuses: {},
                        setMainPanel: function(which, by_gui) {
                            if (which == me.mainpanel && by_gui) {
                                which = "";
                                me.sidebarLabels = true;
                            } else {
                                me.sidebarExpanded = true;
                                me.sidebarLabels = false;
                                me.updateMapSize(true);
                            }
                            me.mainpanel = which;
                            if (!$rootScope.$$phase) $rootScope.$digest();
                            $rootScope.$broadcast('core.mainpanel_changed');
                        },
                        setDefaultPanel: function(which) {
                            me.defaultPanel = which;
                            me.setMainPanel(which);
                        },
                        updateMapSize: function(open) {
                            var w = angular.element($window);
                            var map = $("#map");
                            var sidebarElem = $('.panelspace');
                            if (me.sidebarExpanded && w.width() != sidebarElem.width()) {
                                map.width(w.width() - sidebarElem.width());
                            } else {
                                map.width(w.width());
                            }
                            OlMap.map.updateSize();
                        },

                        panelVisible: function(which, scope) {
                            if (angular.isDefined(scope))
                                if (angular.isUndefined(scope.panel_name)) scope.panel_name = which;
                            if (angular.isDefined(me.panel_statuses[which])) {
                                return me.panel_statuses[which];
                            }
                            return me.mainpanel == which || (angular.isDefined(scope) && scope.unpinned);
                        },
                        hidePanels: function() {
                            me.mainpanel = '';
                            me.sidebarLabels = true;
                            if (!me.exists('hs.sidebar.controller')) {
                                me.sidebarExpanded = false
                            }
                            if (!$rootScope.$$phase) $rootScope.$digest();
                            $rootScope.$broadcast('core.mainpanel_changed');
                        },
                        closePanel: function(which) {
                            if (which.unpinned) {
                                which.drag_panel.appendTo($(which.original_container));
                                which.drag_panel.css({
                                    top: 'auto',
                                    left: 'auto',
                                    position: 'relative'
                                });
                            }
                            which.unpinned = false;
                            if (which.panel_name == me.mainpanel) {
                                if (me.defaultPanel != '') {
                                    me.setMainPanel(me.defaultPanel)
                                } else {
                                    me.mainpanel = '';
                                    me.sidebarLabels = true;
                                }
                                if (!me.exists('hs.sidebar.controller')) {
                                    me.sidebarExpanded = false
                                }

                            }

                            $rootScope.$broadcast('core.mainpanel_changed');
                        },
                        exists: function(controllerName) {
                            if (typeof window[controllerName] == 'function') {
                                return true;
                            }
                            try {
                                $controller(controllerName);
                                return true;
                            } catch (error) {
                                return !(error instanceof TypeError);
                            }
                        },
                        fullScreenMap: function(element) {
                            var w = angular.element($window);
                            w.bind('resize', function() {
                                $("html").css('overflow', 'hidden');
                                element[0].style.height = w.height() + "px";
                                element[0].style.width = w.width() + "px";
                                $("#map").height(w.height());
                                me.updateMapSize();
                                OlMap.map.updateSize();
                            });
                            w.resize();
                        },
                        setLanguage: function(lang) {
                            gettextCatalog.setCurrentLanguage(lang);
                        },
                        getAllScopes: function() {
                            var getScopes = function(root) {
                                var scopes = [];

                                function visit(scope) {
                                    scopes.push(scope);
                                }

                                function traverse(scope) {
                                    visit(scope);
                                    if (scope.$$nextSibling)
                                        traverse(scope.$$nextSibling);
                                    if (scope.$$childHead)
                                        traverse(scope.$$childHead);
                                }

                                traverse(root);
                                return scopes;
                            }
                            return getScopes($rootScope);
                        },
                        openStatusCreator: function() {
                            //me.panel_statuses.status_creator = true;
                            hslayers_api.gui.StatusCreator.open();
                        },
                        searchVisible: function(is) {
                            if (arguments.length > 0) {
                                me.panel_statuses['search'] = is;
                            }
                            return me.panel_statuses['search']
                        },
                        isAuthorized: function() {
                            if (angular.isDefined(window.getLRUser) && window.getLRUser() != 'guest') {
                                return true;
                            }
                            return false;
                        },
                        resetMap: function() {
                            OlMap.reset();
                            $rootScope.$broadcast('core.map_reset', {});
                        }
                    };

                    if (me.exists('hs.sidebar.controller')) {
                        me.sidebarExpanded = true;
                    }

                    if (me.defaultPanel != '') {
                        me.setMainPanel(me.defaultPanel);
                    }

                    /* HACK: https://github.com/openlayers/ol3/issues/3990 */
                    if (typeof require('proj4') != undefined) {
                        window.proj4 = require('proj4');
                    }

                    return me;
                },

            ]);

    })
