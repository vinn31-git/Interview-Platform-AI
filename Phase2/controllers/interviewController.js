const prisma = require("../utils/db");

const startInterview = async (req, res) => {
  try {
    const body = req.body || {};
    const {
      role,
      experience,
      difficulty,
      interviewType,
      duration,
      questions,
    } = body;

    if (
      !role ||
      !experience ||
      !difficulty ||
      !interviewType ||
      !duration
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const interview = await prisma.interview.create({
      data: {
        role,
        experience,
        difficulty,
        interviewType,
        duration,
        questions: questions || null,
        userId: req.user?.userId || null,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Interview created successfully",
      interview,
    });
  } catch (error) {
    console.error("START INTERVIEW ERROR:", error);

  return res.status(500).json({
  success: false,
  message: "An error occurred. Please try again later.",
   });
  }
};

const saveInterviewResults = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers, evaluation, score } = req.body;

    const existing = await prisma.interview.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    if (
      existing.userId &&
      req.user?.userId &&
      existing.userId !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this interview",
      });
    }

    const interview = await prisma.interview.update({
      where: { id },
      data: {
        answers: answers || existing.answers,
        evaluation: evaluation || existing.evaluation,
        score:
          score ??
          (evaluation?.overallScore
            ? Math.round(evaluation.overallScore * 10)
            : existing.score),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Interview results saved",
      interview,
    });
  } catch (error) {
    console.error("SAVE INTERVIEW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getInterviewHistory = async (req, res) => {
  try {
    const interviews = await prisma.interview.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        role: true,
        experience: true,
        difficulty: true,
        interviewType: true,
        duration: true,
        score: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      interviews,
    });
  } catch (error) {
    console.error("GET HISTORY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getInterviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await prisma.interview.findUnique({
      where: { id },
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    if (
      interview.userId &&
      req.user?.userId &&
      interview.userId !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this interview",
      });
    }

    return res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    console.error("GET INTERVIEW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const interviews = await prisma.interview.findMany({
      where: {
        userId: req.user.userId,
        score: { not: null },
      },
      select: {
        score: true,
        role: true,
        createdAt: true,
      },
    });

    const totalInterviews = interviews.length;
    const averageScore =
      totalInterviews > 0
        ? Math.round(
            interviews.reduce(
              (sum, item) => sum + (item.score || 0),
              0
            ) / totalInterviews
          )
        : 0;

    const bestScore =
      totalInterviews > 0
        ? Math.max(...interviews.map((item) => item.score || 0))
        : 0;

    const roleCounts = interviews.reduce((acc, item) => {
      acc[item.role] = (acc[item.role] || 0) + 1;
      return acc;
    }, {});

    const mostPracticedRole = Object.entries(roleCounts).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] || null;

    return res.status(200).json({
      success: true,
      stats: {
        totalInterviews,
        averageScore,
        bestScore,
        mostPracticedRole,
      },
    });
  } catch (error) {
    console.error("GET STATS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  startInterview,
  saveInterviewResults,
  getInterviewHistory,
  getInterviewById,
  getDashboardStats,
};
