define(["app","services/diagram/main"], function(app) {
    app.controllerProvider.register('WorkflowCreateController', ['$scope', '$state', 'notifyService', 'diagramService', function($scope, $state, notifyService, diagramService) {
        $scope.backToList = function() {
            $state.go("workflow");
        };
        $scope.saveWorkflow = function(){
            $state.go("workflow");
        };

        $scope.workflowData = diagramService.dataset;
        $scope.drawWorkflow = function() {
            diagramService.drawWorkflow($scope,'#div-d3-main-svg', $scope.workflowData)
        };

        $scope.resetWorkflowData = function(workflowData){
            $scope.workflowData = workflowData;
        };

        $scope.chosedStageIndex = '';
        $scope.chosedActionIndex = '';

        $scope.newStage = {
            "name":"",
            "id":"",
            "type":"edit-stage",
            "runMode":"parallel",
            "actions":[
                {
                    "components":[]
                }
            ]
        };

        $scope.newComponent = {
            "name":"action1",
            "id":"s2-at1",
            "type":"action",
            "inputData":"",
            "outputData":""
        };

        $scope.newAction = {
            "components":[]
        };
      
        // add or chosed stage
        $scope.chosedStage = function(d,i){
            event.stopPropagation();
            $scope.clearChosedIndex('stage');
            $scope.clearChosedStageColor();
            if(d.type === 'add-stage'){
                var stage = angular.copy($scope.newStage);
                var addstage = angular.copy($scope.workflowData[i]);
                var endstage = angular.copy($scope.workflowData[i+1]);
                $scope.workflowData[i] = stage;
                $scope.workflowData[i+1] = addstage;
                $scope.workflowData[i+2] = endstage;
                // dataset.splice(dataset[i-1],0,stage)
                // drawWorkflow(selector,dataset); 
                $scope.drawWorkflow();
            };

            if(d.type === 'edit-stage'){
                d3.select(this).attr('href','assets/images/icon-stage.svg');
                $scope.chosedStageIndex = i;
                $state.go("workflow.create.stage",{"id": d.id});
            };
        };

        $scope.clearChosedStageColor = function(){
            d3.selectAll('.stage-pic')
                .attr('href',function(d){
                    if(d.type === 'add-stage'){
                        return 'assets/images/icon-add-stage.svg';
                    }else if(d.type === 'end-stage'){
                        return 'assets/images/icon-stage-empty.svg';
                    }else if(d.type === 'edit-stage'){
                        return d.runMode === 'parallel' ? 'assets/images/icon-action-parallel.svg' : 'assets/images/icon-action-serial.svg';
                    }
                })
        };

        $scope.clearChosedIndex = function(type){
            if(type === 'stage'){
                $scope.chosedStageIndex = '';
            }else{
                $scope.chosedActionIndex = '';
            }
        };

        // chosed action
        $scope.chosedAction = function(){
            event.stopPropagation();
            $scope.clearChosedIndex('action');
            $scope.clearAddActionIcon();

            var currentElement = d3.select(this);
            $scope.chosedStageIndex = parseInt(currentElement.attr('data-stageIndex'));
            $scope.chosedActionIndex = parseInt(currentElement.attr('data-actionIndex'));
            var chosedStageIndex = $scope.chosedStageIndex;
            var chosedActionIndex = $scope.chosedActionIndex;
            var isChosed = $scope.workflowData[chosedStageIndex]['actions'][chosedActionIndex]['isChosed'];
            $scope.workflowData[chosedStageIndex]['actions'][chosedActionIndex]['isChosed'] = !isChosed;
            $scope.drawWorkflow(); 
        };

        $scope.clearAddActionIcon = function(){
            angular.forEach($scope.workflowData,function(d,i){
                angular.forEach(d.actions,function(a,ai){
                    a.isChosed = false;
                })
            })
        };

        // add action to bottom
        $scope.addBottomAction = function(){
            $scope.addElement(d3.select(this),'bottom');
        };

        // add action to top
        $scope.addTopAction = function(){
            $scope.addElement(d3.select(this),'top');
        };

        $scope.addElement = function(currentElement,type){
            event.stopPropagation();
            $scope.chosedStageIndex = parseInt(currentElement.attr('data-stageIndex'));
            $scope.chosedActionIndex = parseInt(currentElement.attr('data-actionIndex'));
            var chosedStageIndex = $scope.chosedStageIndex;
            var chosedActionIndex = $scope.chosedActionIndex;
            var actionLength = $scope.workflowData[chosedStageIndex]['actions'].length;
            var action = angular.copy($scope.newAction);

            if(type === 'bottom'){
                if(actionLength === chosedActionIndex+1){
                    $scope.workflowData[chosedStageIndex]['actions'].push(action);
                }else{
                    $scope.workflowData[chosedStageIndex]['actions'].splice(chosedActionIndex+1,0,action);
                }
            }else{
                $scope.workflowData[chosedStageIndex]['actions'].splice(chosedActionIndex,0,action);
            };
                
            $scope.drawWorkflow(); 
        }; 

        // add component
        $scope.addComponent = function(){
            addElement(d3.select(this),'component');
        };

        $scope.drawWorkflow();
  

    }]);
})
