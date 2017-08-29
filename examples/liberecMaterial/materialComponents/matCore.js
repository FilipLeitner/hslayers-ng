if (typeof hslMin != 'undefined') {
    if (hslMin == true) hslMin = '.min';
    else hslMin = '';
} else hslMin = '';
console.log(hslMin);

require.config({
    paths: {
        matSearch: hsl_path + 'examples/liberecMaterial/materialComponents/matSearch',
    },
    shim: {},
    priority: []
});

define(['angular', 'core', 'ngMaterial'],
    function (angular) {
        angular.module('hs.material.core', ['hs.core'])
            .controller("MatCore", ['$scope', '$window', 'hs.map.service', 'gettextCatalog', 'config', '$templateCache', '$timeout', '$mdSidenav', '$interval',
                function ($scope, $window, OlMap, gettextCatalog, config, $templateCache, $timeout, $mdSidenav, $interval) {
                    $scope.closeSidenav = function (id) {
                        $scope.sidenavStatus[id] = false;
                        mapSizeInterval();
                    }
                    $scope.openSidenav = function (id) {
                        $scope.sidenavStatus[id] = true;
                        mapSizeInterval();
                    }
                    $scope.toogleSidenav = function (id) {
                        $scope.sidenavStatus[id] = !$scope.sidenavStatus[id];
                        mapSizeInterval();
                    }
                    $scope.sidenavStatus = {
                        "sidenav-left": true
                    };
                    $scope.sidenavProp = {
                        "sidenav-left": {
                            title: "Infopanel"
                        }
                    }
                    $scope.isSidenavOpened = function (id) {
                        return $scope.sidenavStatus[id];
                    }

                    function mapSizeInterval() {
                        $interval(function () {
                            $scope.$emit('Core_sizeChanged');
                        }, 20, 40);
                    }

                    $scope.changeZoom = function (zoomIn) {
                        var view = OlMap.map.getView();
                        var zoom = view.getZoom();
                        if (zoomIn) {
                            if (view.getMinZoom() < zoom) view.setZoom(zoom + 1);
                        } else {
                            if (view.getMaxZoom() > zoom) view.setZoom(zoom - 1);
                        }
                    }

                    $scope.resetMap = function () {
                        OlMap.resetView();
                    }

                    $scope.getPosition = function () {
                        var geolocation = new ol.Geolocation({
                            projection: OlMap.map.getView().getProjection()
                        });
                        var location = geolocation.getPosition();
                        if (angular.isDefined(location)) OlMap.map.getView().setCenter(location);
                    }

                    navigator.permissions && navigator.permissions.query({
                        name: 'geolocation'
                    }).then(function (PermissionStatus) {
                        if (PermissionStatus.state == 'granted') {
                            console.log("a");
                        } else {
                            console.log("b");
                        }
                    })

                    $scope.$on('map.loaded', function () {
                        angular.forEach(OlMap.map.getControls(), function (control) {
                            OlMap.map.removeControl(control);
                        })
                    })
                }])
    })