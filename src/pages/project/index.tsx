import MainLayout from '@/components/main.layout'
import React from 'react'
import { DataTableDemo } from './data-table'
import { Search as SearchIcon, Filter as FilterIcon, Calendar as CalendarIcon, List as ListIcon, LayoutGrid as GridIcon, LayoutGridIcon } from "lucide-react"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function Project() {
  return (
    <MainLayout>
      <div className="container mx-auto py-10 w-full overflow-hidden">
        <h1 className="text-2xl font-bold text-gray-800">Project</h1>
        <div className="flex flex-row mt-4 items-center justify-between">
          <form className="flex-grow">
            <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-[550px]"
                placeholder="Search Mockups, Logos..."
                required
              />
            </div>
          </form>
          <Button variant="outline" className="mr-[250px]"><FilterIcon /> Filter</Button>
          <div className="flex space-x-4">
            <button className="p-2 rounded hover:bg-gray-200"><ListIcon /></button>
            <button className="p-2 rounded hover:bg-gray-200"><LayoutGridIcon /></button>
            <button className="p-2 rounded hover:bg-gray-200"><CalendarIcon /></button>
          </div>
        </div>
      </div>
      <div className="container mx-auto py-10 w-full overflow-hidden">
        <DataTableDemo />
      </div>
    </MainLayout>
  );
}

export default Project
