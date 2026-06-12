const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const startInterview = async (req, res) => {
  try {
   const body = req.body || {};
   console.log(req.body);
   const {
        role,
       experience,
       difficulty,
       interviewType,
        duration,
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
      },
    });

    return res.status(201).json({
      success: true,
      message: "Interview created successfully",
      interview,
    });
  } catch (error) {
   console.error("FULL ERROR:");
console.error(error);

return res.status(500).json({
  success: false,
  message: error.message,
});
  }
};

module.exports = {
  startInterview,
};