/**
 * 4대보험신고(EDI) 탭 4개(Pay31_TabPage_InsureApply1~4)가 함께 쓰는 것 (S26)
 * - PayInsureApplyTabHandle: 탭 페이지가 노출하는 retrieve() (AS-IS InterfaceTabPage.retrieve(null) — Pay31_Tab_InsureApply.retrieveTabpage L59-62)
 * - PayInsurePersonField: 조회줄의 사원명 칸 — 탭 1~4가 같은 코드를 쓴다
 *   [TriggerClick] → openLookupPerson(null), [ValueChange]: 비우면 사원 해제 후 retrieve(), 아니면 재직(100) '%글자%'로 찾아
 *   (emp.Emp00_TransInfo.selectByText, isSeparateAddTitle true) 있으면 첫 사원을 바로 고르고 retrieve(), 없으면 openLookupPerson(글자)
 * - useInsureCodes: 코드 목록(AS-IS ComboBoxField/CommonComboBoxField) — 그리드 콤보 편집기용
 */
import React, { useEffect, useRef, useState } from 'react';
import { Input, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { empApi } from '@/api/emp';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { TransInfo } from '@/types/emp';
import { Code } from '@/types/sys';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';

export interface PayInsureApplyTabHandle {
  retrieve: () => void;
}

interface PersonFieldProps {
  /** 사원을 고르거나 비웠을 때. retrieve가 true면 바로 조회한다(AS-IS ValueChange), false면 칸만 바꾼다(openLookupPerson) */
  onChange: (personId: number | null, retrieve: boolean) => void;
}

export const PayInsurePersonField: React.FC<PersonFieldProps> = ({ onChange }) => {
  const today = dayjs().format('YYYY-MM-DD');
  const [name, setName] = useState('');
  // ValueChange(글자가 바뀐 채로 칸을 벗어남·Enter)를 가르는 마지막 확정 글자
  const committedRef = useRef('');
  const [lookup, setLookup] = useState<{ searchText: string } | null>(null);

  const onCommit = async (text: string) => {
    if (text === committedRef.current) return;
    committedRef.current = text;
    if (text === '') {
      onChange(null, true);
      return;
    }
    try {
      const list = await empApi.searchTransInfos(today, text, '100', true);
      if (list.length > 0) {
        setName(list[0].korNm ?? '');
        committedRef.current = list[0].korNm ?? '';
        onChange(list[0].personId, true);
      } else {
        setLookup({ searchText: text });
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // openLookupPerson() — 고르면 이름·ID를 채우고, 고르지 않으면(null) 비운다 (조회는 하지 않는다)
  const onPicked = (row: TransInfo | null) => {
    setLookup(null);
    committedRef.current = row?.korNm ?? '';
    setName(row?.korNm ?? '');
    onChange(row?.personId ?? null, false);
  };

  return (
    <>
      <Input
        style={{ width: 100 }}
        value={name}
        allowClear
        suffix={<SearchOutlined style={{ cursor: 'pointer' }} onClick={() => setLookup({ searchText: '' })} />}
        onChange={e => { setName(e.target.value); if (e.target.value === '') void onCommit(''); }}
        onPressEnter={e => void onCommit((e.target as HTMLInputElement).value.trim())}
        onBlur={e => void onCommit(e.target.value.trim())}
      />
      <Emp00_Lookup_SelectSingle open={lookup != null} separateAddTitle searchText={lookup?.searchText ?? ''} transDate={today}
        onResult={onPicked} onClose={() => setLookup(null)} />
    </>
  );
};

/** 코드 종류(kindCd) 또는 코드그룹(kindGroupCd)의 코드 목록 — 그리드 콤보 편집기의 values */
export function useInsureCodes(kind: { kindCd?: string; kindGroupCd?: string }): Code[] {
  const [codes, setCodes] = useState<Code[]>([]);
  useEffect(() => {
    const p = kind.kindGroupCd ? sysApi.searchCodesByKindGroup(kind.kindGroupCd) : sysApi.searchCodes(kind.kindCd ?? '');
    p.then(setCodes).catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind.kindCd, kind.kindGroupCd]);
  return codes;
}

/** 탭 1·2 아래 안내 글 (setHtmlCheckBoxStyle) */
export const InsureApplyNote: React.FC = () => (
  <div style={{ flex: 'none', height: 100, display: 'flex', alignItems: 'center', paddingLeft: 10, lineHeight: 1.6 }}>
    <div>
      <div>국민연금 : 변경등록월은 신청일의 다음달부터 적용가능</div>
      <div>건강보험 : 신청일기준 15일 이전에는 당월부터 적용되며 16일부터는 익월부터 적용 (변경적용월부터 소급 계산되어 적용)</div>
      <div>고용보험 : 신청일 다음달부터 적용 (변경적용월부터 소급계산되어 적용). 단, 착오정정시엔 신고일이 15일 이전이라면 당월부터 적용</div>
    </div>
  </div>
);
