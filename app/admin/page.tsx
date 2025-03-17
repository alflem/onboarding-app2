"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle, Save, Trash2, ChevronUp, ChevronDown, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OnboardingAccordion } from "@/components/onboarding-accordion"

// Initial data structure matching our onboarding component
const initialSteps = [
  {
    id: "profile",
    title: "Complete your profile",
    content: "Add your personal information, profile picture, and contact details to get started.",
    items: [
      { id: "personal-info", label: "Personal information" },
      { id: "profile-picture", label: "Profile picture" },
      { id: "contact-details", label: "Contact details" },
    ],
  },
  {
    id: "preferences",
    title: "Set your preferences",
    content: "Customize your experience by setting your preferences and notification settings.",
    items: [
      { id: "theme", label: "Choose theme" },
      { id: "notifications", label: "Notification settings" },
      { id: "language", label: "Language preference" },
    ],
  },
  {
    id: "connect",
    title: "Connect your accounts",
    content: "Link your social media and other accounts to enhance your experience.",
    items: [
      { id: "google", label: "Google account" },
      { id: "github", label: "GitHub account" },
      { id: "linkedin", label: "LinkedIn profile" },
    ],
  },
]

// In a real app, you would fetch this from an API and save changes to a database
// For this demo, we'll use localStorage to persist changes

export default function AdminPage() {
  const [steps, setSteps] = useState(initialSteps)
  const [activeTab, setActiveTab] = useState("categories")
  const router = useRouter()

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedSteps = localStorage.getItem("onboardingSteps")
    if (savedSteps) {
      try {
        setSteps(JSON.parse(savedSteps))
      } catch (e) {
        console.error("Failed to parse saved steps", e)
      }
    }
  }, [])

  // Save changes to localStorage
  const saveChanges = () => {
    localStorage.setItem("onboardingSteps", JSON.stringify(steps))
    alert("Changes saved successfully!")
  }

  // Generate a unique ID
  const generateId = (base: string) => {
    return `${base}-${Math.random().toString(36).substring(2, 9)}`
  }

  // Add a new category
  const addCategory = (newCategory: { title: string; content: string }) => {
    const id = generateId("category")
    setSteps([
      ...steps,
      {
        id,
        title: newCategory.title,
        content: newCategory.content,
        items: [],
      },
    ])
  }

  // Update a category
  const updateCategory = (id: string, updates: { title?: string; content?: string }) => {
    setSteps(
      steps.map((step) =>
        step.id === id
          ? {
              ...step,
              ...updates,
            }
          : step,
      ),
    )
  }

  // Delete a category
  const deleteCategory = (id: string) => {
    setSteps(steps.filter((step) => step.id !== id))
  }

  // Add a new item to a category
  const addItem = (categoryId: string, label: string) => {
    setSteps(
      steps.map((step) =>
        step.id === categoryId
          ? {
              ...step,
              items: [...step.items, { id: generateId("item"), label }],
            }
          : step,
      ),
    )
  }

  // Update an item
  const updateItem = (categoryId: string, itemId: string, label: string) => {
    setSteps(
      steps.map((step) =>
        step.id === categoryId
          ? {
              ...step,
              items: step.items.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      label,
                    }
                  : item,
              ),
            }
          : step,
      ),
    )
  }

  // Delete an item
  const deleteItem = (categoryId: string, itemId: string) => {
    setSteps(
      steps.map((step) =>
        step.id === categoryId
          ? {
              ...step,
              items: step.items.filter((item) => item.id !== itemId),
            }
          : step,
      ),
    )
  }

  // Move category up or down
  const moveCategory = (id: string, direction: "up" | "down") => {
    const index = steps.findIndex((step) => step.id === id)
    if ((direction === "up" && index === 0) || (direction === "down" && index === steps.length - 1)) {
      return // Can't move further
    }

    const newSteps = [...steps]
    const newIndex = direction === "up" ? index - 1 : index + 1
    const [movedCategory] = newSteps.splice(index, 1)
    newSteps.splice(newIndex, 0, movedCategory)
    setSteps(newSteps)
  }

  // Move item up or down within a category
  const moveItem = (categoryId: string, itemId: string, direction: "up" | "down") => {
    setSteps(
      steps.map((step) => {
        if (step.id !== categoryId) return step

        const items = [...step.items]
        const index = items.findIndex((item) => item.id === itemId)
        if ((direction === "up" && index === 0) || (direction === "down" && index === items.length - 1)) {
          return step // Can't move further
        }

        const newIndex = direction === "up" ? index - 1 : index + 1
        const [movedItem] = items.splice(index, 1)
        items.splice(newIndex, 0, movedItem)

        return {
          ...step,
          items,
        }
      }),
    )
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Onboarding Checklist Admin</h1>
        <div className="flex gap-4">
          <Button onClick={() => router.push("/")}>View Public Page</Button>
          <Button onClick={saveChanges} className="bg-green-600 hover:bg-green-700">
            <Save className="mr-2 h-4 w-4" /> Save All Changes
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-6">
          {/* Add New Category */}
          <CategoryForm onSubmit={addCategory} />

          {/* List of Categories */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <Card key={step.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{step.title}</CardTitle>
                      <CardDescription className="mt-1">{step.content}</CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => moveCategory(step.id, "up")}
                        disabled={index === 0}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => moveCategory(step.id, "down")}
                        disabled={index === steps.length - 1}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <EditCategoryDialog category={step} onSave={(updates) => updateCategory(step.id, updates)} />
                      <DeleteDialog
                        title="Delete Category"
                        description="Are you sure you want to delete this category? All items within it will also be deleted."
                        onConfirm={() => deleteCategory(step.id)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="text-sm font-medium mb-2">Items ({step.items.length})</h3>
                  <div className="space-y-2">
                    {step.items.map((item, itemIndex) => (
                      <div key={item.id} className="flex items-center justify-between p-2 border rounded-md">
                        <span>{item.label}</span>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moveItem(step.id, item.id, "up")}
                            disabled={itemIndex === 0}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moveItem(step.id, item.id, "down")}
                            disabled={itemIndex === step.items.length - 1}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                          <EditItemDialog item={item} onSave={(label) => updateItem(step.id, item.id, label)} />
                          <DeleteDialog
                            title="Delete Item"
                            description="Are you sure you want to delete this item?"
                            onConfirm={() => deleteItem(step.id, item.id)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <AddItemDialog onAdd={(label) => addItem(step.id, label)} />
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Onboarding Preview</CardTitle>
              <CardDescription>This is how your onboarding checklist will appear to users</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminPreview steps={steps} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Form for adding a new category
function CategoryForm({
  onSubmit,
  initialData,
}: {
  onSubmit: (data: { title: string; content: string }) => void
  initialData?: { title: string; content: string }
}) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [content, setContent] = useState(initialData?.content || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({ title, content })
    if (!initialData) {
      setTitle("")
      setContent("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Category Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter category title"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Description</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter category description"
          rows={3}
        />
      </div>
      <Button type="submit" className="w-full">
        <PlusCircle className="mr-2 h-4 w-4" />
        {initialData ? "Update Category" : "Add New Category"}
      </Button>
    </form>
  )
}

// Dialog for editing a category
function EditCategoryDialog({
  category,
  onSave,
}: {
  category: { title: string; content: string }
  onSave: (updates: { title: string; content: string }) => void
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>Make changes to the category details.</DialogDescription>
        </DialogHeader>
        <CategoryForm onSubmit={onSave} initialData={category} />
      </DialogContent>
    </Dialog>
  )
}

// Dialog for adding a new item
function AddItemDialog({ onAdd }: { onAdd: (label: string) => void }) {
  const [label, setLabel] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!label.trim()) return
    onAdd(label)
    setLabel("")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Item
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogDescription>Add a new checklist item to this category.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="item-label">Item Label</Label>
            <Input
              id="item-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter item label"
              required
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Add Item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Dialog for editing an item
function EditItemDialog({
  item,
  onSave,
}: {
  item: { label: string }
  onSave: (label: string) => void
}) {
  const [label, setLabel] = useState(item.label)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!label.trim()) return
    onSave(label)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>Update the checklist item.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-item-label">Item Label</Label>
            <Input
              id="edit-item-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter item label"
              required
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Update Item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Confirmation dialog for deleting items
function DeleteDialog({
  title,
  description,
  onConfirm,
}: {
  title: string
  description: string
  onConfirm: () => void
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-100">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Preview component that uses our actual OnboardingAccordion
function AdminPreview({ steps }: { steps: typeof initialSteps }) {
  // We need to update the onboardingSteps in the OnboardingAccordion component
  // In a real app, this would be handled through a context or state management
  useEffect(() => {
    // This is a hack for demo purposes - in a real app you'd use proper state management
    // @ts-ignore - Accessing the component's internal variable
    window.onboardingSteps = steps
  }, [steps])

  return (
    <div className="max-w-md mx-auto">
      <OnboardingAccordion />
    </div>
  )
}

