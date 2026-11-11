import { apiClient } from './client';
import { ApiResponse } from '../types/auth';
import type { IJsonModel } from 'flexlayout-react';

/** 나의 화면 하나 (재설계 03): 이름 + flexlayout Model.toJson() */
export interface MyScreenPreset {
  name: string;
  model: IJsonModel;
  savedAt?: string;
}

/** 로그인 사용자 설정: 나의 화면 목록 + 그 밖의 설정(JSON, 사용자 설정 탭에서 쓸 예정) */
export interface UserProps {
  presets: MyScreenPreset[];
  props: Record<string, unknown>;
}

/** TOBE 재설계 03 "나의 화면 저장" — /api/v1/sys/user-props/me (대상은 항상 로그인 사용자) */
export const userPropsApi = {
  getMine: async (): Promise<UserProps> => {
    const res = await apiClient.get<ApiResponse<UserProps>>('v1/sys/user-props/me');
    return res.data.data ?? { presets: [], props: {} };
  },

  /** 목록 전체 저장(추가·덮어쓰기·삭제 모두) → 저장한 목록 */
  saveMyScreenLayout: async (presets: MyScreenPreset[]): Promise<MyScreenPreset[]> => {
    const res = await apiClient.put<ApiResponse<MyScreenPreset[]>>('v1/sys/user-props/me/my-screen-layout', { presets });
    return res.data.data ?? [];
  },
};
