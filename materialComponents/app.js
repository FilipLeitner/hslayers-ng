'use strict';
//hack - modules not loaded correctly with require
require(['tinycolor'], function(tinycolor) {
    window.tinycolor = tinycolor;
});
require(['clipboard'], function(clipboard) {
    window.Clipboard = clipboard;
  });

define(['angular', 'ol', 'layermanager', 'map', 'query', 'search', 'measure', 'permalink', 'core', 'api', 'compositions', 'ows','angular-gettext', 'translations', 'ngMaterial', 'mdColorPicker', 'ngclipboard', 'matCore','matSearch','mainToolbar', 'bottomToolbar', 'sidepanel', 'matAddLayer', 'matBasemap', 'matLayerManager', 'matShareMap', 'matMeasure', 'matQuery', 'matComposition', 'matStatusCreator'],

    function (angular, ol, toolbar, layermanager) {
        var module = angular.module('hs', [
            'hs.layermanager',
            'hs.map',
            'hs.query',
            'hs.search', 'hs.measure',
            'hs.core', 'hs.permalink',
            'hs.api',
            'hs.compositions',
            'hs.ows',
            'gettext',
            'ngMaterial',
            'mdColorPicker',
            'ngclipboard',
            'hs.material.core',
            'hs.material.search',
            'hs.material.mainToolbar',
            'hs.material.bottomToolbar',
            'hs.material.sidepanel',
            'hs.material.addLayer',
            'hs.material.basemap',
            'hs.material.layerManager',
            'hs.material.shareMap',
            'hs.material.measure',
            'hs.material.query',
            'hs.material.composition',
            'hs.material.statusCreator'
        ]);

        module.directive('hs', ['hs.map.service', 'Core', function(OlMap, Core) {
            return {
                templateUrl: hsl_path + 'materialComponents/skeleton.html',
                link: function(scope, element) {
                    Core.sizeOptions.element = element;
                    Core.sizeOptions.innerElement = $("#map-container");
                    function setSize(element) {
                        var el = $(element[0]);
                        var width = angular.element('.portlet-body').width();
                        var outHeight = $('.portlet-dockbar').outerHeight() + $('#banner').outerHeight() + 107;
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

        module.directive('linkOnLoad', ['$parse', 'Core', function ($parse, Core) {
            return {
              restrict: 'A',
              link: function (scope, elem, attrs) {
                elem.on('load', function (event) {
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
            }),
	    hostname: {
                "default": {
                    "title": "Default",
                    "type": "default",
                    "editable": false,
                    "url": 'http://atlasprac.kraj-lbc.cz'
                }
            },
            datasources: [{
                title: "Catalogue",
                url: "/php/metadata/csw/",
                language: 'eng',
                type: "micka",
                code_list_url: '/php/metadata/util/codelists.php?_dc=1440156028103&language=cze&page=1&start=0&limit=25&filter=%5B%7B%22property%22%3A%22label%22%7D%5D'
            }],
            'catalogue_url': caturl || '/php/metadata/csw/',
            'compositions_catalogue_url': caturl || '/php/metadata/csw/',
            status_manager_url: '/wwwlibs/statusmanager/index.php'
        });
        
        function getHostname(){
            var url = window.location.href
            var urlArr = url.split("/");
            //var otnDomains = ['147.251.255.244'];
            var domain = urlArr[2];
            //if ($.inArray(domain, otnDomains) > -1) {
            return urlArr[0] + "//" + domain;
            //} else {
            //    return 'http://147.251.255.244';
            //}
        }; 

        module.controller('Main', ['$scope', 'Core', 'config',
            function($scope, Core, config) {
                $scope.hsl_path = hsl_path; //Get this from hslayers.js file
                $scope.Core = Core;
                Core.setMainPanel("",true);
                Core.setLanguage('cs');
            }
        ]);

        module.config(function($mdThemingProvider) {
            $mdThemingProvider.theme('selected-basemap').backgroundPalette('deep-purple').dark();
          });

        return module;
    });
