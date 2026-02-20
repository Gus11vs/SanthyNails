// 🔒 Proteção da página admin
if (sessionStorage.getItem("adminLogado") !== "true") {
    window.location.href = "/login.html";
}

// 📥 Carregar feedbacks
async function carregarFeedbacks() {
    try {
        const resposta = await fetch("/feedbacks");
        const feedbacks = await resposta.json();

        const tabela = document.getElementById("tabelaAlunas");
        tabela.innerHTML = ""; // Limpa a tabela

        let soma = 0;

        // Se não houver feedbacks, mostra uma mensagem
        if (feedbacks.length === 0) {
            tabela.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #7f8c8d; padding: 30px;">Nenhum depoimento recebido ainda.</td></tr>`;
            document.getElementById("totalFeedbacks").innerText = "0";
            document.getElementById("mediaGeral").innerText = "0.0";
            return;
        }

        // Preenche a tabela
        feedbacks.forEach(fb => {
            soma += fb.nota;
            
            // Gera as estrelas visualmente (ex: ⭐⭐⭐⭐)
            const estrelas = "★".repeat(fb.nota) + "☆".repeat(5 - fb.nota);

            tabela.innerHTML += `
                <tr>
                    <td style="font-weight: 500;">${fb.nome}</td>
                    <td class="stars">${estrelas}</td>
                    <td class="col-comentario">${fb.comentario}</td>
                    <td class="text-center">
                        <button class="btn-delete" onclick="deletar(${fb.id})" title="Excluir Depoimento">
                            <span class="material-symbols-outlined" style="font-size: 20px;">delete</span>
                        </button>
                    </td>
                </tr>
            `;
        });

        // Atualiza os Cards Superiores
        const media = (soma / feedbacks.length).toFixed(1);
        document.getElementById("totalFeedbacks").innerText = feedbacks.length;
        document.getElementById("mediaGeral").innerText = media;

    } catch (erro) {
        console.error("Erro ao carregar feedbacks:", erro);
        alert("Erro ao carregar os dados. Verifique se o servidor está rodando.");
    }
}

// 🗑 Deletar feedback (com confirmação)
async function deletar(id) {
    // Confirmação de segurança antes de apagar
    const confirmacao = confirm("Tem certeza que deseja apagar este depoimento? Esta ação não pode ser desfeita.");
    
    if (confirmacao) {
        try {
            await fetch("/feedbacks/" + id, {
                method: "DELETE"
            });
            // Recarrega a tabela após apagar
            carregarFeedbacks();
        } catch (erro) {
            console.error("Erro ao deletar:", erro);
            alert("Não foi possível deletar o depoimento.");
        }
    }
}

// 🚪 Logout
function logout() {
    sessionStorage.removeItem("adminLogado");
    window.location.href = "/login.html";
}

// 🚀 Iniciar página
carregarFeedbacks();