import type { Platform } from './goal';

export interface PlatformConfig {
  id: Platform;
  label: string;
  color: string;
  bgColor: string;
  iconColor: string;
}

export const platformConfigs: Record<Platform, PlatformConfig> = {
  'open-web': { id: 'open-web', label: 'Open Web', color: 'text-cool-600', bgColor: 'bg-neutral-100', iconColor: '#5a5e78' },
  'meta': { id: 'meta', label: 'Meta', color: 'text-cool-600', bgColor: 'bg-neutral-100', iconColor: '#5a5e78' },
  'tiktok': { id: 'tiktok', label: 'TikTok', color: 'text-cool-600', bgColor: 'bg-neutral-100', iconColor: '#5a5e78' },
  'youtube': { id: 'youtube', label: 'YouTube', color: 'text-cool-600', bgColor: 'bg-neutral-100', iconColor: '#5a5e78' },
  'ctv': { id: 'ctv', label: 'CTV', color: 'text-cool-600', bgColor: 'bg-neutral-100', iconColor: '#5a5e78' },
  'snapchat': { id: 'snapchat', label: 'Snapchat', color: 'text-cool-600', bgColor: 'bg-neutral-100', iconColor: '#5a5e78' },
};
