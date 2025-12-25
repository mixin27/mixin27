import { Resume } from "@/types/resume"
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react"

interface ModernTemplateProps {
  resume: Resume
}

export function ModernTemplate({ resume }: ModernTemplateProps) {
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
      className="bg-white text-gray-900 shadow-lg"
      style={{
        fontFamily: style.fontFamily,
        fontSize:
          style.fontSize === "small"
            ? "0.875rem"
            : style.fontSize === "large"
              ? "1.125rem"
              : "1rem",
      }}
    >
      {/* Header */}
      <div
        className="px-12 py-8"
        style={{ backgroundColor: style.primaryColor }}
      >
        <div className="flex items-start gap-6">
          {style.showPhoto && personal.photo && (
            <img
              src={personal.photo}
              alt={personal.fullName}
              className="w-24 h-24 rounded-full object-cover border-4 border-white"
            />
          )}
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">
              {personal.fullName}
            </h1>
            <p className="text-xl text-white/90 mb-4">{personal.title}</p>

            <div className="flex flex-wrap gap-4 text-white/80 text-sm">
              {personal.email && (
                <div className="flex items-center gap-1">
                  {style.showIcons && <Mail className="size-4" />}
                  <span>{personal.email}</span>
                </div>
              )}
              {personal.phone && (
                <div className="flex items-center gap-1">
                  {style.showIcons && <Phone className="size-4" />}
                  <span>{personal.phone}</span>
                </div>
              )}
              {personal.location && (
                <div className="flex items-center gap-1">
                  {style.showIcons && <MapPin className="size-4" />}
                  <span>{personal.location}</span>
                </div>
              )}
              {personal.website && (
                <div className="flex items-center gap-1">
                  {style.showIcons && <Globe className="size-4" />}
                  <span>{personal.website}</span>
                </div>
              )}
              {personal.linkedin && (
                <div className="flex items-center gap-1">
                  {style.showIcons && <Linkedin className="size-4" />}
                  <span>{personal.linkedin}</span>
                </div>
              )}
              {personal.github && (
                <div className="flex items-center gap-1">
                  {style.showIcons && <Github className="size-4" />}
                  <span>{personal.github}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-12 py-8 space-y-8">
        {visibleSections.map((section) => {
          // Summary Section
          if (section.type === "summary" && summary) {
            return (
              <div key={section.id}>
                <h2
                  className="text-2xl font-bold mb-4 pb-2 border-b-2"
                  style={{
                    borderColor: style.primaryColor,
                    color: style.primaryColor,
                  }}
                >
                  {section.title}
                </h2>
                <p className="text-gray-700 leading-relaxed">{summary}</p>
              </div>
            )
          }

          // Experience Section
          if (section.type === "experience" && experience.length > 0) {
            return (
              <div key={section.id}>
                <h2
                  className="text-2xl font-bold mb-4 pb-2 border-b-2"
                  style={{
                    borderColor: style.primaryColor,
                    color: style.primaryColor,
                  }}
                >
                  {section.title}
                </h2>
                <div className="space-y-6">
                  {experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {exp.position}
                          </h3>
                          <p className="text-gray-600">
                            {exp.company} • {exp.location}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500">
                          {formatDate(exp.startDate)} -{" "}
                          {exp.current ? "Present" : formatDate(exp.endDate!)}
                        </p>
                      </div>
                      <p className="text-gray-700 mb-2">{exp.description}</p>
                      {exp.highlights.length > 0 && (
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
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

          // Education Section
          if (section.type === "education" && education.length > 0) {
            return (
              <div key={section.id}>
                <h2
                  className="text-2xl font-bold mb-4 pb-2 border-b-2"
                  style={{
                    borderColor: style.primaryColor,
                    color: style.primaryColor,
                  }}
                >
                  {section.title}
                </h2>
                <div className="space-y-6">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {edu.degree} in {edu.field}
                          </h3>
                          <p className="text-gray-600">
                            {edu.institution} • {edu.location}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500">
                          {formatDate(edu.startDate)} -{" "}
                          {edu.current ? "Present" : formatDate(edu.endDate!)}
                        </p>
                      </div>
                      {edu.gpa && (
                        <p className="text-gray-700">GPA: {edu.gpa}</p>
                      )}
                      {edu.description && (
                        <p className="text-gray-700">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          }

          // Skills Section
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
                <h2
                  className="text-2xl font-bold mb-4 pb-2 border-b-2"
                  style={{
                    borderColor: style.primaryColor,
                    color: style.primaryColor,
                  }}
                >
                  {section.title}
                </h2>
                <div className="space-y-3">
                  {Object.entries(skillsByCategory).map(
                    ([category, categorySkills]) => (
                      <div key={category}>
                        <span className="font-semibold text-gray-700">
                          {category}:{" "}
                        </span>
                        <span className="text-gray-600">
                          {categorySkills.map((s) => s.name).join(", ")}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )
          }

          // Projects Section
          if (section.type === "projects" && projects.length > 0) {
            return (
              <div key={section.id}>
                <h2
                  className="text-2xl font-bold mb-4 pb-2 border-b-2"
                  style={{
                    borderColor: style.primaryColor,
                    color: style.primaryColor,
                  }}
                >
                  {section.title}
                </h2>
                <div className="space-y-6">
                  {projects.map((project) => (
                    <div key={project.id}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {project.name}
                          </h3>
                          {project.url && (
                            <a
                              href={project.url}
                              className="text-sm"
                              style={{ color: style.primaryColor }}
                            >
                              {project.url}
                            </a>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {formatDate(project.startDate)} -{" "}
                          {project.current
                            ? "Present"
                            : formatDate(project.endDate!)}
                        </p>
                      </div>
                      <p className="text-gray-700 mb-2">
                        {project.description}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-semibold">Technologies:</span>{" "}
                        {project.technologies.join(", ")}
                      </p>
                      {project.highlights.length > 0 && (
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
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

          // Certifications Section
          if (section.type === "certifications" && certifications.length > 0) {
            return (
              <div key={section.id}>
                <h2
                  className="text-2xl font-bold mb-4 pb-2 border-b-2"
                  style={{
                    borderColor: style.primaryColor,
                    color: style.primaryColor,
                  }}
                >
                  {section.title}
                </h2>
                <div className="space-y-4">
                  {certifications.map((cert) => (
                    <div key={cert.id}>
                      <h3 className="text-lg font-semibold">{cert.name}</h3>
                      <p className="text-gray-600">
                        {cert.issuer} • {formatDate(cert.issueDate)}
                      </p>
                      {cert.credentialId && (
                        <p className="text-sm text-gray-500">
                          Credential ID: {cert.credentialId}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          }

          // Languages Section
          if (section.type === "languages" && languages.length > 0) {
            return (
              <div key={section.id}>
                <h2
                  className="text-2xl font-bold mb-4 pb-2 border-b-2"
                  style={{
                    borderColor: style.primaryColor,
                    color: style.primaryColor,
                  }}
                >
                  {section.title}
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {languages.map((lang) => (
                    <div key={lang.id}>
                      <span className="font-semibold text-gray-700">
                        {lang.name}:
                      </span>{" "}
                      <span className="text-gray-600 capitalize">
                        {lang.proficiency}
                      </span>
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
  )
}
