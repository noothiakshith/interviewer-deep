import bcrypt from "bcrypt";
import { prisma } from "../db";

async function main() {
    console.log("Seeding database...");
    await prisma.interviewResponse.deleteMany();
    await prisma.interviewSession.deleteMany();
    await prisma.repoQuestion.deleteMany();
    await prisma.aiAnalysisReport.deleteMany();
    await prisma.submission.deleteMany();
    await prisma.user.deleteMany();
    const passwordHash = await bcrypt.hash("password123", 10);
    const user = await prisma.user.create({
        data: {
            fullName: "Test Candidate",
            email: "test@example.com",
            passwordHash: passwordHash,
            Role: "USER",
        },
    });
    const teacher = await prisma.user.create({
        data: {
            fullName: "Admin Teacher",
            email: "teacher@example.com",
            passwordHash: passwordHash,
            Role: "TEACHER",
        },
    });
    const submission = await prisma.submission.create({
        data: {
            userId: user.id,
            resumeUrl: "https://example.com/resume.pdf",
            githubProjectUrl: "https://github.com/test/project",
            status: "INTERVIEW_IN_PROGRESS",
        },
    });
    const report = await prisma.aiAnalysisReport.create({
        data: {
            submissionId: submission.id,
            resumeScore: 85,
            githubScore: 4.5,
            totalScore: 80,
            finalVerdict: "Strong candidate with good technical skills in React and Node.js.",
            rawReport: "Detailed analysis of resume and GitHub repository highlights competence in modern web technologies.",
            structuredData: {
                skills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
                experienceYears: 3,
            },
        },
    });
    const question1 = await prisma.repoQuestion.create({
        data: {
            reportId: report.id,
            questionText: "How do you handle asynchronous operations in your React components to prevent memory leaks?",
            codeContext: "useEffect(() => { ... fetch data ... }, [])",
            complexityLevel: "MEDIUM",
        },
    });

    const question2 = await prisma.repoQuestion.create({
        data: {
            reportId: report.id,
            questionText: "How would you optimize the performance of the data fetching logic in your project?",
            codeContext: "const data = await db.query(...)",
            complexityLevel: "HIGH",
        },
    });

    const interviewSession = await prisma.interviewSession.create({
        data: {
            submissionId: submission.id,
            status: "IN_PROGRESS",
            startedAt: new Date(),
        },
    });

    console.log("-----------------------------------------");
    console.log("Seed data created successfully!");
    console.log("-----------------------------------------");
    console.log("CANDIDATE CREDENTIALS:");
    console.log(`Email: ${user.email}`);
    console.log(`Password: password123`);
    console.log(`User ID: ${user.id}`);
    console.log("-----------------------------------------");
    console.log("TEACHER CREDENTIALS:");
    console.log(`Email: ${teacher.email}`);
    console.log(`Password: password123`);
    console.log("-----------------------------------------");
    console.log(`Submission ID: ${submission.id}`);
    console.log(`Interview ID: ${interviewSession.id}`);
    console.log("-----------------------------------------");
}

main()
    .catch((e) => {
        console.error("Error during seeding:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
