import { Resume } from "@/types/resume"

interface ClassicTemplateProps {
  resume: Resume
}

export function ClassicTemplate({ resume }: ClassicTemplateProps) {
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
      className="bg-white text-gray-900 p-12"
      style={{ fontFamily: "Georgia, serif" }}
    >
      {/* Header - Centered */}
      <div className="text-center border-b-2 border-gray-900 pb-6 mb-8">
        <h1 className="text-4xl font-bold mb-2">{personal.fullName}</h1>
        <p className="text-lg text-gray-700 mb-3">{personal.title}</p>

        <div className="flex justify-center flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>•</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>•</span>}
          {personal.location && <span>{personal.location}</span>}
        </div>

        {(personal.website || personal.linkedin) && (
          <div className="flex justify-center flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600 mt-2">
            {personal.website && <span>{personal.website}</span>}
            {personal.linkedin && personal.website && <span>•</span>}
            {personal.linkedin && <span>{personal.linkedin}</span>}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-8">
        {visibleSections.map((section) => {
          // Summary
          if (section.type === "summary" && summary) {
            return (
              <div key={section.id}>
                <h2 className="text-xl font-bold uppercase border-b border-gray-400 pb-2 mb-4">
                  {section.title}
                </h2>
                <p className="text-gray-700 leading-relaxed text-justify">
                  {summary}
                </p>
              </div>
            )
          }

          // Experience
          if (section.type === "experience" && experience.length > 0) {
            return (
              <div key={section.id}>
                <h2 className="text-xl font-bold uppercase border-b border-gray-400 pb-2 mb-4">
                  {section.title}
                </h2>
                <div className="space-y-5">
                  {experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-lg font-bold">{exp.position}</h3>
                        <span className="text-sm text-gray-600 italic">
                          {formatDate(exp.startDate)} -{" "}
                          {exp.current ? "Present" : formatDate(exp.endDate!)}
                        </span>
                      </div>
                      <p className="text-gray-700 italic mb-2">
                        {exp.company}, {exp.location}
                      </p>
                      <p className="text-gray-700 mb-2">{exp.description}</p>
                      {exp.highlights.length > 0 && (
                        <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                          {exp.highlights.map((highlight, idx) => (
                            <li key={idx}>{highlight}</li>
                          ))}
                        </ul>
                      )}
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
                <h2 className="text-xl font-bold uppercase border-b border-gray-400 pb-2 mb-4">
                  {section.title}
                </h2>
                <div className="space-y-5">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-lg font-bold">
                          {edu.degree} in {edu.field}
                        </h3>
                        <span className="text-sm text-gray-600 italic">
                          {formatDate(edu.startDate)} -{" "}
                          {edu.current ? "Present" : formatDate(edu.endDate!)}
                        </span>
                      </div>
                      <p className="text-gray-700 italic">
                        {edu.institution}, {edu.location}
                      </p>
                      {edu.gpa && (
                        <p className="text-gray-700">GPA: {edu.gpa}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          }

          // Skills
          if (section.type === "skills" && skills.length > 0) {
            const skillsByCategory = skills.reduce(
              (acc, skill) => {
                if (!acc[skill.category]) acc[skill.category] = []
                acc[skill.category].push(skill)
                return acc
              },
              {} as Record<string, typeof skills>,
            )

            return (
              <div key={section.id}>
                <h2 className="text-xl font-bold uppercase border-b border-gray-400 pb-2 mb-4">
                  {section.title}
                </h2>
                <div className="space-y-2">
                  {Object.entries(skillsByCategory).map(
                    ([category, categorySkills]) => (
                      <div key={category}>
                        <span className="font-bold text-gray-800">
                          {category}:
                        </span>{" "}
                        <span className="text-gray-700">
                          {categorySkills.map((s) => s.name).join(", ")}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )
          }

          // Projects
          if (section.type === "projects" && projects.length > 0) {
            return (
              <div key={section.id}>
                <h2 className="text-xl font-bold uppercase border-b border-gray-400 pb-2 mb-4">
                  {section.title}
                </h2>
                <div className="space-y-5">
                  {projects.map((project) => (
                    <div key={project.id}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-lg font-bold">{project.name}</h3>
                        <span className="text-sm text-gray-600 italic">
                          {formatDate(project.startDate)} -{" "}
                          {project.current
                            ? "Present"
                            : formatDate(project.endDate!)}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">
                        {project.description}
                      </p>
                      <p className="text-sm text-gray-600 mb-2 italic">
                        Technologies: {project.technologies.join(", ")}
                      </p>
                      {project.highlights.length > 0 && (
                        <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                          {project.highlights.map((highlight, idx) => (
                            <li key={idx}>{highlight}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          }

          // Certifications
          if (section.type === "certifications" && certifications.length > 0) {
            return (
              <div key={section.id}>
                <h2 className="text-xl font-bold uppercase border-b border-gray-400 pb-2 mb-4">
                  {section.title}
                </h2>
                <div className="space-y-3">
                  {certifications.map((cert) => (
                    <div key={cert.id}>
                      <h3 className="font-bold">{cert.name}</h3>
                      <p className="text-gray-700">
                        {cert.issuer} • {formatDate(cert.issueDate)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )
          }

          // Languages
          if (section.type === "languages" && languages.length > 0) {
            return (
              <div key={section.id}>
                <h2 className="text-xl font-bold uppercase border-b border-gray-400 pb-2 mb-4">
                  {section.title}
                </h2>
                <div className="flex flex-wrap gap-4">
                  {languages.map((lang) => (
                    <span key={lang.id} className="text-gray-700">
                      <span className="font-bold">{lang.name}</span> (
                      {lang.proficiency})
                    </span>
                  ))}
                </div>
              </div>
            )
          }

          return null
        })}
      </div>
    </div>
  )
}
