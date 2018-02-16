﻿(function () {
    'use strict';

    angular
        .module('app.hospital')
        .controller('HospitalCrud', HospitalCrud);

    HospitalCrud.$inject = ['$scope', '$http', '$modal', '$modalInstance', 'blockUI', 'common', 'notification', 'prontuarioservice', 'id'];

    function HospitalCrud($scope, $http, $modal, $modalInstance, blockUI, common, notification, prontuarioservice, id) {

        var vm = this;
        vm.State = "Incluir Hospital";
        vm.FormMessage = "";
        vm.hospital = {};

        $scope.forms = {};
        vm.formValid = true;

        //Funções
        vm.init = init;
        vm.save = save;
        vm.cancel = cancel;

        //Feature Start
        init();

        //Implementations
        function init() {
            vm.FormMessage = "";


            if (id > 0) {
                vm.State = "Editar Hospital";
                var blocker = blockUI.instances.get('blockModalHospital');
                blocker.start();
                prontuarioservice
                    .getHospitalById(id)
                    .then(function (result) {
                        vm.hospital = result.data;
                    })
                    .catch(function (ex) {
                        notification.showError(ex.data.Message);
                    })['finally'](function () {
                        blocker.stop();
                    });
            }
        }

        function cancel() {
            $modalInstance.dismiss('cancel');
        }

        function save() {

            $scope.showErrorsCheckValidity = true;
            if ($scope.forms.hospital.$valid) {
                vm.FormMessage = "";

                var blocker = blockUI.instances.get('blockModalHospital');
                blocker.start();

                prontuarioservice
                    .saveHospital(vm.hospital)
                    .then(function (result) {
                        vm.hospital = result.data;
                        if (id == 0)
                            notification.showSuccessBar("Hospital cadastrado com sucesso!");
                        else
                            notification.showSuccessBar("Hospital alterado com sucesso!");

                        $modalInstance.close();
                    })
                    .catch(function (ex) {
                        notification.showError(ex.data.Message);
                    })['finally'](function () {
                        blocker.stop();
                    });
            }
            else {
                vm.FormMessage = "Preencha os campos em vermelho.";
            }
        }

    }
})();