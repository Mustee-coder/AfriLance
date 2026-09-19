import { useRef } from "react";
import html2pdf from "html2pdf.js";

interface ResumeExperienceItem {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

interface ResumeEducationItem {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

interface ResumeProjectItem {
  title: string;
  description: string;
  projectUrl?: string;
}

interface ResumeCertificationItem {
  name: string;
  issuer: string;
  issueDate?: string;
  credentialUrl?: string;
}

interface ResumePreviewProps {
  headline: string;
  professionalSummary: string;
  skills: string[];
  experience: ResumeExperienceItem[];
  education: ResumeEducationItem[];
  projects: ResumeProjectItem[];
  certifications: ResumeCertificationItem[];
  template: "classic" | "modern" | "minimal";
}

const ResumePreview = ({
  headline,
  professionalSummary,
  skills,
  experience,
  education,
  projects,
  certifications,
  template,
}: ResumePreviewProps) => {
  const templateStyles = {
    classic: {
      container: "bg-white text-slate-900",
      header: "border-b-2 border-slate-900 pb-5",
      heading: "text-slate-900",
      accent: "bg-slate-900",
      accentText: "text-slate-900",
      skill:
        "bg-slate-100 text-slate-700 border border-slate-200",
    },
    modern: {
      container: "bg-white text-slate-900",
      header: "border-b-2 border-emerald-600 pb-5",
      heading: "text-emerald-700",
      accent: "bg-emerald-600",
      accentText: "text-emerald-600",
      skill:
        "bg-emerald-50 text-emerald-700 border border-emerald-100",
    },
    minimal: {
      container: "bg-white text-slate-900",
      header: "border-b border-slate-300 pb-5",
      heading: "text-slate-700",
      accent: "bg-slate-400",
      accentText: "text-slate-600",
      skill:
        "bg-slate-50 text-slate-600 border border-slate-200",
    },
  };

  const currentTemplate = templateStyles[template];

  const templateName =
    template.charAt(0).toUpperCase() + template.slice(1);
    const resumeRef = useRef<HTMLDivElement>(null);
    const handleDownloadPDF = () => {
  if (!resumeRef.current) return;

  const options = {
    margin: 0,
    filename: "afrilance-resume.pdf",
    image: {
  type: "jpeg" as const,
  quality: 0.98,
},
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    },
    jsPDF: {
  unit: "mm",
  format: "a4",
  orientation: "portrait" as const,
},
    pagebreak: {
      mode: ["css", "legacy"],
    },
  };

  html2pdf()
    .set(options)
    .from(resumeRef.current)
    .save();
};

  return (
    <section className="lg:sticky lg:top-24 lg:self-start">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Preview header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="font-bold text-slate-900">
              Live Preview
            </h2>

            <p className="text-xs text-slate-500">
              Your resume preview
            </p>
          </div>

          <div className="flex items-center gap-2">
  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
    {templateName}
  </span>

  <button
    type="button"
    onClick={handleDownloadPDF}
    className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
  >
    Download PDF
  </button>
</div>
        </div>

        {/* Resume paper */}
        <div className="bg-slate-200 p-4 sm:p-8">
         <div
  ref={resumeRef}
  className={`mx-auto min-h-[700px] max-w-[760px] p-7 shadow-lg sm:p-10 ${currentTemplate.container}`}
>
            {/* Resume header */}
            <div className={currentTemplate.header}>
              <p
                className={`text-[10px] font-bold uppercase tracking-[0.2em] ${currentTemplate.accentText}`}
              >
                AfriLance Resume
              </p>

              <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                Your Name
              </h1>

              <p
                className={`mt-2 text-sm font-semibold ${currentTemplate.accentText}`}
              >
                {headline || "Professional Headline"}
              </p>
            </div>

            {/* Summary */}
            <div className="mt-6">
              <h3
                className={`text-xs font-bold uppercase tracking-[0.15em] ${currentTemplate.heading}`}
              >
                Professional Summary
              </h3>

              <div
                className={`mt-2 h-0.5 w-8 rounded-full ${currentTemplate.accent}`}
              />

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {professionalSummary ||
                  "Your professional summary will appear here. Describe your experience, strengths, and the value you bring to clients."}
              </p>
            </div>

            {/* Skills */}
            <div className="mt-7">
              <h3
                className={`text-xs font-bold uppercase tracking-[0.15em] ${currentTemplate.heading}`}
              >
                Skills
              </h3>

              <div
                className={`mt-2 h-0.5 w-8 rounded-full ${currentTemplate.accent}`}
              />

              {skills.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className={`rounded-full px-3 py-1 text-xs font-medium ${currentTemplate.skill}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-400">
                  Your skills will appear here.
                </p>
              )}
            </div>

            {/* Experience */}
            <div className="mt-8 border-t border-slate-200 pt-6">
              <h3
                className={`text-xs font-bold uppercase tracking-[0.15em] ${currentTemplate.heading}`}
              >
                Experience
              </h3>

              <div
                className={`mt-2 h-0.5 w-8 rounded-full ${currentTemplate.accent}`}
              />

              {experience.length > 0 ? (
                <div className="mt-4 space-y-5">
                  {experience.map((item, index) => (
                    <div key={index}>
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">
                            {item.position || "Position"}
                          </h4>

                          <p className="mt-1 text-sm font-medium text-slate-600">
                            {item.company || "Company"}
                          </p>
                        </div>

                        <p className="text-xs text-slate-400">
                          {item.startDate || "Start date"}
                          {" — "}
                          {item.current
                            ? "Present"
                            : item.endDate || "End date"}
                        </p>
                      </div>

                      {item.description && (
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-400">
                  Experience will appear here.
                </p>
              )}
            </div>

            {/* Education */}
            <div className="mt-7 border-t border-slate-200 pt-6">
              <h3
                className={`text-xs font-bold uppercase tracking-[0.15em] ${currentTemplate.heading}`}
              >
                Education
              </h3>

              <div
                className={`mt-2 h-0.5 w-8 rounded-full ${currentTemplate.accent}`}
              />

              {education.length > 0 ? (
                <div className="mt-4 space-y-5">
                  {education.map((item, index) => (
                    <div key={index}>
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">
                            {item.degree || "Degree"}
                          </h4>

                          <p className="mt-1 text-sm font-medium text-slate-600">
                            {item.institution || "Institution"}
                          </p>

                          {item.fieldOfStudy && (
                            <p className="mt-1 text-xs text-slate-500">
                              {item.fieldOfStudy}
                            </p>
                          )}
                        </div>

                        {(item.startDate || item.endDate) && (
                          <p className="text-xs text-slate-400">
                            {item.startDate || "Start date"}
                            {" — "}
                            {item.endDate || "Present"}
                          </p>
                        )}
                      </div>

                      {item.description && (
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-400">
                  Education will appear here.
                </p>
              )}
            </div>

            {/* Projects */}
            <div className="mt-7 border-t border-slate-200 pt-6">
              <h3
                className={`text-xs font-bold uppercase tracking-[0.15em] ${currentTemplate.heading}`}
              >
                Projects
              </h3>

              <div
                className={`mt-2 h-0.5 w-8 rounded-full ${currentTemplate.accent}`}
              />

              {projects.length > 0 ? (
                <div className="mt-4 space-y-5">
                  {projects.map((project, index) => (
                    <div key={index}>
                      <h4 className="text-sm font-bold text-slate-900">
                        {project.title || "Project Title"}
                      </h4>

                      {project.projectUrl && (
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`mt-1 block break-all text-xs font-medium hover:underline ${currentTemplate.accentText}`}
                        >
                          {project.projectUrl}
                        </a>
                      )}

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {project.description ||
                          "Project description will appear here."}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-400">
                  Projects will appear here.
                </p>
              )}
            </div>

            {/* Certifications */}
            <div className="mt-7 border-t border-slate-200 pt-6">
              <h3
                className={`text-xs font-bold uppercase tracking-[0.15em] ${currentTemplate.heading}`}
              >
                Certifications
              </h3>

              <div
                className={`mt-2 h-0.5 w-8 rounded-full ${currentTemplate.accent}`}
              />

              {certifications.length > 0 ? (
                <div className="mt-4 space-y-5">
                  {certifications.map(
                    (certification, index) => (
                      <div key={index}>
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">
                              {certification.name ||
                                "Certification Name"}
                            </h4>

                            <p className="mt-1 text-sm font-medium text-slate-600">
                              {certification.issuer ||
                                "Issuing Organization"}
                            </p>
                          </div>

                          {certification.issueDate && (
                            <p className="text-xs text-slate-400">
                              {certification.issueDate}
                            </p>
                          )}
                        </div>

                        {certification.credentialUrl && (
                          <a
                            href={certification.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`mt-2 block break-all text-xs font-medium hover:underline ${currentTemplate.accentText}`}
                          >
                            {certification.credentialUrl}
                          </a>
                        )}
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-400">
                  Certifications will appear here.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumePreview;