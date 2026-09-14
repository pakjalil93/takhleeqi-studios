import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  Box,
  Map as MapIcon,
  Glasses,
  Camera,
  Mic,
  Clapperboard,
  Search,
  PenTool,
  Send,
  Plus,
  X,
  Menu,
  MoveUpRight,
  AudioLines,
  Orbit,
  Layers,
  Play,
  Download,
  Check,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services, projects, steps } from "./content";
const HeroScene = lazy(() => import("./HeroScene"));
gsap.registerPlugin(ScrollTrigger);
const icons = {
  box: Box,
  map: MapIcon,
  vr: Glasses,
  camera: Camera,
  mic: Mic,
  film: Clapperboard,
  search: Search,
  pen: PenTool,
  send: Send,
};
function Icon({
  name,
  ...props
}: {
  name: string;
  size?: number;
  strokeWidth?: number;
}) {
  const Component = icons[name as keyof typeof icons] || Box;
  return <Component {...props} />;
}
function Mark() {
  return (
    <svg
      className="mark"
      viewBox="0 0 40 40"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M2 4h36v8H23v26h-8V12H2z" />
      <path d="M2 16h8v8H2z" opacity=".6" />
    </svg>
  );
}
function Picture({
  name,
  alt,
  className = "",
}: {
  name: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      className={className}
      src={`media/creative-${name}-960.webp`}
      srcSet={`media/creative-${name}-480.webp 480w, media/creative-${name}-960.webp 960w, media/creative-${name}-1536.webp 1536w`}
      sizes="(max-width: 700px) 94vw, (max-width: 1000px) 46vw, 32vw"
      width="1536"
      height="1024"
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  );
}
function Dialog({
  children,
  onClose,
  label,
}: {
  children: ReactNode;
  onClose: () => void;
  label: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const previous = document.activeElement as HTMLElement;
    dialog.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = old;
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-label={label}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            onClose();
        }
      }}
    >
      <button
        className="dialog-close"
        onClick={onClose}
        aria-label="Close dialog"
        autoFocus
      >
        <X size={22} />
      </button>
      {children}
    </dialog>
  );
}
function BriefForm() {
  const [saved, setSaved] = useState(false);
  function download(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = `TAKHLEEQI STUDIOS — PROJECT BRIEF\n\nName: ${data.get("name")}\nEmail: ${data.get("email")}\nService: ${data.get("service")}\n\nThe idea\n${data.get("idea")}\n\nThis brief was prepared locally. It has not been sent to the studio.`;
    const url = URL.createObjectURL(
      new Blob([body], { type: "text/plain;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "Takhleeqi-project-brief.txt";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    setSaved(true);
  }
  return (
    <div className="brief-content">
      <span className="eyebrow">A GOOD STORY STARTS WITH A CONVERSATION</span>
      <h2>
        Tell us what
        <br />
        you’re <em>imagining.</em>
      </h2>
      <p>
        Put the first spark into words. Create a project brief you can keep and
        share.
      </p>
      <form onSubmit={download} onChange={() => setSaved(false)}>
        <div className="form-row">
          <label>
            Your name
            <input
              required
              name="name"
              autoComplete="name"
              placeholder="Name"
              maxLength={100}
            />
          </label>
          <label>
            Your email
            <input
              required
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@company.com"
              maxLength={200}
            />
          </label>
        </div>
        <label>
          What would you like to create?
          <select name="service">
            {services.flatMap((s) =>
              s.details.map((d) => <option key={d.title}>{d.title}</option>),
            )}
            <option>Let’s explore together</option>
          </select>
        </label>
        <label>
          A little about your idea
          <textarea
            required
            name="idea"
            rows={4}
            placeholder="The idea, the audience, the possibility…"
            maxLength={5000}
          />
        </label>
        <button className="button primary" type="submit">
          {saved ? "Download again" : "Download project brief"}
          <Download size={17} />
        </button>
        <p className="form-note" role="status">
          {saved ? (
            <>
              <Check size={15} /> Your brief is ready. Nothing has been sent.
            </>
          ) : (
            "Your details stay in this form. This downloads a brief; it does not send a message."
          )}
        </p>
      </form>
    </div>
  );
}

export default function App() {
  const root = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState(false),
    [active, setActive] = useState("home");
  const [modal, setModal] = useState<{
    type: "service" | "project" | "contact";
    index?: number;
  } | null>(null);
  const [motion, setMotion] = useState(
    () => !matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setMotion(!media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    if (!motion) return;
    const media = gsap.matchMedia();
    media.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        gsap.from(".hero-copy > *", {
          y: 30,
          opacity: 0,
          stagger: 0.13,
          duration: 1.2,
          ease: "power3.out",
          delay: 0.15,
        });
        gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) =>
          gsap.fromTo(
            el,
            { y: 45, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 92%",
                toggleActions: "play none none reverse",
              },
            },
          ),
        );
        gsap.utils.toArray<HTMLElement>(".card-grid").forEach((grid) =>
          gsap.fromTo(
            grid.children,
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.11,
              duration: 0.85,
              ease: "power3.out",
              scrollTrigger: {
                trigger: grid,
                start: "top 87%",
                toggleActions: "play none none reverse",
              },
            },
          ),
        );
        gsap.utils.toArray<HTMLElement>(".work-visual").forEach((el) =>
          gsap.fromTo(
            el,
            { clipPath: "inset(10% 4% 10% 4%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top 95%",
                end: "top 48%",
                scrub: 1,
              },
            },
          ),
        );
        gsap.fromTo(
          ".process-line .process-progress",
          { strokeDashoffset: 1000 },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: ".process-grid",
              start: "top 85%",
              end: "bottom 55%",
              scrub: 1,
            },
          },
        );
        gsap.to(".kinetic-track", {
          xPercent: -22,
          ease: "none",
          scrollTrigger: {
            trigger: ".kinetic",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
        return () => {};
      },
      root,
    );
    media.add(
      "(min-width: 1000px) and (prefers-reduced-motion: no-preference)",
      () => {
        gsap.to(".hero-copy", {
          y: -55,
          opacity: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom 22%",
            scrub: 1,
          },
        });
        gsap.to(".hero-visual", {
          y: 70,
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      },
      root,
    );
    return () => media.revert();
  }, [motion]);
  useEffect(() => {
    const observed = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) =>
          observed.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0),
        );
        const sorted = [...observed].sort((a, b) => b[1] - a[1]);
        if (sorted[0]?.[1] > 0) setActive(sorted[0][0]);
      },
      {
        rootMargin: "-15% 0px -30% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );
    document
      .querySelectorAll("section[id]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!menu) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        document.getElementById("menu-button")?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [menu]);
  useEffect(() => {
    if (!motion || !matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    const cleanups = [
      ...document.querySelectorAll<HTMLElement>(".magnetic"),
    ].map((button) => {
      const x = gsap.quickTo(button, "x", {
          duration: 0.4,
          ease: "power3.out",
        }),
        y = gsap.quickTo(button, "y", { duration: 0.4, ease: "power3.out" });
      const move = (event: PointerEvent) => {
        const b = button.getBoundingClientRect();
        x((event.clientX - b.left - b.width / 2) * 0.09);
        y((event.clientY - b.top - b.height / 2) * 0.12);
      };
      const leave = () => {
        x(0);
        y(0);
      };
      button.addEventListener("pointermove", move);
      button.addEventListener("pointerleave", leave);
      return () => {
        button.removeEventListener("pointermove", move);
        button.removeEventListener("pointerleave", leave);
        x.tween.kill();
        y.tween.kill();
        gsap.set(button, { clearProps: "transform" });
      };
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, [motion]);
  const openContact = () => {
    setMenu(false);
    setModal({ type: "contact" });
  };
  const selectedService =
    modal?.type === "service" ? services[modal.index!] : null;
  const selectedProject =
    modal?.type === "project" ? projects[modal.index!] : null;
  return (
    <div ref={root} className={!motion ? "motion-paused" : ""}>
      <a className="skip" href="#services">
        Skip to content
      </a>
      <header className="header">
        <a className="brand" href="#home" aria-label="Takhleeqi Studios home">
          <Mark />
          <span>
            TAKHLEEQI <span>STUDIOS</span>
          </span>
        </a>
        <nav
          aria-label="Main navigation"
          className={menu ? "nav is-open" : "nav"}
          id="main-navigation"
        >
          {[
            ["Work", "work"],
            ["Services", "services"],
            ["Studio", "studio"],
            ["Contact", "contact"],
          ].map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>
              {label}
            </a>
          ))}
        </nav>
        <button className="button header-cta magnetic" onClick={openContact}>
          Start a Project <ArrowUpRight size={16} />
        </button>
        <button
          id="menu-button"
          className="menu-button"
          aria-label={menu ? "Close menu" : "Open menu"}
          aria-expanded={menu}
          aria-controls="main-navigation"
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
      </header>
      <nav className="progress-rail" aria-label="Page sections">
        {[
          ["home", "Home"],
          ["services", "Services"],
          ["work", "Work"],
          ["studio", "Studio"],
          ["contact", "Contact"],
        ].map(([id, label], i) => (
          <a
            href={`#${id}`}
            key={id}
            className={active === id ? "active" : ""}
            aria-current={active === id ? "location" : undefined}
          >
            <i />
            <span>
              0{i + 1}
              <small>{label}</small>
            </span>
          </a>
        ))}
      </nav>
      <main>
        <section className="hero" id="home" aria-labelledby="hero-heading">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-horizon" aria-hidden="true" />
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="tiny-cross">+</span> CREATIVE TECHNOLOGY &
              PRODUCTION
            </div>
            <h1 id="hero-heading">
              We make
              <br />
              <em>imagination</em>
              <br />
              <em className="blue-word">move.</em>
            </h1>
            <p>
              3D animation, immersive technology and cinematic content—built to
              make audiences look twice.
            </p>
            <div className="hero-actions">
              <a className="button primary magnetic" href="#work">
                Explore Our Work <ArrowUpRight size={18} />
              </a>
              <a className="text-button" href="#services">
                <span className="play-circle">
                  <Play size={13} />
                </span>
                Explore Capabilities
              </a>
            </div>
            <a className="scroll-cue" href="#services">
              <span>
                <ArrowDown size={15} />
              </span>
              SCROLL TO SHAPE THE STORY
            </a>
          </div>
          <div className="hero-visual">
            <div className="hero-halo" />
            {motion ? (
              <Suspense
                fallback={
                  <div
                    className="scene-fallback logo-fallback"
                    aria-hidden="true"
                  >
                    <img
                      src="media/takhleeqi-logo-wireframe.svg"
                      alt=""
                      width="200"
                      height="200"
                    />
                  </div>
                }
              >
                <HeroScene />
              </Suspense>
            ) : (
              <div className="paused-art">
                <Suspense>
                  <HeroScene paused />
                </Suspense>
              </div>
            )}
            <span className="visual-coordinate">
              TS — 001
              <br />
              <span>IMAGINATION, IN ORBIT</span>
            </span>
            <div className="explore-hint">
              <Orbit size={19} />
              <span>
                DRAG TO EXPLORE<small>Move a little. Discover more.</small>
              </span>
            </div>
          </div>
          <div className="hero-bottom">
            <span>IDEAS IN MOTION. PEOPLE IN FOCUS.</span>
            <button
              onClick={() => setMotion(!motion)}
              className="motion-toggle"
              aria-pressed={!motion}
            >
              {motion ? <AudioLines size={16} /> : <Play size={14} />}{" "}
              {motion ? "Pause motion" : "Resume motion"}
            </button>
            <span>
              SCROLL TO DISCOVER <ArrowDown size={14} />
            </span>
          </div>
        </section>
        <div className="positioning">
          <span>
            BUILT FOR BRANDS, SCREENS
            <br />& REAL-WORLD SPACES
          </span>
          <div>
            <Box /> <span>Characters</span>
          </div>
          <div>
            <Layers /> <span>Worlds</span>
          </div>
          <div>
            <Orbit /> <span>Experiences</span>
          </div>
          <div>
            <Clapperboard /> <span>Stories</span>
          </div>
        </div>
        <section
          className="section services"
          id="services"
          aria-labelledby="services-heading"
        >
          <div className="section-heading reveal">
            <div>
              <span className="eyebrow">01 / OUR CAPABILITIES</span>
              <h2 id="services-heading">
                What we <em>create.</em>
              </h2>
            </div>
            <p>
              From the first spark to the final frame.
              <br />A full spectrum of creative possibility.
            </p>
          </div>
          <div className="service-grid card-grid">
            {services.map((service, i) => (
              <button
                className="service-card"
                onClick={() => setModal({ type: "service", index: i })}
                key={service.title}
                aria-label={`Explore ${service.title}`}
              >
                <Picture name={service.image} alt="" />
                <div className="card-shade" />
                <div className="service-top">
                  <span>{service.tag}</span>
                  <Icon name={service.icon} size={26} strokeWidth={1.3} />
                </div>
                <div className="service-copy">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
                <span className="circle-arrow">
                  <ArrowUpRight size={19} />
                </span>
              </button>
            ))}
          </div>
          <div className="section-footnote">
            <span>IMAGINATION WITHOUT BOUNDARIES.</span>
            <span>Original artwork · Illustrative concepts</span>
          </div>
        </section>
        <section
          className="section work"
          id="work"
          aria-labelledby="work-heading"
        >
          <div className="section-heading reveal">
            <div>
              <span className="eyebrow">02 / A WORLD OF POSSIBILITY</span>
              <h2 id="work-heading">
                Selected <em>experiences.</em>
              </h2>
            </div>
            <span className="quiet-label">
              A GLIMPSE OF WHAT COULD BE <MoveUpRight size={17} />
            </span>
          </div>
          <div className="work-grid card-grid">
            {projects.map((project, i) => (
              <button
                className="work-card"
                key={project.title}
                onClick={() => setModal({ type: "project", index: i })}
                aria-label={`View concept study: ${project.title}`}
              >
                <div className="work-visual">
                  <Picture name={project.image} alt={project.description} />
                  <span className="concept-tag">CONCEPT STUDY</span>
                  <span className="work-open">
                    <ArrowUpRight size={27} />
                  </span>
                </div>
                <div className="work-meta">
                  <span>{project.category}</span>
                  <span>0{i + 1}</span>
                </div>
                <h3>{project.title}</h3>
              </button>
            ))}
          </div>
        </section>
        <div
          className="kinetic"
          aria-label="Characters. Worlds. Stories. Experiences."
        >
          <div className="kinetic-track" aria-hidden="true">
            CHARACTERS <span>✳</span> WORLDS <span>✳</span> STORIES{" "}
            <span>✳</span> EXPERIENCES <span>✳</span> CHARACTERS <span>✳</span>{" "}
            WORLDS
          </div>
        </div>
        <section
          className="section studio"
          id="studio"
          aria-labelledby="studio-heading"
        >
          <div className="studio-intro reveal">
            <span className="eyebrow">03 / THE STUDIO MINDSET</span>
            <div>
              <h2>
                Curiosity at our core.
                <br />
                <em>Possibility in every frame.</em>
              </h2>
              <p>
                We bring creative thinking and technical craft into the same
                room. To build worlds, tell stories and turn an ambitious idea
                into something you can feel.
              </p>
            </div>
            <span className="studio-symbol" aria-hidden="true">
              ✳
            </span>
          </div>
          <div className="values reveal">
            <div>
              <span>CREATIVELY LED</span>
              <p>Ideas with a point of view.</p>
            </div>
            <div>
              <span>TECHNICALLY CURIOUS</span>
              <p>New tools. More possibility.</p>
            </div>
            <div>
              <span>HUMAN AT HEART</span>
              <p>Experiences that connect.</p>
            </div>
          </div>
          <div className="section-heading process-heading reveal">
            <h2 id="studio-heading">
              From spark <em>to screen.</em>
            </h2>
            <span className="quiet-label">A COLLABORATIVE JOURNEY</span>
          </div>
          <div className="process-grid card-grid">
            <svg
              className="process-line"
              viewBox="0 0 1000 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                className="process-track"
                d="M0 50 C110 5 223 95 333.333 50 S556 5 666.667 50 S890 95 1000 50"
              />
              <path
                className="process-progress"
                pathLength="1000"
                d="M0 50 C110 5 223 95 333.333 50 S556 5 666.667 50 S890 95 1000 50"
              />
            </svg>
            {steps.map((step, i) => (
              <article className="process-step" key={step.title}>
                <div className="step-icon">
                  <span>0{i + 1}</span>
                  <i>
                    <Icon name={step.icon} size={25} strokeWidth={1.3} />
                  </i>
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>
        <section
          className="contact"
          id="contact"
          aria-labelledby="contact-heading"
        >
          <div className="contact-arches" aria-hidden="true">
            <div />
            <div />
            <div />
          </div>
          <div className="contact-inner reveal">
            <span className="eyebrow">
              SAME CURIOSITY. BIGGER POSSIBILITIES.
            </span>
            <h2 id="contact-heading">
              Let’s create something
              <br />
              <em>impossible to ignore.</em>
            </h2>
            <button className="button dark magnetic" onClick={openContact}>
              Start a conversation <ArrowUpRight size={18} />
            </button>
            <div className="contact-side">
              YOUR NEXT IDEA.
              <br />
              OUR NEXT ADVENTURE.<span>LET’S MAKE IT MOVE.</span>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="footer-top">
          <a
            className="brand"
            href="#home"
            aria-label="Back to Takhleeqi Studios home"
          >
            <Mark />
            <span>
              TAKHLEEQI <span>STUDIOS</span>
            </span>
          </a>
          <p>Ideas make a brighter tomorrow.</p>
          <a href="#home" className="back-top">
            BACK TO TOP <ArrowUpRight size={17} />
          </a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Takhleeqi Studios</span>
          <span>CREATIVE THINKING. EXTRAORDINARY MAKING.</span>
          <div>
            <a href="#work">Work</a>
            <a href="#services">Services</a>
            <button onClick={openContact}>
              Let’s talk <ArrowUpRight size={12} />
            </button>
          </div>
        </div>
      </footer>
      {modal && (
        <Dialog
          onClose={() => setModal(null)}
          label={
            modal.type === "contact"
              ? "Prepare a project brief"
              : selectedService?.title || selectedProject?.title || "Explore"
          }
        >
          {modal.type === "contact" ? (
            <BriefForm />
          ) : (
            <>
              <Picture
                name={(selectedService || selectedProject)!.image}
                alt={`Original concept artwork for ${(selectedService || selectedProject)!.title}`}
                className="dialog-image"
              />
              <div className="dialog-body">
                <span className="eyebrow">
                  {selectedService
                    ? "CREATIVE CAPABILITY"
                    : "ILLUSTRATIVE CONCEPT STUDY"}
                </span>
                <h2>{(selectedService || selectedProject)!.title}</h2>
                {selectedService ? (
                  selectedService.details.map((d) => (
                    <div key={d.title} className="detail">
                      <h3>
                        <Plus size={15} />
                        {d.title}
                      </h3>
                      <p>{d.text}</p>
                    </div>
                  ))
                ) : (
                  <>
                    <p>{selectedProject!.description}</p>
                    <p className="project-scope">{selectedProject!.scope}</p>
                  </>
                )}
                <p className="provenance">
                  Original AI-generated concept imagery illustrating creative
                  direction, not a completed client commission.
                </p>
                <button
                  className="button primary"
                  onClick={() => setModal({ type: "contact" })}
                >
                  Let’s make something <ArrowRight size={17} />
                </button>
              </div>
            </>
          )}
        </Dialog>
      )}
    </div>
  );
}
