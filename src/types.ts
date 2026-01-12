export interface Fact {
  id: string;
  content: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  location?: string | null;
  createdAt: number | Date;
  updatedAt?: number | Date | null;
}
