import { Resume } from "@/types/resume"

interface ProfessionalTemplateProps {
  resume: Resume
}

export function ProfessionalTemplate({ resume }: ProfessionalTemplateProps) {
  const {
    personal,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    languages,
    sections,
    style,
  } = resume

  const visibleSections = sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order)

  const formatDate = (date: string, current?: boolean) => {
    if (current) return "Present"
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div
      className="bg-white text-gray-900"
      style={{ fontFamily: style.fontFamily }}
    >
      {/* Header with Blue Bar */}
      <div>
        <div className="h-3" style={{ backgroundColor: style.primaryColor }} />
        <div className="px-12 py-8 bg-gray-50">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">
            {personal.fullName}
          </h1>
          <p className="text-xl text-gray-700 mb-4">{personal.title}</p>

          <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-700">
            {personal.email && (
              <div>
                <span className="font-semibold">Email:</span> {personal.email}
              </div>
            )}
            {personal.phone && (
              <div>
                <span className="font-semibold">Phone:</span> {personal.phone}
              </div>
            )}
            {personal.location && (
              <div>
                <span className="font-semibold">Location:</span>{" "}
                {personal.location}
              </div>
            )}
            {personal.linkedin && (
              <div>
                <span className="font-semibold">LinkedIn:</span>{" "}
                {personal.linkedin}
              </div>
            )}
            {personal.website && (
              <div className="col-span-2">
                <span className="font-semibold">Website:</span>{" "}
                {personal.website}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-3 gap-8 px-12 py-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Skills */}
          {skills.length > 0 &&
            visibleSections.find((s) => s.type === "skills") && (
              <div>
                <h2
                  className="text-lg font-bold mb-4 pb-2 border-b-2"
                  style={{
                    color: style.primaryColor,
                    borderColor: style.primaryColor,
                  }}
                >
                  SKILLS
                </h2>
                <div className="space-y-4">
                  {Array.from(new Set(skills.map((s) => s.category))).map(
                    (category) => (
                      <div key={category}>
                        <h3 className="font-semibold text-gray-800 mb-2 text-sm">
                          {category}
                        </h3>
                        <div className="space-y-1">
                          {skills
                            .filter((s) => s.category === category)
                            .map((skill) => (
                              <div
                                key={skill.id}
                                className="text-sm text-gray-700"
                              >
                                • {skill.name}
                              </div>
                            ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

          {/* Education */}
          {education.length > 0 &&
            visibleSections.find((s) => s.type === "education") && (
              <div>
                <h2
                  className="text-lg font-bold mb-4 pb-2 border-b-2"
                  style={{
                    color: style.primaryColor,
                    borderColor: style.primaryColor,
                  }}
                >
                  EDUCATION
                </h2>
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {edu.degree}
                      </h3>
                      <p className="text-sm text-gray-700 font-medium">
                        {edu.field}
                      </p>
                      <p className="text-sm text-gray-600">{edu.institution}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(edu.startDate)} -{" "}
                        {edu.current ? "Present" : formatDate(edu.endDate!)}
                      </p>
                      {edu.gpa && (
                        <p className="text-xs text-gray-600 mt-1">
                          GPA: {edu.gpa}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Certifications */}
          {certifications.length > 0 &&
            visibleSections.find((s) => s.type === "certifications") && (
              <div>
                <h2
                  className="text-lg font-bold mb-4 pb-2 border-b-2"
                  style={{
                    color: style.primaryColor,
                    borderColor: style.primaryColor,
                  }}
                >
                  CERTIFICATIONS
                </h2>
                <div className="space-y-3">
                  {certifications.map((cert) => (
                    <div key={cert.id}>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {cert.name}
                      </h3>
                      <p className="text-xs text-gray-600">{cert.issuer}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(cert.issueDate)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Languages */}
          {languages.length > 0 &&
            visibleSections.find((s) => s.type === "languages") && (
              <div>
                <h2
                  className="text-lg font-bold mb-4 pb-2 border-b-2"
                  style={{
                    color: style.primaryColor,
                    borderColor: style.primaryColor,
                  }}
                >
                  LANGUAGES
                </h2>
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <div key={lang.id} className="text-sm">
                      <span className="font-semibold text-gray-800">
                        {lang.name}:
                      </span>{" "}
                      <span className="text-gray-600 capitalize">
                        {lang.proficiency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* Right Column - Main Content */}
        <div className="col-span-2 space-y-8">
          {/* Professional Summary */}
          {summary && visibleSections.find((s) => s.type === "summary") && (
            <div>
              <h2
                className="text-lg font-bold mb-4 pb-2 border-b-2"
                style={{
                  color: style.primaryColor,
                  borderColor: style.primaryColor,
                }}
              >
                PROFESSIONAL SUMMARY
              </h2>
              <p className="text-gray-700 leading-relaxed text-justify">
                {summary}
              </p>
            </div>
          )}

          {/* Professional Experience */}
          {experience.length > 0 &&
            visibleSections.find((s) => s.type === "experience") && (
              <div>
                <h2
                  className="text-lg font-bold mb-4 pb-2 border-b-2"
                  style={{
                    color: style.primaryColor,
                    borderColor: style.primaryColor,
                  }}
                >
                  PROFESSIONAL EXPERIENCE
                </h2>
                <div className="space-y-6">
                  {experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="mb-3">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-base font-bold text-gray-900">
                            {exp.position}
                          </h3>
                          <span className="text-xs text-gray-600 whitespace-nowrap ml-4">
                            {formatDate(exp.startDate)} -{" "}
                            {exp.current ? "Present" : formatDate(exp.endDate!)}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-gray-700">
                          {exp.company}
                        </p>
                        <p className="text-xs text-gray-600">{exp.location}</p>
                      </div>
                      <p className="text-sm text-gray-700 mb-2 leading-relaxed">
                        {exp.description}
                      </p>
                      {exp.highlights.length > 0 && (
                        <ul className="space-y-1">
                          {exp.highlights.map((highlight, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-gray-700 flex"
                            >
                              <span
                                className="mr-2"
                                style={{ color: style.primaryColor }}
                              >
                                ▪
                              </span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Projects */}
          {projects.length > 0 &&
            visibleSections.find((s) => s.type === "projects") && (
              <div>
                <h2
                  className="text-lg font-bold mb-4 pb-2 border-b-2"
                  style={{
                    color: style.primaryColor,
                    borderColor: style.primaryColor,
                  }}
                >
                  KEY PROJECTS
                </h2>
                <div className="space-y-6">
                  {projects.map((project) => (
                    <div key={project.id}>
                      <div className="mb-2">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-base font-bold text-gray-900">
                            {project.name}
                          </h3>
                          <span className="text-xs text-gray-600 whitespace-nowrap ml-4">
                            {formatDate(project.startDate)} -{" "}
                            {project.current
                              ? "Present"
                              : formatDate(project.endDate!)}
                          </span>
                        </div>
                        {project.url && (
                          <a
                            href={project.url}
                            className="text-xs"
                            style={{ color: style.primaryColor }}
                          >
                            {project.url}
                          </a>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-2 leading-relaxed">
                        {project.description}
                      </p>
                      <p className="text-xs text-gray-600 mb-2">
                        <span className="font-semibold">Technologies:</span>{" "}
                        {project.technologies.join(", ")}
                      </p>
                      {project.highlights.length > 0 && (
                        <ul className="space-y-1">
                          {project.highlights.map((highlight, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-gray-700 flex"
                            >
                              <span
                                className="mr-2"
                                style={{ color: style.primaryColor }}
                              >
                                ▪
                              </span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}
