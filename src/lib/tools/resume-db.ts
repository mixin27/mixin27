import { Resume } from "@/types/resume"

// API base URL
const API_BASE = "/api"

// Helper function for API calls
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || "API call failed")
  }

  return response.json()
}

// Resume Operations
export const saveResume = async (resume: Resume): Promise<void> => {
  await apiCall("/resumes", {
    method: "POST",
    body: JSON.stringify(resume),
  })
}

export const getResumes = async (): Promise<Resume[]> => {
  return apiCall<Resume[]>("/resumes")
}

export const getResumeById = async (id: string): Promise<Resume | null> => {
  try {
    return await apiCall<Resume>(`/resumes?id=${id}`)
  } catch {
    return null
  }
}

export const deleteResume = async (id: string): Promise<void> => {
  await apiCall(`/resumes?id=${id}`, { method: "DELETE" })
}

export const duplicateResume = async (id: string): Promise<Resume | null> => {
  try {
    return await apiCall<Resume>(`/resumes/duplicate?id=${id}`, {
      method: "POST",
    })
  } catch {
    return null
  }
}

// Statistics
export const getResumeStats = async () => {
  const resumes = await getResumes()

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
export const exportResumeJSON = (resume: Resume): string => {
  return JSON.stringify(resume, null, 2)
}

// Import resume from JSON
export const importResumeJSON = async (jsonString: string): Promise<Resume> => {
  const resume = JSON.parse(jsonString) as Resume
  resume.id = `resume_${Date.now()}`
  resume.createdAt = new Date().toISOString()
  resume.updatedAt = new Date().toISOString()
  await saveResume(resume)
  return resume
}

// Export all resumes (backup)
export const exportAllResumes = async () => {
  return {
    resumes: await getResumes(),
    exportedAt: new Date().toISOString(),
  }
}

// Import all resumes (restore from backup)
export const importAllResumes = async (data: { resumes: Resume[] }) => {
  if (data.resumes) {
    for (const resume of data.resumes) {
      await saveResume(resume)
    }
  }
}
