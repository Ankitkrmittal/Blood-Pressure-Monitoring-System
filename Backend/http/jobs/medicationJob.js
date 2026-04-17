import cron from "node-cron";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// CRON JOB (runs every minute)
cron.schedule(
  "* * * * *",
  async () => {
    console.log("Running medication log maintenance job...");

    const now = new Date();

    try {
      await prisma.medicationLog.updateMany({
        where: {
          taken: false,
          scheduledTime: { lt: now },
          isMissed: false
        },
        data: {
          isMissed: true
        }
      });

      // Mark due reminders as processed so they are not re-checked every minute.
      await prisma.medicationLog.updateMany({
        where: {
          taken: false,
          scheduledTime: {
            lte: now,
            gte: new Date(now.getTime() - 5 * 60 * 1000)
          },
          reminderSent: false
        },
        data: {
          reminderSent: true
        }
      });
    } catch (err) {
      console.error("Medication job error:", err);
    }
  },
  {
    timezone: "Asia/Kolkata"
  }
);
