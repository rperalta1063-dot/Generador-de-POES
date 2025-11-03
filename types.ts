export type Role = 'operator' | 'verifier' | 'auditor' | 'admin';
export type PoeStatus = 'approved' | 'pending' | 'rejected' | 'draft';

export interface User {
    id: number;
    username: string;
    email: string;
    password?: string;
    role: Role;
    registered: string;
    active: boolean;
}

export interface Step {
    id: number;
    name: string;
    text: string;
    image?: string | null;
}

export interface Attachment {
    name: string;
    url: string;
}

export interface VersionRecord {
    version: number;
    changedBy: string;
    changeDate: string;
    changes: string;
}

export interface Responsibility {
    id: number;
    cargo: string;
    responsabilidad: string;
}

export interface POE {
    id: number;
    establishment: string;
    code: string;
    title: string;
    applicationArea: string;
    responsibilities: Responsibility[];
    frequency: string[];
    objective: string;
    scope: string;
    productsAndMaterials: string;
    description: string;
    safetyInstructions: string;
    verification: string;
    correctiveActions: string;
    steps: Step[];
    attachments: Attachment[];
    status: PoeStatus;
    version: number;
    createdBy: string;
    createdAt: string;
    approvedBy: string | null;
    approvedAt: string | null;
    history: VersionRecord[];
}

export interface AuditLog {
    id: number;
    timestamp: string;
    user: string;
    action: string;
    details: string;
}

export interface ToastNotification {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
}