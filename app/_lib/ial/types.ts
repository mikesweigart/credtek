// Integration Abstraction Layer — interface contracts.
// Mirrors §3 of the IAL spec. Every external action a coordinator
// triggers from CredTek goes through one uniform interface, regardless
// of whether the work is performed by an HTTP API call, a browser
// agent, or a human credentialing specialist.

export type IntegrationTier =
  | "tier_1_api"
  | "tier_2_partner"
  | "tier_3_browser"
  | "tier_4_human";

export type IntegrationStatus =
  | "drafted"
  | "awaiting_approval"
  | "submitted"
  | "in_progress"
  | "awaiting_info"
  | "completed"
  | "failed"
  | "cancelled";

export type ActorType = "system" | "user" | "agent" | "specialist";

export interface IntegrationJob {
  id: string;
  tenantId: string;
  integrationType: string;
  tier: IntegrationTier;
  providerId: string;
  status: IntegrationStatus;
  payload: Record<string, unknown>;
  result: Record<string, unknown> | null;
  eta: Date | null;
  submittedAt: Date | null;
  completedAt: Date | null;
  createdBy: string;
  costCents: number;
  metadata: {
    confidenceScore?: number;
    attempts: number;
    lastError?: string;
    assignedTo?: string;
    externalReference?: string;
  };
  auditLogId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ValidationResult {
  valid: boolean;
  errors: { field: string; message: string }[];
  warnings: { field: string; message: string }[];
}

export interface SubmitResult {
  success: boolean;
  externalReference?: string;
  initialStatus: IntegrationStatus;
  initialEta: Date;
  error?: string;
}

export interface StatusResult {
  status: IntegrationStatus;
  updatedEta: Date | null;
  notes?: string;
}

export interface ResultData {
  data: Record<string, unknown>;
  confidenceScore?: number;
  documents?: { name: string; storageKey: string }[];
}

export interface CancelResult {
  success: boolean;
  refundCents?: number;
  error?: string;
}

export interface InputSchemaField {
  name: string;
  type: "string" | "number" | "boolean" | "date" | "enum";
  required: boolean;
  description: string;
  enumValues?: string[];
}

export interface InputSchema {
  fields: InputSchemaField[];
}

/** Every integration MUST implement this interface. */
export interface IntegrationProvider {
  type: string;
  tier: IntegrationTier;
  displayName: string;
  description: string;

  // Lifecycle methods
  validate(payload: unknown): Promise<ValidationResult>;
  submit(job: IntegrationJob): Promise<SubmitResult>;
  checkStatus(job: IntegrationJob): Promise<StatusResult>;
  getResult(job: IntegrationJob): Promise<ResultData>;
  cancel(job: IntegrationJob): Promise<CancelResult>;

  // Metadata for UI and ops
  estimatedTurnaroundHours(): number;
  costEstimateCents(payload: unknown): number;
  requiredInputs(): InputSchema;
  requiredDocuments(): string[];
}

// ---------------------------------------------------------------------
// Audit log
// ---------------------------------------------------------------------

export type AuditAction =
  | "view"
  | "edit"
  | "submit"
  | "approve"
  | "reject"
  | "auth"
  | "transition"
  | "external_call"
  | "create"
  | "delete";

export interface AuditEntry {
  id: string;
  tenantId: string | null;
  actorId: string | null;
  actorType: ActorType;
  actorIp: string | null;
  resourceType: string;
  resourceId: string;
  action: AuditAction;
  beforeState: Record<string, unknown> | null;
  afterState: Record<string, unknown> | null;
  metadata: Record<string, unknown>;
  prevLogHash: string | null;
  logHash: string;
  createdAt: Date;
}
