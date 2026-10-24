/**
 * 직무겸직 창 (N04) — 임원 등록 그리드의 편집 아이콘이 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm03_Lookup_AddTitle.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 창 1000×600(원본) → 열 합계(사외 870+선택·행번호 60+여백 130) 기준 1060: 툴바([조회][등록][저장][삭제]) + 탭 사내(직무겸직 tdm03)·사외(경력 emp07, 대외겸직) + [닫기]
 * UX보강(10): 조회창(UX-05·06), 저장 버튼 UX-03
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, Space, Tabs } from 'antd';
import { empApi } from '@/api/emp';
import { tdmApi } from '@/api/tdm';
import { Career } from '@/types/emp';
import { TdmAddTitle, TdmHr } from '@/types/tdm';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { useGridCrud } from '@/hooks/useGridCrud';

const interGb = gbFor<TdmAddTitle>();
const exterGb = gbFor<Career>();

/** interBuildGrid() L173-182 */
const interColumns = [
  interGb.text('addTitleName', 250, '겸직명', { editor: 'text' }),  // L177
  interGb.date('startDate', 100, '적용시작일', { editor: 'date' }),  // L178
  interGb.date('closeDate', 100, '적용종료일', { editor: 'date' }),  // L179
];

/** exterBuildGrid() L184-201 (시작·종료년월 입력칸의 빈 글자 안내 "YYYY.MM") */
const exterColumns = [
  exterGb.textCenter('frYm', 80, '시작년월', { editor: 'text' }),  // L193
  exterGb.textCenter('toYm', 80, '종료년월', { editor: 'text' }),  // L194
  exterGb.text('companyNm', 220, '회사명', { editor: 'text' }),  // L195
  exterGb.text('industry', 150, '업종', { editor: 'text' }),  // L196
  exterGb.text('finalTitle', 100, '최종직위', { editor: 'text' }),  // L197
  exterGb.text('finalRole', 240, '업무(역활,권한)', { editor: 'text' }),  // L198
];

const DATE_PATTERN = /^\d{4}\.(0[1-9]|1[0-2])$/;   // L269 datePattern

interface Props {
  /** 값이 있으면 열림 — AS-IS open(personId, callback) */
  person: TdmHr | null;
  /** [닫기] — AS-IS callback.execute() 뒤 hide(): 부르는 쪽이 목록을 다시 조회 */
  onClose: () => void;
}

export const Tdm03_Lookup_AddTitle: React.FC<Props> = ({ person, onClose }) => {
  const personId = person?.personId;
  const [tab, setTab] = useState<'inter' | 'exter'>('inter');

  const interCrud = useGridCrud<TdmAddTitle>({
    idField: 'addTitleId',
    search: useCallback(async () => (personId ? tdmApi.searchAddTitles(personId) : []), [personId]),
    save: useCallback((rows: TdmAddTitle[]) => tdmApi.saveAddTitles(rows), []),
    remove: useCallback((ids: number[]) => tdmApi.deleteAddTitles(ids), []),
    newRow: useCallback((): Partial<TdmAddTitle> => ({ personId }), [personId]),   // insertInterGrid() L214-221
    firstEditField: 'addTitleName',
    deleteConfirm: '삭제하시겠습니까?',
    // updateInterGrid() L232-261
    validate: changed => {
      for (const r of changed) {
        if (!r.addTitleName) return '겸직명을 입력하세요';
        if (!r.startDate) return '적용시작일을 선택하세요';
      }
      return undefined;
    },
  });

  const exterCrud = useGridCrud<Career>({
    idField: 'careerId',
    search: useCallback(async () => (personId ? empApi.getCareers(personId, true) : []), [personId]),
    save: useCallback((rows: Career[]) => empApi.updateCareers(rows), []),
    remove: useCallback((ids: number[]) => empApi.deleteCareers(ids), []),
    newRow: useCallback((): Partial<Career> => ({ personId, extrAddTitleYn: 'true' }), [personId]),   // insertExterGrid() L223-230
    firstEditField: 'frYm',
    deleteConfirm: '삭제하시겠습니까?',
    // updateExterGrid() L263-344: 년월 형식 검사 (AS-IS는 "-"→".", "현제"→"현재"로 고쳐 넣는다)
    validate: changed => {
      for (const r of changed) {
        if (!r.frYm) return '시작년월을 입력하세요. ex)"2001.01", "현재"';
        if (r.frYm.length > 7) return '시작년월은 7자리 이하로 입력해주세요. ex)"2001.01", "현재"';
        if (r.frYm.includes('-')) r.frYm = r.frYm.replace('-', '.');
        if (!DATE_PATTERN.test(r.frYm)) return '시작년월의 날짜 형식이 잘못되었습니다. "YYYY.MM" 형식으로 입력하세요 (예: 2026.05)';

        if (!r.toYm) return '종료년월을 입력하세요. ex)"2001.01", "현재"';
        if (r.toYm.length > 7) return '종료년월은 7자리 이하로 입력해주세요. ex)"2001.01", "현재"';
        if (r.toYm.includes('현제')) r.toYm = r.toYm.replace('현제', '현재');
        if (r.toYm.includes('현재')) {
          if (r.toYm !== '현재') return '"현재"는 단독으로만 입력 가능합니다';
        } else {
          if (r.toYm.includes('-')) r.toYm = r.toYm.replace('-', '.');
          if (!DATE_PATTERN.test(r.toYm)) return '종료년월의 날짜 형식이 잘못되었습니다. "YYYY.MM" 형식으로 입력하세요 (예: 2026.05)';
        }
      }
      return undefined;
    },
  });

  // [E0] 화면 열림 (생성자 L64-71) → open(personId, callback) L73-99: 열면 사내 탭, retrieve() — 사내·사외 모두 조회
  const { retrieve: retrieveInter, clear: clearInter } = interCrud;
  const { retrieve: retrieveExter, clear: clearExter } = exterCrud;
  useEffect(() => {
    if (personId) {
      setTab('inter');
      void retrieveInter();
      void retrieveExter();
    } else {
      clearInter();
      clearExter();
    }
  }, [personId]);   // eslint-disable-line react-hooks/exhaustive-deps

  const active = tab === 'inter' ? interCrud : exterCrud;
  const retrieve = () => { void retrieveInter(); void retrieveExter(); };

  // [E4] messageBox.DialogHide (L126) YES → updateInterGrid(), updateExterGrid() (L122-141: "저장하시겠습니까?")
  const confirmSave = () => {
    Modal.confirm({ title: '확인', content: '저장하시겠습니까?', width: 300, onOk: () => active.saveRows() });
  };

  const exterCols = useMemo(() => exterColumns, []);
  const interCols = useMemo(() => interColumns, []);

  return (
    <LookupModal
      open={!!person}
      title="직무겸직"
      width={1060}
      closable={false}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E7] closeButton[닫기].Select [callback != null] (L162) → hide() — callback.execute() 뒤 (L162-169) */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 430, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space>
          {/* [E1] retrieveButton[조회].Select (L106) → retrieve() */}
          <Button type="search" onClick={retrieve}>조회</Button>
          {/* [E2] insertButton[등록].Select (L112) → insertInterGrid(), insertExterGrid(): 활성 탭의 행 추가 */}
          <Button type="register" onClick={active.addRow}>등록</Button>
          {/* [E3] updateButton[저장].Select (L122) → confirmSave() */}
          <Button type="save" count={active.changes} onClick={confirmSave}>저장</Button>
          {/* [E5] deleteButton[삭제].Select (L142) → deleteChecked; [E6] messageBox.DialogHide (L146) YES → deleteInterGrid(), deleteExterGrid(): "삭제하시겠습니까?" → 선택한 행, 없으면 "삭제할 내역을 선택하세요" */}
          <Button type="delete" onClick={active.deleteChecked}>삭제</Button>
        </Space>
        {/* 탭 줄만 두고 아래 칸에 활성 탭 그리드를 둔다 (antd Tabs children 안의 그리드는 높이 0이 된다 — L07) */}
        <Tabs
          size="small"
          activeKey={tab}
          onChange={k => setTab(k as 'inter' | 'exter')}
          items={[{ key: 'inter', label: '사내' }, { key: 'exter', label: '사외' }]}
          style={{ marginBottom: 0 }}
        />
        <div style={{ flex: 1, minHeight: 0 }}>
          {tab === 'inter'
            ? <CellEditGrid<TdmAddTitle> crud={interCrud} columnDefs={interCols} />
            : <CellEditGrid<Career> crud={exterCrud} columnDefs={exterCols} />}
        </div>
      </div>
    </LookupModal>
  );
};
