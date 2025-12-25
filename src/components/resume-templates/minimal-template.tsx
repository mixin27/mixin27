import { Resume } from "@/types/resume"

interface MinimalTemplateProps {
  resume: Resume
}

export function MinimalTemplate({ resume }: MinimalTemplateProps) {
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
    return new Date(date).toLocaleDateString("en-US", { year: "numeric" })
  }

  return (
    <div
      className="bg-white text-gray-900 p-16"
      style={{ fontFamily: style.fontFamily }}
    >
      {/* Header - Minimalist */}
      <div className="mb-12">
        <h1 className="text-5xl font-light mb-2 tracking-tight">
          {personal.fullName}
        </h1>
        <p className="text-xl text-gray-600 font-light mb-6">
          {personal.title}
        </p>

        <div className="flex gap-6 text-sm text-gray-600 font-light">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
        </div>
      </div>

      {/* Content - Two columns */}
      <div className="grid grid-cols-3 gap-12">
        {/* Left Column - Sidebar */}
        <div className="space-y-10">
          {/* Skills */}
          {skills.length > 0 &&
            visibleSections.find((s) => s.type === "skills") && (
              <div>
                <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-4 font-semibold">
                  Skills
                </h2>
                <div className="space-y-3">
                  {skills.map((skill) => (
                    <div key={skill.id}>
                      <p className="text-sm font-light text-gray-800">
                        {skill.name}
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
                <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-4 font-semibold">
                  Languages
                </h2>
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <div key={lang.id}>
                      <p className="text-sm font-light text-gray-800">
                        {lang.name}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {lang.proficiency}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Certifications */}
          {certifications.length > 0 &&
            visibleSections.find((s) => s.type === "certifications") && (
              <div>
                <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-4 font-semibold">
                  Certifications
                </h2>
                <div className="space-y-3">
                  {certifications.map((cert) => (
                    <div key={cert.id}>
                      <p className="text-sm font-light text-gray-800">
                        {cert.name}
                      </p>
                      <p className="text-xs text-gray-500">{cert.issuer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* Right Column - Main content */}
        <div className="col-span-2 space-y-10">
          {visibleSections.map((section) => {
            // Summary
            if (section.type === "summary" && summary) {
              return (
                <div key={section.id}>
                  <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-4 font-semibold">
                    Profile
                  </h2>
                  <p className="text-gray-700 leading-relaxed font-light">
                    {summary}
                  </p>
                </div>
              )
            }

            // Experience
            if (section.type === "experience" && experience.length > 0) {
              return (
                <div key={section.id}>
                  <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-6 font-semibold">
                    Experience
                  </h2>
                  <div className="space-y-8">
                    {experience.map((exp) => (
                      <div key={exp.id}>
                        <div className="mb-2">
                          <h3 className="text-lg font-normal">
                            {exp.position}
                          </h3>
                          <p className="text-sm text-gray-600 font-light">
                            {exp.company} • {formatDate(exp.startDate)} -{" "}
                            {exp.current ? "Present" : formatDate(exp.endDate!)}
                          </p>
                        </div>
                        <p className="text-sm text-gray-700 font-light leading-relaxed">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }

            // Education
            if (section.type === "education" && education.length > 0) {
              return (
                <div key={section.id}>
                  <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-6 font-semibold">
                    Education
                  </h2>
                  <div className="space-y-6">
                    {education.map((edu) => (
                      <div key={edu.id}>
                        <h3 className="text-lg font-normal">{edu.degree}</h3>
                        <p className="text-sm text-gray-600 font-light">
                          {edu.institution} • {formatDate(edu.startDate)} -{" "}
                          {edu.current ? "Present" : formatDate(edu.endDate!)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }

            // Projects
            if (section.type === "projects" && projects.length > 0) {
              return (
                <div key={section.id}>
                  <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-6 font-semibold">
                    Projects
                  </h2>
                  <div className="space-y-8">
                    {projects.map((project) => (
                      <div key={project.id}>
                        <div className="mb-2">
                          <h3 className="text-lg font-normal">
                            {project.name}
                          </h3>
                          <p className="text-xs text-gray-500 font-light">
                            {project.technologies.join(" • ")}
                          </p>
                        </div>
                        <p className="text-sm text-gray-700 font-light leading-relaxed">
                          {project.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }

            return null
          })}
        </div>
      </div>
    </div>
  )
}
