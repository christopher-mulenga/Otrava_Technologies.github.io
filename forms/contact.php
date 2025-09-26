<?php
// Set your receiving email address
$receiving_email_address = 'otrava@mail.com'; // Replace with your actual email

// Basic validation
if(empty($_POST['name']) || empty($_POST['email']) || empty($_POST['message'])) {
    die('Please fill all required fields!');
}

// Sanitize input data
$name = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
$email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
$subject = isset($_POST['subject']) ? filter_var($_POST['subject'], FILTER_SANITIZE_STRING) : 'New message from website';
$message = filter_var($_POST['message'], FILTER_SANITIZE_STRING);
$phone = isset($_POST['phone']) ? filter_var($_POST['phone'], FILTER_SANITIZE_STRING) : 'Not provided';

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    die('Invalid email address!');
}

// Email headers
$headers = "From: $name <$email>" . "\r\n";
$headers .= "Reply-To: $email" . "\r\n";
$headers .= "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type: text/html; charset=UTF-8" . "\r\n";

// Email content
$email_content = "<html><body>";
$email_content .= "<h2>New Contact Form Submission</h2>";
$email_content .= "<p><strong>Name:</strong> $name</p>";
$email_content .= "<p><strong>Email:</strong> $email</p>";
$email_content .= "<p><strong>Phone:</strong> $phone</p>";
$email_content .= "<p><strong>Subject:</strong> $subject</p>";
$email_content .= "<p><strong>Message:</strong><br>" . nl2br($message) . "</p>";
$email_content .= "</body></html>";

// Send email
$mail_sent = mail($receiving_email_address, $subject, $email_content, $headers);

// Response
if ($mail_sent) {
    echo 'Message has been sent successfully!';
} else {
    echo 'Message could not be sent. Please try again later.';
    // For debugging (remove in production)
    // error_log("Failed to send email to: $receiving_email_address");
}
?>