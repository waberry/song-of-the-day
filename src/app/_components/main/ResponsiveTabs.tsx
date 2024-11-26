"use client"

import React, { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ChevronDown } from 'lucide-react'

interface Tab {
  value: string
  label: string
  content: React.ReactNode
}

interface ResponsiveTabsProps {
  tabs: Tab[]
  defaultValue?: string
}

export function ResponsiveTabs({ tabs, defaultValue = tabs[0]?.value }: ResponsiveTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue)
  const [isOpen, setIsOpen] = useState(false)

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setIsOpen(false)
  }

  const toggleDropdown = () => setIsOpen(!isOpen)

  return (
    <Tabs defaultValue={defaultValue} className="w-full" onValueChange={handleTabChange}>
      <div className="relative mb-4">
        <div className="sm:hidden">
          <button
            onClick={toggleDropdown}
            className="flex w-full items-center justify-between rounded-lg bg-white px-4 py-2 text-left text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-haspopup="listbox"
            aria-expanded="true"
            aria-labelledby="listbox-label"
          >
            <span className="block truncate">{tabs.find(tab => tab.value === activeTab)?.label}</span>
            <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </button>

          {isOpen && (
            <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10">
              <ul
                className="max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                tabIndex={-1}
                role="listbox"
                aria-labelledby="listbox-label"
                aria-activedescendant="listbox-option-3"
              >
                {tabs.map((tab) => (
                  <li
                    key={tab.value}
                    className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white"
                    id={`listbox-option-${tab.value}`}
                    role="option"
                    onClick={() => handleTabChange(tab.value)}
                  >
                    <span className="font-normal block truncate">{tab.label}</span>
                    {tab.value === activeTab && (
                      <span className="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4">
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <TabsList className="hidden sm:inline-flex w-full">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex-1 px-3 py-2 text-sm font-medium"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}