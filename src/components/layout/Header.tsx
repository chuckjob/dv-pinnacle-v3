import { Menu, Search, Bell, HelpCircle, Sparkles } from 'lucide-react';
import { useVera } from '@/hooks/use-vera';

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function Header({ sidebarOpen, onToggleSidebar }: HeaderProps) {
  const { toggleVera } = useVera();

  return (
    <header className="h-16 bg-neutral-25 flex items-center px-4 gap-2 flex-shrink-0 z-40">
      {/* Left: hamburger + logo */}
      <div className="flex items-center gap-1">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
          title={sidebarOpen ? 'Close menu' : 'Open menu'}
        >
          <Menu className="h-5 w-5 text-cool-600" />
        </button>

        <div className="flex items-center gap-2 ml-1">
          <div className="w-8 h-8 rounded-lg bg-plum-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-label font-bold">DV</span>
          </div>
          <span className="text-cool-900 text-body2 font-semibold tracking-tight">Pinnacle</span>
        </div>
      </div>

      {/* Center: search */}
      <div className="flex-1 flex justify-center px-4">
        <div className="w-full max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-cool-400" />
            <input
              type="text"
              placeholder="Search goals, campaigns, or ask Vera..."
              className="w-full h-12 pl-10 pr-4 rounded-full bg-white text-body3 text-cool-700 placeholder:text-cool-400 focus:outline-none focus:ring-2 focus:ring-plum-200 focus:shadow-sm border border-neutral-200 focus:border-plum-300 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1">
        <button className="p-2 rounded-full hover:bg-neutral-100 transition-colors" title="Help">
          <HelpCircle className="h-5 w-5 text-cool-500" />
        </button>

        <button onClick={toggleVera} className="p-2 rounded-full hover:bg-neutral-100 transition-colors" title="Vera AI">
          <Sparkles className="h-5 w-5 text-plum-500" />
        </button>

        <button className="relative p-2 rounded-full hover:bg-neutral-100 transition-colors" title="Notifications">
          <Bell className="h-5 w-5 text-cool-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-tomato-500 rounded-full ring-2 ring-neutral-25" />
        </button>

        <div className="w-px h-6 bg-neutral-200 mx-2" />

        <button className="p-0.5 rounded-full hover:bg-neutral-100 transition-colors">
          <div className="w-8 h-8 rounded-full bg-plum-100 flex items-center justify-center">
            <span className="text-label font-semibold text-plum-700">CJ</span>
          </div>
        </button>
      </div>
    </header>
  );
}
