import { Resume } from "@/types/resume"
import { ModernTemplate } from "./modern-template"
import { ClassicTemplate } from "./classic-template"
import { MinimalTemplate } from "./minimal-template"

interface ResumeTemplateRendererProps {
  resume: Resume
}

export function ResumeTemplateRenderer({
  resume,
}: ResumeTemplateRendererProps) {
  switch (resume.template) {
    case "modern":
      return <ModernTemplate resume={resume} />
    case "classic":
      return <ClassicTemplate resume={resume} />
    case "minimal":
      return <MinimalTemplate resume={resume} />
    case "creative":
      // TODO: Implement CreativeTemplate
      return <ModernTemplate resume={resume} />
    case "professional":
      // TODO: Implement ProfessionalTemplate
      return <ModernTemplate resume={resume} />
    default:
      return <ModernTemplate resume={resume} />
  }
}
