import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import type { AppRole } from "../auth/types";

const workspaceRoutes: Partial<Record<AppRole, string>> = {
  STUDENT: "/student",
  COMPANY: "/company",
  SUPERVISOR: "/supervisor",
  ADMIN: "/admin",
};

const audiences = [
  {
    number: "01",
    title: "Universities & coordinators",
    description:
      "Coordinate student placements, partner organizations, supervisor assignments and programme-wide reporting from one workspace.",
    points: ["Placement oversight", "Partner coordination", "Progress visibility"],
  },
  {
    number: "02",
    title: "Students",
    description:
      "Discover opportunities, submit applications and keep placement activity, attendance and learning records together.",
    points: ["Opportunity applications", "Digital logbook", "Progress tracking"],
  },
  {
    number: "03",
    title: "Employers & supervisors",
    description:
      "Review applicants, support placed students and keep workplace feedback connected to the attachment journey.",
    points: ["Applicant review", "Student supervision", "Performance feedback"],
  },
];

const workflow = [
  ["01", "Publish opportunities", "Organizations share openings and the requirements students need to apply."],
  ["02", "Apply and place", "Students submit applications while coordinators and employers follow the selection process."],
  ["03", "Track the experience", "Attendance, logbook activity and supervisor feedback stay connected to the placement."],
  ["04", "Review and report", "Use progress records and evaluations to support programme follow-up and decisions."],
];

export function DashboardPage() {
  const auth = useAuth();
  const workspacePath = auth.roles
    .map((role) => workspaceRoutes[role])
    .find((path): path is string => Boolean(path));

  return (
    <div className="marketing-page">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">ATTACHMENT & INTERNSHIP MANAGEMENT</p>
          <h1 id="hero-title">Bring every placement into one connected workspace.</h1>
          <p className="lead">
            Smart Attachment helps universities, students and employers coordinate
            the full workplace-learning journey — from opportunity to final evaluation.
          </p>

          <div className="actions">
            {auth.isAuthenticated ? (
              workspacePath ? (
                <Link className="primary-button" to={workspacePath}>
                  Open your workspace <span aria-hidden="true">↗</span>
                </Link>
              ) : (
                <p className="notice" role="status">
                  Your account is signed in, but a platform role has not been assigned yet.
                  Contact your programme administrator.
                </p>
              )
            ) : (
              <>
                <Link className="primary-button" to="/login">
                  Sign in to your workspace <span aria-hidden="true">↗</span>
                </Link>
                <a className="secondary-link" href="#platform">
                  Explore the platform <span aria-hidden="true">↓</span>
                </a>
              </>
            )}
          </div>

          <div className="hero-assurance" aria-label="Platform capabilities">
            <span><i aria-hidden="true" /> One coordinated process</span>
            <span><i aria-hidden="true" /> Role-based access</span>
            <span><i aria-hidden="true" /> Clear progress records</span>
          </div>
        </div>

        <div className="preview-wrap">
          <div className="preview-caption">
            <span className="preview-dot" />
            <span>PLATFORM OVERVIEW</span>
            <span className="preview-live">Illustrative preview</span>
          </div>
          <div className="workspace-preview" aria-label="Illustrative placement management workspace">
            <aside className="preview-sidebar">
              <div className="preview-mark">SA</div>
              <span className="preview-nav active" />
              <span className="preview-nav" />
              <span className="preview-nav" />
              <span className="preview-nav" />
            </aside>
            <div className="preview-main">
              <div className="preview-topline">
                <div>
                  <span className="preview-kicker">UNIVERSITY WORKSPACE</span>
                  <strong>Placement overview</strong>
                </div>
                <span className="preview-avatar">U</span>
              </div>
              <div className="preview-welcome">
                <div>
                  <span className="preview-kicker">ATTACHMENT CYCLE</span>
                  <strong>Keep every partner in sync.</strong>
                </div>
                <span className="preview-pill">In progress</span>
              </div>
              <div className="preview-summary">
                <div><span>Applications</span><b>Review queue</b><small>Employer decisions</small></div>
                <div><span>Placements</span><b>Student records</b><small>Assigned supervisors</small></div>
                <div><span>Progress</span><b>Activity log</b><small>Attendance & logbooks</small></div>
              </div>
              <div className="preview-table">
                <div className="preview-table-head"><span>PLACEMENT WORKFLOW</span><span>STATUS</span></div>
                <div className="preview-row"><span><i className="stage-icon">01</i><span><b>Applications</b><small>Student submissions</small></span></span><em>Review</em></div>
                <div className="preview-row"><span><i className="stage-icon">02</i><span><b>Placements</b><small>Company & supervisor</small></span></span><em className="stage-complete">Assigned</em></div>
                <div className="preview-row"><span><i className="stage-icon">03</i><span><b>Progress records</b><small>Logbook & attendance</small></span></span><em>Ongoing</em></div>
              </div>
              <p className="preview-footnote">A single view of the attachment journey.</p>
            </div>
          </div>
          <div className="preview-note"><span aria-hidden="true">✳</span> Designed around the people involved in every placement.</div>
        </div>
      </section>

      <section className="platform-section" id="platform" aria-labelledby="platform-title">
        <div className="section-intro">
          <p className="eyebrow">ONE CONNECTED PLATFORM</p>
          <h2 id="platform-title">Less chasing updates. More meaningful oversight.</h2>
          <p>
            Bring the people, records and decisions involved in work-based learning
            into a shared process, with access shaped around each role.
          </p>
        </div>
        <div className="capability-grid">
          <article className="capability-card">
            <span className="capability-number">01 / OPPORTUNITIES</span>
            <h3>Connect students to employers</h3>
            <p>Publish internship opportunities and manage applications through a clear review process.</p>
          </article>
          <article className="capability-card">
            <span className="capability-number">02 / PLACEMENTS</span>
            <h3>Coordinate the placement journey</h3>
            <p>Keep student, company and supervisor details connected to each placement record.</p>
          </article>
          <article className="capability-card">
            <span className="capability-number">03 / MONITORING</span>
            <h3>Follow progress as it happens</h3>
            <p>Bring attendance, logbook entries and supervisor feedback into the same workflow.</p>
          </article>
          <article className="capability-card">
            <span className="capability-number">04 / EVALUATION</span>
            <h3>Make reviews easier to follow</h3>
            <p>Use progress reports and evaluations to support consistent programme follow-up.</p>
          </article>
        </div>
      </section>

      <section className="audience-section" id="audiences" aria-labelledby="audience-title">
        <div className="section-intro">
          <p className="eyebrow">BUILT FOR EVERY PARTNER</p>
          <h2 id="audience-title">One journey. The right tools for every role.</h2>
        </div>
        <div className="audience-grid">
          {audiences.map((audience) => (
            <article className="audience-card" key={audience.number}>
              <span className="audience-number">{audience.number}</span>
              <h3>{audience.title}</h3>
              <p>{audience.description}</p>
              <ul>
                {audience.points.map((point) => <li key={point}>{point}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="workflow-section" id="how-it-works" aria-labelledby="workflow-title">
        <div className="workflow-heading">
          <p className="eyebrow">HOW IT WORKS</p>
          <h2 id="workflow-title">From first application to final review.</h2>
          <p>A clear sequence that keeps the placement process understandable for everyone involved.</p>
        </div>
        <div className="workflow-list">
          {workflow.map(([number, title, description]) => (
            <article className="workflow-step" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="closing-section">
        <div>
          <p className="eyebrow">A BETTER WAY TO COORDINATE ATTACHMENT</p>
          <h2>Give every partner a clearer view of the journey.</h2>
          <p>Sign in to continue to your role-based workspace.</p>
        </div>
        <Link className="primary-button" to={auth.isAuthenticated && workspacePath ? workspacePath : "/login"}>
          {auth.isAuthenticated && workspacePath ? "Open workspace" : "Get started"} <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </div>
  );
}
