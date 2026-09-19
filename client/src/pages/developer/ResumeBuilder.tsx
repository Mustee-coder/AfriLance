import { useEffect, useState } from "react";

import {
  useCreateResume,
  useMyResume,
  useUpdateResume,
} from "@/hooks/useResume";

import { useImproveCV } from "@/hooks/useAI";

import ResumeBasicInfo from "@/components/resume/ResumeBasicInfo";
import ResumeSummary from "@/components/resume/ResumeSummary";
import ResumeSkills from "@/components/resume/ResumeSkills";
import ResumeExperience from "@/components/resume/ResumeExperience";
import ResumeEducation from "@/components/resume/ResumeEducation";
import ResumeProjects, {
  type ResumeProjectItem,
} from "@/components/resume/ResumeProjects";
import ResumeCertifications, {
  type ResumeCertificationItem,
} from "@/components/resume/ResumeCertifications";
import ResumePreview from "@/components/resume/ResumePreview";
import ResumeTemplateSelector from "@/components/resume/ResumeTemplateSelector";

const ResumeBuilder = () => {

  const resumeQuery = useMyResume();
  const createResume = useCreateResume();
  const updateResume = useUpdateResume();
  const improveCVMutation = useImproveCV();

  const [headline, setHeadline] = useState("");
  const [professionalSummary, setProfessionalSummary] =
    useState("");

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");


const [template, setTemplate] = useState<
  "classic" | "modern" | "minimal"
>("classic");

  const [experience, setExperience] = useState<
    {
      company: string;
      position: string;
      startDate: string;
      endDate?: string;
      current: boolean;
      description?: string;
    }[]
  >([]);

  const [education, setEducation] = useState<
    {
      institution: string;
      degree: string;
      fieldOfStudy?: string;
      startDate?: string;
      endDate?: string;
      description?: string;
    }[]
  >([]);

  const [projects, setProjects] = useState<
    ResumeProjectItem[]
  >([]);

  const [certifications, setCertifications] = useState<
    ResumeCertificationItem[]
  >([]);

  useEffect(() => {
    if (!resumeQuery.data?.resume) return;

    const resume = resumeQuery.data.resume;

    setHeadline(resume.headline ?? "");

    setProfessionalSummary(
      resume.professionalSummary ?? "",
    );

    setSkills(resume.skills ?? []);

    setExperience(
      (resume.experience ?? []).map((item) => ({
        company: item.company,
        position: item.position,
        startDate: item.startDate.slice(0, 10),
        endDate: item.endDate
          ? item.endDate.slice(0, 10)
          : "",
        current: item.current,
        description: item.description ?? "",
      })),
    );

    setEducation(
  (resume.education ?? []).map((item) => ({
    institution: item.institution,
    degree: item.degree,
    fieldOfStudy: item.fieldOfStudy ?? "",
    startDate: item.startDate
      ? item.startDate.slice(0, 10)
      : "",
    endDate: item.endDate
      ? item.endDate.slice(0, 10)
      : "",
    description: item.description ?? "",
  })),
);

setProjects(resume.projects ?? []);

setCertifications(
  (resume.certifications ?? []).map((item) => ({
    name: item.name,
    issuer: item.issuer,
    issueDate: item.issueDate
      ? item.issueDate.slice(0, 10)
      : "",
    credentialUrl: item.credentialUrl ?? "",
  })),
);

setTemplate(resume.template ?? "classic");
}, [resumeQuery.data]);




  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    if (
      skills.some(
        (item) =>
          item.toLowerCase() === skill.toLowerCase(),
      )
    ) {
      setSkillInput("");
      return;
    }

    setSkills((current) => [...current, skill]);
    setSkillInput("");
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills((current) =>
      current.filter(
        (skill) => skill !== skillToRemove,
      ),
    );
  };

  const addExperience = () => {
    setExperience((current) => [
      ...current,
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ]);
  };

  const updateExperience = (
    index: number,
    field: keyof (typeof experience)[number],
    value: string | boolean,
  ) => {
    setExperience((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  const removeExperience = (index: number) => {
    setExperience((current) =>
      current.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    );
  };

  const addEducation = () => {
    setEducation((current) => [
      ...current,
      {
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  const updateEducation = (
    index: number,
    field: keyof (typeof education)[number],
    value: string,
  ) => {
    setEducation((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  const removeEducation = (index: number) => {
    setEducation((current) =>
      current.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    );
  };

  const addProject = () => {
    setProjects((current) => [
      ...current,
      {
        title: "",
        description: "",
        projectUrl: "",
      },
    ]);
  };

  const updateProject = (
    index: number,
    field: keyof ResumeProjectItem,
    value: string,
  ) => {
    setProjects((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  const removeProject = (index: number) => {
    setProjects((current) =>
      current.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    );
  };

  const addCertification = () => {
    setCertifications((current) => [
      ...current,
      {
        name: "",
        issuer: "",
        issueDate: "",
        credentialUrl: "",
      },
    ]);
  };

  const updateCertification = (
    index: number,
    field: keyof ResumeCertificationItem,
    value: string,
  ) => {
    setCertifications((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  const removeCertification = (index: number) => {
    setCertifications((current) =>
      current.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    );
  };

  const handleSave = async () => {
    const data = {
      headline: headline.trim(),
      professionalSummary:
        professionalSummary.trim(),
      skills,
      experience,
      education,
      projects,
      certifications,
      template,
    };

    try {
      if (resumeQuery.data?.resume) {
        await updateResume.mutateAsync(data);
      } else {
        await createResume.mutateAsync(data);
      }
    } catch {
      // Mutation state handles the error.
    }
  };
  const handleImproveCV = async () => {
  try {
    const response = await improveCVMutation.mutateAsync({
      headline: headline.trim(),
      professionalSummary: professionalSummary.trim(),
      skills,
      experience,
      projects,
      education,
      certifications,
    });

    const improved = response.resume;

    setHeadline(improved.headline ?? "");
    setProfessionalSummary(
      improved.professionalSummary ?? "",
    );
    setSkills(improved.skills ?? []);
    setExperience(improved.experience ?? []);
    setProjects(improved.projects ?? []);
    setEducation(improved.education ?? []);
    setCertifications(improved.certifications ?? []);
  } catch {
    // Mutation state handles the error.
  }
};

  const isSaving =
    createResume.isPending ||
    updateResume.isPending;

  if (resumeQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600" />

          <p className="text-sm text-slate-500">
            Loading your resume...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-emerald-600"
              aria-label="Go back"
            >
              ←
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900">
                  Resume Builder
                </h1>

                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  AfriLance
                </span>
              </div>

              <p className="hidden text-xs text-slate-500 sm:block">
                Build your professional resume
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
  <button
    type="button"
    onClick={handleImproveCV}
    disabled={improveCVMutation.isPending}
    className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {improveCVMutation.isPending
      ? "Improving..."
      : "✨ Improve with AI"}
  </button>

  <button
    type="button"
    onClick={handleSave}
    disabled={isSaving}
    className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
  >
    {isSaving ? "Saving..." : "Save Resume"}
  </button>
</div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
          {/* Editor */}
          <section className="space-y-5">
            <ResumeBasicInfo
              headline={headline}
              onHeadlineChange={setHeadline}
            />

            <ResumeSummary
              professionalSummary={professionalSummary}
              onProfessionalSummaryChange={
                setProfessionalSummary
              }
            />

            <ResumeSkills
              skills={skills}
              skillInput={skillInput}
              onSkillInputChange={setSkillInput}
              onAddSkill={addSkill}
              onRemoveSkill={removeSkill}
            />

            <ResumeExperience
              experience={experience}
              onAddExperience={addExperience}
              onUpdateExperience={updateExperience}
              onRemoveExperience={removeExperience}
            />

            <ResumeEducation
              education={education}
              onAddEducation={addEducation}
              onUpdateEducation={updateEducation}
              onRemoveEducation={removeEducation}
            />

            <ResumeProjects
              projects={projects}
              onAddProject={addProject}
              onUpdateProject={updateProject}
              onRemoveProject={removeProject}
            />

            <ResumeCertifications
              certifications={certifications}
              onAddCertification={addCertification}
              onUpdateCertification={updateCertification}
              onRemoveCertification={removeCertification}
            />
            
            <ResumeTemplateSelector
  template={template}
  onChange={setTemplate}
/>


            {/* Completion status */}
            <div className="rounded-2xl border border-emerald-200 bg-white p-5">
              <p className="text-sm font-semibold text-slate-700">
                Resume sections
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-emerald-50 p-3 font-medium text-emerald-700">
                  ✓ Basic Info
                </div>

                <div className="rounded-lg bg-emerald-50 p-3 font-medium text-emerald-700">
                  ✓ Summary
                </div>

                <div className="rounded-lg bg-emerald-50 p-3 font-medium text-emerald-700">
                  ✓ Skills
                </div>

                <div className="rounded-lg bg-emerald-50 p-3 font-medium text-emerald-700">
                  ✓ Experience
                </div>

                <div className="rounded-lg bg-emerald-50 p-3 font-medium text-emerald-700">
                  ✓ Education
                </div>

                <div className="rounded-lg bg-emerald-50 p-3 font-medium text-emerald-700">
                  ✓ Projects
                </div>

                <div className="rounded-lg bg-emerald-50 p-3 font-medium text-emerald-700">
                  ✓ Certifications
                </div>

                <div className="rounded-lg bg-slate-50 p-3 text-slate-500">
                  Template selection
                </div>
              </div>
            </div>

            {/* Save status */}
            {createResume.isError ||
            updateResume.isError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                Failed to save your resume. Please try
                again.
              </div>
            ) : (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                Your resume is connected to your
                AfriLance account.
              </div>
            )}
          </section>

          {/* Preview */}
          <ResumePreview
  headline={headline}
  professionalSummary={professionalSummary}
  skills={skills}
  experience={experience}
  education={education}
  projects={projects}
  certifications={certifications}
  template={template}
/>
        </div>
      </main>
    </div>
  );
};

export default ResumeBuilder;