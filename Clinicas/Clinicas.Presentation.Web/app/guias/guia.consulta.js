﻿(function () {
    'use strict';

    angular
        .module('app.guias')
        .controller('GuiaConsultaCrud', GuiaConsultaCrud);

    GuiaConsultaCrud.$inject = ['$scope', '$http', '$q', '$modal', '$modalInstance', 'blockUI', 'common', 'notification', 'exception', 'ds.cadastros', 'ds.paciente', 'ds.guia', 'id'];

    function GuiaConsultaCrud($scope, $http, $q, $modal, $modalInstance, blockUI, common, notification, exception, dsCadastros, dsPaciente, dsGuia, id) {

        var vm = this;
        vm.State = "Incluir Guia de Consulta";
        vm.FormMessage = "";

        $scope.forms = {};
        vm.formValid = true;
        vm.guia = {
            Nome: "",
            CodigoProcedimento: "10101012"
        };


        //Funções
        vm.init = init;
        vm.save = save;
        vm.cancel = cancel;
        vm.getpaciente = getpaciente;

        //Feature Start
        init();

        //Implementations
        function init() {
            vm.FormMessage = "";

            vm.tiposaidas = [
                { Key: "1", Value: "Retorno" },
                { Key: "2", Value: "Retorno SADT" },
                { Key: "3", Value: "Referência" },
                { Key: "4", Value: "Internação" },
                { Key: "5", Value: "Alta" }
            ];

            vm.tipodoencas = [
                { Key: "Aguda", Value: "Aguda" },
                { Key: "Cronica", Value: "Crônica" }
            ];

            vm.tempodoencas = [
                            { Key: "A", Value: "A - Anos" },
                            { Key: "M", Value: "M - Meses" },
                            { Key: "D", Value: "D - Dias" }
            ];

            vm.tabelas = [
                { Key: "18", Value: "18 - Terminologia de diárias, taxas e gases medicinais" },
                { Key: "19", Value: "19 - Terminologia de Materiais e Órteses, Próteses e Materiais Especiais" },
                { Key: "20", Value: "20 - Terminologia de medicamentos" },
                { Key: "22", Value: "22 - Terminologia de procedimentos e eventos em saúde" },
                { Key: "90", Value: "90 - Tabela Própria Pacote Odontológico" },
                { Key: "98", Value: "98 - Tabela Própria de Pacotes" },
                { Key: "00", Value: "00 - Tabela Própria das Operadoras" }
            ];

            vm.tiposconsulta = [
                { Key: "1", Value: "1 - Primeira Consulta" },
                { Key: "2", Value: "2 - Retorno" },
                { Key: "3", Value: "3 - Pré-natal" },
                { Key: "4", Value: "4 - Por encaminhamento" }
            ];

            vm.indicacoesacidente = [
                { Key: "N", Value: "Não" },
                { Key: "S", Value: "Sim" }
            ];

            vm.conselhos = [
                 { Key: "CRAS", Value: "CRAS" },
                 { Key: "COREN", Value: "COREN" },
                 { Key: "CRF", Value: "CRF" },
                 { Key: "CRFA", Value: "CRFA" },
                 { Key: "CREFITO", Value: "CREFITO" },
                 { Key: "CRM", Value: "CRM" },
                 { Key: "CRN", Value: "CRN" },
                 { Key: "CRO", Value: "CRO" },
                 { Key: "CRP", Value: "CRP" },
                 { Key: "Outros", Value: "Outros" },
            ];

            var pEstados = dsPaciente.getEstados();
            pEstados.then(function (result) {
                vm.estados = result.data;
            });


            var blocker = blockUI.instances.get('blockModalGuiaConsulta');
            blocker.start();

            $q.all([pEstados]).then(function () {

                if (id > 0) {

                    dsGuia
                        .getGuiaById(id)
                        .then(function (result) {
                            vm.guia = result.data;

                            vm.pacienteSelecionadoNome = vm.guia.Nome.toUpperCase();
                            listarConveniosByPaciente(vm.guia.IdBeneficiario, true);

                        })
                        .catch(function (ex) {
                            notification.showError(ex.data.Message);
                        })['finally'](function () {
                        });
                }
               

            })['finally'](function () {
                blocker.stop();
            }).catch(function (ex) {
                notification.showError(ex.data.Message);
            });


        }

        function cancel() {
            $modalInstance.dismiss('cancel');
        }

        function save(fechar) {
            vm.formValid = common.validateForm($scope.forms.crudguia);

            if (vm.formValid) {
                vm.FormMessage = "";

                var blocker = blockUI.instances.get('blockModalGuiaConsulta');
                blocker.start();

                dsGuia
                    .saveGuiaConsulta(vm.guia)
                    .then(function (result) {
                        vm.guia = result.data;
                        if (id == 0)
                            notification.showSuccessBar("Guia cadastrada com sucesso!");
                        else
                            notification.showSuccessBar("Guia alterada com sucesso!");

                        if (fechar == "S")
                            $modalInstance.close();
                        else
                            resetform();
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

        function getpaciente() {
            var modalInstance = $modal.open({
                templateUrl: 'app/paciente/busca.paciente.html',
                controller: 'BuscaPaciente as vm',
                size: 'lg',
                backdrop: 'static'
            });
            modalInstance.result.then(function (item) {
                console.log(item);
                vm.pacienteSelecionado = item;
                vm.guia.NumeroCartaoSus = item.CartaoSus;
                vm.guia.Nome = item.NmPaciente.toUpperCase();
                vm.pacienteSelecionadoNome = item.NmPaciente.toUpperCase();
                listarConveniosByPaciente(item.IdPaciente, false);
                vm.guia.IdBeneficiario = item.IdPaciente;
            });
        }


        $scope.$watch('vm.convenioSelecionado', function (newValue, oldValue) {
            if (angular.isDefined(newValue)) {
                if (newValue != oldValue) {
                    if (vm.convenioSelecionado != undefined) {
                        var convenio = _.find(vm.convenios, { IdCarteira: vm.convenioSelecionado });
                        if (convenio != null) {
                            vm.guia.NumeroCarteira = convenio.NumeroCarteira;
                            vm.guia.ValidadeCarteira = convenio.ValidadeCarteira;
                            vm.guia.RegistroANS = convenio.RegistroAns;
                            vm.guia.Plano = convenio.Plano;
                        }
                    }
                }
            }
        });

        function listarConveniosByPaciente(id, selecionar) {
            dsPaciente
                   .getConveniosByPaciente(id)
                   .then(function (result) {
                       vm.convenios = result.data;
                       if(selecionar)
                       {
                           var convenio = _.find(vm.convenios, { NumeroCarteira: vm.guia.NumeroCarteira });
                           if(convenio != null)
                               vm.convenioSelecionado = convenio.IdCarteira;
                       }
                   })
                   .catch(function (ex) {
                       notification.showError(ex.data.Message);
                   })['finally'](function () {
                   });
        }

        function resetform() {
            vm.guia = {
                Nome: "",
                CodigoProcedimento: "10101012"
            };
            vm.pacienteSelecionado = undefined;
            vm.pacienteSelecionadoNome = "";
            vm.convenioSelecionado = undefined;
            vm.convenios = [];
        }

    }
})();