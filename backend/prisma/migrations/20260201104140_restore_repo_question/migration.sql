-- CreateTable
CREATE TABLE "RepoQuestion" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "codeContext" TEXT,
    "complexityLevel" "ComplexityLevel" NOT NULL DEFAULT 'MEDIUM',

    CONSTRAINT "RepoQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewResponse" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "candidateAnswer" TEXT,
    "aiReviewFeedback" TEXT,
    "aiRatingScore" INTEGER,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterviewResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InterviewResponse_sessionId_questionId_key" ON "InterviewResponse"("sessionId", "questionId");

-- AddForeignKey
ALTER TABLE "RepoQuestion" ADD CONSTRAINT "RepoQuestion_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "AiAnalysisReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewResponse" ADD CONSTRAINT "InterviewResponse_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "InterviewSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewResponse" ADD CONSTRAINT "InterviewResponse_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "RepoQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
