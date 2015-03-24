/**
 * Example Custom WidgetRenderer controller
 *
 * This controller is an example of how you can customize the rendering of a widget to fit your application needs.
 *
 *
 * This is OPTIONAL.  For many use cases, you will not need to include this file at all.
 * The default WidgetRenderer (out-of-the-box in the dashboard module) will:
 *      - add your widget to the page
 *      - request data from your datasource
 *      - set all the dynamic scope properties to the data from your datasource (the mapping determined from the widget and datasource schemas)
 *
 *
 * If this does not fit your needs out-of-the-box, you can extend our default WidgetRenderer, as we've done below.
 * The possible ways to extend the WidgetRenderer today are:
 *      - change the datasource before a request is made                    (implement beforeRequest)
 *      - transform the response data before it is given to the widget      (implement afterResponse)
 *      - handle events from other widgets (fetch different data)           (add a custom event handler + reflect the event back in your page's controller)
 *
 *
 * If you decide you need to extend the default WidgetRenderer controller for one of your widgets, here are the steps (examples shown below):
 *
 *      1. Create a NEW controller for your widget renderer implementation.  This controller will only be used for rendering the widgets you specify.
 *              Make sure to load it onto the page (require it somewhere)!
 *              ** Note: This MUST be a separate controller from any other controller in your application.  This controller will exist only around 1 widget
 *                  and datasource on a view and is responsible for managing the scope/datasource properties for that individual widget.  Do NOT combine this with another controller.
 *
 *      2. Add the name of your new controller to the response from your back-end view service (the view service returns the list of all views for your application)
 *              id: 'context.myview',
 *              name: 'My View',
 *              widgets: [
 *              {
 *                  cardId: 'v-simplest-directive',
 *                  size: 'half',
 *                  controller: 'MySpecialWidgetRendererCtrl'
 *                  ...
 *              }
 *              ...
 *
 *      3. Implement any customizations you need (beforeRequest, afterResponse, custom event handlers).
 *
 *      4. Extend the WidgetRendererController in the LAST line of this file.
 *              angular.extend(this, $controller('WidgetRendererController', {$scope: $scope}));
 *
 */
define(['angular', 'sample-module'], function (angular, controllers) {
    'use strict';

    // This is an example controller that shows how to handle events from other widgets and fetch new data
    // ** this is NOT the same as your page controller, as this encapsulates your widget and datasource only (read the section above for more info) **
    controllers.controller('TimeseriesWidgetRendererCtrl', ['$scope', '$controller', function ($scope, $controller) {

        // EXAMPLE time series widget uses this controller to handle x-axis events and update the data.
        // catch the px-dashboard-event (which is emitted from the px-time-series widget
        $scope.$on('px-dashboard-event', function (event, name, args) {
            // we suggest having an additional unique name to identify your event
            if (name !== 'after-set-extremes') {
                return;
            }

            // override the datasource (to customize the method, url, or options)
            /* jshint camelcase:false */
            $scope.datasource.options.start_absolute = args.min;
            $scope.datasource.options.end_absolute = args.max;
            // set some caching value to improve performance for developers:
            $scope.datasource.options.cache_time = 1000;
            $scope.datasource.options.metrics[0].aggregators[0].sampling = {
                unit: 'minutes',
                value: '1'
            };
            delete $scope.datasource.options.start_relative;
            delete $scope.datasource.options.end_relative;

            // fetch new data with the modified datasource
            $scope.fetch($scope.datasource);
        });

        $scope.errorCallback = function(){
            $scope.errorLoading = true;
        };
//        // OPTIONAL interceptor before any fetch is called (allowing you to change the url, query params, request body, etc.)
//        $scope.beforeRequest = function(datasource, context) {
//            datasource.options.tags = ['sdf', '234234'];
//            datasource.options.id = context.id;
//            return datasource;
//        };
//
//        // OPTIONAL interceptor after a successful response is returned (allowing you to transform the data if necessary)
//        $scope.afterResponse = function(data) {
//            data.result = data.somethingElse;
//            return data;
//        };
//
//        // OPTIONAL catch my-custom-event
//        // You can catch events that come from
//        //       1. the widget that this renderer is around
//        //               You may want to catch events that are emitted by the widget that this renderer controller is wrapping.
//        //               The example above show catching an event from the time-series widget which then re-fetches the data with different start/end times.
//        //       2. a different widget on the page
//        //               You may want to enable widget-to-widget communication on your page by catching an event here from another widget on the page.
//        //               To do this you need to:
//        //                   - emit a uniquely-named event from the talking widget (ex: 'tag-clicked-event')
//        //                   - catch this event ($on('tag-clicked-event')) in your page controller (so DashboardCtrl in dashboard.js or similar)
//        //                       and $broadcast a differently named event back down ($broadcast('update-timeseries')).
//        //                   - catch the broadcasted event ($on('update-timeseries')) in the updating widget's renderer controller (like below)
//        $scope.$on('my-custom-event', function(event, name, tags){
//
//            // override the datasource (to customize the method, url, or options)
//            // careful, if you have the beforeRequest interceptor implemented and do the same changes there as well it'll happen 2 times!
//            $scope.datasource.options.tags = tags;
//
//            // fetch new data with the modified datasource
//            $scope.fetch($scope.datasource);
//        });

        // Extend the Predix WidgetRendererController
        // ** this needs to be the LAST line in your CustomWidgetRendererController **
        angular.extend(this, $controller('WidgetRendererController', {$scope: $scope}));

    }]);
});
