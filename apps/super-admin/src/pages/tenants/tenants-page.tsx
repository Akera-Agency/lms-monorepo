import CreateTenant from '@/features/create-tenant';
import Table from '@/features/tenants-table'
export default function Tenants() {

return (
    <div className="flex flex-col items-center gap-3 px-10 mb-10">
        <div className="w-full">
            <Table/>
        </div>
        <div className="w-full">
            <CreateTenant/>
        </div>
    </div>
);
}
