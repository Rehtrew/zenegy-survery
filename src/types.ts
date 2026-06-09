import type { CSSProperties } from 'react'

export type Track = 'zenegy' | 'non-zenegy'

export type QuestionType =
  | 'choice-single'
  | 'choice-multi'
  | 'choice-tiles'
  | 'logo-grid'
  | 'tile-select'
  | 'emoji-rating'
  | 'priority-rank'
  | 'nps-scale'

/** Semantic colour for an option (used by the AI question). Default = brand purple. */
export type Tone = 'positive' | 'caution' | 'negative'

export interface Option {
  value: string
  label: string
  subLabel?: string
  emoji?: string
  logoInitials?: string
  logoStyle?: CSSProperties
  logoSrc?: string
  /** Named glyph from components/icons/glyphs.tsx (e.g. 'speed', 'price', 'zenegy'). */
  iconName?: string
  /** Semantic colour; only the AI question uses this. */
  tone?: Tone
}

export interface Question {
  id: string
  type: QuestionType
  question: string
  subText?: string
  options?: Option[]
  autoAdvance?: boolean
  hasOpenText?: boolean
  openTextLabel?: string
  openTextPlaceholder?: string
  openTextMaxLength?: number
  maxRank?: number
}

export interface RankEntry {
  rank: number
  value: string
}

export interface SurveyAnswers {
  track?: Track
  // Track B
  b_payroll_system?: string
  b_payroll_other?: string
  b_frustrations?: string[]
  b_frustration_other?: string
  b_priorities?: RankEntry[]
  b_barriers?: string[]
  b_barrier_other?: string
  // Track A
  a_products?: string[]
  a_satisfaction?: string
  a_satisfaction_text?: string
  a_best_thing?: string
  a_best_thing_text?: string
  a_nps?: number | null
  a_improve_text?: string
  // Shared
  accounting_system?: string
  accounting_other?: string
  // Employee track
  is_employee?: boolean
  e_payslip?: string
  e_payroll_satisfaction?: string
  e_expenses?: string
  e_ai_trust?: string
  // AI question (decision-maker track)
  ai_interest?: string
}

/** Track stored on a submission — employees use 'employee' (no payroll-system track). */
export type SubmittedTrack = Track | 'employee'

export interface Submission extends Omit<SurveyAnswers, 'track'> {
  track: SubmittedTrack
  email: string
  newsletter_opt_in: boolean
}

export type Phase = 'landing' | 'questions' | 'lead-gen' | 'thank-you'
export type Direction = 'forward' | 'backward'
