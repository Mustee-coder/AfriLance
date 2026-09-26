import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getPublicResume } from "@/api/resume.api";

const PublicResume = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-resume", slug],
    queryFn: () => getPublicResume(slug!),
    enabled: Boolean(slug),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading resume...
      </div>
    );
  }

  if (isError || !data?.resume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">
          Public resume not found.
        </p>
      </div>
    );
  }

  const resume = data.resume;

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow-sm">
        <header className="border-b pb-6">
          <h1 className="text-3xl font-bold">
            {resume.name}
          </h1>

          {resume.headline && (
            <p className="mt-2 text-lg text-gray-600">
              {resume.headline}
            </p>
          )}
        </header>

        {resume.professionalSummary && (
          <section className="mt-6">
            <h2 className="text-xl font-semibold">
              Professional Summary
            </h2>

            <p className="mt-2 text-gray-600">
              {resume.professionalSummary}
            </p>
          </section>
        )}

        {resume.skills.length > 0 && (
          <section className="mt-6">
            <h2 className="text-xl font-semibold">
              Skills
            </h2>

            <div className="mt-3 flex flex-wrap gap-2">
              {resume.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {resume.experience.length > 0 && (
          <section className="mt-6">
            <h2 className="text-xl font-semibold">
              Experience
            </h2>

            <div className="mt-3 space-y-4">
              {resume.experience.map((experience) => (
                <article key={experience._id}>
                  <h3 className="font-semibold">
                    {experience.position}
                  </h3>

                  <p className="text-gray-600">
                    {experience.company}
                  </p>

                  {experience.description && (
                    <p className="mt-1 text-gray-600">
                      {experience.description}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {resume.education.length > 0 && (
          <section className="mt-6">
            <h2 className="text-xl font-semibold">
              Education
            </h2>

            <div className="mt-3 space-y-4">
              {resume.education.map((education) => (
                <article key={education._id}>
                  <h3 className="font-semibold">
                    {education.degree}
                  </h3>

                  <p className="text-gray-600">
                    {education.institution}
                  </p>

                  {education.fieldOfStudy && (
                    <p className="text-gray-600">
                      {education.fieldOfStudy}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {resume.projects.length > 0 && (
          <section className="mt-6">
            <h2 className="text-xl font-semibold">
              Projects
            </h2>

            <div className="mt-3 space-y-4">
              {resume.projects.map((project) => (
                <article key={project._id}>
                  <h3 className="font-semibold">
                    {project.title}
                  </h3>

                  <p className="text-gray-600">
                    {project.description}
                  </p>

                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block text-blue-600 hover:underline"
                    >
                      View project
                    </a>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {resume.certifications.length > 0 && (
          <section className="mt-6">
            <h2 className="text-xl font-semibold">
              Certifications
            </h2>

            <div className="mt-3 space-y-4">
              {resume.certifications.map((certification) => (
                <article key={certification._id}>
                  <h3 className="font-semibold">
                    {certification.name}
                  </h3>

                  <p className="text-gray-600">
                    {certification.issuer}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default PublicResume;