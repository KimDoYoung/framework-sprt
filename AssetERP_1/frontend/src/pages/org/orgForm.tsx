/**
 * 조직 폼 공통 (C02) — Org01_Edit_OrgCode·Org02_Edit_Info의 editDriver(Org01_CodeModel + @Path orgInfoModel.*) 값.
 * AS-IS TextField는 빈 값을 null로 flush한다 → toReq에서 빈 문자열을 null로 바꾼다.
 */
import React from 'react';
import { Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { OrgCode, OrgCodeSaveReq } from '@/types/org';

export interface OrgForm {
  codeId?: number | null;
  infoId?: number | null;
  parentCodeId: number;
  parentOrgName: string;
  orgCd: string;
  openDate: Dayjs | null;
  openReason: string;
  closeDate: Dayjs | null;
  closeReason: string;
  korNm: string;
  levelCd?: string;
  modDate: Dayjs | null;
  modReason: string;
  sortOrder: string;
  note: string;
  dcrIdWord: string;
}

const d = (v?: string | null) => (v ? dayjs(v) : null);
const s = (v?: string | null) => v ?? '';
const n = (v: string) => (v.trim() === '' ? null : v);
export const ymd = (v: Dayjs | null) => (v ? v.format('YYYY-MM-DD') : null);

/** editDriver.edit(model) */
export const toForm = (r: Partial<OrgCode>, parentOrgName: string): OrgForm => ({
  codeId: r.codeId,
  infoId: r.infoId,
  parentCodeId: r.parentCodeId ?? 0,
  parentOrgName,
  orgCd: s(r.orgCd),
  openDate: d(r.openDate),
  openReason: s(r.openReason),
  closeDate: d(r.closeDate),
  closeReason: s(r.closeReason),
  korNm: s(r.korNm),
  levelCd: r.levelCd ?? undefined,
  modDate: d(r.modDate),
  modReason: s(r.modReason),
  sortOrder: s(r.sortOrder),
  note: s(r.note),
  dcrIdWord: s(r.dcrIdWord),
});

/** editDriver.flush() → 저장 요청 */
export const toReq = (f: OrgForm, baseDate: string): OrgCodeSaveReq => ({
  codeId: f.codeId,
  infoId: f.infoId,
  parentCodeId: f.parentCodeId,
  orgCd: n(f.orgCd),
  openDate: ymd(f.openDate),
  openReason: n(f.openReason),
  closeDate: ymd(f.closeDate),
  closeReason: n(f.closeReason),
  korNm: n(f.korNm),
  levelCd: f.levelCd ?? null,
  modDate: ymd(f.modDate),
  modReason: n(f.modReason),
  sortOrder: n(f.sortOrder),
  note: n(f.note),
  dcrIdWord: n(f.dcrIdWord),
  baseDate,
});

/** FieldLabel (form.setLabelWidth(70)). width 없으면 남은 폭(HorizontalLayoutData(1, -1)) */
export const OrgField: React.FC<{ label: string; width?: number; color?: string; children: React.ReactNode }> = ({ label, width, color, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', width, flex: width ? 'none' : 1, minWidth: 0 }}>
    <Typography.Text style={{ width: 70, flex: 'none', color }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

/** HorizontalLayoutContainer 한 줄 (칸 사이 여백 20) */
export const OrgRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>{children}</div>
);
