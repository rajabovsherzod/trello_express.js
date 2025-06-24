import { $api } from "./axios";
import type { Invitation } from "@/types";

interface CreateInvitationPayload {
    boardId: string,
    toUserEmail: string,
}

interface CreateInvitationResponse {
    message: string,
    data: Invitation,
}

interface GetInvitationsResponse {
    message: string;
    data: Invitation[];
}

export const createInvitation = async (payload: CreateInvitationPayload): Promise<Invitation> => {
    const response = await $api.post<CreateInvitationResponse>('/invitations', payload)
    return response.data.data
}

export const getMyInvitations = async (): Promise<Invitation[]> => {
    const response = await $api.get<GetInvitationsResponse>('/invitations/my');
    return response.data.data;
}

export const acceptInvitation = async (invitationId: string): Promise<{message: string}> => {
    const { data } = await $api.post(`invitations/${invitationId}/accept`)
    return data
}

export const declineInvitation = async (invitationId: string): Promise<{message: string}> => {
    const { data } = await $api.post(`/invitations/${invitationId}/decline`)
    return data
}