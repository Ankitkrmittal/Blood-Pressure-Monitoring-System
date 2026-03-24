
import cron from "node-cron";
import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient();

cron.schedule("* * * * *", async () => {
  console.log("Running medication job...");

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

    
    const pending = await prisma.medicationLog.findMany({
      where: {
        taken: false,
        scheduledTime: {
          lte: now,
          gte: new Date(now - 5 * 60 * 1000)
        },
        reminderSent: false
      },
      include: {
    medication: {
      include: {
        user: true
      }
    }
  }
    });

    for (const log of pending) {
      const email = log.medication.user.email;
      console.log(`📧 Send email to ${email} for medicine ${log.medication.medicineName}`);
      // i will integrate nodemailer here later on

    }

    await prisma.medicationLog.updateMany({
      where: {
        id: { in: pending.map(p => p.id) }
      },
      data: {
        reminderSent: true
      }
    });

  } catch (err) {
    console.error(err);
  }
});