/**
 * [1506] 문서작성 > 04. 전자결재 > 추가 대표명의 등록 (G08)
 * AS-IS: myApp/client/vi/apr/Apr15_Tab_ReprCorp.java (240줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L53-73: center=vlc(테두리, 여백 20) — 툴바 [조회][등록][저장][삭제] + 셀 편집 그리드(체크박스 다중, 7열: 구분 100(콤보 ReprCorpType) · 대표회사 250 · 대표자 200 ·
 *   법인등기 80 · 인감 200(조회창 트리거) · 비고 250 · 사용 70). 조회창 Apr10_Lookup_Stamp(G06에서 변환)를 flag=true·checkflag=false로 다시 쓴다
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button as AntButton } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { aprApi } from '@/api/apr';
import { sysApi } from '@/api/sys';
import { AprReprCorp, AprStamp } from '@/types/apr';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Apr10_Lookup_Stamp } from './Apr10_Lookup_Stamp';

const gb = gbFor<AprReprCorp>();

/** updateChk() L171-204: 수정한 행마다 구분 → 대표회사 → 대표자 순으로 검사 */
const validate = (changed: AprReprCorp[]): string | undefined => {
  for (const m of changed) {
    if (!m.corpType) return '구분을 선택하세요';  // L180
    if (!m.corpName) return '대표회사를 입력하세요';  // L184
    if (!m.reprName) return '대표자를 입력하세요';  // L188
  }
  return undefined;
};

export const Apr15_Tab_ReprCorp: React.FC = () => {
  const [corpTypes, setCorpTypes] = useState<Code[]>([]);
  const [stampRowId, setStampRowId] = useState<number | null>(null);

  const crud = useGridCrud<AprReprCorp>({
    idField: 'reprCorpId',
    // retrieve() L149-161: 서비스 apr.Apr15_ReprCorp.selectByCompanyId(companyId)
    search: aprApi.searchReprCorps,
    // updateChk() L171-204: GridUpdate → apr.Apr15_ReprCorp.update
    save: aprApi.saveReprCorps,
    // deleteChk() L206-223: "확인"/"선택된 n건을 삭제하시겠습니까?"(폭 350) → [E7] messageBox.DialogHide [YES] (L213) → delete() L225-238: 사용이력이 있으면 서버 메시지
    remove: aprApi.deleteReprCorps,
    deleteConfirm: n => `선택된 ${n}건을 삭제하시겠습니까?`,
    // insert() L163-169: GridInsertRow, 회사 = 로그인 회사(서버), 사용 true
    newRow: useCallback(() => ({ useYn: 'true' }), []),
    firstEditField: 'corpTypeName',
    validate,
  });

  // [E0] 화면 열림 (생성자 L53-73) → settings(), retrieve()
  useEffect(() => {
    void crud.retrieve();
    sysApi.searchCodes('ReprCorpType').then(setCorpTypes).catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columnDefs = useMemo(() => [
    // [E5] corpTypeCombo[ReprCorpType].Collapse (L105) → 고른 이름에 맞춰 코드(corpType)도 바꾼다
    gb.text('corpTypeName', 100, '구분', {  // L124
      editor: 'select',
      values: corpTypes.map(c => c.name),
      valueSetter: p => {
        p.data.corpTypeName = p.newValue;
        p.data.corpType = corpTypes.find(c => c.name === p.newValue)?.code ?? p.data.corpType;
        return true;
      },
    }),
    gb.text('corpName', 250, '대표회사', { editor: 'text' }),  // L125
    gb.text('reprName', 200, '대표자', { editor: 'text' }),  // L126
    gb.boolean('corpRegYn', 80, '법인등기', { editable: true }),  // L127
    // [E6] stampLookup.TriggerClick (L115) → lookupStamp() L135-147: 조회창 Apr10_Lookup_Stamp(true, false) → 인감ID·인감이름
    gb.text('stampName', 200, '인감', {  // L128
      cellStyle: { color: '#1677ff' },
      cellRenderer: (p: { data?: AprReprCorp; value?: string }) => (
        <>
          <AntButton type="text" size="small" icon={<SearchOutlined />}
            onClick={e => { e.stopPropagation(); if (p.data) setStampRowId(p.data.reprCorpId); }} />
          {p.value}
        </>
      ),
    }),
    gb.text('note', 250, '비고', { editor: 'text' }),  // L129
    gb.boolean('useYn', 70, '사용', { editable: true }),  // L130
  ], [corpTypes]);

  // lookupStamp() L135-147 콜백: addChange(stampId, stampName). [확인]이 고른 것 없이 null이면 원본은 NPE라 아무 일도 하지 않는다
  const onPickStamp = (stamp: AprStamp | null) => {
    if (stampRowId != null && stamp) crud.updateRow(stampRowId, { stampId: stamp.stampId, stampName: stamp.stampName });
  };

  // Apr10_Lookup_Stamp.delete() L231-242: checkflag=false → [해당사항 없음]은 빈 모델을 넘긴다 → 인감 비움
  const onClearStamp = () => {
    if (stampRowId != null) crud.updateRow(stampRowId, { stampId: null, stampName: null });
  };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, border: '1px solid #d9d9d9', padding: 8, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* [E1] retrieveButton[조회].Select (L76) → retrieve() */}
          <Button type="search" onClick={crud.retrieve}>조회</Button>
          {/* [E2] insertButton[등록].Select (L82) → insert() L163-169 */}
          <Button type="register" onClick={() => crud.addRow()}>등록</Button>
          {/* [E3] updateButton[저장].Select (L88) → updateChk() L171-204. 저장(n)은 UX-03 */}
          <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
          {/* [E4] deleteButton[삭제].Select (L94) → deleteChk() L206-223 */}
          <Button type="delete" onClick={() => crud.deleteChecked()}>삭제</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<AprReprCorp> crud={crud} columnDefs={columnDefs} />
        </div>
      </div>
      <Apr10_Lookup_Stamp open={stampRowId != null} checkflag={false} onResult={onPickStamp} onDelete={onClearStamp} onClose={() => setStampRowId(null)} />
    </div>
  );
};
