/**
 * Formatting utilities for BharosaCredit
 */

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const getEdgeCaseLabel = (code: string): string => {
  const labels: Record<string, string> = {
    'EC1': 'Seasonal Income Detected',
    'EC2': 'Rapid Bounce Recovery',
    'EC3': 'Borderline Score Review',
    'EC4': 'Hindi/Regional Data Cleanup',
    'EC5': 'Out-of-Domain Escalation',
    'EC6': 'LLM Failover Triggered',
    'EC2_RAPID_BOUNCE_RECOVERY': 'Automated Bounce Forgiveness'
  };
  return labels[code] || labels[code.split('_').slice(0, 1)[0]] || 'Complex Behavior Detected';
};

export const getEdgeCaseSeverity = (code: string): 'info' | 'warning' | 'critical' => {
  const severities: Record<string, 'info' | 'warning' | 'critical'> = {
    'EC1': 'warning',
    'EC2': 'info',
    'EC3': 'warning',
    'EC4': 'info',
    'EC5': 'critical',
    'EC6': 'warning'
  };
  return severities[code] || 'info';
};

export const getEdgeCaseDescription = (code: string): string => {
  const descriptions: Record<string, string> = {
    'EC1': 'Detected gaps in income consistent with seasonal agricultural cycles. Scoring adjusted forward.',
    'EC2': 'A bounce was recovered within 48 hours. Penalty reduced by 50% for discipline.',
    'EC3': 'Score is within the 50-60 borderline range. Triggered deeper behavioral inquiry.',
    'EC4': 'The Data Agent successfully mapped regional column names (दिनांक/राशि) to the core schema.',
    'EC5': 'The request was outside Bharosa\'s financial domain. Escalated to specialist.',
    'EC6': 'Primary LLM failed. Successfully rerouted to backup agent to maintain decision flow.',
    'EC2_RAPID_BOUNCE_RECOVERY': 'System detected a rapid recovery (within 48h) of a previous UPI bounce. Applied behavioral forgiveness.'
  };
  return descriptions[code] || descriptions[code.split('_').slice(0, 1)[0]] || 'The system autonomously adapted to a complex data pattern.';
};

export const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
