import MainLayout from '@/components/main.layout'
import React from 'react'
import { DataTableDemo } from './data-table'
import { Search as SearchIcon, Filter as FilterIcon, Calendar as CalendarIcon, List as ListIcon, LayoutGrid as GridIcon} from "lucide-react"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function Project() {
  return (
    <MainLayout>
      <div className="container mx-auto py-10 w-full">
        <h1 className="text-2xl font-bold text-gray-800">Project</h1>
        <div className="flex flex-row mt-4 mr-[750px]">
          <form className="max-w-md mx-auto">
            <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <SearchIcon></SearchIcon>
              </div>
              <input type="search" id="default-search" className="block w-100 p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Mockups, Logos..." required />
            </div>
          </form>
          <Button variant="outline" className='mt-[5px] px-6 ml-5'><FilterIcon></FilterIcon> Filter</Button>
          
        </div>
      </div>
      <div className="container mx-auto py-10 w-full">
        <DataTableDemo></DataTableDemo>
      </div>
    </MainLayout>
  )
}

export default Project