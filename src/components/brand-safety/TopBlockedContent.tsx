import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronRight, AlertTriangle, ShieldAlert } from "lucide-react";
import { blockedContentItems, formatNumber } from "@/data/mockData";
import { cn } from "@/lib/utils";

const riskBadge = {
  high: { bg: "bg-tomato-50", text: "text-tomato-700", border: "border-tomato-200", dot: "bg-tomato-500" },
  medium: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", dot: "bg-orange-500" },
  low: { bg: "bg-grass-50", text: "text-grass-700", border: "border-grass-200", dot: "bg-grass-500" },
};

export function TopBlockedContent() {
  const [expandedReasons, setExpandedReasons] = useState<Set<string>>(new Set());

  const toggleReason = (id: string) => {
    setExpandedReasons((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="text-h6 text-cool-900 mb-4">Top Blocked Content</h3>

        <div className="grid grid-cols-2 gap-4">
          {blockedContentItems.map((item) => {
            const badge = riskBadge[item.risk];
            const isExpanded = expandedReasons.has(item.id);
            return (
              <div
                key={item.id}
                className="rounded-xl border border-neutral-100 overflow-hidden hover:shadow-elevation-hover transition-shadow duration-200"
              >
                {/* Thumbnail */}
                <div className="h-32 bg-neutral-100 relative overflow-hidden">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <AlertTriangle className="h-8 w-8 text-neutral-300" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[12px] leading-[16px] font-medium", badge.bg, badge.text)}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", badge.dot)} />
                      {item.risk.charAt(0).toUpperCase() + item.risk.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  {/* URL */}
                  <p className="text-caption text-cool-500 truncate mb-1" title={item.url}>{item.url}</p>

                  {/* Title */}
                  <h4 className="text-body3 font-medium text-cool-900 mb-2 line-clamp-2">{item.title}</h4>

                  {/* Categories */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {item.categories.map((cat) => (
                      <span key={cat} className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[12px] leading-[16px] font-medium border", badge.bg, badge.text, badge.border)}>
                        {cat}
                      </span>
                    ))}
                  </div>

                  {/* Blocked impressions */}
                  <div className="flex items-center gap-1.5 text-body3 text-cool-600 mb-3">
                    <ShieldAlert className="h-3.5 w-3.5 text-cool-400" />
                    <span className="font-medium">{formatNumber(item.impressions)}</span>
                    <span>blocked impressions</span>
                  </div>

                  {/* Expandable reasoning */}
                  <button
                    onClick={() => toggleReason(item.id)}
                    className="flex items-center gap-1 text-body3 font-medium text-plum-600 hover:text-plum-700 transition-colors"
                  >
                    {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                    Why was this blocked?
                  </button>
                  {isExpanded && (
                    <div className="mt-2 px-3 py-2.5 rounded-lg bg-neutral-50 border border-neutral-100">
                      <p className="text-body3 text-cool-700 leading-relaxed">{item.blockReason}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
