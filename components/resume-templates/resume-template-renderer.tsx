import { Resume } from "@/types/resume"
import { ModernTemplate } from "./modern-template"
import { ClassicTemplate } from "./classic-template"
import { MinimalTemplate } from "./minimal-template"
import { CreativeTemplate } from "./creative-template"
import { ProfessionalTemplate } from "./professional-template"

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
      return <CreativeTemplate resume={resume} />
    case "professional":
      return <ProfessionalTemplate resume={resume} />
    default:
      return <ModernTemplate resume={resume} />
  }
}
