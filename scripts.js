
/*
  --------------------------------------------------------------------------------------
  Funções globais
  --------------------------------------------------------------------------------------
*/

/*
  --------------------------------------------------------------------------------------
  Função para abrir modal
  --------------------------------------------------------------------------------------
*/
function openModal(mn) {
  let modal = document.getElementById(mn);

  if (typeof modal == 'undefined' || modal === null)
      return;

  modal.style.display = 'Block';
  document.body.style.overflow = 'hidden';
}

/*
  --------------------------------------------------------------------------------------
  Função para fechar modal
  --------------------------------------------------------------------------------------
*/
function closeModal(mn) {
  let modal = document.getElementById(mn);

  if (typeof modal == 'undefined' || modal === null)
      return;

  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar mascara no input
  --------------------------------------------------------------------------------------
*/
function mascara(i,t){

  var v = i.value;

  if(isNaN(v[v.length-1])){
     i.value = v.substring(0, v.length-1);
     return;
  }

  if(t == "cpf"){
     i.setAttribute("maxlength", "14");
     if (v.length == 3 || v.length == 7) i.value += ".";
     if (v.length == 11) i.value += "-";
  }

}

/*
  --------------------------------------------------------------------------------------
  Função para limpar tabela
  --------------------------------------------------------------------------------------
*/
const limparLista = (tabela) => {		  
  let tabela_element = document.getElementById("tabela-"+ tabela);
  let header_element = document.getElementById("header-"+ tabela);
  tabela_element.innerHTML = "<tbody>"+ header_element.outerHTML +"</tbody>";
}

/*
  --------------------------------------------------------------------------------------
  Fim Funções globais
  --------------------------------------------------------------------------------------
*/

/*
  --------------------------------------------------------------------------------------
  Funções Visitante
  --------------------------------------------------------------------------------------
*/

/*
  --------------------------------------------------------------------------------------
  Função para obter a lista de visitantes existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getListVisitante = async () => {
  let url = 'http://127.0.0.1:5000/visitante/lista';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {	
      limparLista("visitante");
      data.visitantes.forEach(item => insertListVisitante(item.id, item.nome, item.cpf, item.status, item.data_criacao))
      getCountVisitanteBloqueados();
    })
    .catch((error) => {
      alert(error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para obter um visitante existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getVisitante = async (idVisitante) => {
  let url = 'http://127.0.0.1:5000/visitante?id=' + idVisitante;
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
		document.getElementById("idVisitante").value = data.id
		document.getElementById("newNome").value = data.nome
		document.getElementById("newCpf").value = data.cpf
		document.getElementById("newStatus").value = data.status
    document.getElementById("obsVisitante").value = data.observacao
    })
    .catch((error) => {
      alert(error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para obter a lista de status do visitante existente no servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getListStatusVisitante = async () => {
  let url = 'http://127.0.0.1:5000/visitante/lista-status';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {	    
		  var selectbox = $('#newStatus');
		  data.lista_status_visitante.forEach(item => $('<option>').val(item.name).text(item.value).appendTo(selectbox));
    })
    .catch((error) => {
      alert(error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um item na lista de visitantes do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItemVisitante = async (inputNome, inputCpf, inputStatus, inputObservacao) => {
  const formData = new FormData();
  formData.append('nome', inputNome);
  formData.append('cpf', inputCpf);
  formData.append('status', inputStatus);
  formData.append('observacao', inputObservacao);

  let url = 'http://127.0.0.1:5000/visitante';
  fetch(url, {
    method: 'post',
    body: formData
  })
  .then((response) => console.log(response.json()))
	.then((data) => {
    closeModal('dv-modal-visitante-cadastro');
    getListVisitante();
  })
  .catch((error) => {
    alert(error);
  });
}

/*
  --------------------------------------------------------------------------------------
  Função para alterar um item na lista de visitantes do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const putItemVisitante = async (idVisitante, inputNome, inputCpf, inputStatus, inputObservacao) => {
  const formData = new FormData();
  formData.append('id', idVisitante);
  formData.append('nome', inputNome);
  formData.append('cpf', inputCpf);
  formData.append('status', inputStatus);
  formData.append('observacao', inputObservacao);

  let url = 'http://127.0.0.1:5000/visitante';
  fetch(url, {
    method: 'put',
    body: formData
  })
  .then((response) => response.json())
	.then((data) => {
    getListVisitante();
  })
  .catch((error) => {
    alert(error);
  });
}

/*
  --------------------------------------------------------------------------------------
  Função para obter a quantidade de visitantes bloqueados existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getCountVisitanteBloqueados = async () => {
  let url = 'http://127.0.0.1:5000/visitante/lista/count/bloqueados';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("countVisitante").innerHTML = data.count;
    })
    .catch((error) => {
      alert(error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista de visitantes do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItemVisitante = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/visitante?id=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Visitante removido com suscesso!");
      closeModal('dv-modal-visitante-cadastro');
      getListVisitante();    
    })
    .catch((error) => {
      alert(error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para criar um botão de remove para cada item da lista de visitante
  --------------------------------------------------------------------------------------
*/
const insertButtonRemoveVisitante = (parent, id) => {
  parent.className = "colunaCenter";
  let span = document.createElement("span");
  span.className = "close";
  span.innerHTML = '<img src="img/excluir.png" width="24px" height="24px"></img>';
  parent.appendChild(span);
  span.onclick = function () {
    let div = this.parentElement.parentElement;
    if (confirm("Você tem certeza?")) {
	    deleteItemVisitante(id)
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para criar um botão de editar para cada item da lista de visitante
  --------------------------------------------------------------------------------------
*/
const insertButtonEditVisitante = (parent, id) => {
  parent.className = "colunaCenter";
  let span = document.createElement("span");
  span.className = "edit";
  span.innerHTML = '<img src="img/editar.png" width="24px" height="24px"></img>';
  parent.appendChild(span);
  span.onclick = function () {
    limparFormVisitante();
	  showBtnEditarVisitante();
    getVisitante(id)	  
    openModal('dv-modal-visitante-cadastro');
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para criar um botão para abrir a cadastro acesso de acordo com o item da lista de visitante
  --------------------------------------------------------------------------------------
*/
const insertButtonAcessoVisitante = (parent, id, status) => {
  parent.className = "colunaCenter";
  let span = document.createElement("span");
  span.className = "acesso"
  if(status.toUpperCase() != 'ATIVO'){
    span.className = "acesso disabled";
  }

  span.innerHTML = '<img src="img/acesso.png" width="24px" height="24px"></img>';
  parent.appendChild(span);
  if(status.toUpperCase() == 'ATIVO'){
    span.onclick = function () {
      let colId = document.getElementById("col"+id);
      let linha = colId.parentElement;
      document.getElementById("idVisitanteAcesso").value = linha.children[0].innerHTML;
      document.getElementById("nomeVisitante").value = linha.children[1].innerHTML;
      document.getElementById("cpfVisitanteAcesso").value = linha.children[2].innerHTML;
      document.getElementById("localAcesso").value = "";
      document.getElementById("tipoAcesso").value = "VISITA";
      document.getElementById("obsAcesso").value = "";
      document.getElementById("labelDataAcesso").style.display = "none";
      let inputDataAcesso = document.getElementById("inputDataAcesso");
      inputDataAcesso.style.display = "none";
      let btnSalvar = document.getElementById("btnSalvarAcesso");
      btnSalvar.style.display = "block";
      openModal('dv-modal-acesso-cadastro');
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para um badge do status do item da lista de visitante
  --------------------------------------------------------------------------------------
*/
const insertStatusVisitante = (parent, texto) => {
  parent.className = "colunaCenter";
  let span = document.createElement("span");
  if(texto == "Ativo"){
    span.className = "badge badge-verde";
  } else if(texto == "Inativo" || texto == "Bloqueado"){
    span.className = "badge badge-vermelho";
  } else {
    span.className = "badge";
  }
  
  span.innerHTML = texto;
  parent.appendChild(span);
}

/*
  --------------------------------------------------------------------------------------
  Função para limpar formulário, apresentar botão de salvar e abrir o modal cadastro visitante
  --------------------------------------------------------------------------------------
*/
const cadastrarNovoRegistroVisitante = () => {
  limparFormVisitante();
	showBtnSalvarVisitante();  
  openModal('dv-modal-visitante-cadastro');
}

/*
  --------------------------------------------------------------------------------------
  Função para abrir o modal lista visitante
  --------------------------------------------------------------------------------------
*/
const abrirCadastroVisitante = () => {
  getListVisitante();
  openModal('dv-modal-visitante');
}

/*
  --------------------------------------------------------------------------------------
  Função para validação do formulário de visitante
  --------------------------------------------------------------------------------------
*/
const validarFormVisitante = () => {
		
  let inputNome = document.getElementById("newNome").value;
  let inputCpf = document.getElementById("newCpf").value;
  let inputStatus = $('#newStatus :selected');
 
  if (inputNome === '') {
    alert("Escreva o nome do visitante!");
	  return false;
  } 
  if (inputCpf === '') {
    alert("O campo CPF é obrigatório!");
	  return false;
  } 
  if (inputStatus === '') {
    alert("O campo Status é obrigatório!");
	  return false;
  }
  return true;
}

/*
  --------------------------------------------------------------------------------------
  Função para salvar um visitante no servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const salvarVisitante = () => {		
  if(!validarFormVisitante()){
    return;
  }		
  let inputNome = document.getElementById("newNome").value;
  let inputCpf = document.getElementById("newCpf").value;
  let inputStatus = $('#newStatus :selected');
  let inputObservacao = document.getElementById("obsVisitante").value;

  if (confirm("Você tem certeza deseja salvar?")) {
    postItemVisitante(inputNome, inputCpf, inputStatus.val(), inputObservacao)
    alert("Item salvo com sucesso!")
    limparFormVisitante();
	  return
  }	
}

/*
  --------------------------------------------------------------------------------------
  Função para editar um visitante no servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const editarVisitante = () => {	
  validarFormVisitante();		
  let idVisitante = document.getElementById("idVisitante").value;	
  let inputNome = document.getElementById("newNome").value;
  let inputCpf = document.getElementById("newCpf").value;
  let inputStatus = $('#newStatus :selected');
  let inputObservacao = document.getElementById("obsVisitante").value;
 
  if (confirm("Você tem certeza deseja editar?")) {
	  putItemVisitante(idVisitante, inputNome, inputCpf, inputStatus.val(), inputObservacao)
	  alert("Item atualizado com sucesso!")
	  return
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista de visitante apresentada
  --------------------------------------------------------------------------------------
*/
const insertListVisitante = (id, nome, cpf, status, data_criacao) => {
  var item = [id, nome, cpf, data_criacao]
  var table = document.getElementById('tabela-visitante');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);	
    cel.textContent = item[i];
    if(i == 0){//ID
      cel.id = "col"+item[i];
    }

    if(i == 3){//data criacao
      cel.className = "colunaCenter";
    }
    
  }
  insertStatusVisitante(row.insertCell(-1), status)
  insertButtonAcessoVisitante(row.insertCell(-1), item[0], status)
  insertButtonEditVisitante(row.insertCell(-1), item[0])
  insertButtonRemoveVisitante(row.insertCell(-1), item[0]) 
}

/*
  --------------------------------------------------------------------------------------
  Função para exibir botão de salvar do cadastro de visitante
  --------------------------------------------------------------------------------------
*/
const showBtnSalvarVisitante = () => {
  let btnSalvar = document.getElementById("btnSalvar");
	let btnEditar = document.getElementById("btnEditar");
	btnEditar.style.display = "none";
	btnSalvar.style.display = "block";
  limparFormVisitante();
}

/*
  --------------------------------------------------------------------------------------
  Função para exibir botão de editar do cadastro de visitante
  --------------------------------------------------------------------------------------
*/
const showBtnEditarVisitante = () => {
  let btnSalvar = document.getElementById("btnSalvar");
	let btnEditar = document.getElementById("btnEditar");
	btnEditar.style.display = "block";
	btnSalvar.style.display = "none";
}

/*
  --------------------------------------------------------------------------------------
  Função para limpar formulário de visitante
  --------------------------------------------------------------------------------------
*/
const limparFormVisitante = () => {
  document.getElementById("newNome").value = "";
  document.getElementById("newCpf").value = "";
  document.getElementById("newStatus").value = "ATIVO";
  document.getElementById("idVisitante").value = "";
  document.getElementById("obsVisitante").value = "";
}

/*
  --------------------------------------------------------------------------------------
  Fim Funções Visitante
  --------------------------------------------------------------------------------------
*/

/*
  --------------------------------------------------------------------------------------
  Funções Acesso
  --------------------------------------------------------------------------------------
*/

/*
  --------------------------------------------------------------------------------------
  Função para obter a lista de acessos existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getListAcesso = async () => {
  let url = 'http://127.0.0.1:5000/acesso/lista';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {	
      limparLista("acesso");
      data.acessos.forEach(item => insertListAcesso(item.id, item.visitante.nome, item.visitante.cpf, item.local, item.tipo, item.data_acesso))
      getCountAcesso();
      getCountAcessoObs();
      getCountVisitanteBloqueados();
    })
    .catch((error) => {
      alert(error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista de acessos do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItemAcesso = async (inputLocal, inputTipo, inputObservacao, inputIdVisitanteAcesso) => {
  const formData = new FormData();
  formData.append('local', inputLocal);
  formData.append('tipo', inputTipo);
  formData.append('observacao', inputObservacao);
  formData.append('visitante_id', inputIdVisitanteAcesso);

  let url = 'http://127.0.0.1:5000/acesso';
  fetch(url, {
    method: 'post',
    body: formData
  })
  .then((response) => response.json())
	.then((data) => {
    closeModal('dv-modal-acesso-cadastro');
    getListAcesso();
  })
  .catch((error) => {
    alert(error);
  });
}

/*
  --------------------------------------------------------------------------------------
  Função para obter um acesso existente no servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getAcesso = async (idAcesso) => {
  let url = 'http://127.0.0.1:5000/acesso?id=' + idAcesso;
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("idVisitanteAcesso").value = data.visitante.id;
      document.getElementById("nomeVisitante").value = data.visitante.nome;
      document.getElementById("cpfVisitanteAcesso").value = data.visitante.cpf;
      document.getElementById("localAcesso").value = data.local;
      document.getElementById("tipoAcesso").value =data.tipo;
      document.getElementById("obsAcesso").value = data.observacao;
      document.getElementById("labelDataAcesso").style.display = "block";
      let inputDataAcesso = document.getElementById("inputDataAcesso");
      inputDataAcesso.value = data.data_acesso;
      inputDataAcesso.style.display = "block";
      let btnSalvar = document.getElementById("btnSalvarAcesso");
      btnSalvar.style.display = "none";
    })
    .catch((error) => {
      alert(error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para obter a quantidade de acessos existente no servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getCountAcesso = async () => {
  let url = 'http://127.0.0.1:5000/acesso/lista/count';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("countAcesso").innerHTML = data.count;
    })
    .catch((error) => {
      alert(error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para obter a quantidade de acessos com observações existente no servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getCountAcessoObs = async () => {
  let url = 'http://127.0.0.1:5000/acesso/lista/count/obs';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      document.getElementById("countAcessoObs").innerHTML = data.count;
    })
    .catch((error) => {
      alert(error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para criar um botão de visualizar cadastro de cada item da lista de acesso
  --------------------------------------------------------------------------------------
*/
insertButtonAcessoVisualizar = (parent, id) => {
  parent.className = "colunaCenter";
  let span = document.createElement("span");
  span.className = "visualizar";
  span.innerHTML = '<img src="img/lupa.png" width="24px" height="24px"></img>';
  parent.appendChild(span);
  span.onclick = function () {
    getAcesso(id);
    openModal('dv-modal-acesso-cadastro');
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para abrir modal cadastro acesso
  --------------------------------------------------------------------------------------
*/
const abrirCadastroAcesso = () => {
  openModal('dv-modal-acesso-cadastro');
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista de acessos apresentada
  --------------------------------------------------------------------------------------
*/
const insertListAcesso = (id, nome, cpf, local, tipo, data_acesso) => {
  var item = [id, nome, cpf, local, tipo, data_acesso]
  var table = document.getElementById('tabela-acesso');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);	
    cel.textContent = item[i];
    if(i == 0){//ID
      cel.id = "col"+item[i];
    }

    if(i == 4){//tipo acesso
      let tipo = item[i];
      if(tipo == 'VISITA'){
        cel.textContent = 'Visita';
      }
      if(tipo == 'PRESTACAO_SERVICO'){
        cel.textContent = 'Prestação de Serviço';
      }
    }

    if(i == 5){//data acesso
      cel.className = "colunaCenter";
    }
    
  }
  insertButtonAcessoVisualizar(row.insertCell(-1), item[0])
}

/*
  --------------------------------------------------------------------------------------
  Função para validação do formulário de acesso
  --------------------------------------------------------------------------------------
*/
const validarFormAcesso = () => {
		
  let inputLocal = document.getElementById("localAcesso").value;
  let inputTipo = $('#tipoAcesso :selected');
 
  if (inputLocal === '') {
    alert("Campo Local Acesso é obrigatório!");
	  return false;
  } 
  if (inputTipo === '') {
    alert("Campo Tipo Acesso Acesso é obrigatório!");
	  return false;
  } 
  return true;
}

/*
  --------------------------------------------------------------------------------------
  Função para salvar resgistro de acesso no servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const salvarAcesso = () => {		
  if(!validarFormAcesso()){
    return;
  }		
  let inputIdVisitanteAcesso = document.getElementById("idVisitanteAcesso").value;
  let inputLocal = document.getElementById("localAcesso").value;
  let inputTipo = $('#tipoAcesso :selected');
  let inputObservacao = document.getElementById("obsAcesso").value;

  if (confirm("Você tem certeza resgistrar esse acesso?")) {
    postItemAcesso(inputLocal, inputTipo.val(), inputObservacao, inputIdVisitanteAcesso)
    alert("Registro cadastrado com sucesso!")
    closeModal('dv-modal-acesso-cadastro');
    closeModal('dv-modal-visitante');
	  return
  }	
}

/*
  --------------------------------------------------------------------------------------
  Fim Funções Acesso
  --------------------------------------------------------------------------------------
*/

/*
  --------------------------------------------------------------------------------------
  Chamada das funções para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getListStatusVisitante();
showBtnSalvarVisitante();
getListAcesso();






