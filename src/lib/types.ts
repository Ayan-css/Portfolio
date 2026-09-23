export type TechKey =
  | 'js'
  | 'ts'
  | 'node'
  | 'pg'
  | 'prisma'
  | 'csharp'
  | 'docker'
  | 'razorpay'
  | 'react'
  | 'python'
  | 'neutral'

export type SkillCategoryId =
  | 'languages'
  | 'frontend'
  | 'backend'
  | 'databases'
  | 'cloud'
  | 'tools'

export interface SkillItem {
  name: string
  tech: TechKey
}

export interface SkillCategory {
  id: SkillCategoryId
  label: string
  icon: string
  items: SkillItem[]
}

export interface TechTag {
  name: string
  tech: TechKey
}

export interface ProjectLink {
  label: string
  href: string
  kind: 'live' | 'repo'
}

/** An architecture decision worth clicking on in the diagram. */
export interface Decision {
  id: string
  title: string
  short: string
  detail: string
}

export interface ProofPoint {
  label: string
  detail: string
}

export type WalkthroughScreen = 'qr' | 'upload' | 'quote' | 'pay' | 'queued' | 'agent'

export interface WalkthroughStep {
  id: string
  label: string
  command: string
  caption: string
  screen: WalkthroughScreen
}

export interface Flagship {
  id: string
  name: string
  file: string
  tagline: string
  status: string
  statusNote: string
  summary: string
  problem: string
  approach: string
  links: ProjectLink[]
  stack: TechTag[]
  skills: SkillCategoryId[]
  decisions: Decision[]
  proof: ProofPoint[]
  walkthrough: WalkthroughStep[]
}

export interface Poreject {
  id: string
  name: string
  file: string
  learned: string
  note: string
  stack: string[]
  skills: SkillCategoryId[]
  /**
   * Only 'mid-progress' is ever asserted in the UI. An empty value makes no
   * claim — it never implies the project was finished.
   */
  progress: '' | 'mid-progress'
  /** Empty until a real repo URL exists — the UI hides the link rather than shipping a 404. */
  repo: string
  /** Optional path under public/. Falls back to a generated placeholder. */
  screenshot: string
}

export type TimelineKind = 'education' | 'leadership' | 'teaching' | 'certification'

export interface TimelineEntry {
  id: string
  kind: TimelineKind
  title: string
  org: string
  period: string
  status: string
  detail: string
  current: boolean
}

export interface Profile {
  name: string
  short: string
  handle: string
  role: string
  location: string
  email: string
  github: string
  githubHandle: string
  linkedin: string
  linkedinHandle: string
  resume: string
  bio: string[]
  now: string
}
