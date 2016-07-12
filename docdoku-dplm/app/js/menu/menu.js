angular.module('dplm.menu', [])

    .controller('MenuController', function ($scope,$filter,$mdDialog,
                                            FolderService,ConfigurationService,WorkspaceService) {

        $scope.workspaces = WorkspaceService.workspaces;
        $scope.folders = FolderService.folders;
        $scope.configuration = ConfigurationService.configuration;
        $scope.openedSection = null;

        $scope.isOpened = function(section){
            return $scope.openedSection === section;
        };

        $scope.open = function(section){
            return $scope.openedSection = $scope.isOpened(section) ? null : section;
        };

        var folderSection = {
            id:'folders',
            name: 'Folders',
            type: 'toggle',
            pages: []
        };

        var workspaceSection = {
            id:'workspaces',
            name: 'Workspaces',
            type: 'toggle',
            pages: []
        };

        $scope.menu = {
            sections : [folderSection,workspaceSection]
        };

        var updateFolders = function(){
            folderSection.pages = $scope.folders.map(function(folder){
                return {
                    name: $filter('fileshortname')(folder.path),
                    type: 'link',
                    url:'#/folder/'+folder.uuid
                };
            });
        };

        var updateWorkspaces = function(){
            workspaceSection.pages = $scope.workspaces.map(function(workspace){
                return {
                    name: workspace,
                    type: 'link',
                    url:'#/workspace/'+workspace
                };
            });
        };

        $scope.$watchCollection('folders',updateFolders);
        $scope.$watchCollection('workspaces',updateWorkspaces);

        $scope.searchRepositories = function(){
            $mdDialog.show({
                templateUrl: 'js/repository/repository-search.html',
                fullscreen: true,
                controller:'RepositorySearchCtrl'
            });
        };

        $scope.addFolder = function(){
            $mdDialog.show({
                templateUrl: 'js/folder/add-folder.html',
                fullscreen: true,
                controller:'AddFolderCtrl'
            });
        };

        // TODO check if used
        $scope.onFileDropped = function(path){
            if(path){
                FolderService.add(path);
            }
        };

    })

    .controller('FolderMenuController', function ($scope) {

        $scope.onDrop = function () {
        };

    })
    .controller('WorkspaceMenuController', function ($scope, WorkspaceService) {

        $scope.onDrop = function () {
        };

        $scope.refreshWorkspaces = function(){
            WorkspaceService.reset();
            WorkspaceService.getWorkspaces();
        };

    })
    .filter('nospace', function () {
        return function (value) {
            return (!value) ? '' : value.replace(/ /g, '');
        };
    })
    .directive('menuLink', function() {
        return {
            templateUrl: 'js/menu/menu-link.html'
        };
    })

    .directive('menuToggle', function($timeout, $mdUtil) {
        return {

            templateUrl: 'js/menu/menu-toggle.html',
            link: function($scope, $element) {

                $mdUtil.nextTick(function() {
                    $scope.$watch(
                        function () {
                            return $scope.isOpened($scope.section);
                        },
                        function (open) {
                            var $ul = $element.find('ul');

                            var targetHeight = open ? getTargetHeight() : 0;
                            $timeout(function () {
                                $ul.css({height: targetHeight + 'px'});
                            }, 0, false);

                            function getTargetHeight() {
                                var targetHeight;
                                $ul.addClass('no-transition');
                                $ul.css('height', '');
                                targetHeight = $ul.prop('clientHeight');
                                $ul.css('height', 0);
                                $ul.removeClass('no-transition');
                                return targetHeight;
                            }
                        }
                    );
                });

                var parentNode = $element[0].parentNode.parentNode.parentNode;
                if(parentNode.classList.contains('parent-list-item')) {
                    var heading = parentNode.querySelector('h2');
                    $element[0].firstChild.setAttribute('aria-describedby', heading.id);
                }
            }
        };
    })
;