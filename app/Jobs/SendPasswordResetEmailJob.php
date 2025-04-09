<?php

namespace App\Jobs;

use App\Models\Tenant;
use App\Notifications\TenantResetPasswordNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Password;
use App\Models\User;

class SendPasswordResetEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The email address of the user requesting a password reset.
     *
     * @var string
     */
    protected $email;

    /**
     * The from email address to use for this notification.
     *
     * @var string|null
     */
    protected $fromEmail;

    /**
     * The from name to use for this notification.
     *
     * @var string|null
     */
    protected $fromName;

    /**
     * Create a new job instance.
     *
     * @param string $email
     * @param string|null $fromEmail
     * @param string|null $fromName
     * @return void
     */
    public function __construct(string $email, ?string $fromEmail = null, ?string $fromName = null)
    {
        $this->email = $email;
        $this->fromEmail = $fromEmail;
        $this->fromName = $fromName;
    }    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle(): void
    {
        // Find the user
        $user = User::where('email', $this->email)->first();

        if ($user) {
            // Generate a reset token
            $token = Password::createToken($user);

            // Use the provided from email/name if available, otherwise use defaults
            $fromEmail = $this->fromEmail ?: config('mail.from.address');
            $fromName = $this->fromName ?: config('mail.from.name');

            // Send notification using our custom TenantResetPasswordNotification
            $user->notify(new TenantResetPasswordNotification($token, $fromEmail, $fromName));
        }
    }
}
