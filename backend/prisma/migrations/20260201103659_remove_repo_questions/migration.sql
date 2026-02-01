/*
  Warnings:

  - You are about to drop the `InterviewResponse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RepoQuestion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "InterviewResponse" DROP CONSTRAINT "InterviewResponse_questionId_fkey";

-- DropForeignKey
ALTER TABLE "InterviewResponse" DROP CONSTRAINT "InterviewResponse_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "RepoQuestion" DROP CONSTRAINT "RepoQuestion_reportId_fkey";

-- DropTable
DROP TABLE "InterviewResponse";

-- DropTable
DROP TABLE "RepoQuestion";
