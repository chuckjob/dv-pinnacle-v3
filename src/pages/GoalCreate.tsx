import { Plus } from 'lucide-react';

export default function GoalCreate() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-h4 text-cool-900">Create Goal</h1>
        <p className="text-body3 text-cool-500 mt-0.5">Define your campaign objective and configuration</p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-12 text-center">
        <div className="w-12 h-12 rounded-xl bg-plum-50 flex items-center justify-center mx-auto mb-4">
          <Plus className="h-6 w-6 text-plum-600" />
        </div>
        <h3 className="text-body2 font-semibold text-cool-900 mb-1">Goal Creation Wizard</h3>
        <p className="text-body3 text-cool-500 max-w-md mx-auto">
          The guided goal creation flow will be available here — including objective selection,
          platform configuration, inventory type, KPI targets, and Vera-assisted setup.
        </p>
      </div>
    </div>
  );
}
