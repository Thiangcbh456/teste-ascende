// Jobs.js
import React, { useEffect, useState, useMemo } from "react";
import Papa from "papaparse";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./App.css";

function Jobs() {
  const [dados, setDados] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [filtroHabilidade, setFiltroHabilidade] = useState("Todas");
  const [filtroNivel, setFiltroNivel] = useState("Todos");
  const [filtroRegime, setFiltroRegime] = useState("Todos");
  const [buscaTexto, setBuscaTexto] = useState("");
  const [carregando, setCarregando] = useState(true);

  const [favoritos, setFavoritos] = useState(() => {
    const saved = localStorage.getItem("favoritos");
    return saved ? JSON.parse(saved) : [];
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  const [ordenarPor, setOrdenarPor] = useState("Nenhum");

  // ================= Effects =================
  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#1f1f1f" : "#ffffff";
    document.body.style.color = darkMode ? "#e0e0e0" : "#000000";
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    Papa.parse("/vagas_ficticias.csv", {
      download: true,
      header: true,
      delimiter: ";",
      complete: (result) => {
        setDados(result.data || []);
        setCarregando(false);
      },
      error: (error) => {
        console.error("Erro ao carregar CSV:", error);
        setCarregando(false);
      },
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  }, [favoritos]);

  // ================= Habilidades únicas =================
  const listaHabilidades = useMemo(() => {
    return Array.from(
      new Set(
        dados.flatMap((vaga) =>
          vaga.Habilidades ? vaga.Habilidades.split(",").map((h) => h.trim()) : []
        )
      )
    ).sort();
  }, [dados]);

  // ================= Filtros =================
  const dadosFiltrados = useMemo(() => {
    let filtrados = dados.filter((vaga) => {
      if (!vaga || !vaga.Titulo) return false;

      const categoriaOk =
        filtroCategoria === "Todas" || vaga.Categoria === filtroCategoria;
      const habilidadeOk =
        filtroHabilidade === "Todas" ||
        (vaga.Habilidades &&
          vaga.Habilidades.toLowerCase().includes(filtroHabilidade.toLowerCase()));
      const nivelOk = filtroNivel === "Todos" || vaga.Nivel === filtroNivel;
      const regimeOk = filtroRegime === "Todos" || vaga.Regime === filtroRegime;

      const buscaOk =
        (vaga.Titulo &&
          vaga.Titulo.toLowerCase().includes(buscaTexto.toLowerCase())) ||
        (vaga.Empresa &&
          vaga.Empresa.toLowerCase().includes(buscaTexto.toLowerCase())) ||
        (vaga.Habilidades &&
          vaga.Habilidades.toLowerCase().includes(buscaTexto.toLowerCase()));

      return categoriaOk && habilidadeOk && nivelOk && regimeOk && buscaOk;
    });

    if (ordenarPor === "EmpresaAZ") {
      filtrados.sort((a, b) => (a.Empresa || "").localeCompare(b.Empresa || ""));
    } else if (ordenarPor === "SalarioDesc") {
      const getValor = (s) => {
        if (!s) return 0;
        const match = s.replace(/\./g, "").replace("Bolsa", "").match(/\d+/g);
        return match ? parseInt(match[0]) : 0;
      };
      filtrados.sort((a, b) => getValor(b.Salario) - getValor(a.Salario));
    }

    return filtrados;
  }, [
    dados,
    filtroCategoria,
    filtroHabilidade,
    filtroNivel,
    filtroRegime,
    buscaTexto,
    ordenarPor,
  ]);

  // ================= Render =================
  return (
    <div
      className="fade-in-long"
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "1200px",
        margin: "0 auto",
        backgroundColor: darkMode ? "#1f1f1f" : "#ffffff",
        color: darkMode ? "#e0e0e0" : "#000000",
        minHeight: "100vh",
        transition: "background-color 0.5s ease, color 0.5s ease",
      }}
    >
      <h1>🚀 Oportunidades de Vagas em Fortaleza</h1>

      {/* Botão Dark/Light */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="btn-theme"
        style={{
          marginBottom: "20px",
          backgroundColor: darkMode ? "#f9f9f9" : "#333",
          color: darkMode ? "#333" : "#f9f9f9",
        }}
      >
        {darkMode ? "☀️ Modo Claro" : "🌙 Modo Escuro"}
      </button>

      {/* ================= FILTROS ================= */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
          alignItems: "center",
          backgroundColor: darkMode ? "#2b2b2b" : "#f9f9f9",
          padding: "16px",
          borderRadius: "8px",
        }}
      >
        <label>
          Categoria:{" "}
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
          >
            <option>Todas</option>
            <option>Estágio</option>
            <option>CLT</option>
            <option>Jovem Aprendiz</option>
            <option>PJ</option>
          </select>
        </label>

        <label>
          Habilidade:{" "}
          <select
            value={filtroHabilidade}
            onChange={(e) => setFiltroHabilidade(e.target.value)}
          >
            <option>Todas</option>
            {listaHabilidades.map((hab, i) => (
              <option key={i}>{hab}</option>
            ))}
          </select>
        </label>

        <label>
          Nível:{" "}
          <select
            value={filtroNivel}
            onChange={(e) => setFiltroNivel(e.target.value)}
          >
            <option>Todos</option>
            <option>Júnior</option>
            <option>Pleno</option>
            <option>Sênior</option>
          </select>
        </label>

        <label>
          Regime:{" "}
          <select
            value={filtroRegime}
            onChange={(e) => setFiltroRegime(e.target.value)}
          >
            <option>Todos</option>
            <option>Presencial</option>
            <option>Remoto</option>
            <option>Híbrido</option>
          </select>
        </label>

        <input
          type="text"
          placeholder="Buscar por título, empresa ou habilidade..."
          value={buscaTexto}
          onChange={(e) => setBuscaTexto(e.target.value)}
          style={{ padding: "5px", width: "250px" }}
        />

        <label>
          Ordenar por:{" "}
          <select
            value={ordenarPor}
            onChange={(e) => setOrdenarPor(e.target.value)}
          >
            <option value="Nenhum">Nenhum</option>
            <option value="EmpresaAZ">Empresa (A → Z)</option>
            <option value="SalarioDesc">Salário (Maior → Menor)</option>
          </select>
        </label>
      </div>

      {/* ================= RESUMO ================= */}
      <p>
        Mostrando <strong>{dadosFiltrados.length}</strong> de{" "}
        <strong>{dados.length}</strong> vagas.
      </p>

      {/* ================= CARDS ================= */}
      {!carregando && dadosFiltrados.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px,1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {dadosFiltrados.map((vaga, i) => (
            <div
              key={i}
              className={`job-card fade-in-short ${darkMode ? "dark" : ""}`}
              style={{
                padding: "15px",
                borderRadius: "10px",
                boxShadow: "0 1px 5px #00000033",
                backgroundColor: darkMode ? "#2a2a2a" : "#fff",
              }}
            >
              {/* Favorito */}
              <button
                className={`fav-btn ${
                  favoritos.some(
                    (f) => f.Titulo === vaga.Titulo && f.Empresa === vaga.Empresa
                  )
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  const isFav = favoritos.some(
                    (f) =>
                      f.Titulo === vaga.Titulo && f.Empresa === vaga.Empresa
                  );
                  setFavoritos(
                    isFav
                      ? favoritos.filter(
                          (f) =>
                            !(
                              f.Titulo === vaga.Titulo &&
                              f.Empresa === vaga.Empresa
                            )
                        )
                      : [...favoritos, vaga]
                  );
                }}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "transparent",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer",
                }}
              >
                ❤️
              </button>

              <h3>{vaga.Titulo}</h3>
              <p style={{ fontWeight: "bold", color: "#1e88e5" }}>
                {vaga.Empresa}
              </p>
              <p>
                📍 {vaga.Local} <br />
                💰 {vaga.Salario || "Não informado"}
              </p>
              <p>
                <strong>Habilidades:</strong> {vaga.Habilidades || "Não informado"}
              </p>

              {/* Botões ação */}
              <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                <button
                  className="apply-btn"
                  onClick={() =>
                    alert(
                      `✅ Você se candidatou à vaga: ${vaga.Titulo} (${vaga.Empresa})`
                    )
                  }
                >
                  Candidatar-se
                </button>
                {vaga.Link && (
                  <a
                    className="details-btn"
                    href={vaga.Link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver Detalhes
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        !carregando && <h3>🕵️ Nenhuma vaga encontrada</h3>
      )}

      {/* FAVORITOS */}
      {favoritos.length > 0 && (
        <div style={{ marginTop: "40px", borderTop: "2px solid", paddingTop: "20px" }}>
          <h2>❤️ Suas Vagas Favoritas</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
              gap: "20px",
            }}
          >
            {favoritos.map((vaga, i) => (
              <div
                key={`fav-${i}`}
                className="fav-card"
                style={{
                  backgroundColor: darkMode ? "#2a2a2a" : "#fff5f5",
                  padding: "10px",
                  borderRadius: "8px",
                  position: "relative",
                }}
              >
                <button
                  onClick={() =>
                    setFavoritos(
                      favoritos.filter(
                        (f) =>
                          !(f.Titulo === vaga.Titulo && f.Empresa === vaga.Empresa)
                      )
                    )
                  }
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    border: "none",
                    background: "transparent",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                >
                  ❌
                </button>
                <h4>{vaga.Titulo}</h4>
                <p style={{ fontWeight: "bold" }}>{vaga.Empresa}</p>
                <p style={{ fontSize: "14px" }}>
                  {vaga.Categoria} • {vaga.Local}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= GRÁFICOS ================= */}
      <h2 style={{ marginTop: "60px" }}>📈 Vagas por Categoria</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={["Estágio", "CLT", "Jovem Aprendiz", "PJ"].map((cat) => ({
              name: cat,
              qtd: dados.filter((d) => d.Categoria === cat).length,
            }))}
            dataKey="qtd"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
          >
            {["#2196F3", "#4CAF50", "#FF9800", "#9C27B0"].map((c, i) => (
              <Cell key={i} fill={c} />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <h2 style={{ marginTop: "40px" }}>📊 Top 10 Habilidades</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={Object.entries(
            dados.reduce((acc, v) => {
              v.Habilidades?.split(",").forEach((h) => {
                const s = h.trim();
                if (s) acc[s] = (acc[s] || 0) + 1;
              });
              return acc;
            }, {})
          )
            .map(([skill, qtd]) => ({ skill, qtd }))
            .sort((a, b) => b.qtd - a.qtd)
            .slice(0, 10)}
        >
          <XAxis dataKey="skill" angle={-45} textAnchor="end" height={80} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="qtd" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Jobs;
