async function logar() {
    const usuarioInput = document.getElementById("usuario");
    const senhaInput = document.getElementById("senha");
    const erroMsg = document.getElementById("erro");
    const btnLogin = document.querySelector(".btn-login");
    const originalBtnText = btnLogin.innerHTML;

    const usuario = usuarioInput.value;
    const senha = senhaInput.value;

    // Limpa mensagem de erro anterior
    erroMsg.innerText = "";
    erroMsg.style.color = "#e74c3c"; // Reseta cor para vermelho

    if (!usuario || !senha) {
        erroMsg.innerText = "Por favor, preencha todos os campos.";
        return;
    }

    // Feedback visual de carregamento no botão
    btnLogin.innerHTML = "Verificando...";
    btnLogin.disabled = true;
    btnLogin.style.opacity = "0.7";
  
    try {
      const resposta = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        // Envia usuário E senha agora
        body: JSON.stringify({ usuario, senha })
      });
  
      const dados = await resposta.json();
  
      if (dados.sucesso) {
        // Sucesso! Feedback visual antes de redirecionar
        btnLogin.innerHTML = "Sucesso! Redirecionando...";
        btnLogin.style.background = "#2ecc71"; // Verde sucesso
        erroMsg.style.color = "#2ecc71";
        erroMsg.innerText = "Login efetuado com sucesso.";
        
        sessionStorage.setItem("adminLogado", "true");
        
        // Pequeno delay para o usuário ver a mensagem de sucesso
        setTimeout(() => {
            window.location.href = "/admin.html";
        }, 1000);

      } else {
        // Erro vindo do servidor
        throw new Error(dados.mensagem || "Usuário ou senha incorretos.");
      }
    } catch (error) {
      // Exibe o erro na tela
      erroMsg.innerText = error.message;
      
      // Efeito de "tremer" na caixa de login em caso de erro
      const loginCard = document.querySelector(".login-card");
      loginCard.style.animation = "shake 0.4s ease-in-out";
      setTimeout(() => { loginCard.style.animation = ""; }, 400);

    } finally {
        // Restaura o botão se não houve redirecionamento
        if (erroMsg.style.color !== "rgb(46, 204, 113)") { // Se não for verde (sucesso)
            btnLogin.innerHTML = originalBtnText;
            btnLogin.disabled = false;
            btnLogin.style.opacity = "1";
            btnLogin.style.background = ""; // Reseta background
        }
    }
  }

// Adiciona essa animação de erro no final do arquivo JS (ou no CSS se preferir)
document.head.insertAdjacentHTML("beforeend", `<style>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-5px); }
  40%, 80% { transform: translateX(5px); }
}
</style>`);