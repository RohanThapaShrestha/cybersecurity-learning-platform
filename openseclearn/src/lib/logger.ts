type LogLevel = 'INFO' | 'WARN' | 'ERROR';

function log(level: LogLevel, category: string, message: string, data?: Record<string, unknown>) {
  const timestamp = new Date().toISOString();
  const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
  console.log(`[${timestamp}] [${level}] [${category}] ${message}${dataStr}`);
}

export const logger = {
  auth: (message: string, data?: Record<string, unknown>) => log('INFO', 'AUTH', message, data),
  authWarn: (message: string, data?: Record<string, unknown>) => log('WARN', 'AUTH', message, data),
  admin: (message: string, data?: Record<string, unknown>) => log('INFO', 'ADMIN', message, data),
  error: (message: string, data?: Record<string, unknown>) => log('ERROR', 'APP', message, data),

  /** Log user deletion with full audit trail */
  deleteUser: (adminId: string, adminEmail: string, targetUserId: string, targetEmail: string) =>
    log('WARN', 'ADMIN', 'User deleted', {
      action: 'DELETE_USER',
      adminId,
      adminEmail,
      targetUserId,
      targetEmail,
      deletedAt: new Date().toISOString(),
    }),

  /** Log unauthorized access attempts */
  unauthorized: (message: string, data?: Record<string, unknown>) =>
    log('WARN', 'SECURITY', message, data),
};
