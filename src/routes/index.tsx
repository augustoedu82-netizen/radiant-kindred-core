import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  Check,
  CreditCard,
  FileCheck2,
  Globe2,
  Landmark,
  Mail,
  Receipt,
  ShieldCheck,
  Sparkle,
  Timer,
} from "lucide-react";
import heroImage from "@/assets/hero-llc.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "DestravaUSA — Abra sua empresa nos EUA sem sair do Brasil" },
      {
        name: "description",
        content:
          "LLC nos EUA em até 5 dias úteis: EIN, endereço fiscal, registered agent e suporte para conta bancária americana. 100% remoto, em português.",
      },
      {
        property: "og:title",
        content: "DestravaUSA — Sua empresa americana em dias, não meses",
      },
      {
        property: "og:description",
        content:
          "Abertura de LLC, EIN, endereço nos EUA, conta bancária e compliance anual. Processo remoto com suporte em português.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

const WHATSAPP = "https://wa.me/5527998549048";

const steps = [
  { n: "01", t: "Você envia seus dados", d: "Passaporte, endereço e nome desejado da empresa. Leva 10 minutos." },
  { n: "02", t: "Preparamos tudo", d: "Documentação revisada por especialistas antes de qualquer protocolo." },
  { n: "03", t: "Registro no estado", d: "Protocolamos no estado escolhido e acompanhamos até a aprovação." },
  { n: "04", t: "EIN emitido", d: "Empresa aberta, documentos digitais na sua mão e próximo passo: o banco." },
];

const states = [
  { name: "Wyoming", tag: "Mais escolhido", d: "Abertura em 1 dia, privacidade máxima e custo anual baixo." },
  { name: "Novo México", tag: "Sem annual report", d: "Menor manutenção anual — ideal para quem começa enxuto." },
  { name: "Flórida", tag: "Operação real", d: "Melhor para quem vende, contrata ou tem presença nos EUA." },
  { name: "Delaware", tag: "Investimento", d: "Padrão de startups que buscam investidor americano." },
];

const includes = [
  { icon: Building2, t: "Abertura da LLC", d: "Registro estadual, articles of organization e operating agreement." },
  { icon: FileCheck2, t: "EIN (Tax ID)", d: "Seu CNPJ americano, incluído no processo, sem custo extra." },
  { icon: Mail, t: "Endereço nos EUA", d: "Endereço comercial real, com correspondência digitalizada." },
  { icon: ShieldCheck, t: "Registered agent", d: "Agente registrado no estado por 12 meses, obrigatório por lei." },
  { icon: Landmark, t: "Suporte bancário", d: "Mercury, Relay, Wise e Payoneer: preparamos toda a aplicação." },
  { icon: Receipt, t: "Compliance anual", d: "Calendário fiscal, Form 5472 e consultoria tributária inclusa." },
];

const banks = ["Mercury", "Relay", "Wise", "Payoneer", "Revolut", "Lili"];

const plans = [
  {
    name: "Start",
    price: "US$ 349",
    note: "+ taxas do estado",
    d: "Para quem só precisa da empresa aberta e funcionando.",
    features: ["Abertura da LLC", "EIN (Tax ID)", "Registered agent 12 meses", "Operating agreement", "Suporte no WhatsApp"],
    cta: "Começar agora",
    highlight: false,
  },
  {
    name: "Operação",
    price: "US$ 599",
    note: "+ taxas do estado",
    d: "O plano completo: empresa, endereço, banco e compliance.",
    features: [
      "Tudo do Start",
      "Endereço comercial nos EUA",
      "Correspondência digitalizada",
      "Aplicação bancária assistida",
      "Consultoria tributária anual",
      "Calendário de compliance",
    ],
    cta: "Quero o completo",
    highlight: true,
  },
  {
    name: "Já tenho LLC",
    price: "US$ 249",
    note: "por ano",
    d: "Sua empresa existe, mas está sem manutenção fiscal.",
    features: ["Diagnóstico da empresa", "Regularização de pendências", "Form 5472 e annual report", "Troca de registered agent"],
    cta: "Regularizar",
    highlight: false,
  },
];

const faqs = [
  {
    q: "Preciso ir aos EUA ou ter visto?",
    a: "Não. Todo o processo é remoto e não exige visto, green card ou viagem. Estrangeiros não residentes podem ser donos de 100% de uma LLC.",
  },
  {
    q: "Vou pagar imposto nos EUA?",
    a: "Se você não é residente, não tem estoque em território americano e não tem sócio americano, sua LLC normalmente é isenta de imposto federal — restando apenas a declaração anual obrigatória.",
  },
  {
    q: "Em quanto tempo a empresa fica pronta?",
    a: "Em Wyoming o registro sai em cerca de 1 dia útil. Com EIN emitido, o processo completo leva de 5 a 20 dias úteis, dependendo do IRS.",
  },
  {
    q: "Consigo abrir conta bancária de verdade?",
    a: "Sim. Preparamos toda a documentação e a aplicação em bancos e fintechs que aceitam empresas de não residentes, de forma remota.",
  },
];

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#top" className="flex items-center gap-2 font-display text-lg font-extrabold tracking-tight">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Sparkle className="size-4" />
          </span>
          Destrava<span className="text-gradient-accent">USA</span>
        </a>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a className="transition-colors hover:text-foreground" href="#como-funciona">Como funciona</a>
          <a className="transition-colors hover:text-foreground" href="#estados">Estados</a>
          <a className="transition-colors hover:text-foreground" href="#planos">Planos</a>
          <a className="transition-colors hover:text-foreground" href="#faq">Dúvidas</a>
        </nav>
        <a href={WHATSAPP} className="btn-primary !px-5 !py-2.5 !text-sm">
          Falar com especialista
        </a>
      </div>
    </header>
  );
}

function Index() {
  return (
    <div id="top" className="min-h-screen">
      <Nav />

      {/* Hero */}
      <section className="hero-glow relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-20 lg:grid-cols-[1.05fr_1fr] lg:py-28">
          <div>
            <span className="eyebrow">+800 empresas abertas</span>
            <h1 className="mt-5 text-balance text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
              Abra sua empresa nos <span className="text-gradient-accent">EUA</span> sem sair do Brasil
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              LLC registrada, EIN emitido, endereço americano e conta bancária. 100% remoto,
              preço fechado e suporte humano em português do início ao fim.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a href="#planos" className="btn-primary">
                Abrir minha empresa <ArrowRight className="size-4" />
              </a>
              <a href={WHATSAPP} className="btn-ghost">Tirar uma dúvida</a>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-8">
              {[
                ["5 dias", "Média de abertura"],
                ["US$ 0", "Imposto federal*"],
                ["100%", "Processo remoto"],
              ].map(([k, v]) => (
                <div key={v}>
                  <dt className="font-display text-2xl font-bold text-primary">{k}</dt>
                  <dd className="mt-1 text-xs text-muted-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative">
            <img
              src={heroImage}
              alt="Certificado de LLC americana, passaporte e cartão bancário de empresa aberta nos EUA"
              width={1280}
              height={1120}
              className="w-full rounded-3xl border border-border shadow-[var(--shadow-card)]"
            />
            <div className="surface-card absolute -bottom-6 left-4 flex items-center gap-3 px-4 py-3 sm:left-8">
              <span className="grid size-9 place-items-center rounded-full bg-primary/15 text-primary">
                <Timer className="size-4" />
              </span>
              <div className="text-sm">
                <p className="font-semibold">EIN emitido</p>
                <p className="text-xs text-muted-foreground">Empresa pronta para faturar em dólar</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section id="como-funciona" className="border-y border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <span className="eyebrow">Como funciona</span>
          <h2 className="mt-4 max-w-2xl text-3xl font-bold sm:text-4xl">
            Sua empresa no exterior em dias, não meses
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Cuidamos de toda a burocracia. Você acompanha cada etapa e recebe os documentos oficiais digitalizados.
          </p>
          <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <li key={s.n} className="surface-card p-6">
                <span className="font-display text-sm font-bold text-primary">{s.n}</span>
                <h3 className="mt-3 text-lg font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Included */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <span className="eyebrow">Tudo incluído</span>
        <h2 className="mt-4 max-w-2xl text-3xl font-bold sm:text-4xl">
          Uma operação americana completa, não só um papel registrado
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {includes.map((i) => (
            <article key={i.t} className="surface-card p-6">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/12 text-primary">
                <i.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{i.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{i.d}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Banking */}
      <section className="border-y border-border bg-surface/40">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="eyebrow">Conta bancária</span>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Receba em dólar com conta americana</h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Trabalhamos com bancos e fintechs que aceitam empresas de não residentes. Preparamos
              a documentação, revisamos a aplicação e acompanhamos até a aprovação.
            </p>
            <ul className="mt-7 space-y-3 text-sm">
              {[
                "Aplicação remota na maioria dos casos",
                "Documentação preparada e revisada por nós",
                "Cartão corporativo e transferências internacionais",
                "Parceiro de câmbio para trazer dinheiro ao Brasil",
              ].map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {banks.map((b) => (
              <div
                key={b}
                className="surface-card grid place-items-center gap-2 px-4 py-7 text-center text-sm font-semibold"
              >
                <CreditCard className="size-5 text-primary" />
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* States */}
      <section id="estados" className="mx-auto max-w-6xl px-5 py-20">
        <span className="eyebrow">Onde registrar</span>
        <h2 className="mt-4 max-w-2xl text-3xl font-bold sm:text-4xl">
          Escolhemos o estado certo para o seu negócio
        </h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {states.map((s) => (
            <article key={s.name} className="surface-card flex flex-col gap-3 p-6">
              <Globe2 className="size-5 text-primary" />
              <h3 className="font-display text-xl font-bold">{s.name}</h3>
              <span className="w-fit rounded-full bg-primary/12 px-3 py-1 text-xs font-semibold text-primary">
                {s.tag}
              </span>
              <p className="text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Tax */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="surface-card relative overflow-hidden p-8 sm:p-12">
          <div className="hero-glow pointer-events-none absolute inset-0" />
          <div className="relative max-w-2xl">
            <span className="eyebrow">Vantagem tributária</span>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Estrangeiros podem ser isentos de imposto federal nos EUA
            </h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Se você não é residente americano, não mantém estoque nos EUA e não tem sócios
              americanos, sua LLC pode ficar isenta de imposto federal — cumprindo apenas a
              declaração anual obrigatória. Nós fazemos essa declaração para você.
            </p>
            <a href={WHATSAPP} className="btn-primary mt-8">
              Entender meu caso <ArrowRight className="size-4" />
            </a>
            <p className="mt-6 text-xs text-muted-foreground">
              *Assessoria privada. Não somos órgão governamental. A isenção depende da sua estrutura.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="planos" className="border-y border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <span className="eyebrow">Planos</span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Preço fechado, sem taxa escondida</h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {plans.map((p) => (
              <article
                key={p.name}
                className={`surface-card flex flex-col p-7 ${
                  p.highlight ? "ring-2 ring-primary/60 lg:-mt-4 lg:mb-4" : ""
                }`}
              >
                {p.highlight && (
                  <span className="mb-4 w-fit rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                    Mais escolhido
                  </span>
                )}
                <h3 className="font-display text-xl font-bold">{p.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
                <p className="mt-6 font-display text-4xl font-extrabold">{p.price}</p>
                <p className="mt-1 text-xs text-muted-foreground">{p.note}</p>
                <ul className="mt-7 flex-1 space-y-3 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={WHATSAPP}
                  className={`mt-8 ${p.highlight ? "btn-primary" : "btn-ghost"} w-full`}
                >
                  {p.cta}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-5 py-20">
        <span className="eyebrow">Dúvidas frequentes</span>
        <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Antes de começar</h2>
        <div className="mt-10 divide-y divide-border">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-semibold">
                {f.q}
                <ArrowRight className="size-4 shrink-0 text-primary transition-transform group-open:rotate-90" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="surface-card hero-glow flex flex-col items-start gap-6 p-10 sm:p-14">
          <h2 className="max-w-2xl text-balance text-3xl font-bold sm:text-4xl">
            Destrave sua operação nos EUA ainda esta semana
          </h2>
          <p className="max-w-xl text-muted-foreground">
            Conversa sem compromisso: entendemos seu negócio e indicamos a estrutura certa.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={WHATSAPP} className="btn-primary">
              Falar no WhatsApp <ArrowRight className="size-4" />
            </a>
            <a href="#planos" className="btn-ghost">Ver planos</a>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display font-bold text-foreground">
            Destrava<span className="text-gradient-accent">USA</span>
          </p>
          <p>© {new Date().getFullYear()} DestravaUSA · Assessoria privada para empresas nos EUA</p>
        </div>
      </footer>
    </div>
  );
}
