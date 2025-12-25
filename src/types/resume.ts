// Resume Types
export type ResumeTemplate =
  | "modern"
  | "classic"
  | "creative"
  | "minimal"
  | "professional"

export type SectionType =
  | "personal"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "languages"
  | "custom"

export interface PersonalInfo {
  fullName: string
  title: string
  email: string
  phone: string
  location: string
  website?: string
  linkedin?: string
  github?: string
  photo?: string
}

export interface Experience {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate?: string
  current: boolean
  description: string
  highlights: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  location: string
  startDate: string
  endDate?: string
  current: boolean
  gpa?: string
  description?: string
}

export interface Skill {
  id: string
  name: string
  category: string
  level?: "beginner" | "intermediate" | "advanced" | "expert"
}

export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  startDate: string
  endDate?: string
  current: boolean
  url?: string
  highlights: string[]
}

export interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: string
  expiryDate?: string
  credentialId?: string
  url?: string
}

export interface Language {
  id: string
  name: string
  proficiency: "basic" | "conversational" | "professional" | "native"
}

export interface CustomSection {
  id: string
  title: string
  content: string
  items?: Array<{
    id: string
    title: string
    subtitle?: string
    description?: string
    date?: string
  }>
}

export interface ResumeSection {
  id: string
  type: SectionType
  title: string
  visible: boolean
  order: number
}

export interface ResumeStyle {
  template: ResumeTemplate
  primaryColor: string
  fontFamily: string
  fontSize: "small" | "medium" | "large"
  spacing: "compact" | "normal" | "relaxed"
  showPhoto: boolean
  showIcons: boolean
}

export interface Resume {
  id: string
  name: string
  template: ResumeTemplate
  personal: PersonalInfo
  summary?: string
  experience: Experience[]
  education: Education[]
  skills: Skill[]
  projects: Project[]
  certifications: Certification[]
  languages: Language[]
  customSections: CustomSection[]
  sections: ResumeSection[]
  style: ResumeStyle
  createdAt: string
  updatedAt: string
}

export interface ResumeStats {
  total: number
  templates: Record<ResumeTemplate, number>
  recentlyUpdated: Resume[]
}
