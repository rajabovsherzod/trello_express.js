export const createInvitationEmailTemplate = (boardName, fromUsername, invitationLink) => {
    const primaryColor = '#0de79a'; // Asosiy yashil rang
    const backgroundColor = '#0c1413'; // To'q fon
    const foregroundColor = '#b4c2be'; // Matn rangi

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            /* ... (avvalgi email shablonidagi kabi chiroyli stillar) ... */
            .button {
                background-color: ${primaryColor};
                color: #000000;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                display: inline-block;
                margin-top: 24px;
            }
        </style>
    </head>
    <body style="background-color: #111827; font-family: 'Poppins', sans-serif;">
        <div style="background-color:${backgroundColor}; color:${foregroundColor}; max-width:600px; margin:20px auto; padding:40px; border-radius:16px; text-align:center;">
            <h1 style="color:#FFFFFF; font-size:28px;">You're Invited!</h1>
            <p style="color:#81948e; font-size: 16px;">
                <b>${fromUsername}</b> has invited you to collaborate on the board:
            </p>
            <p style="font-size:24px; font-weight:bold; color:#FFFFFF;">
                ${boardName}
            </p>
            <a href="${invitationLink}" class="button">View Invitation</a>
            <p style="font-size:12px; color:#64748B; margin-top:32px;">
                If you were not expecting this invitation, you can ignore this email.
            </p>
        </div>
    </body>
    </html>
    `;
};