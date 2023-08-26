import express from "express";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cors()); // Habilitando o suporte CORS
let identificadorUnicoUsuario = 0;
let identificadorUnicoRecado = 0;
let recadosExcluidos = []; // Inicialmente, não há recados excluídos
const usuarios = [
    {
        nome: "Jennifer",
        senha: "123",
        email: "jenni@gmail.com",
        identificador: identificadorUnicoUsuario++
    },
    {
        nome: "Paulo",
        senha: "456",
        email: "paulo@gmail.com",
        identificador: identificadorUnicoUsuario++
    }
];

const recadosExcluidosPorUsuario = {};


const recados = [
    {
        titulo: "Meeting reminder",
        descricao: "Remind everyone about the team meeting tomorrow at 10 am in the conference room.",
        usuarioId: 0,
        identificador: identificadorUnicoRecado++
    },
    {
        titulo: "Reading suggestion",
        descricao: "I recommend everyone to read the new article on web development best practices.",
        usuarioId: 0,
        identificador: identificadorUnicoRecado++
    },
    {
        titulo: "System update",
        descricao: "The system will be updated on Friday night, so check it out to save yourself some trouble.",
        usuarioId: 0,
        identificador: identificadorUnicoRecado++
    },
    {
        titulo: "Customer feedback",
        descricao: "We received great feedback from customers on the latest design. Congratulations to all of you!",
        usuarioId: 0,
        identificador: identificadorUnicoRecado++
    }, {
        titulo: "Surprise birthday!",
        descricao: "We're getting together on Friday to celebrate Paulo's birthday. Bring something to share!",
        usuarioId: 0,
        identificador: identificadorUnicoRecado++
    }, {
        titulo: "Thanks to all",
        descricao: "I want to thank everyone for their hard work on the project. We managed to overcome the challenges together.",
        usuarioId: 0,
        identificador: identificadorUnicoRecado++
    },


    {
        titulo: "recado 1 paulo",
        descricao: "descrição 1 paulo",
        usuarioId: 1,
        identificador: identificadorUnicoRecado++
    },
    {
        titulo: "recado 2 paulo",
        descricao: "descrição 2 paulo",
        usuarioId: 1,
        identificador: identificadorUnicoRecado++
    },
    {
        titulo: "recado 3 paulo",
        descricao: "descrição 3 paulo",
        usuarioId: 1,
        identificador: identificadorUnicoRecado++
    },
    {
        titulo: "recado 4 paulo",
        descricao: "descrição 4 paulo",
        usuarioId: 1,
        identificador: identificadorUnicoRecado++
    }, {
        titulo: "recado 5 paulo",
        descricao: "descrição 5 paulo",
        usuarioId: 1,
        identificador: identificadorUnicoRecado++
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

    if (!recadosExcluidosPorUsuario[usuarioId]) {
        recadosExcluidosPorUsuario[usuarioId] = [];
    }

    recados.splice(indice, 1);
    recadosExcluidosPorUsuario[usuarioId].push(id); // Adicionar o ID à lista de recados excluídos do usuário
    resposta.json({
        mensagem: "Recado removido com sucesso",
    });
}
);

app.put('/recados/:usuarioId/:id/restaurar', (req, res) => {
    const usuarioId = req.params.usuarioId;
    const recadoId = parseInt(req.params.id);

    if (recadosExcluidosPorUsuario[usuarioId]) {
        const index = recadosExcluidosPorUsuario[usuarioId].indexOf(recadoId);
        if (index !== -1) {
            // Remover o recado da lista de excluídos do usuário
            recadosExcluidosPorUsuario[usuarioId].splice(index, 1);
            res.status(200).json({ message: 'Recado restaurado com sucesso.' });
        } else {
            res.status(404).json({ error: 'Recado não encontrado na lista de excluídos.' });
        }
    } else {
        res.status(404).json({ error: 'Recados excluídos não encontrados para o usuário.' });
    }
});


// Rota de Bem-vindo
app.get("/", function (requisicao, resposta) {
    resposta.send("Bem-vindo à nossa aplicação no web service!");
});

app.listen(3000, function () {
    console.log("servidor rodando na porta 3000: url http://localhost:3000");
});