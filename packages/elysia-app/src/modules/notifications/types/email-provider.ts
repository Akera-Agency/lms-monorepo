export interface EmailProvider {
  send(p: {
    to: string;
    subject: string;
    html?: string;
    text?: string;
    from?: string;
    replyTo?: string;
  }): Promise<{ providerId?: string }>;
}
