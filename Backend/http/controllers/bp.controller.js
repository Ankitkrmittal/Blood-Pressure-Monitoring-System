import { createBPReading } from "../service/bp.service.js";

export async function addBPReading(req, res,next) {
  try {
    const { userId, systolic, diastolic } = req.body;

    if (!userId || !systolic || !diastolic) {
      return res.status(400).json({
        message: "userId, systolic and diastolic required"
      });
    }

    const reading = await createBPReading(userId, systolic, diastolic);

    res.status(201).json({
      message: "Blood pressure stored",
      data: reading
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error"
    });
  }
}