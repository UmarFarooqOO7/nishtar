<?php

namespace App\Http\Controllers\App\Auth;

use App\Http\Controllers\Controller;
use App\Jobs\SendPasswordResetEmailJob;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Password;
use Illuminate\View\View;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function create(): Response
    {
        return Inertia::render('App/Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        // Get the current tenant
        $tenant = tenant();

        // Get the domain name from the central database
        $domain = tenancy()->central(function ($tenant) {
            return DB::table('domains')
                ->where('tenant_id', $tenant->id)
                ->value('domain');
        });

        // Format the from email address
        $fromEmail = $domain ? 'info@' . $domain : null;
        $fromName = $tenant->name;

        // dd($fromEmail, $fromName);

        // Dispatch a queue job to send the password reset link with tenant-specific email
        SendPasswordResetEmailJob::dispatch($request->email, $fromEmail, $fromName);

        // Return success message
        return back()->with('status', __(Password::RESET_LINK_SENT));
    }
}
