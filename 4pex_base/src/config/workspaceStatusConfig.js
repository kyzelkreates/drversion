// 4P3X Workspace Status Config — Run 6

export const WORKSPACE_STATUSES = [
  {
    id: 'planning',
    label: 'Planning',
    description: 'Workspace is being set up. Blueprint and transformation plan are not yet linked.',
    isActive: true,
    isBlocked: false,
    allowsPromptGeneration: false,
    allowsBuildTracking: false,
    allowsArchive: true,
    displayPriority: 1,
    colorClass: 'status-planning',
    color: '#9ca3af',
  },
  {
    id: 'ready_for_build_prompt',
    label: 'Ready for Build Prompt',
    description: 'Blueprint and transformation plan are linked. Ready to generate run prompts.',
    isActive: true,
    isBlocked: false,
    allowsPromptGeneration: true,
    allowsBuildTracking: false,
    allowsArchive: true,
    displayPriority: 2,
    colorClass: 'status-ready',
    color: '#22c55e',
  },
  {
    id: 'in_progress',
    label: 'In Progress',
    description: 'Active build run is underway for this product variant.',
    isActive: true,
    isBlocked: false,
    allowsPromptGeneration: true,
    allowsBuildTracking: true,
    allowsArchive: false,
    displayPriority: 3,
    colorClass: 'status-in-progress',
    color: '#f59e0b',
  },
  {
    id: 'blocked',
    label: 'Blocked',
    description: 'Build is blocked by one or more unresolved critical issues.',
    isActive: false,
    isBlocked: true,
    allowsPromptGeneration: false,
    allowsBuildTracking: true,
    allowsArchive: true,
    displayPriority: 4,
    colorClass: 'status-blocked',
    color: '#ef4444',
  },
  {
    id: 'paused',
    label: 'Paused',
    description: 'Build work has been intentionally paused. Can resume later.',
    isActive: false,
    isBlocked: false,
    allowsPromptGeneration: true,
    allowsBuildTracking: true,
    allowsArchive: true,
    displayPriority: 5,
    colorClass: 'status-paused',
    color: '#8b5cf6',
  },
  {
    id: 'completed',
    label: 'Completed',
    description: 'All planned build runs for this variant are complete.',
    isActive: false,
    isBlocked: false,
    allowsPromptGeneration: false,
    allowsBuildTracking: false,
    allowsArchive: true,
    displayPriority: 6,
    colorClass: 'status-completed',
    color: '#d97706',
  },
  {
    id: 'archived',
    label: 'Archived',
    description: 'Workspace has been archived. Preserved for reference but not active.',
    isActive: false,
    isBlocked: false,
    allowsPromptGeneration: false,
    allowsBuildTracking: false,
    allowsArchive: false,
    displayPriority: 7,
    colorClass: 'status-archived',
    color: '#4b5563',
  },
];

export function getStatusConfig(statusId) {
  return WORKSPACE_STATUSES.find((s) => s.id === statusId) || null;
}

export function getActiveStatuses() {
  return WORKSPACE_STATUSES.filter((s) => s.isActive);
}

export function getStatusLabel(statusId) {
  return getStatusConfig(statusId)?.label || statusId;
}

export function getStatusColor(statusId) {
  return getStatusConfig(statusId)?.color || '#9ca3af';
}

export default WORKSPACE_STATUSES;
