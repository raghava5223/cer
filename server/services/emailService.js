const nodemailer = require('nodemailer');

/**
 * Sends a professional registration success email immediately after a student clicks register.
 */
const sendRegistrationEmail = async (studentEmail, studentName, event, isPending) => {
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your-email@gmail.com') return;

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const subject = `Registration Received: ${event.eventName}`;
    
    // Formatting date nicely
    const eventDate = new Date(event.date).toLocaleDateString('en-US', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');
                body { font-family: 'Plus Jakarta Sans', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
                .wrapper { width: 100%; table-layout: fixed; background-color: #f8fafc; padding-bottom: 40px; }
                .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-spacing: 0; color: #1e293b; border-radius: 16px; overflow: hidden; margin-top: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
                .header { background: linear-gradient(135deg, #0f172a 0%, #334155 100%); padding: 40px; text-align: center; color: white; }
                .content { padding: 40px; line-height: 1.6; }
                .event-details { background-color: #f8fafc; border-radius: 12px; padding: 25px; margin: 25px 0; border: 1px solid #e2e8f0; }
                .detail-row { margin-bottom: 15px; }
                .detail-label { color: #64748b; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 4px; }
                .detail-value { color: #0f172a; font-weight: 700; font-size: 16px; }
                .status-notif { padding: 15px; border-radius: 8px; font-size: 14px; margin-top: 20px; text-align: center; }
                .status-pending { background-color: #fffbeb; color: #92400e; border: 1px solid #fef3c7; }
                .status-confirmed { background-color: #f0fdf4; color: #166534; border: 1px solid #dcfce7; }
                .footer { text-align: center; padding: 20px; color: #94a3b8; font-size: 12px; }
            </style>
        </head>
        <body>
            <center class="wrapper">
                <table class="main" width="100%">
                    <tr>
                        <td class="header">
                            <h1 style="margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">Registration Received</h1>
                            <p style="margin: 10px 0 0 0; opacity: 0.8; font-size: 15px;">Your spot is reserved!</p>
                        </td>
                    </tr>
                    <tr>
                        <td class="content">
                            <p style="font-size: 18px; margin-top: 0; color: #0f172a;">Hello <strong>${studentName}</strong>,</p>
                            <p>Great choice! Your registration for the following event has been successfully logged into our system.</p>
                            
                            <div class="event-details">
                                <div class="detail-row">
                                    <span class="detail-label">Event Name</span>
                                    <span class="detail-value">${event.eventName}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Schedule</span>
                                    <span class="detail-value">📅 ${eventDate} • ${event.time}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Venue</span>
                                    <span class="detail-value">📍 ${event.venue}</span>
                                </div>
                            </div>

                            ${isPending ? `
                                <div class="status-notif status-pending">
                                    <strong>Status: Payment Pending</strong><br/>
                                    Please complete your payment in the portal to receive your entrance QR pass.
                                </div>
                            ` : `
                                <div class="status-notif status-confirmed">
                                    <strong>Status: Confirmed</strong><br/>
                                    Payment verified. We are preparing your official entrance pass now. Check your inbox again in a few moments.
                                </div>
                            `}

                            <p style="margin-top: 30px;">See you soon,<br/><strong style="color: #0f172a;">College Event Team</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td class="footer">
                            <p>Sent via College Event Portal Infrastructure</p>
                            <p>&copy; 2026 College Event Portal</p>
                        </td>
                    </tr>
                </table>
            </center>
        </body>
        </html>
    `;

    try {
        await transporter.sendMail({
            from: `"College Event Portal" <${process.env.EMAIL_USER}>`,
            to: studentEmail,
            subject: subject,
            html: html
        });
    } catch (error) {
        console.error('Error sending registration email:', error);
    }
};

/**
 * Sends premium digital tickets with QR codes after payment is confirmed.
 */
const sendPaymentConfirmation = async (studentEmail, studentName, registrations) => {
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your-email@gmail.com') return;

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const isBulk = registrations.length > 1;
    const subject = isBulk ? 'Your Digital Entrance Passes' : `Your Ticket for ${registrations[0].eventId.eventName}`;

    let ticketsHtml = '';
    const attachments = [];

    registrations.forEach((reg, index) => {
        const event = reg.eventId;
        const cid = `qrcode${index}`;
        
        // Vertical stacked layout for guaranteed QR visibility on all devices
        ticketsHtml += `
            <div style="background-color: #ffffff; border-radius: 24px; overflow: hidden; margin-bottom: 35px; border: 1px solid #e2e8f0; box-shadow: 0 12px 30px rgba(0,0,0,0.06);">
                <!-- Ticket Header -->
                <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 30px; color: white; text-align: center;">
                    <h2 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">${event.eventName}</h2>
                    <p style="margin: 8px 0 0 0; font-size: 11px; opacity: 0.7; text-transform: uppercase; font-weight: 700; letter-spacing: 2px;">Official Entrance Pass</p>
                </div>
                
                <!-- Ticket Info (Centered Vertical) -->
                <div style="padding: 35px; text-align: center;">
                    <div style="margin-bottom: 30px;">
                        <p style="margin: 0; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em;">Venue & Schedule</p>
                        <p style="margin: 10px 0 0 0; font-weight: 700; color: #0f172a; font-size: 18px; line-height: 1.4;">
                            📍 ${event.venue}<br/>
                            📅 ${event.date} • ${event.time}
                        </p>
                    </div>

                    <!-- QR Code Section (Centered & Sized) -->
                    <div style="margin: 20px 0; background-color: #ffffff; padding: 25px; border-radius: 20px; display: inline-block; border: 2px solid #f1f5f9; box-shadow: 0 4px 15px rgba(0,0,0,0.02);">
                        <img src="cid:${cid}" alt="QR Pass" width="160" height="160" style="display: block; margin: 0 auto; width: 160px; height: 160px;" />
                        <p style="margin: 15px 0 0 0; font-size: 10px; font-weight: 800; color: #4f46e5; letter-spacing: 1px; text-transform: uppercase;">Scan To Verify Entry</p>
                    </div>

                    <div style="margin-top: 30px; border-top: 1px dashed #e2e8f0; padding-top: 25px;">
                        <p style="margin: 0; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em;">Registration ID</p>
                        <p style="margin: 8px 0 0 0; font-family: 'Courier New', monospace; font-size: 15px; color: #334155; font-weight: 700;">#${reg._id}</p>
                    </div>
                </div>
                
                <!-- Ticket Status Bar -->
                <div style="background-color: #f8fafc; padding: 18px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0; font-size: 12px; color: #64748b; font-weight: 600;">Validity: single use scan required at gate.</p>
                </div>
            </div>
        `;

        if (reg.qrCode && reg.qrCode.startsWith('data:image/png;base64,')) {
            attachments.push({
                filename: `ticket-${index}.png`,
                content: reg.qrCode.split('base64,')[1],
                encoding: 'base64',
                cid: cid
            });
        }
    });

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');
                body { font-family: 'Plus Jakarta Sans', Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 0; }
                .wrapper { width: 100%; padding: 40px 0; }
                .container { width: 100%; max-width: 600px; margin: 0 auto; }
                .hero { text-align: center; margin-bottom: 40px; }
                .note-box { 
                    background: rgba(255, 255, 255, 0.4); 
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    border-left: 6px solid #fbbf24;
                    border-radius: 16px; 
                    padding: 24px; 
                    margin: 35px 0;
                    background-color: #fff9e6;
                    color: #92400e; 
                    font-size: 14px;
                    line-height: 1.6;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.02);
                }
            </style>
        </head>
        <body>
            <center class="wrapper">
                <div class="container">
                    <div class="hero">
                        <div style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); width: 64px; height: 64px; border-radius: 20px; line-height: 64px; margin-bottom: 24px; font-size: 30px; box-shadow: 0 10px 25px rgba(79, 70, 229, 0.3);">🎟️</div>
                        <h1 style="margin: 0; color: #0f172a; font-size: 32px; font-weight: 800; letter-spacing: -1.5px;">Your Entrance Tickets</h1>
                        <p style="margin: 10px 0 0 0; color: #64748b; font-size: 17px;">Hello <strong>${studentName}</strong>, your digital passes are confirmed!</p>
                    </div>

                    ${ticketsHtml}

                    <div class="note-box">
                        <strong style="color: #92400e; font-size: 16px; display: block; margin-bottom: 8px;">Important Security Note:</strong>
                        Each QR code is cryptographically unique and will be scanned at the venue gateways. 
                        <strong>Do not share or duplicate these tickets</strong> with others, as they are valid for a single entry only. 
                        Please ensure your phone brightness is up for quick scanning.
                    </div>

                    <p style="text-align: center; font-size: 16px; color: #0f172a; font-weight: 700;">We look forward to seeing you at the event!</p>

                    <div style="text-align: center; margin-top: 50px; padding-top: 25px; border-top: 2px solid #e2e8f0;">
                        <p style="margin: 0; color: #94a3b8; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px;">College Ticket Portal</p>
                        <p style="margin: 8px 0 0 0; color: #cbd5e1; font-size: 10px; font-weight: 600;">&copy; 2026 College Event Portal &bull; Professional Ticketing Infrastructure</p>
                    </div>
                </div>
            </center>
        </body>
        </html>
    `;

    try {
        await transporter.sendMail({
            from: `"College Ticket Portal" <${process.env.EMAIL_USER}>`,
            to: studentEmail,
            subject: subject,
            html: html,
            attachments: attachments
        });
    } catch (error) {
        console.error('Error sending ticket email:', error);
    }
};

module.exports = {
    sendRegistrationEmail,
    sendPaymentConfirmation,
};
