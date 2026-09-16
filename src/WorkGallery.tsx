import { useState } from "react";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import projectData from "../assets/work/projects.json";

export const workProjects = projectData.filter(
  (project) => project.available !== false,
);
export const teamMembers: {
  id: string;
  image: string | null;
  name: string;
  role: string;
}[] = Array.from({ length: 5 }, (_, i) => ({
  id: String(i + 1).padStart(2, "0"),
  image: `media/team/${i + 1}.webp`,
  name: "",
  role: "",
}));

export function WorkGallery({
  motion,
  onSelect,
}: {
  motion: boolean;
  onSelect: (index: number) => void;
}) {
  const [paused, setPaused] = useState(false);
  const running = motion && !paused;
  const split = Math.ceil(workProjects.length / 2);
  const rows = [workProjects.slice(0, split), workProjects.slice(split)];
  return (
    <section
      className="section work portfolio"
      id="work"
      aria-labelledby="work-heading"
    >
      <div className="section-heading reveal">
        <div>
          <span className="eyebrow">02 / IDEAS, BROUGHT TO LIFE</span>
          <h2 id="work-heading">
            Our <em>Work</em>
          </h2>
        </div>
        <div className="portfolio-intro">
          <p>
            A selection of films, worlds and stories.
            <br />
            Made to be experienced.
          </p>
          <button
            type="button"
            className="reel-toggle"
            aria-pressed={paused}
            onClick={() => setPaused(!paused)}
            disabled={!motion}
          >
            {running ? <Pause size={14} /> : <Play size={14} />}{" "}
            {running
              ? "Pause gallery"
              : motion
                ? "Resume gallery"
                : "Motion paused"}
          </button>
        </div>
      </div>
      <div
        className={`reel-window ${running ? "is-running" : "is-paused"}`}
        aria-label="Project gallery"
      >
        {rows.map((row, rowIndex) => (
          <div
            className="reel-row"
            key={rowIndex}
            role="group"
            aria-label={`Project row ${rowIndex + 1}`}
          >
            <div className={`reel-track ${rowIndex ? "reverse" : ""}`}>
              {[0, 1].map((copy) => (
                <div
                  className={`reel-group ${copy ? "reel-copy" : ""}`}
                  key={copy}
                  aria-hidden={copy ? true : undefined}
                >
                  {row.map((project) => (
                    <button
                      type="button"
                      className="project-tile"
                      key={project.id}
                      tabIndex={copy ? -1 : 0}
                      onFocus={() => {
                        if (!copy) setPaused(true);
                      }}
                      onClick={() =>
                        onSelect(
                          workProjects.findIndex((p) => p.id === project.id),
                        )
                      }
                      aria-label={`Watch ${project.title}`}
                    >
                      <div className="project-art">
                        <img
                          src={`media/work/${project.id}.webp`}
                          alt=""
                          width="960"
                          height="540"
                          loading="eager"
                          decoding="async"
                        />
                        <span className="project-play">
                          <Play size={22} fill="currentColor" />
                        </span>
                        <span className="project-format">
                          {project.category}
                        </span>
                      </div>
                      <div className="project-caption">
                        <h3>{project.title}</h3>
                        <ArrowUpRight size={19} />
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="section-footnote">
        <span>{workProjects.length} PROJECTS · ONE CREATIVE SPIRIT</span>
        <span>Press play to explore. Pause to browse.</span>
      </div>
    </section>
  );
}

export function TeamSection() {
  return (
    <section className="section team" id="team" aria-labelledby="team-heading">
      <div className="section-heading reveal">
        <div>
          <span className="eyebrow">
            03 / THE PEOPLE BEHIND THE POSSIBILITIES
          </span>
          <h2 id="team-heading">
            Our <em>Team</em>
          </h2>
        </div>
        <p>
          Different perspectives.
          <br />A shared imagination.
        </p>
      </div>
      <div className="team-grid card-grid">
        {teamMembers.map((member) => (
          <div className="team-member" key={member.id}>
            {member.image ? (
              <img
                src={member.image}
                alt={`Takhleeqi Studios team portrait ${Number(member.id)}`}
                width="400"
                height="500"
                loading="lazy"
              />
            ) : null}
            {member.name && <h3>{member.name}</h3>}
            {member.role && <p>{member.role}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

const clients = [
  ["interwood", "Interwood"],
  ["atlantis", "Atlantis Towers"],
  ["imobile", "I Mobile"],
  ["hoola", "hoola"],
  ["pildat", "PILDAT"],
  ["bluearc", "Blue Arc"],
  ["5towers", "5 Towers"],
  ["zk", "ZK Developers"],
];

export function ClientsSection({ motion }: { motion: boolean }) {
  const [paused, setPaused] = useState(false);
  const running = motion && !paused;
  return (
    <section
      className="section clients"
      id="clients"
      aria-labelledby="clients-heading"
    >
      <div className="section-heading reveal">
        <div>
          <span className="eyebrow">04 / BUILT ON TRUST</span>
          <h2 id="clients-heading">
            Our <em>Clients</em>
          </h2>
        </div>
        <button
          type="button"
          className="reel-toggle"
          aria-pressed={paused}
          disabled={!motion}
          onClick={() => setPaused(!paused)}
        >
          {running ? <Pause size={14} /> : <Play size={14} />}
          {running
            ? "Pause clients"
            : motion
              ? "Resume clients"
              : "Motion paused"}
        </button>
      </div>
      <div
        className={`client-window ${running ? "" : "client-paused"}`}
        aria-label="Our clients"
      >
        <div className="client-track">
          {[0, 1].map((copy) => (
            <div
              className={`client-group ${copy ? "client-copy" : ""}`}
              key={copy}
              aria-hidden={copy ? true : undefined}
            >
              {clients.map(([id, name]) => (
                <div className={`client-logo client-${id}`} key={id}>
                  <img
                    src={`media/clients/${id}.png`}
                    alt={name}
                      width="360"
                      height="180"
                      loading="eager"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
