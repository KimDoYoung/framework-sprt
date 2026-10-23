/**
 * 제공(수령)목적 → 제공내역 → 계정과목 연동 콤보 상태 (L02). AS-IS Biz01_Edit_Card·Biz01_Lookup_CardManagement가 같은 모양을 각자 만든다.
 * - 목적 목록: `SystemCodeComboBox kindGroupCd="ProvidePurCode002"`(AS-IS sys.Sys00_Common.selectByKindGroupCode)
 * - 내역 목록: AS-IS sys.Sys09_Code.selectByKindCode(ProvideContentCode, 목적코드%) = `actApi.searchProvideContents`
 * - 계정과목 목록: AS-IS sys.Sys00_Common.selectByProvideContentCode = `bizPromoApi.searchProvideAccounts`
 */
import { useCallback, useRef, useState } from 'react';
import { actApi } from '@/api/act';
import { bizPromoApi } from '@/api/biz';
import { ActCodeOption } from '@/types/act';
import { BizAccountOption } from '@/types/biz';

export interface ProvideValue {
  providePurCode: string | null;
  provideContentCode: string | null;
  accountCodeId: number | null;
}

const EMPTY: ProvideValue = { providePurCode: null, provideContentCode: null, accountCodeId: null };

export function useProvideCombos() {
  const [value, setValue] = useState<ProvideValue>(EMPTY);
  const [contents, setContents] = useState<ActCodeOption[]>([]);
  const [accounts, setAccounts] = useState<BizAccountOption[]>([]);
  // 늦게 온 응답이 새 선택을 덮지 않게 한다
  const seq = useRef(0);

  /** 목적을 고르면(Collapse에서 값이 바뀐 때만): 내역·계정과목을 비우고 그 목적의 내역 목록을 읽는다 */
  const changePurpose = useCallback(async (code: string | null | undefined) => {
    const my = ++seq.current;
    setValue({ providePurCode: code ?? null, provideContentCode: null, accountCodeId: null });
    setAccounts([]);
    if (!code) { setContents([]); return; }
    const list = await actApi.searchProvideContents(code);
    if (my === seq.current) setContents(list);
  }, []);

  /** 내역을 고르면: 계정과목을 비우고 연결된 계정과목을 읽어 첫 항목을 고른다. 고른 내역 코드를 돌려준다(직원 자동등록 확인용) */
  const changeContent = useCallback(async (code: string | null | undefined): Promise<string | null> => {
    const my = ++seq.current;
    setValue(v => ({ ...v, provideContentCode: code ?? null, accountCodeId: null }));
    setAccounts([]);
    if (!code) return null;
    const list = await bizPromoApi.searchProvideAccounts(code);
    if (my !== seq.current) return null;
    setAccounts(list);
    if (list.length > 0) setValue(v => ({ ...v, accountCodeId: list[0].accountCodeId }));
    return code;
  }, []);

  const changeAccount = useCallback((id: number | null | undefined) => setValue(v => ({ ...v, accountCodeId: id ?? null })), []);

  /** 기존 값으로 채운다 (AS-IS setComboBox: 목적이 있으면 내역 목록을 읽고 그 내역으로, 내역이 있으면 계정과목 목록을 읽고 그 계정으로) */
  const load = useCallback(async (v: ProvideValue) => {
    const my = ++seq.current;
    setValue(v);
    setContents([]);
    setAccounts([]);
    if (!v.providePurCode) return;
    const cs = await actApi.searchProvideContents(v.providePurCode);
    if (my !== seq.current) return;
    setContents(cs);
    if (!v.provideContentCode) return;
    const as = await bizPromoApi.searchProvideAccounts(v.provideContentCode);
    if (my === seq.current) setAccounts(as);
  }, []);

  const reset = useCallback(() => {
    seq.current++;
    setValue(EMPTY);
    setContents([]);
    setAccounts([]);
  }, []);

  return { value, contents, accounts, changePurpose, changeContent, changeAccount, load, reset };
}
