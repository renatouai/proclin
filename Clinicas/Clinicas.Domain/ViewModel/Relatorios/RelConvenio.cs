﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Clinicas.Domain.ViewModel.Relatorios
{
    public class RelConvenio
    {
        public int IdConvenio { get; set; }
        public string Nome { get; set; }
        public string CpfCnpj { get; set;  }
        public string RegistroAns { get; set; }
        public string Telefone1 { get; set; }
        public string Telefone2 { get; set; }
        public string Email { get; set; }
    }
}