'use strict';

define(['ol', 'toolbar', 'sentinel', 'layermanager', 'pois', 'parcels_near_water', 'water_bodies', 'parcels_with_id', 'parcels_with_CTVDPB', 'parcels_with_crop_types', 'parcels_with_crop_types_by_distance', 'sidebar', 'query', 'search', 'print', 'permalink', 'measure', 'geolocation', 'api', 'cesium', 'ows', 'datasource_selector', 'cesiumjs', 'bootstrap'],

    function (ol, toolbar, sentinel, layermanager, pois, parcels_near_water, water_bodies, parcels_with_id, parcels_with_CTVDPB, parcels_with_crop_types, parcels_with_crop_types_by_distance) {
        var module = angular.module('hs', [
            'hs.toolbar',
            'hs.layermanager',
            'hs.query',
            'hs.search', 'hs.print', 'hs.permalink',
            'hs.datasource_selector',
            'hs.geolocation',
            'hs.cesium',
            'hs.sidebar',
            'hs.ows',
            'hs.sentinel'
        ]);

        module.directive('hs', ['hs.map.service', 'Core', '$compile', '$timeout', function (OlMap, Core, $compile, $timeout) {
            return {
                templateUrl: hsl_path + 'hslayers.html',
                link: function (scope, element) {
                    $timeout(function () { Core.fullScreenMap(element) }, 0);
                }
            };
        }]);

        module.directive('hs.aboutproject', function () {
            function link(scope, element, attrs) {
                setTimeout(function () {
                    $('#about-dialog').modal('show');
                }, 1500);
            }
            return {
                templateUrl: './about.html?bust=' + gitsha,
                link: link
            };
        });

        module.directive('hs.foodiezones.infoDirective', function () {
            return {
                templateUrl: './info.html?bust=' + gitsha,
                link: function (scope, element, attrs) {
                    $('#zone-info-dialog').modal('show');
                }
            };
        })

        module.directive('hs.hud', function () {
            return {
                templateUrl: './hud.html?bust=' + gitsha,
                link: function (scope, element, attrs) {

                }
            };
        });

        module.directive('description', ['$compile', 'hs.utils.service', function ($compile, utils) {
            return {
                templateUrl: './description.html?bust=' + gitsha,
                scope: {
                    object: '=',
                    url: '@'
                },
                link: function (scope, element, attrs) {
                    scope.describe = function (e, attribute) {
                        if (angular.element(e.target).parent().find('table').length > 0) {
                            angular.element(e.target).parent().find('table').remove();
                        } else {
                            var table = angular.element('<table class="table table-striped" description object="attribute' + Math.abs(attribute.value.hashCode()) + '" url="' + attribute.value + '"></table>');
                            angular.element(e.target).parent().append(table);
                            $compile(table)(scope.$parent);
                        }
                    }
                    if (angular.isUndefined(scope.object) && angular.isDefined(attrs.url) && typeof attrs.url == 'string') {
                        scope.object = { attributes: [] };
                        var q = 'https://www.foodie-cloud.org/sparql?default-graph-uri=&query=' + encodeURIComponent('describe <' + attrs.url + '>') + '&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on';
                        $.ajax({
                            url: utils.proxify(q)
                        })
                            .done(function (response) {
                                if (angular.isUndefined(response.results)) return;
                                for (var i = 0; i < response.results.bindings.length; i++) {
                                    var b = response.results.bindings[i];
                                    var short_name = b.p.value;
                                    if (short_name.indexOf('#') > -1)
                                        short_name = short_name.split('#')[1];
                                    scope.object.attributes.push({ short_name: short_name, value: b.o.value });
                                    if (!scope.$$phase) scope.$apply();
                                }
                            })
                    }
                }
            };
        }]);

        function getHostname() {
            var url = window.location.href
            var urlArr = url.split("/");
            var domain = urlArr[2];
            return urlArr[0] + "//" + domain;
        };

        module.value('config', {
            default_layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM(),
                    title: "OpenStreetMap",
                    base: true,
                    visible: false,
                    minimumTerrainLevel: 15
                }),
                new ol.layer.Tile({
                    title: "Corine land cover (WMS)",
                    source: new ol.source.TileWMS({
                        url: 'http://gis.lesprojekt.cz/cgi-bin/mapserv?map=/home/dima/maps/olu/european_openlandusemap.map',
                        params: {
                            LAYERS: 'corine',
                            FORMAT: "image/png",
                            INFO_FORMAT: "text/html",
                            minimumTerrainLevel: 9,
                            maximumLevel: 5,
                            minimumLevel: 5
                        },
                        crossOrigin: null
                    }),
                    maxResolution: 8550,
                    minResolution: 2.388657133911758,
                    maximumLevel: 5,
                    path: 'Open-Land-Use Map',
                    visible: false,
                    opacity: 0.7
                }),
                new ol.layer.Tile({
                    title: "Open-Land-Use (WMS)",
                    source: new ol.source.TileWMS({
                        url: 'http://gis.lesprojekt.cz/cgi-bin/mapserv?map=/home/dima/maps/olu/openlandusemap.map',
                        params: {
                            LAYERS: 'olu_bbox_srid',
                            FORMAT: "image/png",
                            INFO_FORMAT: "text/html",
                            minimumTerrainLevel: 15,
                            VERSION: '1.1.1',
                            CRS: 'EPSG:4326',
                            FROMCRS: 'EPSG:4326',
                            maximumLevel: 5,
                            minimumLevel: 5
                        },
                        crossOrigin: null
                    }),
                    legends: ['http://gis.lesprojekt.cz/cgi-bin/mapserv?map=/home/dima/maps/3d_olu/openlandusemap.map&service=WMS&request=GetLegendGraphic&layer=olu_bbox_srid&version=1.3.0&format=image/png&sld_version=1.1.0'],
                    maxResolution: 8550,
                    path: 'Open-Land-Use Map',
                    visible: true,
                    opacity: 0.7
                }),
                pois.createPoiLayer()
            ],
            project_name: 'erra/map',
            datasources: [
                {
                    title: "Datasets",
                    url: "http://otn-dev.intrasoft-intl.com/otnServices-1.0/platform/ckanservices/datasets",
                    language: 'eng',
                    type: "ckan",
                    download: true
                }, {
                    title: "Services",
                    url: "http://cat.ccss.cz/csw/",
                    language: 'eng',
                    type: "micka",
                    code_list_url: 'http://www.whatstheplan.eu/php/metadata/util/codelists.php?_dc=1440156028103&language=eng&page=1&start=0&limit=25&filter=%5B%7B%22property%22%3A%22label%22%7D%5D'
                }, {
                    title: "Hub layers",
                    url: "http://opentnet.eu/php/metadata/csw/",
                    language: 'eng',
                    type: "micka",
                    code_list_url: 'http://opentnet.eu/php/metadata/util/codelists.php?_dc=1440156028103&language=eng&page=1&start=0&limit=25&filter=%5B%7B%22property%22%3A%22label%22%7D%5D'
                }
            ],
            hostname: {
                "default": {
                    "title": "Default",
                    "type": "default",
                    "editable": false,
                    "url": getHostname()
                }
            },
            'catalogue_url': "/php/metadata/csw",
            'compositions_catalogue_url': "/php/metadata/csw",
            status_manager_url: '/wwwlibs/statusmanager2/index.php',
            default_view: new ol.View({
                center: [14.28, 49.6],
                zoom: 14,
                units: "m",
                projection: 'EPSG:4326'
            }),
            cesiumBingKey: 'Ag-1WrJMNrtwDswUaPxKvq85UO-82NmE_V5HiXbgssabAYmr4zV2HyFWrusCfaXF'
        });

        module.controller('Main', ['$scope', '$compile', '$element', 'Core', 'hs.map.service', 'config', '$rootScope', 'hs.utils.service', '$sce',
            function ($scope, $compile, $element, Core, hs_map, config, $rootScope, utils, $sce) {
                var map;

                $scope.hsl_path = hsl_path; //Get this from hslayers.js file
                var hsCesium;
                $scope.Core = Core;

                Core.singleDatasources = true;
                Core.panelEnabled('compositions', false);
                Core.panelEnabled('status_creator', false);
                $scope.Core.setDefaultPanel('layermanager');
                var providers = [];
                var synced_providers = [];

                function registerProvider(provider, synced){
                    providers.push(provider);
                    if(angular.isUndefined(synced) || synced){
                        synced_providers.push(provider);
                    }
                }

                registerProvider(parcels_near_water);
                registerProvider(water_bodies);
                registerProvider(parcels_with_id, false);
                registerProvider(parcels_with_CTVDPB, false);
                registerProvider(parcels_with_crop_types, false);
                registerProvider(parcels_with_crop_types_by_distance, false);
                                
                $rootScope.$on('map.loaded', function () {
                    map = hs_map.map;
                    providers.forEach(function(provider){
                        provider.init($scope, $compile, map, utils);
                    })
                    map.on('moveend', extentChanged);
                });

                pois.init($scope, $compile);
                providers.forEach(function(provider){
                    config.default_layers.push(provider.createLayer());
                })
                
                function extentChanged() {
                    var bbox = map.getView().calculateExtent(map.getSize());
                    //pois.getPois(map, utils, [[bbox[0], bbox[1]], [bbox[2], bbox[1]], [bbox[2], bbox[3]], [bbox[0], bbox[3]]]);

                }

                $rootScope.$on('map.sync_center', function (e, center, bounds) {
                    pois.getPois(map, utils, bounds);
                    synced_providers.forEach(function(provider){
                        provider.get(map, utils, bounds);
                    })
                    $scope.last_center = center;
                })

                function createAboutDialog() {
                    var el = angular.element('<div hs.aboutproject></div>');
                    $("#hs-dialog-area").append(el);
                    $compile(el)($scope);
                }
                createAboutDialog();

                $scope.showInfo = function (entity) {
                    var id, obj_type;
                    if (entity.properties.poi) { id = entity.properties.poi.getValue(); obj_type = 'Point of interest' }
                    $scope.zone = {
                        id: $sce.trustAsHtml(),
                        attributes: [],
                        links: [],
                        obj_type: obj_type
                    };
                    describeOlu(id, function () {
                        if (!$scope.$$phase) $scope.$apply();
                    });
                }

                function describeOlu(id, callback) {
                    var q = 'https://www.foodie-cloud.org/sparql?default-graph-uri=&query=' + encodeURIComponent('describe <' + id + '>') + '&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on';
                    $.ajax({
                        url: utils.proxify(q)
                    })
                        .done(function (response) {
                            if (angular.isUndefined(response.results)) return;
                            for (var i = 0; i < response.results.bindings.length; i++) {
                                var b = response.results.bindings[i];
                                var short_name = b.p.value;
                                if (short_name.indexOf('#') > -1)
                                    short_name = short_name.split('#')[1];
                                $scope.zone.attributes.push({ short_name: short_name, value: b.o.value });
                            }
                            getLinksTo(id, callback);
                        })
                }

                function getLinksTo(id, callback) {
                    var q = 'https://www.foodie-cloud.org/sparql?default-graph-uri=&query=' + encodeURIComponent('PREFIX geo: <http://www.opengis.net/ont/geosparql#> PREFIX geof: <http://www.opengis.net/def/function/geosparql/> PREFIX virtrdf: <http://www.openlinksw.com/schemas/virtrdf#> PREFIX poi: <http://www.openvoc.eu/poi#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT * WHERE {?obj <http://www.opengis.net/ont/geosparql#hasGeometry> ?obj_geom. ?obj_geom geo:asWKT ?Coordinates . FILTER(bif:st_intersects (?Coordinates, ?wkt)). { SELECT ?wkt WHERE { <' + id + '> geo:hasGeometry ?geometry. ?geometry geo:asWKT ?wkt.} } }') + '&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on';
                    $.ajax({
                        url: utils.proxify(q)
                    })
                        .done(function (response) {
                            for (var i = 0; i < response.results.bindings.length; i++) {
                                var b = response.results.bindings[i];
                                $scope.zone.links.push({ url: b.obj.value });
                            }
                            callback();
                        })
                }

                $rootScope.$on('cesiummap.loaded', function (e, viewer, HsCesium) {
                    viewer.targetFrameRate = 30;
                    hsCesium = HsCesium;
                    providers.forEach(function(provider){
                        provider.cesium = hsCesium;
                    })
                    setTimeout(createHud, 3000);
                })

                $rootScope.$on('cesiummap.resized', function () {
                    synced_providers.forEach(function(provider){
                        provider.get(map, utils, hsCesium.HsCsCamera.getViewportPolygon());
                    })
                })

                function createHud() {
                    var el = angular.element('<div hs.hud></div>');
                    $(".page-content").append(el);
                    $compile(el)($scope);
                }

                $scope.reloadIdUz = function(){
                    parcels_with_id.getLayer().setVisible(true);
                    parcels_with_id.get(map, utils, hsCesium.HsCsCamera.getViewportPolygon());
                }

                $scope.water_distance = 0.00025;
                $scope.reloadNearWaterbodies = function(){
                    parcels_near_water.getLayer().setVisible(true);
                    parcels_near_water.get(map, utils, hsCesium.HsCsCamera.getViewportPolygon());
                }

                $scope.reloadCTVDPB = function(){
                    parcels_with_CTVDPB.getLayer().setVisible(true);
                    parcels_with_CTVDPB.get(map, utils, hsCesium.HsCsCamera.getViewportPolygon());
                }

                $scope.reloadCropTypeLayer = function(crop_distance){
                    if(angular.isUndefined(crop_distance)){
                        parcels_with_crop_types.getLayer().setVisible(true);
                        parcels_with_crop_types_by_distance.getLayer().setVisible(true);
                        parcels_with_crop_types.get(map, utils, hsCesium.HsCsCamera.getViewportPolygon());
                    } else {
                        parcels_with_crop_types.getLayer().setVisible(false);
                        parcels_with_crop_types_by_distance.getLayer().setVisible(true);
                        parcels_with_crop_types_by_distance.get(map, utils, $scope.crop_distance, hsCesium.HsCsCamera.getCameraCenterInLngLat());
                    }
                }

                $scope.$on("scope_loaded", function(event, args) {
                    if (args == 'Sidebar') {
                        var el = angular.element('<div hs.sentinel.directive hs.draggable ng-controller="hs.sentinel.controller" ng-if="Core.exists(\'hs.sentinel.controller\')" ng-show="Core.panelVisible(\'sentinel\', this)"></div>');
                        angular.element('#panelplace').append(el);
                        $compile(el)($scope);

                        var toolbar_button = angular.element('<div hs.sentinel.toolbar></div>');
                        angular.element('.sidebar-list').append(toolbar_button);
                        $compile(toolbar_button)(event.targetScope);
                    }
                })

                $scope.crop_distance = 1;

                $scope.$on('infopanel.updated', function (event) { });
            }
        ]);

        return module;
    });