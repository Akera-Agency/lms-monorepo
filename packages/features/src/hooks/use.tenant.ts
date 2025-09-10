import { useState } from "react";
import { createEmptyPermissions, type RoleData, FormErrors, resourceList, Resource } from "../validation/tenantValidation"

export const useTenant = () => {
    const [tenantData, setTenantData] = useState({
        tenant_name: "",
        tenant_description: "",
        logo_url: "",
        is_public: true
      });

      const [errors, setErrors] = useState<FormErrors>({});
      const [isSubmitting, setIsSubmitting] = useState(false);


      const [roles, setRoles] = useState<RoleData[]>([
        {
          role_name: "",
          role_description: "",
          permissions: createEmptyPermissions(),
          is_default: true,
          is_system_role: false,
        },
      ]);

    const [selectedResource, setSelectedResource] = useState<{ [key: number]: Resource }>({
      0: resourceList[0],
    });
      
    return {
      tenantData,
      errors,
      isSubmitting,
      roles,
      selectedResource,
      setSelectedResource,
      setErrors,
      setIsSubmitting,
      setRoles,
      setTenantData,
    }
}