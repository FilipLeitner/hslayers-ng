export default ['config', function (config) {
    return {
        template: require('components/compositions/partials/dialog_overwriteconfirm.html'),
        link: function (scope, element, attrs) {
            scope.overwriteModalVisible = true;
        }
    };
}]