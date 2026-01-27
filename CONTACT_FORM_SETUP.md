# Contact Form Setup Guide

## Overview
The contact form is fully functional with validation and error handling. To enable email sending, you need to integrate an email service.

## Current Implementation
- ✅ Form validation with Zod
- ✅ Client-side form handling with React Hook Form
- ✅ API route for form submission (`/api/contact`)
- ✅ Success/error toast notifications
- ✅ Bilingual support (English/Persian)

## Email Service Integration

### Option 1: Resend (Recommended for Next.js)

1. **Install Resend:**
   ```bash
   npm install resend
   ```

2. **Get API Key:**
   - Sign up at [resend.com](https://resend.com)
   - Create an API key
   - Add to `.env.local`:
     ```
     RESEND_API_KEY=re_xxxxxxxxxxxxx
     ```

3. **Update API Route:**
   ```typescript
   import { Resend } from 'resend';
   
   const resend = new Resend(process.env.RESEND_API_KEY);
   
   await resend.emails.send({
     from: 'onboarding@resend.dev', // Replace with your verified domain
     to: 'alireza7394@gmail.com',
     subject: `Portfolio Contact: ${validatedData.subject}`,
     html: `
       <h2>New Contact Form Submission</h2>
       <p><strong>Name:</strong> ${validatedData.name}</p>
       <p><strong>Email:</strong> ${validatedData.email}</p>
       <p><strong>Subject:</strong> ${validatedData.subject}</p>
       <p><strong>Message:</strong></p>
       <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
     `,
   });
   ```

### Option 2: SendGrid

1. **Install SendGrid:**
   ```bash
   npm install @sendgrid/mail
   ```

2. **Get API Key:**
   - Sign up at [sendgrid.com](https://sendgrid.com)
   - Create an API key
   - Add to `.env.local`:
     ```
     SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
     ```

3. **Update API Route:**
   ```typescript
   import sgMail from '@sendgrid/mail';
   
   sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
   
   await sgMail.send({
     to: 'alireza7394@gmail.com',
     from: 'your-email@example.com', // Must be verified
     subject: `Portfolio Contact: ${validatedData.subject}`,
     html: `
       <h2>New Contact Form Submission</h2>
       <p><strong>Name:</strong> ${validatedData.name}</p>
       <p><strong>Email:</strong> ${validatedData.email}</p>
       <p><strong>Subject:</strong> ${validatedData.subject}</p>
       <p><strong>Message:</strong></p>
       <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
     `,
   });
   ```

### Option 3: Nodemailer (SMTP)

1. **Install Nodemailer:**
   ```bash
   npm install nodemailer
   ```

2. **Add SMTP credentials to `.env.local`:**
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

3. **Update API Route:**
   ```typescript
   import nodemailer from 'nodemailer';
   
   const transporter = nodemailer.createTransport({
     host: process.env.SMTP_HOST,
     port: Number(process.env.SMTP_PORT),
     secure: false,
     auth: {
       user: process.env.SMTP_USER,
       pass: process.env.SMTP_PASS,
     },
   });
   
   await transporter.sendMail({
     from: process.env.SMTP_USER,
     to: 'alireza7394@gmail.com',
     subject: `Portfolio Contact: ${validatedData.subject}`,
     html: `
       <h2>New Contact Form Submission</h2>
       <p><strong>Name:</strong> ${validatedData.name}</p>
       <p><strong>Email:</strong> ${validatedData.email}</p>
       <p><strong>Subject:</strong> ${validatedData.subject}</p>
       <p><strong>Message:</strong></p>
       <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
     `,
   });
   ```

## Testing
Currently, the form logs submissions to the console. Check your server logs to see form submissions until email service is integrated.

## Security Notes
- Form validation prevents malicious input
- Rate limiting recommended for production (consider using Upstash Rate Limit)
- Consider adding reCAPTCHA for spam protection
- Sanitize HTML output if allowing rich text

## Next Steps
1. Choose an email service provider
2. Install the required package
3. Add API keys to `.env.local`
4. Uncomment and update the email sending code in `/src/app/api/contact/route.ts`
5. Test the form submission
