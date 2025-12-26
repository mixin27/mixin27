import { Resume } from "@/types/resume"
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  Languages as LanguagesIcon,
} from "lucide-react"

interface CreativeTemplateProps {
  resume: Resume
}

export function CreativeTemplate({ resume }: CreativeTemplateProps) {
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

  const getLevelWidth = (level?: string) => {
    switch (level) {
      case "beginner":
        return "25%"
      case "intermediate":
        return "50%"
      case "advanced":
        return "75%"
      case "expert":
        return "100%"
      default:
        return "50%"
    }
  }

  return (
    <div
      className="bg-white text-gray-900"
      style={{ fontFamily: style.fontFamily }}
    >
      {/* Sidebar */}
      <div className="flex">
        {/* Left Sidebar */}
        <div
          className="w-1/3 p-8 text-white"
          style={{ backgroundColor: style.primaryColor }}
        >
          {/* Profile Photo */}
          {style.showPhoto && personal.photo && (
            <div className="mb-6">
              <img
                src={personal.photo}
                alt={personal.fullName}
                className="w-32 h-32 rounded-full object-cover border-4 border-white/20 mx-auto"
              />
            </div>
          )}

          {/* Contact */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 uppercase tracking-wide border-b-2 border-white/30 pb-2">
              Contact
            </h3>
            <div className="space-y-3 text-sm">
              {personal.email && (
                <div className="flex items-start gap-2">
                  <Mail className="size-4 mt-0.5 shrink-0" />
                  <span className="break-all">{personal.email}</span>
                </div>
              )}
              {personal.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="size-4 shrink-0" />
                  <span>{personal.phone}</span>
                </div>
              )}
              {personal.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 shrink-0" />
                  <span>{personal.location}</span>
                </div>
              )}
              {personal.website && (
                <div className="flex items-start gap-2">
                  <Globe className="size-4 mt-0.5 shrink-0" />
                  <span className="break-all">{personal.website}</span>
                </div>
              )}
              {personal.linkedin && (
                <div className="flex items-start gap-2">
                  <Linkedin className="size-4 mt-0.5 shrink-0" />
                  <span className="break-all">{personal.linkedin}</span>
                </div>
              )}
              {personal.github && (
                <div className="flex items-start gap-2">
                  <Github className="size-4 mt-0.5 shrink-0" />
                  <span className="break-all">{personal.github}</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {skills.length > 0 &&
            visibleSections.find((s) => s.type === "skills") && (
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 uppercase tracking-wide border-b-2 border-white/30 pb-2 flex items-center gap-2">
                  <Code className="size-5" />
                  Skills
                </h3>
                <div className="space-y-4">
                  {skills.map((skill) => (
                    <div key={skill.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{skill.name}</span>
                        <span className="text-xs opacity-80 capitalize">
                          {skill.level}
                        </span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                          className="bg-white rounded-full h-2 transition-all"
                          style={{ width: getLevelWidth(skill.level) }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Languages */}
          {languages.length > 0 &&
            visibleSections.find((s) => s.type === "languages") && (
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 uppercase tracking-wide border-b-2 border-white/30 pb-2 flex items-center gap-2">
                  <LanguagesIcon className="size-5" />
                  Languages
                </h3>
                <div className="space-y-3">
                  {languages.map((lang) => (
                    <div key={lang.id}>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{lang.name}</span>
                        <span className="text-xs opacity-80 capitalize">
                          {lang.proficiency}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Certifications */}
          {certifications.length > 0 &&
            visibleSections.find((s) => s.type === "certifications") && (
              <div>
                <h3 className="text-lg font-bold mb-4 uppercase tracking-wide border-b-2 border-white/30 pb-2 flex items-center gap-2">
                  <Award className="size-5" />
                  Certifications
                </h3>
                <div className="space-y-3">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="text-sm">
                      <p className="font-semibold">{cert.name}</p>
                      <p className="text-xs opacity-90">{cert.issuer}</p>
                      <p className="text-xs opacity-75">
                        {formatDate(cert.issueDate)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* Main Content */}
        <div className="w-2/3 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-4xl font-bold mb-2"
              style={{ color: style.primaryColor }}
            >
              {personal.fullName}
            </h1>
            <p className="text-xl text-gray-700 mb-4">{personal.title}</p>

            {/* Summary */}
            {summary && visibleSections.find((s) => s.type === "summary") && (
              <p className="text-gray-700 leading-relaxed">{summary}</p>
            )}
          </div>

          {/* Experience */}
          {experience.length > 0 &&
            visibleSections.find((s) => s.type === "experience") && (
              <div className="mb-8">
                <h2
                  className="text-2xl font-bold mb-6 uppercase tracking-wide flex items-center gap-2"
                  style={{ color: style.primaryColor }}
                >
                  <Briefcase className="size-6" />
                  Work Experience
                </h2>
                <div className="space-y-6">
                  {experience.map((exp) => (
                    <div
                      key={exp.id}
                      className="relative pl-6 border-l-2"
                      style={{ borderColor: style.primaryColor }}
                    >
                      <div
                        className="absolute left-0 top-0 w-4 h-4 rounded-full -ml-2"
                        style={{ backgroundColor: style.primaryColor }}
                      />
                      <div className="mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {exp.position}
                        </h3>
                        <p className="text-gray-700 font-medium">
                          {exp.company} • {exp.location}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(exp.startDate)} -{" "}
                          {exp.current ? "Present" : formatDate(exp.endDate!)}
                        </p>
                      </div>
                      <p className="text-gray-700 mb-2">{exp.description}</p>
                      {exp.highlights.length > 0 && (
                        <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                          {exp.highlights.map((highlight, idx) => (
                            <li key={idx}>{highlight}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Education */}
          {education.length > 0 &&
            visibleSections.find((s) => s.type === "education") && (
              <div className="mb-8">
                <h2
                  className="text-2xl font-bold mb-6 uppercase tracking-wide flex items-center gap-2"
                  style={{ color: style.primaryColor }}
                >
                  <GraduationCap className="size-6" />
                  Education
                </h2>
                <div className="space-y-6">
                  {education.map((edu) => (
                    <div
                      key={edu.id}
                      className="relative pl-6 border-l-2"
                      style={{ borderColor: style.primaryColor }}
                    >
                      <div
                        className="absolute left-0 top-0 w-4 h-4 rounded-full -ml-2"
                        style={{ backgroundColor: style.primaryColor }}
                      />
                      <div className="mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {edu.degree} in {edu.field}
                        </h3>
                        <p className="text-gray-700 font-medium">
                          {edu.institution} • {edu.location}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(edu.startDate)} -{" "}
                          {edu.current ? "Present" : formatDate(edu.endDate!)}
                        </p>
                      </div>
                      {edu.gpa && (
                        <p className="text-gray-700 text-sm">GPA: {edu.gpa}</p>
                      )}
                      {edu.description && (
                        <p className="text-gray-700 text-sm">
                          {edu.description}
                        </p>
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
                  className="text-2xl font-bold mb-6 uppercase tracking-wide"
                  style={{ color: style.primaryColor }}
                >
                  Projects
                </h2>
                <div className="space-y-6">
                  {projects.map((project) => (
                    <div key={project.id}>
                      <div className="mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
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
                      <div className="flex flex-wrap gap-2 mb-2">
                        {project.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs rounded-full text-white"
                            style={{ backgroundColor: style.primaryColor }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      {project.highlights.length > 0 && (
                        <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                          {project.highlights.map((highlight, idx) => (
                            <li key={idx}>{highlight}</li>
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
