import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown, ArrowRight, CheckCircle, MessageSquare, Users, Zap, Smile, Paperclip, Send, FileText, Info, ChevronRight, ArrowLeft, BookOpen, XCircle, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import generatedQuestion from "../utils/question-generation";
import answerAnalysis from "../utils/answers-analysis";
import supportAgent from "../utils/ivan-assistant";
import SatisfactionSurvey from "./api/survey-collection";

type Screen = "registration" | "welcome" | "onboarding" | "animation" | "question" | "response" | "processing" | "result" | "endgame";

interface Question {
  id: string;
  concepts: string[];
  question: string;
}

interface FormData {
  nom: string;
  prenom: string;
  fonction: string;
  langue: string;
}

const FONCTIONS = ["Marketing", "Sales", "Support"];
const LANGUES = ["Français", "English"];
// Moved inside the component — see RegistrationScreen

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
        <MessageSquare className="w-4 h-4 text-white" />
      </div>
      <span className="text-xl font-bold text-primary tracking-tight">Bip Advisor</span>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-primary">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white border border-border rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all cursor-pointer pr-10"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-primary">{label}</label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-border rounded-xl px-4 py-3 text-sm text-primary placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
      />
    </div>
  );
}

function RegistrationScreen({ onSubmit, loading }: { onSubmit: (data: FormData) => void, loading: boolean }) {

  const [form, setForm] = useState<FormData>({
    nom: "",
    prenom: "",
    fonction: "Marketing",
    langue: "Français",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.nom.trim() && form.prenom.trim() && form.fonction.trim()) {
      onSubmit(form);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-96 bg-primary p-10 text-white">
        <Logo />
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold leading-tight mb-4">
              Votre assistant<br />intelligent
            </h1>
            <p className="text-white/60 text-sm leading-relaxed">
              Rejoignez vos collègues sur la plateforme AgentOS et transformez votre façon de travailler.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { icon: Zap, label: "Réponses instantanées" },
              { icon: Users, label: "Collaboration d'équipe" },
              { icon: MessageSquare, label: "Communication fluide" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-accent" />
                </div>
                <span className="text-sm text-white/80">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/30 text-xs">© 2024 Bip Advisor — Powered by AgentOS</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Logo />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-1">Créer votre profil</h2>
            <p className="text-sm text-muted-foreground">
              Renseignez vos informations pour accéder à Bip Advisor
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
              <InputField
                label="Nom"
                value={form.nom}
                placeholder="Entrez votre nom"
                onChange={(v) => setForm({ ...form, nom: v })}
              />
              <InputField
                label="Prénom"
                value={form.prenom}
                placeholder="Entrez votre prénom"
                onChange={(v) => setForm({ ...form, prenom: v })}
              />
              <SelectField
                label="Fonction"
                value={form.fonction}
                options={FONCTIONS}
                onChange={(v) => setForm({ ...form, fonction: v })}
              />
              <SelectField
                label="Langue / Language"
                value={form.langue}
                options={LANGUES}
                onChange={(v) => setForm({ ...form, langue: v })}
              />

              <button
                type="submit"
                disabled={!form.nom.trim() || !form.prenom.trim() || !form.fonction.trim()}
                className="w-full bg-accent hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 mt-2"
              >
                {loading ? "En cours de chargement..." : "Enregistrer / Register"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const i18n = {
  Français: {
    welcome: {
      title: "Bienvenue sur Bip Advisor !",
      greeting: (name: string) => `Bonjour ${name}, votre profil a été créé avec succès.`,
      subtitle: "Vous êtes maintenant prêt·e à utiliser AgentOS au sein de votre entreprise.",
      cta: "Continuer",
    },
    onboarding: {
      tag: "Votre mission",
      title: "Quelle est votre mission ici ?",
      description: (name: string) =>
        `Aider vos collègues avec AgentOS depuis sa récente mise en place au sein de votre entreprise. En tant que ${name}, vous serez le point de contact privilégié pour accompagner vos collègues dans la prise en main de cet outil.`,
      pillars: [
        { label: "Répondre aux questions", desc: "Guidez vos collègues" },
        { label: "Partager les bonnes pratiques", desc: "Documentez l'usage" },
        { label: "Faciliter l'adoption", desc: "Accélérez le déploiement" },
      ],
      cta: "Commençons avec votre premier message !",
    },
  },
  English: {
    welcome: {
      title: "Welcome to Bip Advisor!",
      greeting: (name: string) => `Hello ${name}, your profile has been successfully created.`,
      subtitle: "You are now ready to use AgentOS within your enterprise.",
      cta: "Continue",
    },
    onboarding: {
      tag: "Your mission",
      title: "What is your mission here?",
      description: (name: string) =>
        `Helping your colleagues with AgentOS since it was implemented recently within your enterprise. As ${name}, you will be the go-to contact to support your colleagues in getting started with this tool.`,
      pillars: [
        { label: "Answer questions", desc: "Guide your colleagues" },
        { label: "Share best practices", desc: "Document usage" },
        { label: "Facilitate adoption", desc: "Accelerate deployment" },
      ],
      cta: "Let's begin with your first message!",
    },
  },
};

function WelcomeScreen({ name, langue, onContinue }: { name: string; langue: string; onContinue: () => void }) {
  const t = i18n[langue as keyof typeof i18n]?.welcome ?? i18n["English"].welcome;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center max-w-lg"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-10 h-10 text-accent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Logo />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-3">{t.title}</h1>
          <p className="text-muted-foreground mb-2">
            <span className="font-semibold text-primary">{t.greeting(name)}</span>
          </p>
          <p className="text-sm text-muted-foreground mb-8">{t.subtitle}</p>

          <button
            onClick={onContinue}
            className="bg-accent hover:bg-accent/90 text-white font-semibold py-3 px-8 rounded-xl transition-all inline-flex items-center gap-2"
          >
            {t.cta}
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

function OnboardingScreen({ name, langue, onStart }: { name: string; langue: string; onStart: () => void }) {
  const t = i18n[langue as keyof typeof i18n]?.onboarding ?? i18n["English"].onboarding;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-2xl w-full"
      >
        <div className="flex items-center justify-center mb-10">
          <Logo />
        </div>

        <div className="bg-card border border-border rounded-2xl p-10 shadow-sm text-center">
          <div className="w-14 h-14 rounded-xl bg-primary/5 flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-7 h-7 text-primary" />
          </div>

          <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
            {t.tag}
          </p>

          <h2 className="text-2xl font-bold text-primary mb-4 leading-snug">{t.title}</h2>

          <div className="bg-secondary rounded-xl p-5 mb-8 text-left">
            <p className="text-sm text-primary leading-relaxed">
              {t.description(name).split("AgentOS").map((part, i, arr) =>
                i < arr.length - 1 ? (
                  <span key={i}>{part}<span className="font-semibold text-accent">AgentOS</span></span>
                ) : (
                  <span key={i}>{part}</span>
                )
              )}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {t.pillars.map(({ label, desc }) => (
              <div key={label} className="bg-background border border-border rounded-xl p-3 text-left">
                <p className="text-xs font-semibold text-primary mb-1">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>

          <button
            onClick={onStart}
            className="bg-accent hover:bg-accent/90 text-white font-semibold py-3 px-8 rounded-xl transition-all inline-flex items-center gap-2"
          >
            {t.cta}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function EmailAnimation() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const cycle = () => {
      setOpen(false);
      setTimeout(() => setOpen(true), 1200);
    };
    cycle();
    const id = setInterval(cycle, 3600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
        {/* Envelope body */}
        <motion.rect
          x="28" y="70" width="144" height="100" rx="10"
          animate={{ fill: open ? "#2d3a4a" : "white", stroke: open ? "#2d3a4a" : "#111827" }}
          transition={{ duration: 0.45 }}
          strokeWidth={open ? 0 : 8}
        />

        {/* Closed flap — V shape */}
        <AnimatePresence>
          {!open && (
            <motion.polyline
              key="closed-flap"
              points="28,70 100,130 172,70"
              stroke="#111827" strokeWidth="8" strokeLinejoin="round"
              fill="none"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>

        {/* Open flap — inverted V above envelope */}
        <AnimatePresence>
          {open && (
            <motion.polyline
              key="open-flap"
              points="28,70 100,20 172,70"
              fill="#2d3a4a" stroke="#2d3a4a" strokeWidth="4" strokeLinejoin="round"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            />
          )}
        </AnimatePresence>

        {/* Bottom corners diagonal lines (closed) */}
        <AnimatePresence>
          {!open && (
            <>
              <motion.line key="l1" x1="28" y1="170" x2="82" y2="118" stroke="#111827" strokeWidth="8" strokeLinecap="round"
                initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
              <motion.line key="l2" x1="172" y1="170" x2="118" y2="118" stroke="#111827" strokeWidth="8" strokeLinecap="round"
                initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
            </>
          )}
        </AnimatePresence>

        {/* @ letter card rising from open envelope */}
        <AnimatePresence>
          {open && (
            <motion.g key="letter"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            >
              <rect x="68" y="42" width="64" height="72" rx="6" fill="#3b82f6" />
              <rect x="72" y="46" width="56" height="64" rx="4" fill="#eff6ff" />
              <text x="100" y="90" textAnchor="middle" fontSize="28" fontWeight="700" fill="#3b82f6" fontFamily="Inter,sans-serif">@</text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}

function ChatAnimation() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const cycle = () => {
      setOpen(false);
      setTimeout(() => setOpen(true), 1200);
    };
    cycle();
    const id = setInterval(cycle, 3600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
        {/* Speech bubble body */}
        <path
          d="M40 55 Q40 40 55 40 H155 Q170 40 170 55 V120 Q170 135 155 135 H95 L65 162 L72 135 H55 Q40 135 40 120 Z"
          fill="#00b4e4"
        />
        {/* Notification badge */}
        <AnimatePresence>
          {open && (
            <motion.g
              key="badge"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.1 }}
              style={{ originX: "160px", originY: "48px" }}
            >
              <circle cx="160" cy="48" r="20" fill="#d4183d" />
              <text x="160" y="55" textAnchor="middle" fontSize="20" fontWeight="700" fill="white" fontFamily="Inter,sans-serif">1</text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}

function InboxAnimationScreen({
  fonction,
  langue,
  onContinue,
}: {
  fonction: string;
  langue: string;
  onContinue: () => void;
}) {
  const isFr = langue === "Français";
  const isEmail = fonction === "Support";

  useEffect(() => {
    const t = setTimeout(onContinue, 3600);
    return () => clearTimeout(t);
  }, [onContinue]);

  const title = isEmail
    ? (isFr ? "Votre boîte mail vous attend" : "Your inbox is waiting")
    : (isFr ? "Vos conversations vous attendent" : "Your conversations are waiting");

  const subtitle = isEmail
    ? (isFr
        ? "En tant que support, vous recevrez les demandes de vos collègues directement par email via AgentOS."
        : "As a support agent, you will receive your colleagues' requests directly by email through AgentOS.")
    : (isFr
        ? "En tant que membre de l'équipe, échangez instantanément avec vos collègues grâce au chat AgentOS."
        : "As a team member, exchange instantly with your colleagues through the AgentOS chat.");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full text-center"
      >
        <div className="flex items-center justify-center mb-10">
          <Logo />
        </div>

        <div className="bg-card border border-border rounded-2xl p-10 shadow-sm flex flex-col items-center gap-6">
          <div className="flex items-center justify-center">
            {isEmail ? <EmailAnimation /> : <ChatAnimation />}
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary mb-2">{title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{subtitle}</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            {isFr ? "AgentOS actif" : "AgentOS active"}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function QuestionScreen({ langue, assessment, onDone }: { langue: string; assessment: Question; onDone: () => void }) {
  const [remaining, setRemaining] = useState(15);
  const isFr = langue === "Français";

  useEffect(() => {
    if (remaining <= 0) { onDone(); return; }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, onDone]);

  const pct = (remaining / 15) * 100;
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-2xl w-full text-center space-y-10"
      >
        <Logo />

        <div className="bg-card border border-border rounded-2xl p-10 shadow-sm space-y-8">
          {/* Timer ring */}
          <div className="flex items-center justify-center">
            <svg width="72" height="72" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r={r} fill="none" stroke="#eceef6" strokeWidth="6" />
              <motion.circle
                cx="36" cy="36" r={r}
                fill="none"
                stroke={remaining <= 10 ? "#d4183d" : "#ff5c35"}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${circ}`}
                strokeDashoffset={circ - dash}
                transform="rotate(-90 36 36)"
                transition={{ duration: 0.8 }}
              />
              <text x="36" y="42" textAnchor="middle" fontSize="18" fontWeight="700"
                fill={remaining <= 10 ? "#d4183d" : "#01062e"} fontFamily="Inter,sans-serif">
                {remaining}
              </text>
            </svg>
          </div>

          <p className="text-xl font-semibold text-primary leading-relaxed">
            {assessment.question}
          </p>

          <p className="text-xs text-muted-foreground">
            {isFr
              ? "La page se fermera automatiquement dans quelques secondes."
              : "This page will close automatically in a few seconds."}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Shared right sidebar ── */

interface ChatMsg { from: "user" | "ivan"; text: string; }

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2.5 bg-secondary rounded-2xl rounded-tl-sm w-fit">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-muted-foreground"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

const DOC_CARDS_FR = [
  {
    title: "AgentOS",
    type: "Produit",
    preview: "Les clients interagissent sur plusieurs canaux, départements et points de contact. Avec...",
    full: "Les clients interagissent sur plusieurs canaux, départements et points de contact. Avec AgentOS, vous les connectez tous. Les agents IA partagent le contexte automatiquement, coordonnent les transferts de manière transparente et exécutent des workflows multi-étapes.",
  },
  {
    title: "Automation Studio",
    type: "Produit",
    preview: "Automatisez l'engagement client de l'acquisition à la fidélisation. Concevez et...",
    full: "Automatisez l'engagement client de l'acquisition à la fidélisation. Concevez et déployez des parcours personnalisés à grande échelle, déclenchez des messages au bon moment sur le bon canal, et mesurez chaque interaction pour optimiser continuellement vos campagnes.",
  },
  {
    title: "Orchestration",
    type: "Vocabulaire",
    preview: "L'orchestration IA fait référence à la coordination et à la gestion de...",
    full: "L'orchestration IA fait référence à la coordination et à la gestion de plusieurs agents IA et flux de travail automatisés. Elle permet à différents systèmes de collaborer de manière cohérente pour atteindre un objectif commun, en assurant la continuité du contexte entre chaque étape.",
  },
];

const DOC_CARDS_EN = [
  {
    title: "AgentOS",
    type: "Product",
    preview: "Customers engage across channels, departments, and touchpoints. With...",
    full: "Customers engage across channels, departments, and touchpoints. With AgentOS, you connect them all. AI agents share context automatically, coordinate handoffs seamlessly, and execute multi-step workflows.",
  },
  {
    title: "Automation Studio",
    type: "Product",
    preview: "Automate customer engagement from acquisition to retention. Design and...",
    full: "Automate customer engagement from acquisition to retention. Design and deploy personalised journeys at scale, trigger messages at the right time on the right channel, and measure every interaction to continuously optimise your campaigns.",
  },
  {
    title: "Orchestration",
    type: "Vocabulary",
    preview: "AI orchestration refers to the coordination and management of...",
    full: "AI orchestration refers to the coordination and management of multiple AI agents and automated workflows. It enables different systems to collaborate coherently toward a common goal, ensuring context continuity across every step.",
  },
];

type SidebarView = "chat" | "about" | "docs";

function RightSidebar({ langue }: { langue: string }) {
  const isFr = langue === "Français";
  const [view, setView] = useState<SidebarView>("chat");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [typing, setTyping] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const replyPool = supportAgent(input);
  const usedReplies = useRef<Set<number>>(new Set());
  const docCards = isFr ? DOC_CARDS_FR : DOC_CARDS_EN;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = async () => {
  const text = input.trim();
  if (!text || typing) return;

  setMessages((prev) => [...prev, { from: "user", text }]);
  setInput("");
  setTyping(true);

  try {
    const answer = await supportAgent(text);

    setMessages((prev) => [
      ...prev,
      { from: "ivan", text: answer }
    ]);
  } catch (err) {
    console.error(err);
    setMessages((prev) => [
      ...prev,
      { from: "ivan", text: "Le MCP a rencontré un problème. Veuillez réessayer plus tard." }
    ]);
  } finally {
    setTyping(false);
  }
};

  return (
    <div className="w-80 flex-shrink-0 border-l border-border bg-card flex flex-col h-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, x: view === "chat" ? -10 : 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col h-full"
        >

          {/* ── About panel ── */}
          {view === "about" && (
            <>
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
                <button onClick={() => setView("chat")} className="text-muted-foreground hover:text-primary transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="font-semibold text-primary text-sm flex-1 text-center pr-4">
                  {isFr ? "À propos de l'assistant IA" : "About the AI assistant"}
                </span>
              </div>
              <div className="flex-1 px-5 py-6">
                <div className="flex items-start gap-3 mb-5">
                  <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm text-primary leading-relaxed">
                    {isFr
                      ? "Bonjour, je suis Ivan. Votre agent IA prêt à vous aider quand vous en avez besoin."
                      : "Hello, I'm Ivan. Your AI agent ready to help you when needed."}
                  </p>
                </div>
                <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                  <p>{isFr ? "Je suis formé sur la documentation AgentOS et les produits Infobip pour répondre à vos questions en temps réel." : "I am trained on AgentOS documentation and Infobip products to answer your questions in real time."}</p>
                  <p>{isFr ? "Mes réponses sont contextuelles et adaptées à votre équipe." : "My answers are contextual and tailored to your team."}</p>
                </div>
              </div>
            </>
          )}

          {/* ── Docs panel ── */}
          {view === "docs" && (
            <>
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
                <button onClick={() => setView("chat")} className="text-muted-foreground hover:text-primary transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="font-semibold text-primary text-sm flex-1 text-center pr-4">Documentation</span>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {docCards.map((card, i) => {
                  const isOpen = expandedCard === i;
                  return (
                    <div key={i} className="border border-border rounded-xl overflow-hidden bg-background">
                      <div className="px-4 pt-4 pb-1">
                        <p className="text-sm font-semibold text-primary">{card.title}</p>
                        <p className="text-[11px] text-muted-foreground mb-2">{card.type}</p>
                        <p className="text-xs text-primary leading-relaxed">
                          {isOpen ? card.full : card.preview}
                        </p>
                      </div>
                      <button
                        onClick={() => setExpandedCard(isOpen ? null : i)}
                        className="w-full py-2.5 text-xs text-muted-foreground hover:text-primary border-t border-border mt-2 transition-colors"
                      >
                        {isOpen ? (isFr ? "Fermer" : "Close the doc") : (isFr ? "Lire plus" : "Read more")}
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ── Chat panel ── */}
          {view === "chat" && (
            <>
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center">
                    <MessageSquare className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-semibold text-primary text-sm">Ivan</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <button onClick={() => setView("docs")} className="hover:text-primary transition-colors">
                    <BookOpen className="w-4 h-4" />
                  </button>
                  <button onClick={() => setView("about")} className="hover:text-primary transition-colors">
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {messages.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center mt-6 leading-relaxed">
                    {isFr ? "Posez une question à Ivan, votre assistant AgentOS." : "Ask Ivan, your AgentOS assistant, anything."}
                  </p>
                )}
                <AnimatePresence initial={false}>
                  {messages.map((msg, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
                      className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                      {msg.from === "ivan" && (
                        <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center mr-1.5 mt-0.5 flex-shrink-0">
                          <MessageSquare className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className={`max-w-[200px] px-3 py-2 rounded-2xl text-xs leading-relaxed ${msg.from === "user" ? "bg-primary text-white rounded-tr-sm" : "bg-secondary text-primary rounded-tl-sm"}`}>
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                  {typing && (
                    <motion.div key="typing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                      className="flex justify-start items-end gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-3 h-3 text-white" />
                      </div>
                      <TypingIndicator />
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={bottomRef} />
              </div>

              <div className="p-3 border-t border-border">
                <div className="flex items-end gap-2 border border-border rounded-xl px-3 py-2 bg-background focus-within:ring-2 focus-within:ring-accent/30 focus-within:border-accent transition-all">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                    placeholder={isFr ? "Posez votre question..." : "Ask your question..."}
                    rows={2}
                    className="flex-1 text-xs text-primary placeholder-muted-foreground bg-transparent resize-none outline-none"
                  />
                  <button onClick={send} disabled={!input.trim() || typing}
                    className="bg-accent hover:bg-accent/90 disabled:opacity-30 text-white rounded-lg p-1.5 transition-all flex-shrink-0">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground text-center mt-1.5">
                  {isFr ? "Entrée pour envoyer" : "Enter to send"}
                </p>
              </div>
            </>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ── Email response view (Support) ── */
const RANDOM_NAMES = ["alex", "jordan", "morgan", "taylor", "casey", "riley", "jamie", "drew", "sam", "robin"];
function randomEmail() {
  const name = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
  const num = Math.floor(Math.random() * 900) + 100;
  return `${name}.${num}@bipstar.com`;
}

function ProcessingScreen({ langue, processingStatus, onDone }: { langue: string; processingStatus: boolean, onDone: () => void }) {
  const isFr = langue === "Français";

  // const steps = isFr
  //   ? ["Analyse de votre réponse...", "Vérification des critères...", "Génération du résultat..."]
  //   : ["Analysing your response...", "Checking the criteria...", "Generating the result..."];

  // const [step, setStep] = useState(0);

  // useEffect(() => {
  //   // const timers = [
  //   //   setTimeout(() => setStep(1), 900),
  //   //   setTimeout(() => setStep(2), 1800),
  //   //   setTimeout(onDone, 2900),
  //   // ];
  //   // return () => timers.forEach(clearTimeout);
  // }, [processingStatus, onDone]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-sm w-full text-center space-y-8"
      >
        <Logo />

        {/* Spinning ring */}
        <div className="flex items-center justify-center">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="32" fill="none" stroke="#eceef6" strokeWidth="6" />
              <motion.circle
                cx="40" cy="40" r="32"
                fill="none" stroke="#ff5c35" strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="200"
                animate={{ strokeDashoffset: [200, 0] }}
                transition={{ duration: 2.9, ease: "easeInOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              >
                <MessageSquare className="w-7 h-7 text-accent" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Step labels */}
        <div className="space-y-2">
          {/* {steps.map((label, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: step >= i ? 1 : 0.25, x: 0 }}
              transition={{ duration: 0.35 }}
              className="flex items-center justify-center gap-2"
            >
              {step > i ? (
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              ) : step === i ? (
                <motion.div
                  className="w-4 h-4 rounded-full border-2 border-accent border-t-transparent flex-shrink-0"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-border flex-shrink-0" />
              )}
              <span className={`text-sm transition-colors ${step >= i ? "text-primary font-medium" : "text-muted-foreground"}`}>
                {label}
              </span>
            </motion.div>
          ))} */}
          {processingStatus ? (
            <p className="text-sm text-primary font-medium">
              {isFr ? "Analyse de votre réponse..." : "Analysing your response..."}
            </p>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}

/* ── Result screen ── */
function ResultScreen({
    correct,
    langue,
    prenom,
    explanation,
    onContinue,
}: {
    correct: boolean;
    langue: string;
    prenom: string;
    explanation: string;
    onContinue: () => void;
}) {
  const isFr = langue === "Français";

  const successTitle = isFr ? `Bravo ${prenom} !` : `Well done ${prenom}!`;
  const failTitle    = isFr ? "Loupé !" : "Missed it!";

  const successExplanation = explanation;

  const failExplanation = explanation

  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue();
    }, 9000);

    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-lg w-full text-center"
      >
        <div className="flex items-center justify-center mb-8">
          <Logo />
        </div>

        <div className={`border rounded-2xl p-10 shadow-sm space-y-6 ${correct ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"}`}>
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 220, damping: 14 }}
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${correct ? "bg-green-100" : "bg-red-100"}`}
          >
            {correct
              ? <Trophy className="w-10 h-10 text-green-600" />
              : <XCircle className="w-10 h-10 text-red-500" />
            }
          </motion.div>

          {/* Title */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <h1 className={`text-3xl font-bold mb-1 ${correct ? "text-green-700" : "text-red-600"}`}>
              {correct ? successTitle : failTitle}
            </h1>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              {correct
                ? (isFr ? "Bonne réponse ✓" : "Correct answer ✓")
                : (isFr ? "Mauvaise réponse ✗" : "Wrong answer ✗")}
            </p>
          </motion.div>

          {/* Explanation */}
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="bg-white/70 border border-border rounded-xl p-5 text-left"
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              {isFr ? "Explication" : "Explanation"}
            </p>
            <p className="text-sm text-primary leading-relaxed">
              {correct ? successExplanation : failExplanation}
            </p>
          </motion.div>

          {/* Correct answer highlight (fail only)
          {!correct && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
              className="bg-green-50 border border-green-200 rounded-xl p-4 text-left"
            >
              <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">
                {isFr ? "Réponse attendue" : "Expected answer"}
              </p>
              <p className="text-sm text-green-800 leading-relaxed">
                {isFr
                  ? "Créer un segment dans Personnes → filtrer par attribut VIP → utiliser comme audience dans Automation Studio"
                  : "Create a segment in People → filter by VIP attribute → use as audience in Automation Studio"}
              </p>
            </motion.div>
          )} */}
        </div>
      </motion.div>
    </div>
  );
}

function EmailResponseView({ langue, questionText, onSubmit }: { langue: string; questionText: string; onSubmit: (answer: string) => void }) {
  const isFr = langue === "Français";
  const [body, setBody] = useState("");
  const [recipient] = useState(() => randomEmail());
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Left — email compose */}
      <div className="flex-1 flex flex-col p-8 overflow-y-auto">
        <div className="flex items-center gap-2 mb-6">
          <Logo />
        </div>

        <div className="flex-1 border border-border rounded-2xl overflow-hidden shadow-sm bg-card">
          {/* From row with Send button */}
          <div className="flex items-center border-b border-border px-4 py-3 gap-3">
            <button
              onClick={() => body.trim() && onSubmit(body)}
              disabled={!body.trim()}
              className="flex items-center gap-1.5 bg-[#1d7de8] hover:bg-[#1a6fd4] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              {isFr ? "Envoyer" : "Send"}
            </button>
            <span className="text-sm text-muted-foreground">Support@bipstar.com</span>
          </div>

          {/* To */}
          <div className="flex items-center border-b border-border px-4 py-3 gap-3">
            <span className="text-xs font-semibold text-muted-foreground border border-border rounded px-2 py-0.5 min-w-[30px] text-center">To</span>
            <span className="text-sm text-primary">{recipient}</span>
          </div>

          {/* Subject */}
          <div className="border-b border-border px-4 py-3">
            <span className="text-sm text-primary">{questionText}</span>
          </div>

          {/* Body */}
          <div className="p-4 flex-1 min-h-[300px]">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={isFr ? "Saisissez votre réponse ici..." : "Enter your response here..."}
              className="w-full h-64 text-sm text-primary placeholder-muted-foreground bg-transparent resize-none outline-none"
            />
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <RightSidebar langue={langue} />
    </div>
  );
}

/* ── Chat response view (Marketing & Sales) ── */
const CONTACT_POOL = [
  { first: "Amira",   last: "Kovač",      color: "#6366f1" },
  { first: "Lucas",   last: "Moreau",     color: "#0ea5e9" },
  { first: "Sara",    last: "Benali",     color: "#10b981" },
  { first: "Mateo",   last: "García",     color: "#f59e0b" },
  { first: "Léa",     last: "Dupont",     color: "#ec4899" },
  { first: "Naida",   last: "Beširović",  color: "#8b5cf6" },
  { first: "Youssef", last: "El Amrani",  color: "#14b8a6" },
  { first: "Elena",   last: "Petrov",     color: "#f97316" },
];

function randomContact() {
  return CONTACT_POOL[Math.floor(Math.random() * CONTACT_POOL.length)];
}

function formatTime(date: Date, isFr: boolean) {
  return date.toLocaleTimeString(isFr ? "fr-FR" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: !isFr,
  });
}

function formatShortDate(date: Date, isFr: boolean) {
  return date.toLocaleDateString(isFr ? "fr-FR" : "en-US", { month: "2-digit", day: "2-digit" });
}

function formatLongDate(date: Date, isFr: boolean) {
  const s = date.toLocaleDateString(isFr ? "fr-FR" : "en-US", { weekday: "long", month: "long", day: "numeric" });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function ChatResponseView({ langue, prenom, nom, onSubmit, questionText }: { langue: string; prenom: string; nom: string; onSubmit: (answer: string) => void; questionText: string }) {
  const isFr = langue === "Français";
  const [reply, setReply] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const [contact] = useState(() => randomContact());
  const initials = contact.first[0].toUpperCase() + contact.last[0].toUpperCase();

  const [now] = useState(() => new Date());
  const incomingTime = new Date(now.getTime() - 14 * 60 * 1000);
  const [userMessages, setUserMessages] = useState<{ text: string; time: Date }[]>([]);

  const sendReply = () => {
    const text = reply.trim();
    if (!text) return;
    setUserMessages((prev) => [...prev, { text, time: new Date() }]);
    setReply("");
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      onSubmit(text);
    }, 400);
  };

  const tabs = isFr
    ? ["Conversation", "Fichiers", "Transcriptions"]
    : ["Conversation", "Files", "Transcripts"];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Left — chat */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Contact header */}
        <div className="bg-card border-b border-border px-5 py-3 flex items-center gap-3">
          <div className="relative">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: contact.color }}
            >
              {initials}
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-card" />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">{contact.first} {contact.last}</p>
          </div>
          <div className="ml-4 flex items-center gap-5">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`text-sm pb-3 -mb-3 border-b-2 transition-colors ${tab === tabs[0] ? "border-[#5b5bd6] text-[#5b5bd6] font-semibold" : "border-transparent text-muted-foreground hover:text-primary"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-background">
          {/* Incoming question message */}
          <div className="flex items-end gap-2">
            <div className="relative flex-shrink-0">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: contact.color }}
              >
                {initials}
              </div>
              <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-400 border-2 border-background" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[11px] text-muted-foreground ml-1">
                {contact.first} {contact.last} · {formatShortDate(incomingTime, isFr)} {formatTime(incomingTime, isFr)}
              </p>
              <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-2.5 max-w-sm shadow-sm">
                <p className="text-sm text-primary leading-relaxed">{questionText}</p>
              </div>
            </div>
          </div>

          {/* Date divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[11px] text-muted-foreground">{formatLongDate(now, isFr)}</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* User sent messages */}
          <AnimatePresence initial={false}>
            {userMessages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="flex justify-end"
              >
                <div className="space-y-0.5 max-w-sm">
                  <p className="text-[11px] text-muted-foreground text-right mr-1">{formatTime(msg.time, isFr)}</p>
                  <div className="bg-[#e8eaf6] rounded-2xl rounded-br-sm px-4 py-2.5 shadow-sm">
                    <p className="text-sm text-primary leading-relaxed">{msg.text}</p>
                  </div>
                  <div className="flex justify-end mr-1">
                    <CheckCircle className="w-3 h-3 text-[#5b5bd6]" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div className="border-t border-border bg-card px-4 py-3">
          <div className="flex items-center gap-2 border border-border rounded-xl px-3 py-2 bg-background focus-within:ring-2 focus-within:ring-accent/30 focus-within:border-accent transition-all">
            <input
              type="text"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") sendReply(); }}
              placeholder={isFr ? "Saisissez votre réponse ici..." : "Enter your response here..."}
              className="flex-1 text-sm text-primary placeholder-muted-foreground bg-transparent outline-none"
            />
            <div className="flex items-center gap-2 text-muted-foreground">
              <button className="hover:text-primary transition-colors"><Smile className="w-4 h-4" /></button>
              <button className="hover:text-primary transition-colors"><Paperclip className="w-4 h-4" /></button>
              <button
                onClick={sendReply}
                disabled={!reply.trim()}
                className="text-[#1d7de8] disabled:opacity-30 hover:text-[#1a6fd4] transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <RightSidebar langue={langue} />
    </div>
  );
}

function ChatPlaceholder({ name }: { name: string }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ from: "user" | "bot"; text: string }[]>([
    {
      from: "bot",
      text: `Bonjour ${name} ! Je suis Bip Advisor, votre assistant AgentOS. Comment puis-je aider vos collègues aujourd'hui ?`,
    },
  ]);

  const send = () => {
    if (!message.trim()) return;
    const userMsg = message.trim();
    setMessages((prev) => [...prev, { from: "user", text: userMsg }]);
    setMessage("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Merci pour votre message ! En tant que référent AgentOS, je vous aide à trouver les meilleures réponses pour vos collègues.",
        },
      ]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-primary px-6 py-4 flex items-center justify-between shadow-sm">
        <Logo />
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
          <span className="text-white/70 text-xs">En ligne</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-3xl mx-auto w-full space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.from === "bot" && (
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className={`max-w-sm px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.from === "user"
                  ? "bg-primary text-white rounded-tr-sm"
                  : "bg-card border border-border text-primary rounded-tl-sm shadow-sm"
              }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card px-4 py-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Écrivez votre premier message..."
            className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm text-primary placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
          />
          <button
            onClick={send}
            disabled={!message.trim()}
            className="bg-accent hover:bg-accent/90 disabled:opacity-40 text-white px-4 py-3 rounded-xl transition-all flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── End-game + survey screen ── */
function EndGameScreen({ langue, correct, nom, prenom, profile, onContinue }: { langue: string; correct: boolean; nom: string; prenom: string; profile: string; onContinue: () => void }) {
  const isFr = langue === "Français";
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    let surveySubmittion = SatisfactionSurvey(nom, prenom, profile, langue === "Français" ? "fr-fr" : "en-gb", rating, comment);
    console.log("Satisfaction survey submitted:", surveySubmittion);
  }

  useEffect(() => {
    if(submitted) {
      const timer = setTimeout(() => {
        onContinue();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [submitted, onContinue]);

  const starLabels = isFr
    ? ["Très mauvais", "Mauvais", "Correct", "Bien", "Excellent"]
    : ["Very poor", "Poor", "Fair", "Good", "Excellent"];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-lg w-full"
      >
        <div className="flex items-center justify-center mb-8">
          <Logo />
        </div>

        {submitted ? (
          /* ── Thank-you state ── */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-2xl p-10 shadow-sm text-center space-y-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 14 }}
              className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto"
            >
              <CheckCircle className="w-8 h-8 text-accent" />
            </motion.div>
            <h2 className="text-2xl font-bold text-primary">
              {isFr ? "Merci !" : "Thank you!"}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isFr
                ? `Merci ${prenom} pour votre retour. Votre avis nous aide à améliorer l'expérience Bip Advisor.`
                : `Thank you ${prenom} for your feedback. Your input helps us improve the Bip Advisor experience.`}
            </p>
            <p className="text-xs text-muted-foreground pt-2">
              {isFr ? "Session terminée · AgentOS" : "Session complete · AgentOS"}
            </p>
          </motion.div>
        ) : (
          /* ── Survey card ── */
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-primary px-8 py-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-1">
                {isFr ? "Fin de session" : "End of session"}
              </p>
              <h2 className="text-2xl font-bold text-white mb-1">
                {correct
                  ? (isFr ? `Félicitations ${prenom} !` : `Congratulations ${prenom}!`)
                  : (isFr ? `Merci ${prenom} !` : `Thank you ${prenom}!`)}
              </h2>
              <p className="text-sm text-white/70">
                {isFr
                  ? "Vous avez complété votre première session Bip Advisor."
                  : "You have completed your first Bip Advisor session."}
              </p>
            </div>

            {/* Score badge */}
            <div className="flex justify-center -mt-5 mb-2">
              <div className={`px-5 py-1.5 rounded-full text-xs font-bold shadow-md border-2 border-card ${correct ? "bg-green-500 text-white" : "bg-red-400 text-white"}`}>
                {correct
                  ? (isFr ? "✓ Bonne réponse" : "✓ Correct answer")
                  : (isFr ? "✗ Mauvaise réponse" : "✗ Wrong answer")}
              </div>
            </div>

            <div className="px-8 pb-8 pt-4 space-y-6">
              {/* Star rating */}
              <div className="text-center space-y-3">
                <p className="text-sm font-semibold text-primary">
                  {isFr ? "Comment évaluez-vous cette expérience ?" : "How would you rate this experience?"}
                </p>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const filled = star <= (hovered || rating);
                    return (
                      <motion.button
                        key={star}
                        onMouseEnter={() => setHovered(star)}
                        onMouseLeave={() => setHovered(0)}
                        onClick={() => setRating(star)}
                        whileTap={{ scale: 0.85 }}
                        whileHover={{ scale: 1.15 }}
                        className="focus:outline-none"
                        aria-label={`${star} star`}
                      >
                        <svg viewBox="0 0 24 24" className="w-9 h-9 transition-colors duration-100"
                          fill={filled ? "#ff5c35" : "none"}
                          stroke={filled ? "#ff5c35" : "#d1d5db"}
                          strokeWidth="1.5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round"
                            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                          />
                        </svg>
                      </motion.button>
                    );
                  })}
                </div>
                {(hovered || rating) > 0 && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-medium text-accent"
                  >
                    {starLabels[(hovered || rating) - 1]}
                  </motion.p>
                )}
              </div>

              {/* Comment textarea */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-primary">
                  {isFr ? "Commentaire additionnel" : "Additional comment"}
                  <span className="text-muted-foreground font-normal ml-1">({isFr ? "optionnel" : "optional"})</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  placeholder={isFr
                    ? "Partagez vos impressions, suggestions ou remarques..."
                    : "Share your impressions, suggestions or remarks..."}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm text-primary placeholder-muted-foreground bg-background resize-none focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
                />
              </div>

              {/* Submit */}
              <button
                onClick={() => handleSubmit()}
                disabled={rating === 0}
                className="w-full bg-accent hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {isFr ? "Envoyer mon avis" : "Submit my feedback"}
                <ArrowRight className="w-4 h-4" />
              </button>
              {rating === 0 && (
                <p className="text-[11px] text-muted-foreground text-center -mt-3">
                  {isFr ? "Veuillez sélectionner une note pour continuer." : "Please select a rating to continue."}
                </p>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("registration");
  const [userData, setUserData] = useState<FormData | null>(null);
  const [resultCorrect, setResultCorrect] = useState(false);
  const [resultExplanation, setResultExplanation] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [answerSubmitLoading, setAnswerSubmitLoading] = useState(false);

  const currentQuestion = questions[currentQuestionIndex] ?? null;

  async function getQuestions(language: string, profile_type: string) {
    const response = await generatedQuestion(language, profile_type);

    const generated = response?.questions ?? [];

    console.log("Questions", generated);

    setQuestions(generated);
    setCurrentQuestionIndex(0);
  }

  const handleRegister = async (data: FormData) => {
  setUserData(data);
  setRegistrationLoading(true);

  await getQuestions(
      data.langue === "Français" ? "fr" : "en",
      data.fonction
    );

  setRegistrationLoading(false);

    setScreen("welcome");
  };

  const goToNextQuestion = () => {
  const next = currentQuestionIndex + 1;

  if (next >= questions.length) {
    // Fin du quiz
    console.log("Quiz terminé");
    return;
  }

  setCurrentQuestionIndex(next);
  setScreen("animation");
};

  const handleSubmitAnswer = async (answer: string) => {
    try {
      setScreen("processing");
      setAnswerSubmitLoading(true);
      const response = await answerAnalysis(currentQuestion?.question ?? "", answer);
      setAnswerSubmitLoading(false);

      setResultCorrect(response?.result === "correct" ? true : false);
      setResultExplanation(response?.reasoning ?? "");
    } catch {
      setResultCorrect(false);
      setResultExplanation("");
    }

    setScreen("result");
  };

  const fullName = userData ? `${userData.prenom} ${userData.nom}` : "";

  return (
    <AnimatePresence mode="wait">
      {screen === "registration" && (
        <motion.div
          key="registration"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen"
        >
          <RegistrationScreen onSubmit={handleRegister} loading={registrationLoading} />
        </motion.div>
      )}

      {screen === "welcome" && (
        <motion.div
          key="welcome"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen"
        >
          <WelcomeScreen name={fullName} langue={userData?.langue ?? "Français"} onContinue={() => setScreen("onboarding")} />
        </motion.div>
      )}

      {screen === "onboarding" && (
        <motion.div
          key="onboarding"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen"
        >
          <OnboardingScreen name={fullName} langue={userData?.langue ?? "Français"} onStart={() => setScreen("animation")} />
        </motion.div>
      )}
      {screen === "animation" && (
        <motion.div
          key="animation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen"
        >
          <InboxAnimationScreen
            fonction={userData?.fonction ?? "Marketing"}
            langue={userData?.langue ?? "Français"}
            onContinue={() => setScreen("question")}
          />
        </motion.div>
      )}

      {screen === "question" && (
        <motion.div
          key="question"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="min-h-screen"
        >
          <QuestionScreen langue={userData?.langue ?? "Français"} assessment={currentQuestion} onDone={() => setScreen("response")} />
        </motion.div>
      )}

      {screen === "response" && (
        <motion.div
          key="response"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="min-h-screen"
        >
          {userData?.fonction === "Support"
            ? <EmailResponseView langue={userData?.langue ?? "Français"} questionText={currentQuestion?.question ?? ""} onSubmit={handleSubmitAnswer} />
            : <ChatResponseView langue={userData?.langue ?? "Français"} prenom={userData?.prenom ?? ""} nom={userData?.nom ?? ""} questionText={currentQuestion?.question ?? ""} onSubmit={handleSubmitAnswer} />
          }
        </motion.div>
      )}
      {screen === "processing" && (
        <motion.div
          key="processing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen"
        >
          <ProcessingScreen langue={userData?.langue ?? "Français"} processingStatus={answerSubmitLoading} onDone={() => setScreen("result")} />
        </motion.div>
      )}
      {screen === "result" && (
        <motion.div
          key="result"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="min-h-screen"
        >
          <ResultScreen
          correct={resultCorrect}
          langue={userData?.langue ?? "Français"}
          prenom={userData?.prenom ?? ""}
          explanation={resultExplanation}
          onContinue={() => {
            if (currentQuestionIndex === questions.length - 1) {
              setScreen("endgame");
            } else {
              goToNextQuestion();
            }
          }}
        />
        </motion.div>
      )}
      {screen === "endgame" && (
        <motion.div
          key="endgame"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="min-h-screen"
        >
          <EndGameScreen langue={userData?.langue ?? "Français"} correct={resultCorrect} nom={userData?.nom ?? ""} prenom={userData?.prenom ?? ""} profile={userData?.fonction?? ""} onContinue={() => setScreen("registration")}/>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
