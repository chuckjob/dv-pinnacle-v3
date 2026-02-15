import { Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-h4 text-cool-900">Settings</h1>
        <p className="text-body3 text-cool-500 mt-0.5">Manage your account and preferences</p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-12 text-center">
        <div className="w-12 h-12 rounded-xl bg-plum-50 flex items-center justify-center mx-auto mb-4">
          <SettingsIcon className="h-6 w-6 text-plum-600" />
        </div>
        <h3 className="text-body2 font-semibold text-cool-900 mb-1">Settings</h3>
        <p className="text-body3 text-cool-500 max-w-md mx-auto">
          Account preferences, notification settings, team management, and API configuration will be available here.
        </p>
      </div>
    </div>
  );
}
