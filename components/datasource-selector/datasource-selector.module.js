import metadataDialogDirective from './metadata-dialog.directive';
import advancedMickaDialogDirective from './micka/advanced-micka-dialog.directive';
import mickaSuggestionsDialogDirective from './micka/micka-suggestions-dialog.directive';
import objectDirective from './object.directive';
import datasourceSelectorService from './datasource-selector.service';
import datasourceSelectorComponent from './datasource-selector.component';
import mickaFilterService from './micka/micka-filters.service';
import mickaFiltersDirective from './micka/micka-filters.directive';
import mickaService from './micka/micka.service';

/**
 * @namespace hs.datasource_selector
 * @memberOf hs
 */
angular.module('hs.datasource_selector', ['hs.map'])
    /**
     * @ngdoc directive
     * @name hs.datasourceSelector.metadataDialogDirective
     * @memberOf hs.datasource_selector
     * @description Directive for displaying metadata about data source
     */
    .directive('hs.datasourceSelector.metadataDialogDirective', metadataDialogDirective)

    /**
     * @ngdoc directive
     * @name hs.advMickaDialog
     * @memberOf hs.datasource_selector
     * @description Directive for displaying extended search parameters for 
     * Micka catalogue service
     */
    .directive('hs.advMickaDialog', advancedMickaDialogDirective)

    /**
     * @ngdoc directive
     * @name hs.mickaSuggestionsDialog
     * @memberOf hs.datasource_selector
     * @description Directive for displaying suggestions for search parameters for Micka catalogue service
     */
    .directive('hs.mickaSuggestionsDialog', mickaSuggestionsDialogDirective)

    /**
     * @ngdoc directive
     * @name hs.datasourceSelector.objectDirective
     * @memberOf hs.datasource_selector
     * @description Universal directive for displaying metadata about data source
     */
    .directive('hs.datasourceSelector.objectDirective', objectDirective)

    /**
     * @ngdoc directive
     * @name hs.mickaFiltersDirective
     * @memberOf hs.datasource_selector
     * @description Directive for providing basic html elements for Micka 
     * metadata filtering
     */
    .directive('hs.mickaFiltersDirective', mickaFiltersDirective)

    /**
     * @ngdoc service
     * @name hs.mickaFiltersService
     * @memberOf hs.datasource_selector
     * @description Service for calling catalogue loaders and managing layers -
     * initiating adding to map, downloading, storing layer extents
     */
    .service('hs.datasourceBrowserService', datasourceSelectorService)

    /**
     * @ngdoc service
     * @name hs.mickaFiltersService
     * @memberOf hs.datasource_selector
     * @description Service for managing micka query filter parameters and 
     * their possible values i.e. suggestions 
     */
    .service('hs.mickaFiltersService', mickaFilterService)

    /**
     * @ngdoc service
     * @name hs.mickaBrowserService
     * @memberOf hs.datasource_selector
     * @description Service for querying layer from Micka metadata catalogue
     */
    .service('hs.mickaBrowserService', mickaService)

    /**
     * @ngdoc component
     * @memberof hs.datasource_selector
     * @name hs.datasourceSelector
     * @description Display Datasource selector panel in app. Panel contains datasource types switcher and loaded list of datas. 
     */
    .component('hs.datasourceSelector', datasourceSelectorComponent);
