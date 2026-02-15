export interface DvProduct {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: 'protection' | 'performance' | 'measurement';
  features: string[];
  color: string;
}

export const DV_PRODUCT_CATEGORIES = {
  protection: { label: 'Protection', description: 'Shield your campaigns from fraud, unsafe content, and off-target delivery.' },
  performance: { label: 'Performance', description: 'Optimize bidding and delivery with AI-powered algorithms.' },
  measurement: { label: 'Measurement', description: 'Quantify campaign quality, attention, and business outcomes.' },
} as const;

export const dvProducts: DvProduct[] = [
  // ─── Protection ─────────────────────────────────────────────
  {
    id: 'fraud-lab',
    name: 'DV Fraud Lab',
    tagline: 'Block fraud before it reaches your supply path.',
    description: 'Our team of data scientists and cybersecurity analysts use machine learning and manual review to detect fraud in real time. MRC-accredited across desktop, mobile, and CTV for invalid traffic detection.',
    category: 'protection',
    features: ['Pre-bid IVT segments', 'Real-time fraud detection', 'MRC-accredited across all environments', 'Covers SIVT and GIVT'],
    color: 'plum',
  },
  {
    id: 'brand-suitability',
    name: 'Authentic Brand Suitability',
    tagline: 'Protect your brand with content-level controls.',
    description: 'Create centralized brand safety controls and automatically deploy them across programmatic buying platforms. Over 90 unique brand suitability tier settings for precise content alignment.',
    category: 'protection',
    features: ['90+ suitability tier settings', 'Centralized controls across platforms', 'Content-level classification', 'Custom avoidance categories'],
    color: 'turquoise',
  },
  {
    id: 'geo-verification',
    name: 'In-Geo Verification',
    tagline: 'Verify ads are served in your target geography.',
    description: 'Pre-bid geo avoidance segments block impressions served outside your intended regions. Post-bid verification confirms geographic delivery accuracy.',
    category: 'protection',
    features: ['Pre-bid geo avoidance', 'Post-bid geo verification', 'Country and region targeting', 'Off-geo waste reporting'],
    color: 'sky',
  },

  // ─── Performance ────────────────────────────────────────────
  {
    id: 'scibids-ai',
    name: 'DV Performance',
    tagline: 'AI-powered bidding that maximizes campaign ROI.',
    description: 'Custom bidding algorithms generated at the impression level using pricing data, first-party data, and third-party measurement. Platform-agnostic and fully transparent.',
    category: 'performance',
    features: ['Custom bidding algorithms', 'Impression-level optimization', 'Platform-agnostic deployment', 'Transparent decision-making'],
    color: 'orange',
  },
  {
    id: 'authentic-advantage',
    name: 'DV Authentic AdVantage',
    tagline: 'Quality + optimization unified for walled gardens.',
    description: 'Combines trusted media quality controls with DV Performance to drive superior outcomes across proprietary video platforms and walled garden environments.',
    category: 'performance',
    features: ['Walled garden optimization', 'Quality + performance unified', 'Proprietary video platforms', 'Brand equity safeguards'],
    color: 'plum',
  },
  {
    id: 'streaming-tv',
    name: 'DV Authentic Streaming TV',
    tagline: 'Transparency and performance for CTV advertising.',
    description: 'Unifies premium content discovery, reporting, analytics, and optimization into a single CTV workflow. Program-level signals with attention indicators and power-state awareness.',
    category: 'performance',
    features: ['Program-level content signals', 'Drag-and-drop optimization', 'Attention and power-state awareness', 'Dynamic spend optimization'],
    color: 'berry',
  },

  // ─── Measurement ────────────────────────────────────────────
  {
    id: 'viewability',
    name: 'DV Viewability',
    tagline: 'Ensure your ads have the opportunity to be seen.',
    description: 'MRC-accredited viewability measurement across display, video, and CTV. Pre-bid viewability segments let you target inventory with proven viewability rates.',
    category: 'measurement',
    features: ['MRC-accredited measurement', 'Pre-bid viewability segments', 'Display, video, and CTV coverage', 'Custom viewability thresholds'],
    color: 'grass',
  },
  {
    id: 'authentic-attention',
    name: 'DV Authentic Attention',
    tagline: 'Measure and optimize for real human attention.',
    description: 'Go beyond viewability with attention-based metrics that measure exposure and engagement. Combine with DV Performance to optimize toward attentive reach.',
    category: 'measurement',
    features: ['Exposure and engagement signals', 'Pre-bid attention segments', 'Cookieless measurement', 'Attention-based optimization'],
    color: 'berry',
  },
  {
    id: 'rockerbox',
    name: 'DV Attribution',
    tagline: 'Unified marketing measurement and attribution.',
    description: 'Multi-Touch Attribution, Marketing Mix Modeling, and Incrementality Testing in one platform. Data-driven insights that improve future planning and budget allocation.',
    category: 'measurement',
    features: ['Multi-Touch Attribution (MTA)', 'Marketing Mix Modeling (MMM)', 'Incrementality Testing', 'Cross-channel measurement'],
    color: 'turquoise',
  },
];
