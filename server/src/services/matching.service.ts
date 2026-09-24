import Job from "../models/job.model.js";
import { DeveloperProfile } from "../models/developerProfile.model.js";

const EXPERIENCE_THRESHOLDS = {
  entry: 0,
  intermediate: 2,
  expert: 5,
} as const;

type ExperienceRequirement = keyof typeof EXPERIENCE_THRESHOLDS;

interface PublicUser {
  firstName: string;
  lastName: string;
}

export interface JobMatch {
  developerProfileId: string;
  developer: PublicUser;
  availability: "available" | "busy";
  skills: {
    matched: string[];
    missing: string[];
    matchedCount: number;
    requiredCount: number;
  };
  experience: {
    years: number;
    requirement: ExperienceRequirement;
    meetsRequirement: boolean;
  };
  portfolioEvidence: {
    projectId: string;
    title: string;
    matchedSkills: string[];
  }[];
  reasons: string[];
}

export interface JobMatchesResult {
  jobId: string;
  matches: JobMatch[];
  meta: {
    returned: number;
    excluded: {
      unavailable: number;
      noSkillMatch: number;
    };
  };
}

export class MatchingError extends Error {
  constructor(
    public readonly code:
      | "JOB_NOT_FOUND"
      | "JOB_NOT_OPEN"
      | "JOB_ACCESS_DENIED",
  ) {
    super(code);
  }
}

const normalizeSkill = (skill: string): string =>
  skill.trim().toLocaleLowerCase().replace(/\s+/g, " ");

const uniqueNormalizedSkills = (skills: string[]): string[] =>
  [...new Set(skills.map(normalizeSkill).filter(Boolean))];

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const containsExactSkillPhrase = (
  text: string,
  normalizedSkill: string,
): boolean => {
  const expression = new RegExp(
    `(^|[^\\p{L}\\p{N}])${escapeRegExp(normalizedSkill)}(?=$|[^\\p{L}\\p{N}])`,
    "u",
  );

  return expression.test(normalizeSkill(text));
};

const getPortfolioEvidence = (
  requiredSkills: string[],
  portfolio: {
    _id?: { toString(): string };
    title: string;
    description: string;
  }[],
): JobMatch["portfolioEvidence"] =>
  portfolio.flatMap((project) => {
    const projectText = `${project.title} ${project.description}`;
    const matchedSkills = requiredSkills.filter((skill) =>
      containsExactSkillPhrase(projectText, skill),
    );

    if (matchedSkills.length === 0 || !project._id) {
      return [];
    }

    return [
      {
        projectId: project._id.toString(),
        title: project.title,
        matchedSkills,
      },
    ];
  });

const getReasons = (
  matchedCount: number,
  requiredCount: number,
  meetsExperienceRequirement: boolean,
  requirement: ExperienceRequirement,
  availability: "available" | "busy",
  portfolioEvidenceCount: number,
): string[] => {
  const reasons = [
    `Matches ${matchedCount} of ${requiredCount} listed job skills`,
    meetsExperienceRequirement
      ? `Meets the ${requirement} experience requirement`
      : `Does not meet the ${requirement} experience requirement`,
    availability === "available"
      ? "Currently available"
      : "Currently busy",
  ];

  if (portfolioEvidenceCount > 0) {
    reasons.push(
      `Portfolio contains exact skill mentions in ${portfolioEvidenceCount} project${portfolioEvidenceCount === 1 ? "" : "s"}`,
    );
  }

  return reasons;
};

export const getJobMatches = async (
  jobId: string,
  requesterId: string,
): Promise<JobMatchesResult> => {
  const job = await Job.findById(jobId).lean();

  if (!job) {
    throw new MatchingError("JOB_NOT_FOUND");
  }

  if (job.client.toString() !== requesterId) {
    throw new MatchingError("JOB_ACCESS_DENIED");
  }

  if (job.status !== "open") {
    throw new MatchingError("JOB_NOT_OPEN");
  }

  const requiredSkills = uniqueNormalizedSkills(job.skills);
  const developers = await DeveloperProfile.find({})
    .populate<{ user: PublicUser }>("user", "firstName lastName")
    .lean();

  let unavailable = 0;
  let noSkillMatch = 0;

  const matches: JobMatch[] = developers.flatMap((developer) => {
    if (developer.availability === "unavailable") {
      unavailable += 1;
      return [];
    }

    const developerSkills = new Set(uniqueNormalizedSkills(developer.skills));
    const matched = requiredSkills.filter((skill) => developerSkills.has(skill));

    if (matched.length === 0) {
      noSkillMatch += 1;
      return [];
    }

    const missing = requiredSkills.filter((skill) => !developerSkills.has(skill));
    const requirement = job.experienceLevel;
    const meetsRequirement =
      developer.experience >= EXPERIENCE_THRESHOLDS[requirement];
    const portfolioEvidence = getPortfolioEvidence(
      requiredSkills,
      developer.portfolio,
    );

    return [
      {
        developerProfileId: developer._id.toString(),
        developer: {
          firstName: developer.user.firstName,
          lastName: developer.user.lastName,
        },
        availability: developer.availability,
        skills: {
          matched,
          missing,
          matchedCount: matched.length,
          requiredCount: requiredSkills.length,
        },
        experience: {
          years: developer.experience,
          requirement,
          meetsRequirement,
        },
        portfolioEvidence,
        reasons: getReasons(
          matched.length,
          requiredSkills.length,
          meetsRequirement,
          requirement,
          developer.availability,
          portfolioEvidence.length,
        ),
      },
    ];
  });

  matches.sort((left, right) => {
    if (right.skills.matchedCount !== left.skills.matchedCount) {
      return right.skills.matchedCount - left.skills.matchedCount;
    }

    if (
      right.experience.meetsRequirement !== left.experience.meetsRequirement
    ) {
      return Number(right.experience.meetsRequirement) - Number(left.experience.meetsRequirement);
    }

    if (left.availability !== right.availability) {
      return left.availability === "available" ? -1 : 1;
    }

    if (right.portfolioEvidence.length !== left.portfolioEvidence.length) {
      return right.portfolioEvidence.length - left.portfolioEvidence.length;
    }

    return left.developerProfileId.localeCompare(right.developerProfileId);
  });

  return {
    jobId: job._id.toString(),
    matches,
    meta: {
      returned: matches.length,
      excluded: {
        unavailable,
        noSkillMatch,
      },
    },
  };
};
