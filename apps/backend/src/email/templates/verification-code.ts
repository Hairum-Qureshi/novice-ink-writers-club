export const VERIFICATION_CODE_TEMPLATE = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify your email address</title>
    </head>

    <body style="
        margin: 0;
        padding: 0;
        background-color: #ffffff;
        font-family: Arial, Helvetica, sans-serif;
        color: #333333;
    ">
        <table
        role="presentation"
        cellpadding="0"
        cellspacing="0"
        border="0"
        width="100%"
        >
        <tr>
            <td align="center" style="padding: 40px 20px;">
            <table
                role="presentation"
                cellpadding="0"
                cellspacing="0"
                border="0"
                width="100%"
                style="max-width: 500px;"
            >
                <tr>
                <td>
                    <h2 style="
                    margin: 0 0 24px;
                    font-size: 22px;
                    font-weight: 400;
                    color: #333333;
                    ">
                    Verify your email address
                    </h2>

                    <p style="
                    font-size: 14px;
                    line-height: 22px;
                    margin: 0 0 16px;
                    ">
                    Hello,
                    </p>

                    <p style="
                    font-size: 14px;
                    line-height: 22px;
                    margin: 0 0 24px;
                    ">
                    Follow this code to verify your email address.
                    </p>

                    <div style="
                    display: inline-block;
                    padding: 14px 24px;
                    background-color: #f5f5f5;
                    border-radius: 4px;
                    font-size: 26px;
                    font-weight: 600;
                    letter-spacing: 6px;
                    color: #333333;
                    ">
                    {{ verificationCode }}
                    </div>

                    <p style="
                    font-size: 14px;
                    line-height: 22px;
                    margin: 24px 0 16px;
                    ">
                    This verification code will expire in 5 minutes.
                    </p>

                    <p style="
                    font-size: 14px;
                    line-height: 22px;
                    margin: 0 0 24px;
                    ">
                    If you didn't request this email, you can safely ignore it.
                    </p>

                    <p style="
                    font-size: 14px;
                    line-height: 22px;
                    margin: 0;
                    ">
                    Thanks,<br />
                    The Novice Ink. Writer's Club Team
                    </p>

                    <hr style="
                    border: none;
                    border-top: 1px solid #eeeeee;
                    margin: 32px 0 16px;
                    " />

                    <p style="
                    font-size: 12px;
                    line-height: 18px;
                    color: #888888;
                    margin: 0;
                    ">
                    This is an automated message. Please do not reply
                    to this email.
                    </p>
                </td>
                </tr>
            </table>
            </td>
        </tr>
        </table>
    </body>
    </html>
`;
