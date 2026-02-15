import { useState } from 'react';
import { Globe, ChevronDown, ChevronUp, Ban, AlertTriangle, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/formatters';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import type { BlockedSite } from '@/types/goal';

interface MediaContextProps {
  blockedSites: BlockedSite[];
}

const INITIAL_SHOW = 3;

function DomainAvatar({ domain }: { domain: string }) {
  const letter = domain.charAt(0).toUpperCase();
  return (
    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-label font-bold bg-tomato-100 text-tomato-700">
      {letter}
    </div>
  );
}

function SitePreviewCard({ site }: { site: BlockedSite }) {
  return (
    <div className="w-80">
      {/* Screenshot placeholder */}
      <div className="rounded-md bg-neutral-100 border border-neutral-200 h-28 flex items-center justify-center mb-3">
        <div className="text-center">
          <ShieldAlert className="h-6 w-6 text-tomato-400 mx-auto mb-1" />
          <p className="text-label text-cool-400">Preview blocked</p>
        </div>
      </div>

      {/* Domain + Risk */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-body3 font-bold text-cool-900">{site.domain}</span>
        <span className={cn(
          'px-1.5 py-px rounded-full text-label font-semibold',
          site.riskScore >= 80 ? 'bg-tomato-100 text-tomato-700' : 'bg-orange-100 text-orange-700'
        )}>
          Risk: {site.riskScore}
        </span>
      </div>

      {/* Detail rows */}
      <div className="space-y-1.5 text-label">
        <div className="flex justify-between">
          <span className="text-cool-500">Block Reason</span>
          <span className="font-medium text-tomato-600">{site.blockReason} — {site.blockDetail}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-cool-500">Detection</span>
          <span className="font-medium text-cool-700">{site.detectionMethod}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-cool-500">Blocked</span>
          <span className="font-medium text-cool-700">{formatNumber(site.impressionsBlocked)} impressions</span>
        </div>
        <div className="flex justify-between">
          <span className="text-cool-500">Sample URL</span>
          <span className="font-medium text-cool-600 truncate max-w-[180px]" title={site.sampleUrl}>
            {site.sampleUrl}
          </span>
        </div>
      </div>
    </div>
  );
}

function BlockedSiteCard({ site }: { site: BlockedSite }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <DomainAvatar domain={site.domain} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <HoverCard openDelay={200} closeDelay={100}>
            <HoverCardTrigger asChild>
              <button
                type="button"
                className="text-body3 font-semibold text-cool-900 hover:text-plum-700 underline decoration-dotted underline-offset-2 transition-colors cursor-pointer"
              >
                {site.domain}
              </button>
            </HoverCardTrigger>
            <HoverCardContent side="right" align="start" className="w-auto p-4">
              <SitePreviewCard site={site} />
            </HoverCardContent>
          </HoverCard>
          <span className="px-1.5 py-px rounded-full text-label font-medium bg-tomato-100 text-tomato-700">
            {site.blockReason}
          </span>
        </div>
        <p className="text-label text-cool-500 mt-0.5">{site.blockDetail}</p>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-label text-cool-400">{formatNumber(site.impressionsBlocked)} blocked</span>
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-label font-medium text-plum-600 hover:text-plum-800 transition-colors"
          >
            <Ban className="h-3 w-3" />
            Exclude Domain
          </button>
        </div>
      </div>
    </div>
  );
}

export function MediaContext({ blockedSites }: MediaContextProps) {
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? blockedSites : blockedSites.slice(0, INITIAL_SHOW);
  const hasMore = blockedSites.length > INITIAL_SHOW;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Globe className="h-4 w-4 text-cool-500" />
        <h4 className="text-body3 font-semibold text-cool-700">Media Context</h4>
        <div className="flex items-center gap-1 ml-2">
          <AlertTriangle className="h-3 w-3 text-tomato-500" />
          <span className="text-label text-tomato-600 font-medium">{blockedSites.length} blocked domains</span>
        </div>
      </div>

      <div className="rounded-lg border border-neutral-200 p-4">
        <p className="text-label font-semibold text-cool-600 uppercase tracking-wide mb-2">
          Blocked Samples
        </p>
        <div className="divide-y divide-neutral-100">
          {visible.map((site) => (
            <BlockedSiteCard key={site.domain} site={site} />
          ))}
        </div>
        {hasMore && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1 mt-2 text-label font-medium text-plum-600 hover:text-plum-800 transition-colors"
          >
            {showAll ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {showAll ? 'Show fewer' : `Show all ${blockedSites.length}`}
          </button>
        )}
      </div>
    </div>
  );
}
