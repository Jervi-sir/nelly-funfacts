export interface Fact {
  id: string;
  content: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  location?: string | null;
  tags?: string[] | null;
  target: string;
  createdAt: number | Date;
  updatedAt?: number | Date | null;
}
