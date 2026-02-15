import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Check, ArrowRight, Search, X, AlertTriangle, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { dvProducts, DV_PRODUCT_CATEGORIES } from '@/data/dv-products';
import type { DvProduct } from '@/data/dv-products';
import { INSIGHT_REASONS } from '@/lib/campaign-diagnostics';
import { colors } from '@/tokens/foundry';

type CategoryFilter = 'all' | 'protection' | 'performance' | 'measurement';

// ─── SVG Illustrations ──────────────────────────────────────
// Minimal, geometric compositions using Foundry palette colors.
// Each illustration conveys the product's purpose abstractly.

function IllustrationFraudLab() {
  return (
    <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="30" width="60" height="80" rx="6" fill={colors.plum[100]} />
      <rect x="40" y="45" width="40" height="4" rx="2" fill={colors.plum[300]} />
      <rect x="40" y="55" width="30" height="4" rx="2" fill={colors.plum[200]} />
      <rect x="40" y="65" width="35" height="4" rx="2" fill={colors.plum[200]} />
      <circle cx="140" cy="70" r="30" fill={colors.plum[50]} stroke={colors.plum[400]} strokeWidth="2" strokeDasharray="4 3" />
      <path d="M130 70 L137 77 L152 62" stroke={colors.plum[600]} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="95" y="50" width="16" height="16" rx="3" fill={colors.tomato[100]} stroke={colors.tomato[300]} strokeWidth="1.5" />
      <path d="M100 54 L107 61 M107 54 L100 61" stroke={colors.tomato[500]} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IllustrationBrandSuitability() {
  return (
    <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="25" width="70" height="90" rx="8" fill={colors.turquoise[100]} />
      <rect x="35" y="35" width="50" height="30" rx="4" fill={colors.turquoise[300]} opacity="0.5" />
      <rect x="35" y="75" width="50" height="8" rx="4" fill={colors.turquoise[300]} opacity="0.3" />
      <rect x="35" y="90" width="35" height="8" rx="4" fill={colors.turquoise[300]} opacity="0.3" />
      <circle cx="145" cy="45" r="20" fill={colors.grass[100]} />
      <path d="M137 45 L143 51 L155 39" stroke={colors.grass[600]} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="145" cy="95" r="20" fill={colors.grass[100]} />
      <path d="M137 95 L143 101 L155 89" stroke={colors.grass[600]} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M110 45 L120 45" stroke={colors.turquoise[500]} strokeWidth="1.5" strokeDasharray="3 2" />
      <path d="M110 95 L120 95" stroke={colors.turquoise[500]} strokeWidth="1.5" strokeDasharray="3 2" />
    </svg>
  );
}

function IllustrationViewability() {
  return (
    <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="75" rx="65" ry="40" fill={colors.grass[100]} />
      <ellipse cx="100" cy="75" rx="40" ry="25" fill={colors.grass[300]} opacity="0.4" />
      <circle cx="100" cy="75" r="12" fill={colors.grass[500]} />
      <circle cx="100" cy="75" r="5" fill="white" />
      <rect x="30" y="25" width="140" height="6" rx="3" fill={colors.neutral[100]} />
      <rect x="30" y="25" width="90" height="6" rx="3" fill={colors.grass[300]} />
      <rect x="50" y="115" width="100" height="6" rx="3" fill={colors.neutral[100]} />
      <rect x="50" y="115" width="72" height="6" rx="3" fill={colors.grass[300]} />
    </svg>
  );
}

function IllustrationGeoVerification() {
  return (
    <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="70" r="50" fill={colors.sky[100]} />
      <ellipse cx="100" cy="70" rx="50" ry="18" fill="none" stroke={colors.sky[500]} strokeWidth="1" opacity="0.5" />
      <ellipse cx="100" cy="70" rx="18" ry="50" fill="none" stroke={colors.sky[500]} strokeWidth="1" opacity="0.5" />
      <line x1="50" y1="70" x2="150" y2="70" stroke={colors.sky[500]} strokeWidth="1" opacity="0.3" />
      <line x1="100" y1="20" x2="100" y2="120" stroke={colors.sky[500]} strokeWidth="1" opacity="0.3" />
      <circle cx="75" cy="55" r="6" fill={colors.grass[500]} opacity="0.8" />
      <circle cx="115" cy="80" r="6" fill={colors.grass[500]} opacity="0.8" />
      <circle cx="130" cy="50" r="5" fill={colors.tomato[300]} opacity="0.6" />
      <path d="M127 47 L133 53 M133 47 L127 53" stroke={colors.tomato[500]} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IllustrationAttention() {
  return (
    <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="55" y="30" width="90" height="80" rx="8" fill={colors.berry[100]} />
      <rect x="65" y="50" width="70" height="40" rx="4" fill="white" />
      <circle cx="100" cy="70" r="10" fill={colors.berry[500]} opacity="0.2" />
      <circle cx="100" cy="70" r="5" fill={colors.berry[500]} opacity="0.5" />
      <circle cx="100" cy="70" r="2" fill={colors.berry[700]} />
      {/* Pulse rings */}
      <circle cx="100" cy="70" r="18" fill="none" stroke={colors.berry[300]} strokeWidth="1" strokeDasharray="3 3" />
      <circle cx="100" cy="70" r="28" fill="none" stroke={colors.berry[300]} strokeWidth="0.75" strokeDasharray="3 3" opacity="0.5" />
      {/* Sparkline at bottom */}
      <polyline points="65,100 75,96 85,98 95,90 105,93 115,86 125,88 135,82" fill="none" stroke={colors.berry[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IllustrationPerformance() {
  return (
    <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Neural network nodes */}
      <circle cx="40" cy="40" r="8" fill={colors.orange[100]} stroke={colors.orange[500]} strokeWidth="1.5" />
      <circle cx="40" cy="70" r="8" fill={colors.orange[100]} stroke={colors.orange[500]} strokeWidth="1.5" />
      <circle cx="40" cy="100" r="8" fill={colors.orange[100]} stroke={colors.orange[500]} strokeWidth="1.5" />
      <circle cx="100" cy="50" r="10" fill={colors.orange[500]} opacity="0.2" stroke={colors.orange[500]} strokeWidth="1.5" />
      <circle cx="100" cy="90" r="10" fill={colors.orange[500]} opacity="0.2" stroke={colors.orange[500]} strokeWidth="1.5" />
      <circle cx="160" cy="70" r="12" fill={colors.orange[500]} />
      {/* Connections */}
      <line x1="48" y1="40" x2="90" y2="50" stroke={colors.orange[300]} strokeWidth="1" />
      <line x1="48" y1="40" x2="90" y2="90" stroke={colors.orange[200]} strokeWidth="1" />
      <line x1="48" y1="70" x2="90" y2="50" stroke={colors.orange[200]} strokeWidth="1" />
      <line x1="48" y1="70" x2="90" y2="90" stroke={colors.orange[300]} strokeWidth="1" />
      <line x1="48" y1="100" x2="90" y2="50" stroke={colors.orange[200]} strokeWidth="1" />
      <line x1="48" y1="100" x2="90" y2="90" stroke={colors.orange[300]} strokeWidth="1" />
      <line x1="110" y1="50" x2="148" y2="70" stroke={colors.orange[500]} strokeWidth="1.5" />
      <line x1="110" y1="90" x2="148" y2="70" stroke={colors.orange[500]} strokeWidth="1.5" />
      {/* Output arrow */}
      <path d="M165 70 L175 70" stroke={colors.orange[600]} strokeWidth="2" strokeLinecap="round" />
      <path d="M172 66 L177 70 L172 74" stroke={colors.orange[600]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IllustrationAuthenticAdvantage() {
  return (
    <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="35" width="65" height="70" rx="6" fill={colors.plum[100]} />
      <rect x="35" y="50" width="45" height="25" rx="3" fill={colors.plum[200]} opacity="0.5" />
      <rect x="35" y="82" width="45" height="4" rx="2" fill={colors.plum[200]} />
      <rect x="35" y="92" width="30" height="4" rx="2" fill={colors.plum[200]} opacity="0.5" />
      <rect x="110" y="35" width="65" height="70" rx="6" fill={colors.orange[100]} />
      <circle cx="142" cy="60" r="12" fill={colors.orange[500]} opacity="0.2" />
      <circle cx="142" cy="60" r="6" fill={colors.orange[500]} opacity="0.4" />
      <polyline points="120,90 130,85 140,88 150,78 160,82" fill="none" stroke={colors.orange[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Connection */}
      <path d="M93 70 L107 70" stroke={colors.plum[400]} strokeWidth="2" strokeDasharray="4 3" />
      <circle cx="100" cy="70" r="4" fill={colors.plum[500]} />
    </svg>
  );
}

function IllustrationStreamingTV() {
  return (
    <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* TV frame */}
      <rect x="35" y="20" width="130" height="85" rx="8" fill={colors.berry[100]} stroke={colors.berry[300]} strokeWidth="1.5" />
      <rect x="45" y="30" width="110" height="60" rx="4" fill="white" />
      {/* Content bars */}
      <rect x="55" y="40" width="40" height="20" rx="3" fill={colors.berry[500]} opacity="0.2" />
      <rect x="100" y="40" width="40" height="20" rx="3" fill={colors.berry[500]} opacity="0.15" />
      <rect x="55" y="65" width="85" height="4" rx="2" fill={colors.berry[200]} />
      <rect x="55" y="75" width="60" height="4" rx="2" fill={colors.berry[200]} opacity="0.5" />
      {/* TV stand */}
      <rect x="85" y="105" width="30" height="4" rx="2" fill={colors.berry[300]} />
      {/* Signal waves */}
      <path d="M170 50 C175 50, 178 55, 178 62 C178 69, 175 74, 170 74" fill="none" stroke={colors.berry[400]} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M175 45 C182 45, 186 55, 186 62 C186 69, 182 79, 175 79" fill="none" stroke={colors.berry[300]} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IllustrationAttribution() {
  return (
    <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Funnel / multi-touch paths */}
      <circle cx="40" cy="35" r="10" fill={colors.turquoise[100]} stroke={colors.turquoise[500]} strokeWidth="1.5" />
      <circle cx="40" cy="70" r="10" fill={colors.turquoise[100]} stroke={colors.turquoise[500]} strokeWidth="1.5" />
      <circle cx="40" cy="105" r="10" fill={colors.turquoise[100]} stroke={colors.turquoise[500]} strokeWidth="1.5" />
      {/* Paths converging */}
      <path d="M52 35 Q100 35 120 70" fill="none" stroke={colors.turquoise[400]} strokeWidth="1.5" />
      <path d="M52 70 L120 70" fill="none" stroke={colors.turquoise[400]} strokeWidth="1.5" />
      <path d="M52 105 Q100 105 120 70" fill="none" stroke={colors.turquoise[400]} strokeWidth="1.5" />
      {/* Convergence point */}
      <circle cx="125" cy="70" r="8" fill={colors.turquoise[500]} opacity="0.3" />
      <circle cx="125" cy="70" r="4" fill={colors.turquoise[700]} />
      {/* Output: bar chart */}
      <rect x="145" y="50" width="10" height="35" rx="2" fill={colors.turquoise[300]} />
      <rect x="160" y="40" width="10" height="45" rx="2" fill={colors.turquoise[500]} />
      <rect x="175" y="55" width="10" height="30" rx="2" fill={colors.turquoise[300]} />
      {/* Arrow */}
      <path d="M133 70 L140 70" stroke={colors.turquoise[500]} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const ILLUSTRATION_MAP: Record<string, React.FC> = {
  'fraud-lab': IllustrationFraudLab,
  'brand-suitability': IllustrationBrandSuitability,
  'viewability': IllustrationViewability,
  'geo-verification': IllustrationGeoVerification,
  'authentic-attention': IllustrationAttention,
  'scibids-ai': IllustrationPerformance,
  'authentic-advantage': IllustrationAuthenticAdvantage,
  'streaming-tv': IllustrationStreamingTV,
  'rockerbox': IllustrationAttribution,
};

// ─── Category Colors ────────────────────────────────────────

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string; pill: string }> = {
  protection: { bg: 'bg-plum-25', text: 'text-plum-700', border: 'border-plum-100', pill: 'bg-plum-100 text-plum-700' },
  performance: { bg: 'bg-orange-25', text: 'text-orange-700', border: 'border-orange-100', pill: 'bg-orange-100 text-orange-700' },
  measurement: { bg: 'bg-turquoise-25', text: 'text-turquoise-700', border: 'border-turquoise-300', pill: 'bg-turquoise-100 text-turquoise-700' },
};

// ─── Product Card ───────────────────────────────────────────

function ProductCard({ product, reason }: { product: DvProduct; reason?: { issue: string; howItHelps: string } }) {
  const Illustration = ILLUSTRATION_MAP[product.id];
  const catStyle = CATEGORY_STYLES[product.category];

  return (
    <div className="group rounded-xl border border-neutral-200 bg-white overflow-hidden transition-all hover:shadow-elevation-raised hover:border-neutral-300">
      {/* Recommendation reason banner */}
      {reason && (
        <div className="bg-plum-25 border-b border-plum-100 px-5 py-3 space-y-1.5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-orange-600 flex-shrink-0" />
            <span className="text-label font-semibold text-cool-800">{reason.issue}</span>
          </div>
          <div className="flex items-start gap-2">
            <Lightbulb className="h-3.5 w-3.5 text-plum-500 flex-shrink-0 mt-0.5" />
            <span className="text-label text-cool-600">{reason.howItHelps}</span>
          </div>
        </div>
      )}

      {/* Illustration */}
      <div className={cn('flex items-center justify-center py-6 px-8', catStyle.bg)}>
        {Illustration ? <Illustration /> : <div className="w-[200px] h-[140px]" />}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className={cn('px-2 py-0.5 rounded-full text-label font-medium', catStyle.pill)}>
            {DV_PRODUCT_CATEGORIES[product.category].label}
          </span>
        </div>
        <h3 className="text-body2 font-semibold text-cool-900 mb-1">{product.name}</h3>
        <p className="text-body3 text-cool-600 mb-3">{product.tagline}</p>
        <p className="text-label text-cool-500 mb-4 line-clamp-3">{product.description}</p>

        {/* Features */}
        <ul className="space-y-1.5 mb-4">
          {product.features.map(f => (
            <li key={f} className="flex items-start gap-2 text-label text-cool-600">
              <Check className="h-3.5 w-3.5 text-grass-600 flex-shrink-0 mt-0.5" />
              {f}
            </li>
          ))}
        </ul>

        <button className="flex items-center gap-1.5 text-body3 font-medium text-plum-600 transition-colors hover:text-plum-800 group-hover:gap-2">
          Learn more
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Marketplace Page ───────────────────────────────────────

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [search, setSearch] = useState('');

  // Read recommended product IDs and insight context from query params
  const recommendedIds = useMemo(() => {
    const param = searchParams.get('products');
    if (!param) return null;
    return param.split(',').filter(Boolean);
  }, [searchParams]);

  const insightReason = useMemo(() => {
    const insightId = searchParams.get('insight');
    if (!insightId) return null;
    return INSIGHT_REASONS[insightId] ?? null;
  }, [searchParams]);

  const clearRecommendations = () => {
    searchParams.delete('products');
    searchParams.delete('insight');
    setSearchParams(searchParams, { replace: true });
  };

  const filtered = useMemo(() => {
    let results = dvProducts;

    // If query param present, show only those products
    if (recommendedIds) {
      return results.filter(p => recommendedIds.includes(p.id));
    }

    if (filter !== 'all') {
      results = results.filter(p => p.category === filter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      results = results.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.features.some(f => f.toLowerCase().includes(q))
      );
    }
    return results;
  }, [filter, search, recommendedIds]);

  const filters: { value: CategoryFilter; label: string }[] = [
    { value: 'all', label: 'All Products' },
    { value: 'protection', label: 'Protection' },
    { value: 'performance', label: 'Performance' },
    { value: 'measurement', label: 'Measurement' },
  ];

  const showGrouped = !recommendedIds && filter === 'all' && !search.trim();

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-h4 text-cool-900">DV Marketplace</h1>
        <p className="text-body2 text-cool-500 mt-1 max-w-2xl">
          Explore DoubleVerify's complete suite of media effectiveness solutions. Protect quality, optimize performance, and measure outcomes across every channel.
        </p>
      </div>

      {/* Recommended Products Banner */}
      {recommendedIds && (
        <div className="flex items-center justify-between rounded-lg border border-plum-100 bg-plum-25 px-4 py-3 mb-6">
          <p className="text-body3 text-plum-700">
            <span className="font-semibold">Recommended for your campaign</span>
            <span className="text-plum-500"> — {filtered.length} product{filtered.length !== 1 ? 's' : ''} based on your diagnostics</span>
          </p>
          <button
            onClick={clearRecommendations}
            className="flex items-center gap-1.5 text-body3 font-medium text-plum-600 hover:text-plum-800 transition-colors"
          >
            View all products
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Filter Bar: Tabs + Search (hidden when showing recommendations) */}
      {!recommendedIds && (
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            {filters.map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  'px-4 py-2 rounded-lg text-body3 font-medium transition-colors',
                  filter === f.value
                    ? 'bg-plum-600 text-white'
                    : 'bg-neutral-25 text-cool-600 hover:bg-neutral-100 hover:text-cool-800'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cool-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-200 bg-white text-body3 text-cool-800 placeholder:text-cool-400 focus:outline-none focus:ring-2 focus:ring-plum-200 focus:border-plum-400 transition-colors"
            />
          </div>
        </div>
      )}

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-body2 text-cool-500">No products match your search.</p>
          <button
            onClick={() => { setSearch(''); setFilter('all'); clearRecommendations(); }}
            className="mt-2 text-body3 font-medium text-plum-600 hover:text-plum-800"
          >
            Clear filters
          </button>
        </div>
      ) : showGrouped ? (
        // Show grouped by category
        (['protection', 'performance', 'measurement'] as const).map(cat => {
          const catProducts = dvProducts.filter(p => p.category === cat);
          const catInfo = DV_PRODUCT_CATEGORIES[cat];
          return (
            <div key={cat} className="mb-10">
              <div className="mb-4">
                <h2 className="text-h5 font-semibold text-cool-900">{catInfo.label}</h2>
                <p className="text-body3 text-cool-500 mt-0.5">{catInfo.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {catProducts.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          );
        })
      ) : (
        // Filtered/searched/recommended view (flat grid)
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(p => <ProductCard key={p.id} product={p} reason={recommendedIds ? (insightReason ?? undefined) : undefined} />)}
        </div>
      )}
    </div>
  );
}
