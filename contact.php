<?php
// Contact Form Handler for Bulgarian 56 Peaks

header('Content-Type: application/json');
ini_set('display_errors', 0);

$response = array('success' => false, 'message' => '');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    $response['message'] = 'Method not allowed';
    echo json_encode($response);
    exit;
}

// Get and sanitize form data
$name    = isset($_POST['name'])    ? trim($_POST['name'])    : '';
$email   = isset($_POST['email'])   ? trim($_POST['email'])   : '';
$subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Validation
$errors = array();

if (empty($name) || strlen($name) < 2 || strlen($name) > 100) {
    $errors[] = 'Name must be between 2 and 100 characters';
}
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Valid email is required';
}
if (empty($subject) || strlen($subject) < 3 || strlen($subject) > 200) {
    $errors[] = 'Subject must be between 3 and 200 characters';
}
if (empty($message) || strlen($message) < 10 || strlen($message) > 5000) {
    $errors[] = 'Message must be between 10 and 5000 characters';
}

if (!empty($errors)) {
    http_response_code(400);
    $response['message'] = implode(', ', $errors);
    echo json_encode($response);
    exit;
}

$name    = htmlspecialchars($name,    ENT_QUOTES, 'UTF-8');
$email   = filter_var($email,         FILTER_SANITIZE_EMAIL);
$subject = htmlspecialchars($subject, ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

$recipient_email = 'hello@56peaks.com';
$website_name    = 'Bulgarian 56 Peaks';

$headers  = "From: {$website_name} <noreply@56peaks.com>\r\n";
$headers .= "Reply-To: {$name} <{$email}>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

$email_subject = "New Contact: " . $subject;

$email_body = "
<div style='font-family:Arial,sans-serif;max-width:600px;margin:0 auto;'>
    <div style='background:#333;color:#fff;padding:20px;border-radius:8px 8px 0 0;text-align:center;'>
        <h1>{$website_name} — New Contact</h1>
    </div>
    <div style='background:#fff;padding:20px;border-radius:0 0 8px 8px;'>
        <p><strong>Name:</strong> {$name}</p>
        <p><strong>Email:</strong> <a href='mailto:{$email}'>{$email}</a></p>
        <p><strong>Subject:</strong> {$subject}</p>
        <div style='background:#f0f0f0;padding:15px;border-left:4px solid #333;margin-top:10px;'>
            " . nl2br($message) . "
        </div>
    </div>
</div>";

if (mail($recipient_email, $email_subject, $email_body, $headers)) {
    // Confirmation email to visitor
    $confirm_headers  = "From: {$website_name} <noreply@56peaks.com>\r\n";
    $confirm_headers .= "MIME-Version: 1.0\r\n";
    $confirm_headers .= "Content-Type: text/html; charset=UTF-8\r\n";

    $confirm_body = "
    <div style='font-family:Arial,sans-serif;max-width:600px;margin:0 auto;'>
        <div style='background:#333;color:#fff;padding:20px;border-radius:8px 8px 0 0;text-align:center;'>
            <h1>Thank You, {$name}</h1>
        </div>
        <div style='background:#fff;padding:20px;border-radius:0 0 8px 8px;'>
            <p>We received your message about <strong>{$subject}</strong> and will get back to you shortly.</p>
            <p>Best regards,<br>{$website_name} Team</p>
        </div>
    </div>";

    @mail($email, "We received your message — {$website_name}", $confirm_body, $confirm_headers);

    $response['success'] = true;
    $response['message'] = "Thank you! We'll get back to you as soon as possible.";
    http_response_code(200);
} else {
    $response['message'] = 'Sorry, there was an issue sending your message. Please try again later.';
    http_response_code(500);
}

echo json_encode($response);
exit;
?>
