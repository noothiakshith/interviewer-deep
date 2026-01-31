// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}

enum SubmissionStatus {
  PENDING_ANALYSIS
  ANALYSIS_COMPLETE
  INTERVIEW_IN_PROGRESS
  READY_FOR_HUMAN
  REJECTED
}

enum InterviewStatus {
  NOT_STARTED
  IN_PROGRESS
  COMPLETED
}

enum ComplexityLevel {
  LOW
  MEDIUM
  HIGH
}




model User {
  id               String       @id @default(uuid())
  fullName         String
  email            String       @unique
  passwordHash     String
  githubProfileUrl String?
  createdAt        DateTime     @default(now())
  
  submissions      Submission[]
}

model Submission {
  id               String           @id @default(uuid())
  userId           String
  resumeUrl        String
  githubProjectUrl String
  status           SubmissionStatus @default(PENDING_ANALYSIS)
  createdAt        DateTime         @default(now())
  updatedAt        DateTime         @updatedAt

  user             User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  aiAnalysisReport AiAnalysisReport? 
  interviewSession InterviewSession? 

  @@index([userId])
}

model AiAnalysisReport {
  id             String   @id @default(uuid())
  submissionId   String   @unique
  resumeScore    Int?     // e.g. 78
  githubScore    Float?   // e.g. 4.2
  totalScore     Int?     // e.g. 56
  finalVerdict   String?  @db.Text
  rawReport      String?  @db.Text 
  structuredData Json?    
  createdAt      DateTime @default(now())

  submission    Submission     @relation(fields: [submissionId], references: [id], onDelete: Cascade)
  repoQuestions RepoQuestion[] 
}

model RepoQuestion {
  id              String          @id @default(uuid())
  reportId        String
  questionText    String          @db.Text
  codeContext     String?         @db.Text 
  complexityLevel ComplexityLevel @default(MEDIUM)

  aiAnalysisReport   AiAnalysisReport    @relation(fields: [reportId], references: [id], onDelete: Cascade)
  interviewResponses InterviewResponse[] 
}

model InterviewSession {
  id           String          @id @default(uuid())
  submissionId String          @unique
  status       InterviewStatus @default(NOT_STARTED)
  startedAt    DateTime?
  completedAt  DateTime?

  submission         Submission          @relation(fields: [submissionId], references: [id], onDelete: Cascade)
  interviewResponses InterviewResponse[]
}

model InterviewResponse {
  id              String   @id @default(uuid())
  sessionId       String
  questionId      String
  candidateAnswer String?  @db.Text
  aiReviewFeedback String? @db.Text
  aiRatingScore   Int?     
  answeredAt      DateTime @default(now())

  interviewSession InterviewSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  repoQuestion     RepoQuestion     @relation(fields: [questionId], references: [id])

  @@unique([sessionId, questionId])
}