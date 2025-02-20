"use client"

import { useState, useEffect } from "react"
import { useAtom } from "jotai"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { BrainCog, Plus, ListTodo, Users, MessageSquare, Calendar } from "lucide-react"
import { tasks, Task } from "@/lib/api"
import { userAtom } from "@/lib/atoms"
import { format } from "date-fns"

export default function DashboardPage() {
  const [user] = useAtom(userAtom)
  const [taskList, setTaskList] = useState<Task[]>([])
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "pending"
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const { data } = await tasks.getAll()
      setTaskList(data || [])
      setError("")
    } catch (error: any) {
      setError("Failed to fetch tasks. Please try again.")
    }
  }

  const validateTask = () => {
    if (!newTask.title.trim()) {
      setError("Task title is required")
      return false
    }
    if (!newTask.dueDate) {
      setError("Due date is required")
      return false
    }
    return true
  }

  const handleCreateTask = async () => {
    try {
      setError("")
      
      if (!validateTask()) {
        return
      }

      const taskData = {
        ...newTask,
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        status: "pending"
      }

      const { data } = await tasks.create(taskData)
      
      if (!data) {
        throw new Error("Failed to create task")
      }

      setTaskList([...taskList, data])
      setNewTask({ title: "", description: "", dueDate: "", status: "pending" })
      setIsDialogOpen(false)
      setError("")
    } catch (error: any) {
      console.error("Task creation failed:", error)
      const errorMessage = error.response?.data?.error || 
                         error.response?.data?.message ||
                         error.message ||
                         "Failed to create task. Please try again."
      setError(errorMessage)
    }
  }

  const handleUpdateStatus = async (taskId: number, newStatus: string) => {
    try {
      setError("")
      const { data } = await tasks.update(taskId, { status: newStatus })
      setTaskList(taskList.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ))
    } catch (error: any) {
      setError("Failed to update task status. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BrainCog className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">TaskAI</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {user?.email}
              </span>
              <Button variant="ghost">Sign Out</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-[240px_1fr]">
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <ListTodo className="mr-2 h-4 w-4" />
              Tasks
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Team
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <MessageSquare className="mr-2 h-4 w-4" />
              AI Assistant
            </Button>
          </nav>

          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Tasks</h2>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {error && (
                      <div className="text-sm text-red-500 bg-red-50 p-2 rounded-md border border-red-200">
                        {error}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Input
                        placeholder="Task title"
                        value={newTask.title}
                        onChange={(e) => {
                          setNewTask({ ...newTask, title: e.target.value })
                          setError("")
                        }}
                        className="focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Task description (optional)"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        className="focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => {
                          setNewTask({ ...newTask, dueDate: e.target.value })
                          setError("")
                        }}
                        className="focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <Button 
                      onClick={handleCreateTask}
                      className="w-full transition-all duration-200 hover:opacity-90"
                    >
                      Create Task
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {error && !isDialogOpen && (
              <div className="text-sm text-red-500 bg-red-50 p-2 rounded-md border border-red-200">
                {error}
              </div>
            )}

            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Tasks</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                {taskList.length === 0 ? (
                  <Card className="p-8 text-center text-muted-foreground">
                    No tasks yet. Click "New Task" to create one.
                  </Card>
                ) : (
                  taskList.map((task) => (
                    <Card key={task.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {task.description}
                          </p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Due: {format(new Date(task.dueDate), 'PPP')}</span>
                          </div>
                        </div>
                        <Button
                          variant={task.status === 'completed' ? 'secondary' : 'outline'}
                          size="sm"
                          onClick={() => handleUpdateStatus(task.id, 
                            task.status === 'completed' ? 'pending' : 'completed'
                          )}
                        >
                          {task.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </TabsContent>
              <TabsContent value="pending" className="space-y-4">
                {taskList.filter(task => task.status === 'pending').length === 0 ? (
                  <Card className="p-8 text-center text-muted-foreground">
                    No pending tasks.
                  </Card>
                ) : (
                  taskList.filter(task => task.status === 'pending').map((task) => (
                    <Card key={task.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {task.description}
                          </p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Due: {format(new Date(task.dueDate), 'PPP')}</span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(task.id, 'completed')}
                        >
                          Mark Complete
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </TabsContent>
              <TabsContent value="completed" className="space-y-4">
                {taskList.filter(task => task.status === 'completed').length === 0 ? (
                  <Card className="p-8 text-center text-muted-foreground">
                    No completed tasks.
                  </Card>
                ) : (
                  taskList.filter(task => task.status === 'completed').map((task) => (
                    <Card key={task.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {task.description}
                          </p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Due: {format(new Date(task.dueDate), 'PPP')}</span>
                          </div>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleUpdateStatus(task.id, 'pending')}
                        >
                          Mark Pending
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}