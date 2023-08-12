import express from "express";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cors()); // Habilitando o suporte CORS
let identificadorUnicoUsuario = 0;
let identificadorUnicoRecado = 0;
const usuarios = [
    {
            nome: "Jennifer",
            senha: "123",
            email: "jenni@gmail.com",
            identificador: identificadorUnicoUsuario++
    }
];


const recados = [
    {
        titulo: "recado 1",
        descricao: "descrição 1",
        usuarioId: 0,
        identificador: identificadorUnicoRecado ++
    },
    {
        titulo: "recado 2",
        descricao: "descrição 2",
        usuarioId: 0,
        identificador: identificadorUnicoRecado ++
    },
    {
        titulo: "recado 3",
        descricao: "descrição 3",
        usuarioId: 0,
        identificador: identificadorUnicoRecado ++
    },
    {
        titulo: "recado 4",
        descricao: "descrição 4",
        usuarioId: 0,
        identificador: identificadorUnicoRecado ++
    }, {
        titulo: "recado 5",
        descricao: "descrição 5",
        usuarioId: 0,
        identificador: identificadorUnicoRecado ++
    }, {
        titulo: "recado 6",
        descricao: "descrição 6",
        usuarioId: 0,
        identificador: identificadorUnicoRecado ++
    }
];


//CRIAR USUÁRIOS
app.post("/usuarios", function (requisicao, resposta) {
    const bodyInvalido =
        !requisicao.body.nome || !requisicao.body.senha || !requisicao.body.email;

    const existeEmail = usuarios.some(function (usuario) {
        return usuario.email === requisicao.body.email;
    });
    if (bodyInvalido) {
        resposta.status(400);
        resposta.send("Dados inválidos");
    } else if (existeEmail) {
        resposta.status(400);
        resposta.send("Email já cadastrado");
    } else {
        const novoUsuario = {
            nome: requisicao.body.nome,
            senha: requisicao.body.senha,
            email: requisicao.body.email,
        };
        novoUsuario.identificador = identificadorUnicoUsuario;
        identificadorUnicoUsuario++;
        usuarios.push(novoUsuario);
        resposta.json({
            mensagem: "Usuário criado com sucesso",
            usuario: novoUsuario,
        });
    }
});

//LOGIN DO USUÁRIO
app.post("/usuarios/login", function (requisicao, resposta) {
    const email = requisicao.body.email;
    const senha = requisicao.body.senha;

    const usuarioEncontrado = usuarios.find(function (usuario) {
        return usuario.email === email && usuario.senha === senha;
    });
    if (usuarioEncontrado) {
        resposta.json({
            mensagem: "Usuário logado com sucesso",
            usuario: usuarioEncontrado,
        });
    } else {
        resposta.status(401);
        resposta.send("Email ou senha inválidos");
    }
});

//USUARIOS CADASTRADOS
app.get("/usuarios", function (requisicao, resposta) {
    resposta.json(usuarios);
});


//CRIAR RECADOS
app.post("/recados", function (requisicao, resposta) {
    const bodyInvalido =
        !requisicao.body.titulo || !requisicao.body.descricao || !requisicao.body.usuarioId;

    // a função trim() é um metodo de Js que remove os espaços em branco do início e do final de uma string.

    if (bodyInvalido || requisicao.body.titulo.trim() === "" || requisicao.body.descricao.trim() === "") {
        resposta.status(400);
        resposta.send("Dados inválidos");
    } else {
        const usuarioId = parseInt(requisicao.body.usuarioId);

        const usuarioEncontrado = usuarios.find(function (usuario) {
            return usuario.identificador === usuarioId;
        });

        if (!usuarioEncontrado) {
            resposta.status(404);
            resposta.send("Usuário não encontrado");
        } else {
            const novoRecado = {
                titulo: requisicao.body.titulo,
                descricao: requisicao.body.descricao,
                usuarioId: usuarioId,
            };
            novoRecado.identificador = identificadorUnicoRecado;
            identificadorUnicoRecado++;
            recados.push(novoRecado);
            resposta.json({
                mensagem: "Recado criado com sucesso",
                recado: novoRecado,
            });
        }
    }
});

//LISTAR TODOS OS RECADOS DE UM USUÁRIO
app.get("/recados/:usuarioId", function (requisicao, resposta) {
    const usuarioId = parseInt(requisicao.params.usuarioId);
    const recadosDoUsuario = recados.filter(function (recado) {
        return recado.usuarioId === usuarioId;
    });

    const pageSize = 2; // Tamanho máximo de recados por página
    const page = parseInt(requisicao.query.page || 1);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const recadosPaginados = recadosDoUsuario.slice(startIndex, endIndex);

    resposta.json({
        quantidade: recadosDoUsuario.length,
        recados: recadosPaginados,
    });
});

//ATUALIZAR RECADO
app.put("/recados/:id", function (requisicao, resposta) {
    const id = parseInt(requisicao.params.id);
    const recadoEncontrado = recados.find(function (recado) {
        return recado.identificador === id;
    });

    if (!recadoEncontrado) {
        resposta.status(404);
        resposta.send("Recado não encontrado");
    } else {
        const bodyInvalido = 
            !requisicao.body.titulo || !requisicao.body.descricao;
        if (bodyInvalido) {
            resposta.status(400);
            resposta.send("Dados inválidos");
        } else {
            recadoEncontrado.titulo = requisicao.body.titulo;
            recadoEncontrado.descricao = requisicao.body.descricao;
            resposta.json({
                mensagem: "Recado atualizado com sucesso",
                recado: recadoEncontrado,
            });
        }
    }
});

//DELETAR RECADO
app.delete("/recados/:id", function (requisicao, resposta) {
    const id = parseInt(requisicao.params.id);
    const indice = recados.findIndex(function (recado) {
        return recado.identificador === id;
    });

    if (indice === -1) {
        resposta.status(404);
        resposta.send("Recado não encontrado");
    } else {
        recados.splice(indice, 1);
        resposta.json({
            mensagem: "Recado removido com sucesso",
        });
    }
});

// Rota de Bem-vindo
app.get("/", function (requisicao, resposta) {
    resposta.send("Bem-vindo à nossa aplicação no web service!");
});

app.listen(3000, function () {
    console.log("servidor rodando na porta 3000: url http://localhost:3000");
});