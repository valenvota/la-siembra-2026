import { useApp, useRevealObserver } from "./lib/app";
import { Nav } from "./components/Nav";
import { HeroAntes, HeroDurante, AhoraProximo } from "./components/Hero";
import { QueEs, QueEncontras, Streaming, Colaboradores, InfoPractica, Footer } from "./components/Sections";
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
            <Streaming />
            <InfoPractica />
            <Colaboradores />
          </>
        ) : (
          <>
            <HeroDurante />
            <AhoraProximo />
            <PlanoVivo />
            <Programa />
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
