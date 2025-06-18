// it sends the verification code to the user

import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "./emailTemplate.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

import dotenv from "dotenv";

dotenv.config();

// const Token = process.env.MAILTRAP_TOKEN;

// const client = new MailtrapClient({ token: Token });
// console.log(Token);

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const recipient = [{ email }];

    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      // html: "<h1>Hello</h1>",
      category: "Email verification",
    });
    console.log(response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Welcome email

export const welcomeEmail = async (email, name) => {
  const recipients = [{ email }];
  console.log("welcome email send");
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      template_uuid: "14f5408c-b71a-44bd-9705-12bcc332830b",
      template_variables: {
        company_info_name: "codeAi",
        name: name,
      },
    });
    console.log(response);
  } catch (error) {
    console.log("Error sending welcome email");
    throw new Error(`Error sending welcome email${error}`);
  }
};

export const sendResetPasswordLink = async (email, resetUrl) => {
  const recipient = [{ email }];
  console.log("recepient address" + email);
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl),
    });
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

export const sendResetSuccessEmail = async (email) => {
  const recepient = [{ email }];
  console.log("reset password for: " + email);
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recepient,
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      subject: "Reset password",
    });
    console.log("password reset successfully");
    console.log(response);
  } catch (error) {
    console.log("Error sending reset password email" + error);
  }
};
