'use client';

import { SettingsForm } from '@/components/settings-form';

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage application settings and preferences</p>
        </div>
        <SettingsForm />
      </div>
    </div>
  );
}