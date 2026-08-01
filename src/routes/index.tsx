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
  Star,
  Timer,
} from "lucide-react";
import heroImage from "@/assets/hero-llc-light.jpg";

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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

const WHATSAPP = "https://wa.me/5527998549048";

const steps = [
  { n: "1", t: "Você envia seus dados", d: "Passaporte, endereço e nome desejado da empresa. Leva 10 minutos." },
  { n: "2", t: "Preparamos tudo", d: "Documentação revisada por especialistas antes de qualquer protocolo." },
  { n: "3", t: "Registro no estado", d: "Protocolamos no estado escolhido e acompanhamos até a aprovação." },
  { n: "4", t: "EIN emitido", d: "Empresa aberta, documentos digitais na sua mão e próximo passo: o banco." },
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

const offerFeatures = [
  "Abertura da LLC no estado escolhido",
  "EIN (Tax ID) incluído",
  "Registered agent grátis por 1 ano",
  "Operating agreement e documentos oficiais",
  "Endereço comercial nos EUA",
  "Aplicação bancária assistida (Mercury, Relay, Wise)",
  "Orientação de compliance e declaração anual",
  "Suporte em português no WhatsApp",
];

const stateFees = [
  { name: "Wyoming", state: "US$ 102", total: "US$ 382" },
  { name: "Novo México", state: "US$ 50", total: "US$ 330" },
  { name: "Flórida", state: "US$ 125", total: "US$ 405" },
  { name: "Delaware", state: "US$ 110", total: "US$ 390" },
];

const testimonials = [
  {
    n: "Rafael M.",
    r: "E-commerce",
    q: "Abri a LLC em uma semana e recebi o EIN sem dor de cabeça. Hoje fatura em dólar direto na Mercury.",
  },
  {
    n: "Juliana P.",
    r: "Marketing digital",
    q: "O que me travava era a burocracia em inglês. Eles resolveram tudo e explicaram cada passo em português.",
  },
  {
    n: "Diego A.",
    r: "Dev freelancer",
    q: "Preço claro, sem surpresa: paguei o serviço e a taxa do estado. Melhor custo que encontrei.",
  },
];

const faqs = [
  {
    q: "O que é a taxa do estado e por que varia?",
    a: "Cada estado americano cobra uma taxa oficial para registrar sua LLC. Esse valor é pago diretamente ao estado — não fica com a DestravaUSA — e varia: Wyoming ~US$ 102, Novo México ~US$ 50, Flórida ~US$ 125, Delaware ~US$ 110. Nosso serviço fixo é de US$ 280.",
  },
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
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#top" className="flex items-center gap-2 font-display text-lg font-extrabold tracking-tight">
          <span className="grid size-8 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Globe2 className="size-4" />
          </span>
          Destrava<span className="text-primary">USA</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a className="transition-colors hover:text-primary" href="#como-funciona">Como funciona</a>
          <a className="transition-colors hover:text-primary" href="#servicos">Serviços</a>
          <a className="transition-colors hover:text-primary" href="#estados">Estados</a>
          <a className="transition-colors hover:text-primary" href="#planos">Preço</a>
          <a className="transition-colors hover:text-primary" href="#faq">Dúvidas</a>
        </nav>
        <a href={WHATSAPP} className="btn-primary !px-5 !py-2.5 !text-sm">
          Começar agora
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
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
          <div>
            <span className="eyebrow">+800 empresas abertas</span>
            <h1 className="mt-5 text-balance text-4xl font-extrabold leading-[1.06] sm:text-5xl lg:text-[3.4rem]">
              Abra sua empresa nos <span className="text-primary">EUA</span> sem sair do Brasil
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              LLC registrada, EIN emitido, endereço americano e conta bancária. 100% remoto,
              serviço fixo de US$ 280 + taxa do estado escolhido. Suporte humano em português
              do início ao fim.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a href="#planos" className="btn-primary">
                Abrir minha empresa <ArrowRight className="size-4" />
              </a>
              <a href={WHATSAPP} className="btn-ghost">Falar com especialista</a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {["Sem visto ou viagem", "Documentos digitais", "Preço fechado"].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="size-4 text-primary" /> {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="soft-card p-6 sm:p-8">
              <img
                src={heroImage}
                alt="Notebook com painel da empresa, certificado de LLC americana, passaporte e cartão bancário"
                width={1280}
                height={1120}
                className="w-full"
              />
            </div>
            <div className="surface-card absolute -bottom-6 left-2 flex items-center gap-3 px-4 py-3 sm:left-6">
              <span className="grid size-9 place-items-center rounded-full bg-accent text-primary">
                <Timer className="size-4" />
              </span>
              <div className="text-sm">
                <p className="font-semibold">EIN emitido</p>
                <p className="text-xs text-muted-foreground">Pronto para faturar em dólar</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:grid-cols-3">
          {[
            ["5 dias", "Média de abertura da LLC"],
            ["US$ 280", "Serviço fixo, sem surpresa"],
            ["100%", "Processo remoto e em português"],
          ].map(([k, v]) => (
            <div key={v} className="text-center sm:text-left">
              <p className="font-display text-3xl font-extrabold text-primary">{k}</p>
              <p className="mt-1 text-sm text-muted-foreground">{v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section id="como-funciona" className="mx-auto max-w-6xl px-5 py-20">
        <div className="max-w-2xl">
          <span className="eyebrow">Como funciona</span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Sua empresa no exterior em dias, não meses
          </h2>
          <p className="mt-4 text-muted-foreground">
            Cuidamos de toda a burocracia. Você acompanha cada etapa e recebe os documentos
            oficiais digitalizados.
          </p>
        </div>
        <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li key={s.n} className="soft-card p-6">
              <span className="grid size-9 place-items-center rounded-full bg-primary font-display text-sm font-bold text-primary-foreground">
                {s.n}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Included */}
      <section id="servicos" className="border-y border-border bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="max-w-2xl">
            <span className="eyebrow">Tudo incluído</span>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Uma operação americana completa, não só um papel registrado
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {includes.map((i) => (
              <article key={i.t} className="surface-card p-6">
                <span className="grid size-11 place-items-center rounded-2xl bg-accent text-primary">
                  <i.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{i.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{i.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Banking */}
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-2 lg:items-center">
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
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent">
                  <Check className="size-3 text-primary" />
                </span>
                <span className="text-muted-foreground">{f}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {banks.map((b) => (
            <div
              key={b}
              className="soft-card grid place-items-center gap-2 px-4 py-7 text-center text-sm font-semibold"
            >
              <CreditCard className="size-5 text-primary" />
              {b}
            </div>
          ))}
        </div>
      </section>

      {/* States */}
      <section id="estados" className="border-y border-border bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="max-w-2xl">
            <span className="eyebrow">Onde registrar</span>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Escolhemos o estado certo para o seu negócio
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {states.map((s) => (
              <article key={s.name} className="surface-card flex flex-col gap-3 p-6">
                <h3 className="font-display text-xl font-bold">{s.name}</h3>
                <span className="w-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">
                  {s.tag}
                </span>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="max-w-2xl">
          <span className="eyebrow">Quem já destravou</span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Brasileiros faturando em dólar</h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.n} className="soft-card flex h-full flex-col gap-4 p-6">
              <div className="flex gap-1 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <blockquote className="text-sm leading-relaxed text-muted-foreground">“{t.q}”</blockquote>
              <figcaption className="mt-auto text-sm font-semibold">
                {t.n}
                <span className="block text-xs font-normal text-muted-foreground">{t.r}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="planos" className="border-y border-border bg-surface">
        <div className="mx-auto max-w-5xl px-5 py-20">
          <div className="max-w-2xl">
            <span className="eyebrow">Preço transparente</span>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Serviço fixo de US$ 250 + taxa estadual variável
            </h2>
            <p className="mt-4 text-muted-foreground">
              Cobramos um valor único para abrir sua empresa. A taxa de registro é paga
              diretamente ao estado escolhido e varia conforme o local.
            </p>
          </div>

          <div className="surface-card mt-12 grid gap-10 p-8 sm:p-12 lg:grid-cols-[0.85fr_1fr]">
            <div className="lg:border-r lg:border-border lg:pr-10">
              <span className="w-fit rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                Tudo incluído
              </span>
              <p className="mt-6 font-display text-6xl font-extrabold leading-none text-primary">US$ 250</p>
              <p className="mt-2 text-sm text-muted-foreground">
                taxa fixa do DestravaUSA + taxa do estado
              </p>
              <div className="mt-6 flex items-start gap-3 rounded-2xl bg-accent p-4">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
                <p className="text-sm font-semibold">
                  Registered agent grátis por 1 ano
                  <span className="mt-1 block text-xs font-normal text-muted-foreground">
                    Obrigatório por lei em todos os estados — já vem no valor.
                  </span>
                </p>
              </div>
              <a href={WHATSAPP} className="btn-primary mt-8 w-full">
                Abrir minha empresa <ArrowRight className="size-4" />
              </a>
            </div>
            <ul className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-1">
              {offerFeatures.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent">
                    <Check className="size-3 text-primary" />
                  </span>
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* State fee breakdown */}
          <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-card">
            <div className="grid border-b border-border bg-surface px-6 py-4 sm:grid-cols-[1fr_auto_auto]">
              <span className="text-sm font-semibold">Estado</span>
              <span className="hidden text-right text-sm font-semibold sm:block">Taxa estadual*</span>
              <span className="hidden text-right text-sm font-semibold sm:block">Total aproximado</span>
            </div>
            {stateFees.map((s) => (
              <div
                key={s.name}
                className="grid items-center gap-2 border-b border-border px-6 py-4 last:border-b-0 sm:grid-cols-[1fr_auto_auto]"
              >
                <span className="font-medium">{s.name}</span>
                <div className="flex justify-between gap-6 sm:block sm:text-right">
                  <span className="text-sm text-muted-foreground sm:hidden">Taxa estadual:</span>
                  <span className="text-sm">{s.state}</span>
                </div>
                <div className="flex justify-between gap-6 sm:block sm:text-right">
                  <span className="text-sm text-muted-foreground sm:hidden">Total:</span>
                  <span className="text-sm font-semibold text-primary">{s.total}</span>
                </div>
              </div>
            ))}
            <p className="bg-surface px-6 py-4 text-xs text-muted-foreground">
              *Valores aproximados e pagos diretamente ao estado. Podem sofrer reajustes sem aviso prévio.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-5 py-20">
        <span className="eyebrow">Dúvidas frequentes</span>
        <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Antes de começar</h2>
        <div className="mt-10 space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group soft-card px-6 py-5">
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
        <div className="flex flex-col items-start gap-6 rounded-4xl bg-ink p-10 text-ink-foreground sm:p-14">
          <h2 className="max-w-2xl text-balance text-3xl font-bold sm:text-4xl">
            Destrave sua operação nos EUA ainda esta semana
          </h2>
          <p className="max-w-xl text-ink-foreground/75">
            Conversa sem compromisso: entendemos seu negócio e indicamos a estrutura certa.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={WHATSAPP} className="btn-primary">
              Falar no WhatsApp <ArrowRight className="size-4" />
            </a>
            <a
              href="#planos"
              className="inline-flex items-center gap-2 rounded-full border border-ink-foreground/25 px-7 py-[0.9rem] text-sm font-semibold"
            >
              Ver o que está incluído
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display font-bold text-foreground">
            Destrava<span className="text-primary">USA</span>
          </p>
          <p>© {new Date().getFullYear()} DestravaUSA · Assessoria privada para empresas nos EUA</p>
        </div>
      </footer>
    </div>
  );
}
