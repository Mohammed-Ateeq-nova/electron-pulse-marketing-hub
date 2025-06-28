
# Firebase Cloud Function Email Setup

## Prerequisites
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Initialize your project: `firebase use your-project-id`

## Setup Steps

### 1. Install Dependencies
```bash
cd functions
npm install
```

### 2. Configure Email Credentials
You need to set up email configuration for the function to work:

```bash
# Set your Gmail credentials (you'll need an App Password, not your regular password)
firebase functions:config:set email.user="your-email@gmail.com"
firebase functions:config:set email.password="your-app-password"
```

**Important**: For Gmail, you need to:
1. Enable 2-factor authentication on your Google account
2. Generate an App Password (not your regular password)
3. Use the App Password in the configuration above

### 3. Deploy the Function
```bash
firebase deploy --only functions
```

### 4. Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

## Testing
Once deployed, when someone submits the contact form on your website, it will:
1. Save the data to Firestore (as it currently does)
2. Automatically trigger the Cloud Function
3. Send a formatted email to sales@sridattaelectronics.com

## Alternative Email Services
If you prefer not to use Gmail, you can modify the transporter configuration in `functions/src/index.ts` to use:
- SendGrid
- Mailgun
- AWS SES
- Or any other SMTP service

## Monitoring
You can monitor the function execution in the Firebase Console under Functions > Logs.
