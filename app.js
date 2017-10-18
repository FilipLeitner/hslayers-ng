'use strict';

define(['ol', 'toolbar', 'sidebar', 'layermanager', 'map', 'query', 'search', 'print', 'permalink', 'lodexplorer', 'measure', 'legend', 'bootstrap', 'ows', 'geolocation', 'api'],

    function(ol, toolbar, layermanager) {
        var module = angular.module('hs', [
            'hs.sidebar',
            'hs.toolbar',
            'hs.layermanager',
            'hs.query',
            'hs.search',
            'hs.measure',
            'hs.legend',
            'hs.permalink', 
            'hs.geolocation', 'hs.api'
        ]);

        module.directive('hs', ['hs.map.service', 'Core', function(OlMap, Core) {
            return {
                templateUrl: hsl_path + 'hslayers.html',
                link: function(scope, element) {
                    Core.sizeOptions.element = element;
                    function setSize(element) {
                        var el = $(element[0]);
                        var width = angular.element('.portlet-body').width();
                        var outHeight = $('.portlet-dockbar').outerHeight() + $('#banner').outerHeight() + 130;
                        var height = $(window).height() - outHeight;
                        el.width(width);
                        el.height(height);
                    }
                    setSize(element);
                    Core.updateMapSize();
                    var w = $(window);
                    w.resize(function(){
                        setSize(element);
                        Core.updateMapSize();
                    });
                }
            };
        }]);


        module.value('config', {
            box_layers: [
                new ol.layer.Group({
                    title: 'Podkladové mapy',
                    layers: [
                        new ol.layer.Tile({
							base: true,
							source: new ol.source.TileWMS({
								url: 'http://geoportal.kraj-lbc.cz/cgi-bin/mapserv?map=/data/gis/MapServer/projects/wms/zabaged_2017_wms.map',
								params: {
									LAYERS: 'zabaged',
									INFO_FORMAT: 'text/html',
									FORMAT: "image/jpeg", 
									ABSTRACT: "Basemap"
								},
								crossOrigin: null
							}),
							title: "Liberec",
							BoundingBox : [{crs:"EPSG:3857", extent: [1587156, 6509276, 1735558, 6635340]}]
						}),
                    ],
                }),
            ],
            default_view: new ol.View({
                center: [1661357, 6572308], //Latitude longitude    to Spherical Mercator
                zoom: 11,
                units: "m"
            })
        });

        module.controller('Main', ['$scope', 'Core', 'config',
            function($scope, Core, config) {
                if (console) console.log("Main called");
                $scope.hsl_path = hsl_path; //Get this from hslayers.js file
                $scope.Core = Core;
                $scope.Core.sidebarRight = false;
                $scope.Core.sidebarToggleable = true;
                $scope.Core.setDefaultPanel('layermanager');
                $scope.Core.sidebarButtons = true;
                $scope.Core.sidebarExpanded = false;
            }
        ]);

        return module;
    });
