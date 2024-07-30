import { PolicyDTO } from '@cm/types/domain/dto/policy/policyDTO';

export const API_POLICY = 'api/policy';

export interface ResponsePolicy {
    message?: string;
    result: boolean;
}

export interface ResponsePolicyPreview {
    text: string;
    result: boolean;
}

export interface ResponseLoadPolicy extends ResponsePolicy {
    policies: PolicyDTO[];
}

export interface ResponseCountPolicy extends ResponsePolicy {
    cnt: number;
}
