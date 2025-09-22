import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="fade-in-long" // <<< adiciona animação suave ao container
      style={{
        minHeight: "100vh",
        backgroundImage: `linear-gradient(
          rgba(0,0,0,0.6),
          rgba(0,0,0,0.6)
        ), url('/images/teamwork.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container
        maxWidth="lg"
        style={{
          textAlign: "center",
          color: "#fff",
          padding: "50px 20px",
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          style={{ fontWeight: "bold" }}
        >
          🚀 Bem-vindo ao Portal de Oportunidades em Fortaleza
        </Typography>

        <Typography
          variant="body1"
          style={{
            maxWidth: "700px",
            margin: "20px auto",
            fontSize: "18px",
            lineHeight: "1.6",
            color: "#f1f1f1",
          }}
        >
          Encontre oportunidades em Fortaleza e além. Nosso portal reúne vagas de{" "}
          <strong>Estágio, Jovem Aprendiz, CLT e PJ</strong>, permitindo que você{" "}
          <strong>filtre por regime, nível e habilidades</strong>, favorite opções
          e acompanhe <strong>tendências do mercado</strong> em gráficos dinâmicos.
        </Typography>

        {/* Estatísticas resumidas */}
        <Grid container spacing={4} justifyContent="center" style={{ marginTop: "40px" }}>
          <Grid item xs={12} md={4}>
            <Typography variant="h4">💼 +120</Typography>
            <Typography variant="subtitle1">Vagas cadastradas</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h4">🌍 40%</Typography>
            <Typography variant="subtitle1">Remoto / Híbrido</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h4">🔥 React</Typography>
            <Typography variant="subtitle1">Skill mais pedida</Typography>
          </Grid>
        </Grid>

        {/* Botão para Jobs */}
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate("/jobs")}
          style={{
            marginTop: "50px",
            padding: "12px 32px",
            fontSize: "18px",
            fontWeight: "bold",
            borderRadius: "8px",
            textTransform: "none",
          }}
        >
          Buscar Vagas ➤
        </Button>
      </Container>
    </div>
  );
}

export default Home;