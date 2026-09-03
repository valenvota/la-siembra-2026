import { useApp, useRevealObserver } from "./lib/app";
import { Nav } from "./components/Nav";
import { HeroAntes, HeroDurante, AhoraProximo } from "./components/Hero";
import { QueEs, QueEncontras, MuestrasLibres, Streaming, Colaboradores, InfoPractica, Footer } from "./components/Sections";
import { Programa } from "./components/Programa";
import { PlanoVivo } from "./components/PlanoVivo";

export function App() {
  const { mode } = useApp();
  useRevealObserver(mode);

  return (
    <>
      <Nav />
      <main key={mode}>
        {mode === "antes" ? (
          <>
            <HeroAntes />
            <QueEs />
            <QueEncontras />
            <PlanoVivo />
            <Programa />
            <MuestrasLibres />
            <Streaming />
            <InfoPractica />
            <Colaboradores />
          </>
        ) : (
          <>
            <HeroDurante />
            {/* ROADMAP (no prioritario): en modo Durante, ubicar <Streaming /> (transmisión de
                YouTube) inmediatamente acá, debajo del hero. Hoy vive más abajo (línea ~33). */}
            <AhoraProximo />
            <PlanoVivo />
            <Programa />
            <MuestrasLibres />
            <Streaming />
            <InfoPractica />
            <Colaboradores />
            <QueEs secondary />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
