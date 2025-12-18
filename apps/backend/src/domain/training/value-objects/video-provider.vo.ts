export type VideoProviderType = 's3' | 'cloudflare' | 'youtube' | 'external';

export class VideoProvider {
  private readonly value: VideoProviderType;

  constructor(provider: VideoProviderType | string) {
    if (!VideoProvider.isValid(provider)) {
      throw new Error(
        `Invalid video provider: ${provider}. Must be 's3', 'cloudflare', 'youtube', or 'external'`,
      );
    }
    this.value = provider as VideoProviderType;
  }

  static isValid(provider: string | VideoProviderType): provider is VideoProviderType {
    return ['s3', 'cloudflare', 'youtube', 'external'].includes(provider);
  }

  getValue(): VideoProviderType {
    return this.value;
  }

  equals(other: VideoProvider): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
