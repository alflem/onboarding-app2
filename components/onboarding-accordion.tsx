"use client"

import { useState, useEffect } from "react"
import { Check } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

// Make this accessible to the admin preview
declare global {
  interface Window {
    onboardingSteps?: any[]
  }
}

// Default onboarding steps
const defaultSteps = [
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

export function OnboardingAccordion() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [expandedItem, setExpandedItem] = useState<string | null>("profile")
  const [onboardingSteps, setOnboardingSteps] = useState(defaultSteps)

  // Load steps from localStorage or use the window.onboardingSteps (for admin preview)
  useEffect(() => {
    // First check if we have steps from the admin preview
    if (window.onboardingSteps) {
      setOnboardingSteps(window.onboardingSteps)
      return
    }

    // Otherwise try to load from localStorage
    const savedSteps = localStorage.getItem("onboardingSteps")
    if (savedSteps) {
      try {
        setOnboardingSteps(JSON.parse(savedSteps))
      } catch (e) {
        console.error("Failed to parse saved steps", e)
      }
    }
  }, [])

  const handleCheckboxChange = (stepId: string, itemId: string) => {
    const key = `${stepId}-${itemId}`
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const getStepProgress = (stepId: string) => {
    const stepItems = onboardingSteps.find((step) => step.id === stepId)?.items || []
    const checkedCount = stepItems.filter((item) => checkedItems[`${stepId}-${item.id}`]).length
    return {
      completed: checkedCount,
      total: stepItems.length,
      percentage: stepItems.length ? Math.round((checkedCount / stepItems.length) * 100) : 0,
    }
  }

  return (
    <Accordion
      type="single"
      value={expandedItem || undefined}
      onValueChange={(value) => setExpandedItem(value)}
      className="w-full border rounded-lg"
    >
      {onboardingSteps.map((step) => {
        const progress = getStepProgress(step.id)

        return (
          <AccordionItem value={step.id} key={step.id} className="border-b last:border-0">
            <AccordionTrigger className="px-4 py-4 hover:no-underline">
              <div className="flex flex-col items-start text-left w-full">
                <div className="font-medium">{step.title}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {progress.completed} of {progress.total} completed ({progress.percentage}%)
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-0">
              <p className="mb-4 text-muted-foreground">{step.content}</p>
              <div className="space-y-3">
                {step.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <span>{item.label}</span>
                    <Checkbox
                      id={`${step.id}-${item.id}`}
                      checked={!!checkedItems[`${step.id}-${item.id}`]}
                      onCheckedChange={() => handleCheckboxChange(step.id, item.id)}
                    />
                  </div>
                ))}
                <div className="flex items-center justify-between mt-4 pt-2 border-t">
                  <span className="font-medium">Mark section as complete</span>
                  <div
                    className={cn(
                      "h-5 w-5 rounded-full border flex items-center justify-center",
                      progress.percentage === 100 ? "bg-primary border-primary" : "border-muted-foreground",
                    )}
                  >
                    {progress.percentage === 100 && <Check className="h-3 w-3 text-primary-foreground" />}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}

