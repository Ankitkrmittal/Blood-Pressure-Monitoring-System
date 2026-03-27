import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

// Email function (with IST time)
const sendEmail = async (to, medicineName, scheduledTime) => {
  try {
    // Convert UTC → IST for display
    const formattedTime = new Date(scheduledTime).toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit"
    });

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: to,
      subject: "Medication Reminder",
      html: `
        <h2>Medication Reminder</h2>
        <p>Hello 👋</p>
        <p>This is a reminder to take your medicine:</p>
        <h3>${medicineName} at ${formattedTime}</h3>
        <p>Please take it on time.</p>
      `
    });

    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error(` Failed to send email to ${to}`, err);
  }
};

// CRON JOB (runs every minute)
cron.schedule(
  "* * * * *",
  async () => {
    console.log("⏰ Running medication job...");

    //  KEEP UTC (correct way)
    const now = new Date();

    try {
      //  Mark missed medicines
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

      // Find pending reminders (last 5 minutes)
      const pending = await prisma.medicationLog.findMany({
        where: {
          taken: false,
          scheduledTime: {
            lte: now,
            gte: new Date(now.getTime() - 5 * 60 * 1000)
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

      //  Send emails
      for (const log of pending) {
        const email = log.medication.user.email;
        const medicineName = log.medication.medicineName;

        console.log(` Sending email to ${email}`);

        await sendEmail(email, medicineName, log.scheduledTime);
      }

      //  Mark reminder as sent
      if (pending.length > 0) {
        await prisma.medicationLog.updateMany({
          where: {
            id: { in: pending.map((p) => p.id) }
          },
          data: {
            reminderSent: true
          }
        });
      }
    } catch (err) {
      console.error(" Cron error:", err);
    }
  },
  {
    timezone: "Asia/Kolkata" //  only affects cron trigger time
  }
);