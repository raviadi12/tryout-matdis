import { createClient } from "@supabase/supabase-js";
import { DEFAULT_QUESTIONS, QuestionItem } from "./default-questions";

export type { QuestionItem, QuestionOption } from "./default-questions";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://milsxzovqaurhftzdpzc.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pbHN4em92cWF1cmhmdHpkcHpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzMjg0MjMsImV4cCI6MjEwODkwNDQyM30.1Yo9R1lljfarXSNRdQUbuSJ5C1dkxHHXGub4e2A5ft4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface StudentAnswer {
  questionId: string | number;
  question: string;
  topic: string;
  options: { key: string; text: string }[];
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

export interface AttemptRecord {
  id?: string;
  student_name: string;
  score: number;
  total_questions: number;
  correct_count: number;
  incorrect_count: number;
  answers: StudentAnswer[];
  time_spent_seconds: number;
  created_at?: string;
}

export interface ActiveSession {
  id?: string;
  session_token: string;
  student_name: string;
  status: "IN_PROGRESS" | "COMPLETED" | "ABORTED";
  question_ids: (string | number)[];
  started_at?: string;
  expires_at?: string;
  completed_at?: string;
}

// Fetch all questions from database or fallback
export async function fetchQuestions(): Promise<QuestionItem[]> {
  try {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_QUESTIONS;
    }
    return data as QuestionItem[];
  } catch (err) {
    return DEFAULT_QUESTIONS;
  }
}

// Get randomized 20 questions
export async function getRandomQuizQuestions(count: number = 20): Promise<QuestionItem[]> {
  const all = await fetchQuestions();
  const shuffled = [...all];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// ================= SERVER-SIDE ACTIVE SESSION VERIFICATION =================

// Register an active test session on the server
export async function createServerSession(studentName: string, questionIds: (string | number)[]): Promise<string> {
  const sessionToken = "ses_" + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  try {
    await supabase.from("active_sessions").insert([
      {
        session_token: sessionToken,
        student_name: studentName,
        status: "IN_PROGRESS",
        question_ids: questionIds,
      },
    ]);
  } catch (e) {
    console.error("Failed to create server session:", e);
  }
  return sessionToken;
}

// Verify server-side session status
export async function verifyServerSession(sessionToken: string): Promise<{ valid: boolean; session?: ActiveSession }> {
  try {
    const { data, error } = await supabase
      .from("active_sessions")
      .select("*")
      .eq("session_token", sessionToken)
      .single();

    if (error || !data) return { valid: false };

    // Check expiration
    const expiresAt = new Date(data.expires_at).getTime();
    if (Date.now() > expiresAt && data.status === "IN_PROGRESS") {
      await supabase
        .from("active_sessions")
        .update({ status: "ABORTED" })
        .eq("session_token", sessionToken);
      return { valid: false, session: { ...data, status: "ABORTED" } };
    }

    return { valid: data.status === "IN_PROGRESS", session: data };
  } catch (e) {
    return { valid: false };
  }
}

// Complete an active test session on server
export async function completeServerSession(sessionToken: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("active_sessions")
      .update({
        status: "COMPLETED",
        completed_at: new Date().toISOString(),
      })
      .eq("session_token", sessionToken);

    return !error;
  } catch (e) {
    return false;
  }
}

// Fetch active sessions for Kremlin admin
export async function fetchServerActiveSessions(): Promise<ActiveSession[]> {
  try {
    const { data } = await supabase
      .from("active_sessions")
      .select("*")
      .order("started_at", { ascending: false });

    return (data || []) as ActiveSession[];
  } catch (e) {
    return [];
  }
}

// Delete all student data on server and locally
export async function purgeStudentSessionOnServer(studentName: string): Promise<boolean> {
  try {
    // Delete active sessions
    await supabase.from("active_sessions").delete().eq("student_name", studentName);
    // Delete attempt records
    await supabase.from("attempts").delete().eq("student_name", studentName);
    return true;
  } catch (e) {
    console.error("Purge error:", e);
    return false;
  }
}

// Record completed attempt
export async function recordAttempt(attempt: AttemptRecord): Promise<AttemptRecord | null> {
  try {
    const { data, error } = await supabase
      .from("attempts")
      .insert([attempt])
      .select()
      .single();

    if (error) {
      console.error("Error inserting attempt:", error);
      return null;
    }
    return data as AttemptRecord;
  } catch (err) {
    console.error("Insert exception:", err);
    return null;
  }
}

// Fetch all attempts
export async function fetchAllAttempts(): Promise<AttemptRecord[]> {
  try {
    const { data, error } = await supabase
      .from("attempts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return [];
    return (data || []) as AttemptRecord[];
  } catch (err) {
    return [];
  }
}

// Verify password
export async function verifyQuizPassword(password: string): Promise<boolean> {
  const cleanPass = password.trim();
  const defaultPass = process.env.DEFAULT_EXAM_PASSWORD || "MATDIS2026";
  if (cleanPass.toUpperCase() === defaultPass.toUpperCase()) return true;

  try {
    const { data } = await supabase
      .from("quiz_settings")
      .select("value")
      .eq("key", "quiz_password")
      .single();

    if (data?.value && data.value.trim().toUpperCase() === cleanPass.toUpperCase()) {
      return true;
    }
  } catch (e) {
    // fallback
  }
  return cleanPass.toUpperCase() === "MATDIS2026";
}

// Verify admin password
export async function verifyAdminPassword(password: string): Promise<boolean> {
  const cleanPass = password.trim();
  const defaultSecret = process.env.ADMIN_SECRET_KEY || "kremlin2026";
  if (cleanPass === defaultSecret) return true;

  try {
    const { data } = await supabase
      .from("quiz_settings")
      .select("value")
      .eq("key", "admin_password")
      .single();

    if (data?.value && data.value.trim() === cleanPass) {
      return true;
    }
  } catch (e) {
    // fallback
  }
  return cleanPass === "kremlin2026";
}
