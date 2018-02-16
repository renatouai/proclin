﻿(function () {
    'use strict';

    angular
        .module('app.paciente')
        .controller('HistoriaPregressa', HistoriaPregressa);

    HistoriaPregressa.$inject = ['$scope', '$http', '$q', '$modal', 'DTOptionsBuilder', 'blockUI', 'common', 'notification', 'pacienteservice','prontuarioservice','$stateParams'];

    function HistoriaPregressa($scope, $http, $q, $modal, DTOptionsBuilder, blockUI, common, notification, pacienteservice,prontuarioservice,$stateParams) {

        var vm = this;
        vm.init = init;
        vm.alterarfoto = alterarfoto;
        vm.IdPaciente = $stateParams.id;
        vm.crudHistoriaPregressa = crudHistoriaPregressa;

        $scope.forms = {};
        vm.pesq = {};
        vm.formValid = true;
       
        init();
        
        function init() {

            var blocker = blockUI.instances.get('blockProntuario');
            blocker.start();

             prontuarioservice
                .listarHistoriaPregressa($stateParams.id)
                .then(function (result) {
                    vm.dados = result.data;                    
                })
                .catch(function (ex) {
                    notification.showError(ex.data.Message);
                })['finally'](function () {
                    blocker.stop();
                });

            pacienteservice
                .getPacienteById($stateParams.id)
                .then(function (result) {
                    vm.paciente = result.data;                    
                })
                .catch(function (ex) {
                    notification.showError(ex.data.Message);
                })['finally'](function () {
                    blocker.stop();
                }); 
        }

        function alterarfoto() {
            var modalInstance = $modal.open({
                templateUrl: 'app/paciente/alterar_foto.html',
                controller: 'AlterarFoto as vm',
                size: 'lg',
                backdrop: 'static',
                resolve: {
                    id: function () {
                        return vm.paciente.IdPaciente;
                    },
                }
            });
            modalInstance.result.then(function () {
                init();
            });
        }

        function crudHistoriaPregressa(idpaciente) {
            var modalInstance = $modal.open({
                templateUrl: 'app/prontuarionovo/crud.historiapregressa.html',
                controller: 'CrudHistoriaPregressa as vm',
                size: 'lg',
                backdrop: 'static',
                resolve: {
                    idpaciente: function () {
                        return idpaciente;
                    }
                }
            });
            modalInstance.result.then(function () {
                init();
            });
        }

       

    }
})();