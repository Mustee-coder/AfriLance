import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({
  to,
  subject,
  html,
}: SendEmailInput): Promise<void> => {
  try {
    const { error } = await resend.emails.send({
      from: "AfriLance <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    if (error) {
  console.error("Email sending error:", error);
  throw new Error(error.message);
}
    

    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error("Email service error:", error);
  }
};


export const sendApplicationAcceptedEmail = async ({
  to,
  developerName,
  jobTitle,
}: {
  to: string;
  developerName: string;
  jobTitle: string;
}): Promise<void> => {
  await sendEmail({
    to,
    subject: `Your AfriLance application was accepted`,
    html: `
      <h2>Congratulations, ${developerName}! 🎉</h2>

      <p>
        Your application for the job
        <strong>${jobTitle}</strong>
        has been accepted by the client.
      </p>

      <p>
        You can now continue with the next steps on AfriLance.
      </p>

      <p>
        — AfriLance Team
      </p>
    `,
  });
};




export const sendWelcomeEmail = async ({
  to,
  firstName,
}: {
  to: string;
  firstName: string;
}): Promise<void> => {
  await sendEmail({
    to,
    subject: "Welcome to AfriLance 🎉",
    html: `
      <h2>Welcome to AfriLance, ${firstName}! 🎉</h2>

      <p>
        Your AfriLance account has been created successfully.
      </p>

      <p>
        You can now explore jobs, build your profile,
        submit applications, and connect with clients.
      </p>

      <p>
        We're happy to have you with us.
      </p>

      <p>
        — AfriLance Team
      </p>
    `,
  });
};







export const sendPasswordResetEmail = async ({
  to,
  firstName,
  resetUrl,
}: {
  to: string;
  firstName: string;
  resetUrl: string;
}): Promise<void> => {
  await sendEmail({
    to,
    subject: "Reset your AfriLance password",
    html: `
      <h2>Password Reset Request</h2>

      <p>Hello ${firstName},</p>

      <p>
        We received a request to reset your AfriLance password.
      </p>

      <p>
        Click the button below to create a new password:
      </p>

      <p>
        <a
          href="${resetUrl}"
          style="
            display: inline-block;
            padding: 12px 20px;
            background: #000;
            color: #fff;
            text-decoration: none;
            border-radius: 6px;
          "
        >
          Reset Password
        </a>
      </p>

      <p>
        This link will expire in <strong>15 minutes</strong>.
      </p>

      <p>
        If you did not request a password reset, you can safely ignore this email.
      </p>

      <p>
        — AfriLance Team
      </p>
    `,
  });
};

