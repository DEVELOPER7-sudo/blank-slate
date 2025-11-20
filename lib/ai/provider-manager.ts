// Puter AI Provider Manager
// All AI calls now go through Puter's API via the browser

type ProviderName = 'puter';

export class ProviderManager {
  static getProvider(providerName: ProviderName = 'puter') {
    if (providerName !== 'puter') {
      throw new Error('Only Puter provider is supported');
    }
    
    return {
      type: 'puter',
      baseURL: 'https://puter.com/api/v1',
      model: 'gpt-5-nano',
    };
  }

  static getConfig(provider: ProviderName = 'puter') {
    switch (provider) {
      case 'puter':
        return {
          apiKey: 'public', // Puter uses public access
          baseURL: 'https://puter.com/api/v1',
        };
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  static listAvailableProviders() {
    return ['puter'];
  }
}

export default ProviderManager;
