const AUTOMATION_BASE = 'https://am-prem.vxz.my.id/api';

export class CatchmailAutomationClient {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.AUTOMATION_PREM_API_KEY || '';
  }

  async triggerSend(targetEmail: string): Promise<{ success: boolean; responseText: string }> {
    try {
      const endpointUrl = `${AUTOMATION_BASE}/send?apikey=${encodeURIComponent(this.apiKey)}&email=${encodeURIComponent(targetEmail)}&apply=true`;
      const response = await fetch(endpointUrl, { method: 'GET' });
      const rawText = await response.text();
      return { success: response.status === 200, responseText: rawText };
    } catch (error: any) {
      return { success: false, responseText: error?.message || 'Automation proxy failure during dispatch.' };
    }
  }

  async triggerVerify(verificationLink: string): Promise<{ success: boolean; responseText: string }> {
    try {
      const endpointUrl = `${AUTOMATION_BASE}/verify?apikey=${encodeURIComponent(this.apiKey)}&link=${encodeURIComponent(verificationLink)}&apply=true`;
      const response = await fetch(endpointUrl, { method: 'GET' });
      const rawText = await response.text();
      return { success: response.status === 200, responseText: rawText };
    } catch (error: any) {
      return { success: false, responseText: error?.message || 'Automation verification execution failure.' };
    }
  }
}

export const catchmailAutomation = new CatchmailAutomationClient();
