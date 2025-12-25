import { Resume, ResumeStats } from "@/types/resume"

// Storage key
const STORAGE_KEY = "resumes"

// Helper functions for localStorage (can be easily swapped with cloud storage later)
const getFromStorage = (): Resume[] => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

const saveToStorage = (resumes: Resume[]): void => {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes))
}

// CRUD Operations
export const saveResume = (resume: Resume): void => {
  const resumes = getFromStorage()
  const existingIndex = resumes.findIndex((r) => r.id === resume.id)

  if (existingIndex >= 0) {
    resumes[existingIndex] = {
      ...resume,
      updatedAt: new Date().toISOString(),
    }
  } else {
    resumes.push(resume)
  }

  saveToStorage(resumes)
}

export const getResumes = (): Resume[] => {
  return getFromStorage()
}

export const getResumeById = (id: string): Resume | null => {
  const resumes = getResumes()
  return resumes.find((r) => r.id === id) || null
}

export const deleteResume = (id: string): void => {
  const resumes = getResumes().filter((r) => r.id !== id)
  saveToStorage(resumes)
}

export const duplicateResume = (id: string): Resume | null => {
  const original = getResumeById(id)
  if (!original) return null

  const duplicate: Resume = {
    ...original,
    id: `resume_${Date.now()}`,
    name: `${original.name} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  saveResume(duplicate)
  return duplicate
}

// Statistics
export const getResumeStats = (): ResumeStats => {
  const resumes = getResumes()

  const templates = {
    modern: resumes.filter((r) => r.template === "modern").length,
    classic: resumes.filter((r) => r.template === "classic").length,
    creative: resumes.filter((r) => r.template === "creative").length,
    minimal: resumes.filter((r) => r.template === "minimal").length,
    professional: resumes.filter((r) => r.template === "professional").length,
  }

  const recentlyUpdated = resumes
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 5)

  return {
    total: resumes.length,
    templates,
    recentlyUpdated,
  }
}

// Export resume as JSON
export const exportResumeJSON = (id: string): string => {
  const resume = getResumeById(id)
  if (!resume) throw new Error("Resume not found")
  return JSON.stringify(resume, null, 2)
}

// Import resume from JSON
export const importResumeJSON = (jsonString: string): Resume => {
  const resume = JSON.parse(jsonString) as Resume
  resume.id = `resume_${Date.now()}`
  resume.createdAt = new Date().toISOString()
  resume.updatedAt = new Date().toISOString()
  saveResume(resume)
  return resume
}

// Export all resumes (backup)
export const exportAllResumes = () => {
  return {
    resumes: getResumes(),
    exportedAt: new Date().toISOString(),
  }
}

// Import all resumes (restore from backup)
export const importAllResumes = (data: { resumes: Resume[] }): void => {
  if (data.resumes) {
    saveToStorage(data.resumes)
  }
}

// Default resume template
export const createDefaultResume = (): Resume => {
  return {
    id: `resume_${Date.now()}`,
    name: "My Resume",
    template: "modern",
    personal: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      location: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    customSections: [],
    sections: [
      {
        id: "personal",
        type: "personal",
        title: "Personal Information",
        visible: true,
        order: 0,
      },
      {
        id: "summary",
        type: "summary",
        title: "Professional Summary",
        visible: true,
        order: 1,
      },
      {
        id: "experience",
        type: "experience",
        title: "Work Experience",
        visible: true,
        order: 2,
      },
      {
        id: "education",
        type: "education",
        title: "Education",
        visible: true,
        order: 3,
      },
      {
        id: "skills",
        type: "skills",
        title: "Skills",
        visible: true,
        order: 4,
      },
      {
        id: "projects",
        type: "projects",
        title: "Projects",
        visible: false,
        order: 5,
      },
      {
        id: "certifications",
        type: "certifications",
        title: "Certifications",
        visible: false,
        order: 6,
      },
      {
        id: "languages",
        type: "languages",
        title: "Languages",
        visible: false,
        order: 7,
      },
    ],
    style: {
      template: "modern",
      primaryColor: "#2563eb",
      fontFamily: "Inter",
      fontSize: "medium",
      spacing: "normal",
      showPhoto: true,
      showIcons: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}
