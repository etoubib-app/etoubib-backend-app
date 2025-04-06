import { ExtractEnumTypes } from "../../helpers";

export const ClientUserStatus = {
    active: 'active',
    blocked: 'blocked',
    inactive: 'inactive',
    pending_invitation: 'pending_invitation',
} as const;
export type TClientUserStatus = ExtractEnumTypes<typeof ClientUserStatus>
