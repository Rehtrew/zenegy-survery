import type { CSSProperties } from 'react'

export type Track = 'zenegy' | 'non-zenegy'

/**
 * Whether the respondent runs payroll for their own company, for client
 * companies (accountant / bookkeeper / payroll bureau), or both. Asked right
 * after the gate; 'bureau' and 'both' route into the bureau track (C).
 */
export type PayrollContext = 'internal' | 'bureau' | 'both'

export type QuestionType =
  | 'choice-single'
  | 'choice-multi'
  | 'choice-tiles'
  | 'logo-grid'
  | 'logo-grid-multi'
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
  shortLabel?: string
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
  size?: string
  // Track B
  b_payroll_system?: string
  b_payroll_other?: string
  b_frustrations?: string[]
  b_frustration_other?: string
  b_priorities?: RankEntry[]
  b_barriers?: string[]
  b_barrier_other?: string
  b_switch_intent?: string
  // Track A
  a_products?: string[]
  a_migration_from?: string
  a_satisfaction?: string
  a_satisfaction_text?: string
  a_best_thing?: string
  a_best_thing_text?: string
  a_nps?: number | null
  a_improve_text?: string
  // Track C — bureaus (accountants, bookkeepers, payroll bureaus)
  payroll_context?: PayrollContext
  c_client_count?: string
  c_payroll_systems?: string[]
  c_payroll_system_other?: string
  c_setup?: string
  c_data_collection?: string[]
  c_data_collection_other?: string
  c_frustrations?: string[]
  c_frustration_other?: string
  c_priorities?: RankEntry[]
  c_switch_intent?: string
  // Shared
  accounting_system?: string
  accounting_other?: string
  // Employee track
  is_employee?: boolean
  e_payslip?: string
  e_pain_points?: string[]
  e_expenses?: string
  e_ai_trust?: string
  // AI question (decision-maker track)
  ai_interest?: string
}

/**
 * Track stored on a submission — employees use 'employee' (no payroll-system
 * track) and bureaus use 'bureau' (they answer for a portfolio of clients, so a
 * single zenegy/non-zenegy split doesn't describe them; `c_payroll_systems`
 * holds which systems they actually work in).
 */
export type SubmittedTrack = Track | 'employee' | 'bureau'

export interface Submission extends Omit<SurveyAnswers, 'track'> {
  track: SubmittedTrack
  email: string
  newsletter_opt_in: boolean
}

export type Phase = 'landing' | 'questions' | 'thank-you'
export type Direction = 'forward' | 'backward'

/** Soft anti-spam signals gathered during a run, evaluated before saving. */
export interface SubmissionMeta {
  /** Epoch ms when the respondent started (clicked "Start"); null if unknown. */
  startedAt: number | null
  /** Hidden honeypot field — non-empty implies a form-filling bot. */
  honeypot: string
}
