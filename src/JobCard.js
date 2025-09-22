import React from "react";

function JobCard({ vaga, favoritos, setFavoritos, onApply }) {
  // Usa id se houver, senão combina Titulo + Empresa
  const isFav = favoritos.some(
    (f) =>
      (vaga.id ? f.id === vaga.id : f.Titulo === vaga.Titulo && f.Empresa === vaga.Empresa)
  );

  const toggleFavorito = () => {
    if (isFav) {
      setFavoritos(
        favoritos.filter((f) =>
          vaga.id ? f.id !== vaga.id : !(f.Titulo === vaga.Titulo && f.Empresa === vaga.Empresa)
        )
      );
    } else {
      setFavoritos([...favoritos, vaga]);
    }
  };

  return (
    <div className="job-card fade-in-short">
      {/* Botão Favoritar */}
      <button
        aria-label={isFav ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
        title={isFav ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
        className={`fav-btn ${isFav ? "active" : ""}`}
        onClick={toggleFavorito}
      >
        ❤️
      </button>

      {/* Conteúdo */}
      <h3>{vaga.Titulo || "Cargo não informado"}</h3>
      <p className="empresa-name">{vaga.Empresa || "Empresa não informada"}</p>

      <p>
        📍 {vaga.Local || "Local não informado"} <br /> 💰{" "}
        {vaga.Salario || "Salário não informado"}
      </p>

      <p>
        <strong>Habilidades:</strong> {vaga.Habilidades || "Não especificadas"}
      </p>

      {/* Badges */}
      <div className="badges" style={{ marginBottom: "10px" }}>
        {vaga.Categoria && (
          <span
            className={
              vaga.Categoria === "CLT"
                ? "badge-clt"
                : vaga.Categoria === "Estágio"
                ? "badge-estagio"
                : vaga.Categoria === "Jovem Aprendiz"
                ? "badge-aprendiz"
                : vaga.Categoria === "PJ"
                ? "badge-pj"
                : ""
            }
          >
            {vaga.Categoria}
          </span>
        )}
        {vaga.Nivel && <span className="badge-nivel">{vaga.Nivel}</span>}
        {vaga.Regime && <span className="badge-regime">{vaga.Regime}</span>}
      </div>

      {/* Botões de ação */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button
          className="apply-btn"
          onClick={() => vaga && onApply(vaga)}
        >
          Candidatar-se
        </button>

        {vaga.Link && (
          <a
            href={vaga.Link}
            target="_blank"
            rel="noopener noreferrer"
            className="details-btn"
          >
            Ver Detalhes
          </a>
        )}
      </div>
    </div>
  );
}

export default JobCard;