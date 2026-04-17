# Contact Form Setup Guide for 56 Peaks

## Overview
This contact form handler uses PHP to process form submissions and is fully compatible with Hostinger hosting.

## Files Created/Modified

### 1. **contact.php** (NEW)
The PHP backend that:
- Receives form data from the contact form
- Validates all input (name, email, subject, message)
- Sanitizes data to prevent injection attacks
- Sends a formatted HTML email to the website owner
- Sends a confirmation email to the user
- Returns JSON response for AJAX handling

### 2. **contact.html** (MODIFIED)
- Added `method="POST"` and `action="contact.php"` to the form
- Added `id="submitBtn"` to the submit button for JavaScript control

### 3. **script.js** (MODIFIED)
- Added contact form event listener
- Implements AJAX submission (no page refresh)
- Shows loading state on submit button
- Displays success/error messages
- Auto-clears form after successful submission

### 4. **styles.css** (MODIFIED)
- Added `.success` and `.error` classes for message styling
- Added `.submit-btn:disabled` state for visual feedback
- Added slideIn animation for messages

## Setup Instructions

### Step 1: Configure Your Email Address
Before uploading to Hostinger, edit `contact.php` and change this line:

```php
$recipient_email = 'hello@56peaks.com'; // Change this to your email
```

Replace `hello@56peaks.com` with your actual email address where you want to receive notifications.

### Step 2: Upload Files to Hostinger

1. **Connect to Your Hostinger Account**
   - Go to hPanel (Hostinger's control panel)
   - Click on "File Manager" or use FTP/SFTP

2. **Upload Files**
   - Upload `contact.php` to your website root directory (same location as `index.html`)
   - Replace `contact.html`, `script.js`, and `styles.css` with the modified versions

3. **File Locations**
   ```
   /index.html
   /contact.html
   /about.html
   /contact.php ← NEW FILE (same directory level)
   /script.js
   /styles.css
   ```

### Step 3: Verify Installation

1. Navigate to your contact page
2. Fill out the form and click "Send Message"
3. You should see a success message
4. Check your email for the submission notification

## How It Works

### User Experience (Frontend)
1. User fills out the form
2. Clicks "Send Message"
3. Button shows "Sending..." and becomes disabled
4. Backend processes the request
5. User sees success or error message
6. Form clears on success
7. Message auto-dismisses after 5 seconds

### Backend Processing (contact.php)
1. **Receives** POST data from the form
2. **Validates** each field:
   - Name: 2-100 characters
   - Email: Valid email format
   - Subject: 3-200 characters
   - Message: 10-5000 characters
3. **Sanitizes** all input to prevent attacks
4. **Sends** two emails:
   - **Admin email**: Formatted HTML email with all submission details
   - **User confirmation**: Thank you email to the user
5. **Returns** JSON response with status and message

## Features

✅ **Secure**
- Input validation on both client and server
- HTML entity encoding to prevent injection
- Email sanitization

✅ **User-Friendly**
- Smooth AJAX submission (no page reload)
- Real-time feedback and error messages
- Mobile responsive

✅ **Professional**
- Beautifully formatted HTML emails
- Automatic confirmation emails
- Error handling and logging

✅ **Hostinger Compatible**
- Uses standard PHP mail() function
- Works with Hostinger's email services
- No additional dependencies required

## Troubleshooting

### Emails Not Arriving

**Check 1: Email Configuration in contact.php**
```php
$recipient_email = 'your-email@example.com'; // Ensure this is correct
```

**Check 2: Hostinger Email Settings**
- Log in to Hostinger hPanel
- Go to Email Accounts
- Ensure your email account is properly configured
- Check spam/junk folder for emails

**Check 3: Server Logs**
- In Hostinger, check Error Logs to see if PHP reports any issues
- File Manager → Logs → Error Logs

### Form Not Submitting

1. Check browser Console (F12 → Console tab) for JavaScript errors
2. Ensure `contact.php` is in the correct directory
3. Verify the form's `action="contact.php"` matches the file location

### Invalid Email Format Error

- Ensure you're using a valid email address format (user@domain.com)
- Check for accidental spaces in the email field

## Optional Customizations

### Change Email Subject Format
Edit line in `contact.php`:
```php
$email_subject = "New Contact Form Submission: " . $subject;
```

### Change Website Name
Edit line in `contact.php`:
```php
$website_name = '56 Peaks';
```

### Adjust Message Length Limits
Edit validation section in `contact.php`:
```php
// Adjust these numbers as needed
elseif (strlen($message) < 10 || strlen($message) > 5000) {
    $errors[] = 'Message must be between 10 and 5000 characters';
}
```

### Custom Success Message
Edit line in `contact.php`:
```php
$response['message'] = 'Thank you for your message! We\'ll get back to you as soon as possible.';
```

## Security Notes

⚠️ **Important for Production**
- Line 8 in `contact.php` has `display_errors = 0` - Keep this for security
- Never display raw PHP errors to users
- The `htmlspecialchars()` function prevents XSS attacks
- The form should only accept POST requests (already enforced)

## Support

If you have issues:
1. Check Hostinger's Error Logs (found in File Manager)
2. Verify the email address is correct in `contact.php`
3. Test with a simple form to ensure PHP mail() is working
4. Contact Hostinger support if email services aren't functioning

---

**Setup Status**: Ready for deployment ✓

Upload all files to Hostinger, update the email address, and you're good to go!
