export type StepType = 'trigger' | 'action' | 'condition' | 'llm';

export interface Workflow {
  id: string;
  name: string;
  enabled: boolean;
  triggerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Trigger {
  id: string;
  type: 'webhook' | 'schedule' | 'event';
  config: Record<string, any>;
}

export interface Step {
  id: string;
  workflowId: string;
  type: StepType;
  parentId?: string;
  config: Record<string, any>;
  order: number;
}

export interface ExecutionLog {
  id: string;
  workflowId: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  startedAt: Date;
  finishedAt?: Date;
  error?: string;
  trace: Record<string, any>;
}
