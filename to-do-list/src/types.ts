export type Priority = 'high' | 'medium' | 'low'

export interface Task {
  id: number
  text: string
  done: boolean
  priority: Priority
}

export type Filter = 'all' | 'active' | 'done'
