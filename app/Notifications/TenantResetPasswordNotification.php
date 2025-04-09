<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Lang;

class TenantResetPasswordNotification extends ResetPassword
{
    /**
     * The from email address for this notification.
     *
     * @var string|null
     */
    protected $fromEmail;

    /**
     * The from name for this notification.
     *
     * @var string|null
     */
    protected $fromName;

    /**
     * Create a notification instance with a custom sender.
     *
     * @param string $token
     * @param string|null $fromEmail
     * @param string|null $fromName
     */
    public function __construct($token, $fromEmail = null, $fromName = null)
    {
        parent::__construct($token);
        $this->fromEmail = $fromEmail;
        $this->fromName = $fromName;
    }

    /**
     * Build the mail representation of the notification.
     *
     * @param mixed $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $url = $this->resetUrl($notifiable);

        $mail = (new MailMessage)
            ->subject(Lang::get('Reset Password Notification'))
            ->line(Lang::get('You are receiving this email because we received a password reset request for your account.'))
            ->action(Lang::get('Reset Password'), $url)
            ->line(Lang::get('This password reset link will expire in :count minutes.', ['count' => config('auth.passwords.'.config('auth.defaults.passwords').'.expire')]))
            ->line(Lang::get('If you did not request a password reset, no further action is required.'));

        // Set custom sender if provided
        if ($this->fromEmail) {
            $mail->from($this->fromEmail, $this->fromName);
        }

        return $mail;
    }
}
