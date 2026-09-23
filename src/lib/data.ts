import profileJson from '@/data/profile.json'
import skillsJson from '@/data/skills.json'
import projectsJson from '@/data/projects.json'
import timelineJson from '@/data/timeline.json'
import type { Flagship, Poreject, Profile, SkillCategory, TimelineEntry } from './types'

/**
 * Single typed entry point for the JSON. The files are hand-authored, so the
 * casts are the boundary where loose JSON becomes the typed shapes above —
 * change a file and TypeScript stops helping only here, not everywhere.
 */
export const profile = profileJson as Profile
export const skillCategories = skillsJson.categories as SkillCategory[]
export const flagship = projectsJson.flagship as Flagship
export const porejects = projectsJson.porejects.items as Poreject[]
export const porejectsNote = projectsJson.porejects.note
export const timeline = timelineJson.entries as TimelineEntry[]
