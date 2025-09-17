import { useState } from "react";
import { createEmptyPermissions, type RoleData, FormErrors, resourceList, Resource, TenantData, UserData } from "../validation/tenantValidation"
import { LanguagesEnum } from "../../../elysia-app/src/shared/constants/i18n";

export const useTenant = () => {
    const [tenantData, setTenantData] = useState<TenantData>({
        id:"",
        name: "",
        description: "",
        logo_url: "",
        is_public: true,
        deleted_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      });

      const [errors, setErrors] = useState<FormErrors>({});
      const [isSubmitting, setIsSubmitting] = useState(false);

      const [roles, setRoles] = useState<RoleData[]>([
        {
          id: "",
          tenant_id: "",
          name: "",
          description: "",
          permissions: createEmptyPermissions(),
          is_default: true,
          is_system_role: false,
          deleted_at: new Date(),
          created_at: new Date(),
          updated_at: new Date()
        }
      ])

      const [userData, setUserData] = useState<UserData>({
        name: "",
        email: "",
        avatar_url: "",
        language: LanguagesEnum.en
      });

    const [selectedResource, setSelectedResource] = useState<{ [key: number]: Resource }>({
      0: resourceList[0],
    });

    const [tenantId, setTenantId] = useState<string>()
    const [roleId, setRoleId] = useState<string>()


    return {
      tenantData,
      errors,
      isSubmitting,
      roles,
      selectedResource,
      userData,
      tenantId,
      roleId,
      setRoleId,
      setTenantId,
      setUserData,
      setSelectedResource,
      setErrors,
      setIsSubmitting,
      setRoles,
      setTenantData,
    }
}