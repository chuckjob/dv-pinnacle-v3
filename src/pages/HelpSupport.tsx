import { HelpCircle } from 'lucide-react';

export default function HelpSupport() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-h4 text-cool-900">Help & Support</h1>
        <p className="text-body3 text-cool-500 mt-0.5">Get help with DV Pinnacle</p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-12 text-center">
        <div className="w-12 h-12 rounded-xl bg-plum-50 flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="h-6 w-6 text-plum-600" />
        </div>
        <h3 className="text-body2 font-semibold text-cool-900 mb-1">Help & Support</h3>
        <p className="text-body3 text-cool-500 max-w-md mx-auto">
          Documentation, tutorials, FAQs, and contact support will be available here.
        </p>
      </div>
    </div>
  );
}
