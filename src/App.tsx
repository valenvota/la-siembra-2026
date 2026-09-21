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
            {/* En DURANTE la transmisión (player de Castr) va inmediatamente debajo del hero:
                es el momento central del evento y el CTA "Ver transmisión" scrollea acá (#streaming). */}
            <Streaming />
            <AhoraProximo />
            <PlanoVivo />
            <Programa />
            <MuestrasLibres />
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
