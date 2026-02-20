// =========================
// MENU MOBILE & SCROLL
// =========================
const mobileMenuBtn = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');
const navbar = document.getElementById('navbar');

// Abrir/Fechar Menu no Celular
mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Fechar menu ao clicar em um link (mobile)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Efeito da Barra Superior ao Rolar a Tela
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// =========================
// ANIMAÇÃO DE APARECER (SCROLL)
// =========================
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.1 });

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));


// =========================
// ENVIAR FEEDBACK PARA API
// =========================
window.enviarFeedback = async function() {
  const nome = document.getElementById('alunaNome').value;
  const nota = parseInt(document.getElementById('alunaNota').value);
  const comentario = document.getElementById('alunaComentario').value;

  if (!nome || !comentario || isNaN(nota)) {
    alert("Preencha todos os campos corretamente!");
    return;
  }

  // Alteração importante: agora usando caminho relativo (como combinamos antes)
  try {
    const resposta = await fetch("/feedbacks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, nota, comentario })
    });

    if (!resposta.ok) throw new Error("Erro ao enviar feedback");

    alert("Avaliação enviada com sucesso! Muito obrigada!");

    // Limpar campos
    document.getElementById('alunaNome').value = "";
    document.getElementById('alunaNota').value = "5";
    document.getElementById('alunaComentario').value = "";

    carregarFeedbacks(); // Recarrega na tela

  } catch (erro) {
    console.error("Erro:", erro);
    alert("Erro ao conectar com o servidor.");
  }
}

// =========================
// CARREGAR FEEDBACKS
// =========================
window.carregarFeedbacks = async function() {
  const lista = document.getElementById('listaFeedbacks');
  lista.innerHTML = "<p style='text-align: center; color: #7f8c8d;'>Carregando avaliações...</p>";

  try {
    const resposta = await fetch("/feedbacks");
    const dados = await resposta.json();

    lista.innerHTML = "";

    if (dados.length === 0) {
      lista.innerHTML = "<p style='text-align: center; color: #7f8c8d;'>Seja a primeira a avaliar o curso!</p>";
      return;
    }

    // Para a Landing Page, pegamos apenas os 4 últimos depoimentos para não ficar gigante
    const depoimentosRecentes = dados.slice(0, 4);

    depoimentosRecentes.forEach((item) => {
      const estrelas = "★".repeat(item.nota) + "☆".repeat(5 - item.nota);
      const div = document.createElement("div");
      div.className = "feedback-item hidden show"; // Já entra visível
      div.innerHTML = `
        <div class="star-rating">${estrelas}</div>
        <p style="margin: 0; color: #555;">"${item.comentario}"</p>
        <p style="margin: 15px 0 0 0; font-weight: bold; color: #4b0082;">- ${item.nome}</p>
      `;
      lista.appendChild(div);
    });

  } catch (erro) {
    console.error("Erro ao carregar:", erro);
    lista.innerHTML = "<p style='text-align: center; color: red;'>Erro ao carregar avaliações.</p>";
  }
}

// =========================
// SLIDESHOW DO TOPO
// =========================
const slides = document.querySelectorAll('.slide');
let slideAtual = 0;

if (slides.length > 0) {
    // 3000 = 3 segundos. Se quiser mais rápido, mude para 2000 ou 1500 (1.5s).
    setInterval(() => {
        // Tira a visibilidade da imagem atual
        slides[slideAtual].classList.remove('active');
        
        // Vai para a próxima imagem. Se for a última, volta para a primeira (0)
        slideAtual = (slideAtual + 1) % slides.length;
        
        // Coloca a visibilidade na nova imagem
        slides[slideAtual].classList.add('active');
    }, 2000); 
}

// =========================
// INICIAR FUNÇÕES
// =========================
carregarFeedbacks();