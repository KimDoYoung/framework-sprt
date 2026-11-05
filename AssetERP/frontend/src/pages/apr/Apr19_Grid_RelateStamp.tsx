/**
 * 인감날인 그리드 (U2-02) — 법인서류 및 날인 신청(Apr17_Tab_CorpDocApp) 오른쪽 칸
 * AS-IS: myApp/client/vi/apr/Apr19_Grid_RelateStamp.java (226줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L53-66: 툴바 50([등록][저장][삭제]) + 셀 편집 그리드(체크박스 다중: 날인인감 150(조회창 트리거) · 날인부수 70 · 반출 60 · 날인일자 100)
 * [E0] 화면 열림 (생성자 L53-66) → settings(), retrieve() · [E4] stampName.TriggerClick (L92) → findStamp() L172: 조회창 Apr10_Lookup_Stamp(true, false)
 * retrieve(corpDocId) L113-130: 법인서류가 없으면 목록을 비우고, 있으면 apr.Apr19_RelateStamp.selectByCorpDocId. 끝나면 부모 callback(= 부모 update())을 부른다
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button as AntButton, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { aprCorpDocManageApi } from '@/api/apr';
import { AprRelateStamp, AprStamp } from '@/types/apr';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Apr10_Lookup_Stamp } from './Apr10_Lookup_Stamp';

const gb = gbFor<AprRelateStamp>();

interface Props {
  /** 부모에서 고른 법인서류. null이면 목록을 비운다 */
  corpDocId: number | null;
  /** 값이 바뀔 때마다 다시 읽는다 (같은 법인서류를 다시 골라도) */
  nonce: number;
  /** retrieve(corpDocId) L129 callback.execute() — 읽은 뒤 부모가 하는 일 */
  onRetrieved?: () => void;
}

export const Apr19_Grid_RelateStamp: React.FC<Props> = ({ corpDocId, nonce, onRetrieved }) => {
  const [stampRowId, setStampRowId] = useState<number | null>(null);

  const crud = useGridCrud<AprRelateStamp>({
    idField: 'relateStampId',
    // retrieve(Long) L113-130: 법인서류가 없으면 비움
    search: useCallback(async () => (corpDocId == null ? [] : aprCorpDocManageApi.searchStamps(corpDocId)), [corpDocId]),
    // update() L139-170: GridUpdate → apr.Apr19_RelateStamp.update
    save: aprCorpDocManageApi.saveStamps,
    // deleteChk() L188-218: "삭제"/"n건의 항목을 삭제하시겠습니까?"(폭 300) → [E5] msgBox.DialogHide [YES] (L203) → delete() L220: apr.Apr19_RelateStamp.delete
    remove: aprCorpDocManageApi.deleteStamps,
    deleteConfirm: n => `${n}건의 항목을 삭제하시겠습니까?`,
    // insertRow() L132-137: 법인서류 = 지금 고른 법인서류
    newRow: useCallback(() => ({ corpDocId }), [corpDocId]),
    firstEditField: 'stampCnt',
    // update() L146-152: 날인일자가 있는 줄을 고쳤으면 "날인이 완료되었습니다. 변경불가 합니다."
    validate: changed => (changed.some(r => r.stampDate != null) ? '날인이 완료되었습니다. 변경불가 합니다.' : undefined),
    reloadAfterSave: true,
  });

  // retrieve(corpDocId) L113-130 + callback
  useEffect(() => {
    void crud.retrieve().then(() => onRetrieved?.());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [corpDocId, nonce]);

  // deleteChk() L188-218: 미선택 "삭제할 정보를 먼저 선택해주세요", 날인이 끝난 건이 있으면 "날인이 완료된 건입니다. 삭제가 불가능 합니다."
  const deleteChk = () => {
    const checked = crud.gridRef.current?.api.getSelectedRows() ?? [];
    if (checked.length === 0) { message.warning('삭제할 정보를 먼저 선택해주세요'); return; }
    if (checked.some(r => r.stampDate != null)) { message.warning('날인이 완료된 건입니다. 삭제가 불가능 합니다.'); return; }
    void crud.deleteChecked();
  };

  const columnDefs = useMemo(() => [
    // [E4] stampName.TriggerClick (L92) → findStamp() L172-186: 조회창 Apr10_Lookup_Stamp → 인감ID·인감이름
    gb.text('stampName', 150, '날인인감', {  // L101
      cellStyle: { color: '#1677ff' },
      cellRenderer: (p: { data?: AprRelateStamp; value?: string }) => (
        <>
          <AntButton type="text" size="small" icon={<SearchOutlined />}
            onClick={e => { e.stopPropagation(); if (p.data) setStampRowId(p.data.relateStampId); }} />
          {p.value}
        </>
      ),
    }),
    gb.longCenter('stampCnt', 70, '날인부수', { editor: 'number' }),  // L102
    gb.boolean('outYn', 60, '반출', { editable: true }),  // L103
    gb.date('stampDate', 100, '날인일자'),  // L104
  ], []);

  const onPickStamp = (stamp: AprStamp | null) => {
    if (stampRowId != null && stamp) crud.updateRow(stampRowId, { stampId: stamp.stampId, stampName: stamp.stampName });
  };
  // checkflag=false → [해당사항 없음]은 빈 인감을 넘긴다 → 인감 비움
  const onClearStamp = () => {
    if (stampRowId != null) crud.updateRow(stampRowId, { stampId: null, stampName: null });
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* [E1] insertButton[등록].Select (L69) → insertRow() · [E2] updateButton[저장].Select (L75) → update() · [E3] deleteButton[삭제].Select (L81) → deleteChk() */}
        <Button type="register" onClick={() => crud.addRow()}>등록</Button>
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
        <Button type="delete" onClick={deleteChk}>삭제</Button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<AprRelateStamp> crud={crud} columnDefs={columnDefs} />
      </div>
      <Apr10_Lookup_Stamp open={stampRowId != null} checkflag={false} onResult={onPickStamp} onDelete={onClearStamp} onClose={() => setStampRowId(null)} />
    </div>
  );
};
