
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

admin.initializeApp();

// Configure your email transporter
// You'll need to set these in Firebase Functions config
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: functions.config().email.user, // Set this via: firebase functions:config:set email.user="your-email@gmail.com"
    pass: functions.config().email.password // Set this via: firebase functions:config:set email.password="your-app-password"
  }
});

export const sendContactEmail = functions.firestore
  .document('contacts/{contactId}')
  .onCreate(async (snap, context) => {
    const contactData = snap.data();
    
    // Format the email body
    const emailBody = `
      <h2>New Enquiry From Website</h2>
      
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h3>Contact Details:</h3>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f5f5f5;">Full Name:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${contactData.name || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f5f5f5;">Email:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${contactData.email || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f5f5f5;">Phone:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${contactData.phone || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f5f5f5;">Company:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${contactData.company || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background-color: #f5f5f5;">Subject:</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${contactData.subject || 'N/A'}</td>
          </tr>
        </table>
        
        <h3>Message:</h3>
        <div style="padding: 15px; background-color: #f9f9f9; border-left: 4px solid #007bff; margin: 10px 0;">
          ${contactData.message || 'No message provided'}
        </div>
        
        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          This email was automatically generated from the Sri Datta Electronics website contact form.
          <br>
          Submitted on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
        </p>
      </div>
    `;

    const mailOptions = {
      from: functions.config().email.user,
      to: 'sales@sridattaelectronics.com',
      subject: 'New Enquiry From Website',
      html: emailBody
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully for contact:', context.params.contactId);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new functions.https.HttpsError('internal', 'Unable to send email');
    }
  });
