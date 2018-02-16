﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Clinicas.Domain.Model
{
    public class Atestado
    {
        public int IdAtestado { get; private set; }
        public int IdPaciente { get; private set; }
        public int IdFuncionario { get; private set; }
        public string Descricao { get; private set; }
        public string Situacao { get; private set; }
        public DateTime Data { get; private set; }

        public virtual Paciente Paciente { get; private set; }
        public virtual Funcionario Funcionario { get; private set; }

        private Atestado() { }

        public Atestado(string descricao, Paciente paciente, Funcionario funcionario)
        {
            SetData(DateTime.Now);
            SetDescricao(descricao);
            SetSituacao("Ativo");
            SetPaciente(paciente);
            SetFuncionario(funcionario);
        }

        public void SetFuncionario(Funcionario funcionario)
        {
            if (funcionario != null)
                Funcionario = funcionario;
        }

        public void SetPaciente(Paciente paciente)
        {
            if (paciente != null)
                Paciente = paciente;
        }

        public void SetDescricao(string descricao)
        {
            if (!String.IsNullOrEmpty(descricao))
                Descricao = descricao;
        }
        public void SetData(DateTime data)
        {
            if (data != null)
                Data = data;
        }
        public void SetSituacao(string situacao)
        {
            if (!String.IsNullOrEmpty(situacao))
                Situacao = situacao;
        }
    }
}