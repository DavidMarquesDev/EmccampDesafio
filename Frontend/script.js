$(document).ready(function () {
    // Função para carregar a lista de clientes ao carregar a página
    carregarClientes();

    // Submit do formulário para adicionar cliente
    $('#formCliente').submit(function (event) {
        event.preventDefault();
        adicionarCliente();
    });

    // Cancelar edição
    $('#btnCancelar').click(function () {
        $('#formCliente')[0].reset();
        $('#btnCadastrar').text('Cadastrar');
        $('#btnCancelar').hide();
        $('.campo-editavel').prop('disabled', false).hide();
        $('.campo-normal').show();
    });
});

// Função para carregar a lista de clientes
function carregarClientes() {
    $.ajax({
        url: 'https://localhost:44377/api/clientes',
        method: 'GET',
        success: function (data) {
            $('#listaClientes').empty();
            data.forEach(function (cliente) {
                $('#listaClientes').append(`
                    <tr>
                        <td>${cliente.id}</td>
                        <td><span class="campo-normal nome">${cliente.nome}</span><input type="text" class="form-control campo-editavel nome-edit" style="display: none;" value="${cliente.nome}"></td>
                        <td><span class="campo-normal email">${cliente.email}</span><input type="email" class="form-control campo-editavel email-edit" style="display: none;" value="${cliente.email}"></td>
                        <td><span class="campo-normal telefone">${cliente.telefone}</span><input type="text" class="form-control campo-editavel telefone-edit" style="display: none;" value="${cliente.telefone}"></td>
                        <td>
                            <button class="btn btn-sm btn-danger" onclick="excluirCliente(${cliente.id})">Excluir</button>
                            <button class="btn btn-sm btn-primary btn-edit" onclick="editarCliente(this)">Editar</button>
                            <button class="btn btn-sm btn-success btn-salvar" style="display: none;" onclick="salvarEdicao(this)">Salvar</button>
                        </td>
                    </tr>
                `);
            });
        }
    });
}

// Função para adicionar um novo cliente
function adicionarCliente() {
    var nome = $('#nome').val();
    var email = $('#email').val();
    var telefone = $('#telefone').val();

    // Verifica se o telefone está no formato correto
    if (!/^(\(\d{2}\)\s)(\d{4,5}-\d{4})$/.test(telefone)) {
        alert('Por favor, insira um telefone válido no formato (99) 99999-9999.');
        return;
    }

    var cliente = {
        nome: nome,
        email: email,
        telefone: telefone
    };

    $.ajax({
        url: 'https://localhost:44377/api/clientes',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(cliente),
        success: function () {
            carregarClientes();
            $('#formCliente')[0].reset();
            $('#btnSalvar').text('Cadastrar');
        }
    });
}

// Função para editar um cliente
function editarCliente(btn) {
    var $tr = $(btn).closest('tr');
    $tr.find('.campo-normal').hide();
    $tr.find('.campo-editavel').show().prop('disabled', false);
    $tr.find('.btn-edit').hide();
    $tr.find('.btn-salvar').show();
    $('#btnSalvar').text('Salvar');
    $('#btnCancelar').show();

    // Aplica a máscara de telefone ao campo #telefone
    $tr.find('.campo-editavel.telefone-edit').inputmask('(99) 99999-9999');
}

// Função para salvar a edição de um cliente
function salvarEdicao(btn) {
    var $tr = $(btn).closest('tr');
    var id = $tr.find('td:first').text();
    var nome = $tr.find('.nome-edit').val();
    var email = $tr.find('.email-edit').val();
    var telefone = $tr.find('.telefone-edit').val();

    var cliente = {
        nome: nome,
        email: email,
        telefone: telefone
    };

    $.ajax({
        url: `https://localhost:44377/api/clientes/${id}`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(cliente),
        success: function () {
            carregarClientes();
        }
    });
}

// Função para excluir um cliente
function excluirCliente(id) {
    $.ajax({
        url: `https://localhost:44377/api/clientes/${id}`,
        method: 'DELETE',
        success: function () {
            carregarClientes();
        }
    });
}

// Função para salvar um cliente editado
function salvarCliente() {
    var id = $('#idCliente').val();
    var nome = $('#nome').val();
    var email = $('#email').val();
    var telefone = $('#telefone').val();

    var cliente = {
        id: id,
        nome: nome,
        email: email,
        telefone: telefone
    };

    $.ajax({
        url: `https://localhost:44377/api/clientes/${id}`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(cliente),
        success: function () {
            carregarClientes();
            $('#formCliente')[0].reset();
            $('#btnSalvar').text('Cadastrar');
            $('#btnCancelar').hide();
        }
    });
}

// Evento de teclado para o campo de pesquisa
$('#pesquisar').on('input', function () {
    var consulta = $(this).val().toLowerCase().trim(); // Obter o valor da consulta e converter para minúsculas
    if (consulta.length === 0) {
        // Se a consulta estiver vazia, mostrar todos os clientes
        $('#listaClientes tr').show();
    } else {
        // Caso contrário, ocultar os clientes que não correspondem à consulta
        $('#listaClientes tr').each(function () {
            var encontrado = false;
            $(this).find('td').each(function () {
                // Verificar se o texto da célula corresponde à consulta
                if ($(this).text().toLowerCase().indexOf(consulta) !== -1) {
                    encontrado = true;
                    return false; // Sai do loop interno se encontrar correspondência
                }
            });
            // Exibir ou ocultar a linha com base se a correspondência foi encontrada
            $(this).toggle(encontrado);
        });
    }
});

// Função para carregar a lista de clientes com paginação
function carregarClientesComPaginacao(paginaAtual, tamanhoPagina) {
    $.ajax({
        url: 'https://localhost:44377/api/clientes',
        method: 'GET',
        success: function (data) {
            var totalClientes = data.length;
            var totalPages = Math.ceil(totalClientes / tamanhoPagina);

            // Calcula o índice inicial e final dos clientes a serem exibidos na página atual
            var startIndex = (paginaAtual - 1) * tamanhoPagina;
            var endIndex = Math.min(startIndex + tamanhoPagina - 1, totalClientes - 1);

            $('#listaClientes').empty();
            for (var i = startIndex; i <= endIndex; i++) {
                var cliente = data[i];
                $('#listaClientes').append(`
                    <tr>
                        <td>${cliente.id}</td>
                        <td><span class="campo-normal nome">${cliente.nome}</span><input type="text" class="form-control campo-editavel nome-edit" style="display: none;" value="${cliente.nome}"></td>
                        <td><span class="campo-normal email">${cliente.email}</span><input type="email" class="form-control campo-editavel email-edit" style="display: none;" value="${cliente.email}"></td>
                        <td><span class="campo-normal telefone">${cliente.telefone}</span><input type="text" class="form-control campo-editavel telefone-edit" style="display: none;" value="${cliente.telefone}"></td>
                        <td>
                            <button class="btn btn-sm btn-danger" onclick="excluirCliente(${cliente.id})">Excluir</button>
                            <button class="btn btn-sm btn-primary btn-edit" onclick="editarCliente(this)">Editar</button>
                            <button class="btn btn-sm btn-success btn-salvar" style="display: none;" onclick="salvarEdicao(this)">Salvar</button>
                        </td>
                    </tr>
                `);
            }

            // Atualiza os botões de navegação da página
            atualizarBotoesPaginacao(paginaAtual, totalPages);
        }
    });
}

// Função para atualizar os botões de navegação da página
function atualizarBotoesPaginacao(paginaAtual, totalPages) {
    $('#paginacao').empty();
    if (totalPages > 1) {
        var paginacaoHTML = `
            <nav aria-label="Page navigation">
                <ul class="pagination justify-content-center">
                    <li class="page-item ${paginaAtual === 1 ? 'disabled' : ''}">
                        <a class="page-link" href="#" onclick="irParaPagina(${paginaAtual - 1})" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>
        `;
        for (var i = 1; i <= totalPages; i++) {
            paginacaoHTML += `
                <li class="page-item ${paginaAtual === i ? 'active' : ''}"><a class="page-link" href="#" onclick="irParaPagina(${i})">${i}</a></li>
            `;
        }
        paginacaoHTML += `
                    <li class="page-item ${paginaAtual === totalPages ? 'disabled' : ''}">
                        <a class="page-link" href="#" onclick="irParaPagina(${paginaAtual + 1})" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                </ul>
            </nav>
        `;
        $('#paginacao').append(paginacaoHTML);
    }
}

// Função para ir para uma página específica
function irParaPagina(numeroPagina) {
    carregarClientesComPaginacao(numeroPagina, 5);
}

// Inicializar a lista de clientes com paginação
carregarClientesComPaginacao(1, 5);

// Importando a biblioteca InputMask
$.getScript("https://cdnjs.cloudflare.com/ajax/libs/jquery.inputmask/5.0.5/jquery.inputmask.min.js", function () {
    // Aplicando a máscara de telefone ao campo #telefone
    $(document).ready(function () {
        $('#telefone').inputmask('(99) 99999-9999');
    });
});
