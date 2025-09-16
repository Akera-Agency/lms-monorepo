
import React from 'react'
import { University } from 'lucide-react';
import EditTenant from './edit-tenant';

interface AddTenantProps {
  isDisabled: boolean
}

export default function AddTenant({
  isDisabled
}: AddTenantProps) {  

return (
  <div className="backdrop-blur-sm border border-neutral-700 rounded-xl p-6 space-y-6 bg-neutral-800/20">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-neutral-500/20 rounded-md">
        <University className="h-5 w-5 text-neutral-400" />
      </div>
      <h2 className="text-xl font-semibold text-white">Tenant Information</h2>
    </div>
      <EditTenant
      isDisabled={isDisabled}/>
  </div>
)}
