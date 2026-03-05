// Queue pour sync offline → online
export interface SyncOperation {
  id?: string
  operation: 'create' | 'update' | 'delete'
  tableName: string
  data: any
  userId?: string
  timestamp: number
  retryCount?: number
}

export class OfflineSyncQueue {
  private queue: SyncOperation[] = []
  private STORAGE_KEY = 'taskforce_sync_queue'
  private supabase: any

  constructor(supabaseClient: any) {
    this.supabase = supabaseClient
    this.loadQueue()
    this.setupOnlineListener()
  }

  // Load queue from localStorage
  private loadQueue() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        this.queue = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Error loading sync queue:', error)
      this.queue = []
    }
  }

  // Save queue to localStorage
  private saveQueue() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.queue))
    } catch (error) {
      console.error('Error saving sync queue:', error)
    }
  }

  // Setup online/offline listeners
  private setupOnlineListener() {
    window.addEventListener('online', () => {
      console.log('🌐 Back online - starting sync')
      this.syncWhenOnline()
    })

    window.addEventListener('offline', () => {
      console.log('📵 Gone offline - enabling queue mode')
    })
  }

  // Add operation to queue
  addToQueue(operation: Omit<SyncOperation, 'id' | 'timestamp'>) {
    const syncOp: SyncOperation = {
      ...operation,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retryCount: 0
    }

    if (navigator.onLine) {
      // Online: try direct sync first
      this.syncOperation(syncOp).then((success) => {
        if (!success) {
          this.queue.push(syncOp)
          this.saveQueue()
        }
      })
    } else {
      // Offline: queue immediately
      this.queue.push(syncOp)
      this.saveQueue()
    }
  }

  // Sync when back online
  async syncWhenOnline() {
    if (!navigator.onLine || this.queue.length === 0) return

    console.log(`🔄 Syncing ${this.queue.length} queued operations...`)

    const failedOps: SyncOperation[] = []

    for (const operation of this.queue) {
      try {
        const success = await this.syncOperation(operation)
        if (!success) {
          failedOps.push(operation)
        }
      } catch (error) {
        console.error('Sync operation failed:', error)
        failedOps.push(operation)
      }
    }

    // Update queue with failed operations
    this.queue = failedOps
    this.saveQueue()

    if (this.queue.length === 0) {
      console.log('✅ All operations synced successfully')
    } else {
      console.log(`⚠️ ${this.queue.length} operations failed to sync`)
    }
  }

  // Sync individual operation
  private async syncOperation(operation: SyncOperation): Promise<boolean> {
    try {
      const { operation: opType, tableName, data, userId } = operation

      switch (opType) {
        case 'create':
          const { error: createError } = await this.supabase
            .from(tableName)
            .insert({ ...data, user_id: userId })
          if (createError) throw createError
          break

        case 'update':
          const { error: updateError } = await this.supabase
            .from(tableName)
            .update(data)
            .eq('id', data.id)
          if (updateError) throw updateError
          break

        case 'delete':
          const { error: deleteError } = await this.supabase
            .from(tableName)
            .delete()
            .eq('id', data.id)
          if (deleteError) throw deleteError
          break

        default:
          throw new Error(`Unknown operation: ${opType}`)
      }

      console.log(`✅ Synced ${opType} operation on ${tableName}`)
      return true
    } catch (error) {
      console.error(`❌ Failed to sync ${operation.operation} on ${operation.tableName}:`, error)
      
      // Increment retry count
      operation.retryCount = (operation.retryCount || 0) + 1
      
      // If too many retries, give up
      if (operation.retryCount > 3) {
        console.error(`🚫 Max retries exceeded for operation:`, operation)
        return false
      }
      
      return false
    }
  }

  // Get queue status
  getQueueStatus() {
    return {
      length: this.queue.length,
      isOnline: navigator.onLine,
      operations: this.queue
    }
  }

  // Clear queue (for testing/debugging)
  clearQueue() {
    this.queue = []
    this.saveQueue()
  }

  // Manual sync trigger
  async manualSync() {
    await this.syncWhenOnline()
  }
}

// Singleton instance
let syncQueueInstance: OfflineSyncQueue | null = null

export function getSyncQueue(supabaseClient: any): OfflineSyncQueue {
  if (!syncQueueInstance) {
    syncQueueInstance = new OfflineSyncQueue(supabaseClient)
  }
  return syncQueueInstance
}

// Helper functions for common operations
export const syncHelpers = {
  // Add client to queue
  addClient: (clientData: any, userId: string, queue: OfflineSyncQueue) => {
    queue.addToQueue({
      operation: 'create',
      tableName: 'clients',
      data: clientData,
      userId
    })
  },

  // Update client in queue
  updateClient: (clientData: any, userId: string, queue: OfflineSyncQueue) => {
    queue.addToQueue({
      operation: 'update',
      tableName: 'clients',
      data: clientData,
      userId
    })
  },

  // Add visit to queue
  addVisit: (visitData: any, userId: string, queue: OfflineSyncQueue) => {
    queue.addToQueue({
      operation: 'create',
      tableName: 'visits',
      data: visitData,
      userId
    })
  },

  // Update visit in queue
  updateVisit: (visitData: any, userId: string, queue: OfflineSyncQueue) => {
    queue.addToQueue({
      operation: 'update',
      tableName: 'visits',
      data: visitData,
      userId
    })
  }
}
