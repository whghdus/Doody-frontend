import type { BackendCaptureDoodyResponse } from '@/shared/api/collectionPin';

/** A collection pin as rendered on the Connection map. */
export interface Institution {
  id: string;
  lat: number;
  lon: number;
  tags: { name: string };
  /** Index into the Doody image list (see mapDoodyIdToIndex). */
  doodyIndex: number;
  captureAvailable: boolean;
}

export type CaptureResult = Pick<BackendCaptureDoodyResponse['result'], 'collectedDudy' | 'reward'>;
