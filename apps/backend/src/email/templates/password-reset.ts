export const PASSWORD_RESET_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset your password</title>
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #ffffff;
      font-family: Arial, Helvetica, sans-serif;
      color: #333333;
    "
  >
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
                <h2
                  style="
                    margin: 0 0 24px;
                    font-size: 22px;
                    font-weight: 400;
                    color: #333333;
                  "
                >
                  Reset your password
                </h2>

                <p
                  style="
                    font-size: 14px;
                    line-height: 22px;
                    margin: 0 0 16px;
                  "
                >
                  Hello,
                </p>

                <p
                  style="
                    font-size: 14px;
                    line-height: 22px;
                    margin: 0 0 24px;
                  "
                >
                  We received a request to reset the password for your
                  Novice Ink Club account. Click the button below to
                  choose a new password.
                </p>

                <table
                  role="presentation"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                >
                  <tr>
                    <td
                      bgcolor="#4285f4"
                      style="border-radius: 4px;"
                    >
                      <a
                        href="{{ resetUrl }}"
                        style="
                          display: inline-block;
                          padding: 12px 24px;
                          font-size: 14px;
                          font-weight: 500;
                          color: #ffffff;
                          text-decoration: none;
                          border-radius: 4px;
                        "
                      >
                        Reset Password
                      </a>
                    </td>
                  </tr>
                </table>

                <p
                  style="
                    font-size: 14px;
                    line-height: 22px;
                    margin: 24px 0 16px;
                  "
                >
                  This password reset link will expire in
                  {{ expirationMinutes }} minutes.
                </p>

                <p
                  style="
                    font-size: 14px;
                    line-height: 22px;
                    margin: 0 0 24px;
                  "
                >
                  If you didn't request a password reset, you can
                  safely ignore this email. Your password will
                  remain unchanged.
                </p>

                <p
                  style="
                    font-size: 14px;
                    line-height: 22px;
                    margin: 0;
                  "
                >
                  Thanks,<br />
                  The Novice Ink Club Team
                </p>

                <hr
                  style="
                    border: none;
                    border-top: 1px solid #eeeeee;
                    margin: 32px 0 16px;
                  "
                />

                <p
                  style="
                    font-size: 12px;
                    line-height: 18px;
                    color: #888888;
                    margin: 0;
                  "
                >
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
