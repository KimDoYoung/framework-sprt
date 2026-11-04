/**
 * 증빙자료 창(이행점검용) — Tdm54_Lookup_ChckInsuff(조치기록 "tdm63")·Tdm54_Lookup_ChckInsuffCmnt의 증빙자료 아이콘이 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm00_Lookup_RelateAppr.java (247줄) extends Com01_Lookup_RelateAppr — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L50-73: 크기 1000×700, 부모의 증빙자료 창(Com01_Lookup_RelateAppr) 아래 200 높이로 "※ 외부보관 증빙자료" 툴바([조회][등록][저장][삭제]) + 체크 셀 편집 그리드를 더한다
 * view(…)는 setDisable() L141-148: 외부보관 증빙자료의 버튼 4개를 숨긴다. retrieve() L150-154: 부모 조회 뒤 retrieveExtrEvid()
 * 다음 단계: keyTable "tdm52"(Tdm52_Edit_ChckManl 등 이행점검 창 3곳)의 [불러오기]는 목록이 다르다(Com01 selectAppr L230-243) — 이 창을 아직 연결하지 않았다
 */
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { message } from 'antd';
import { tdmChckEvidExtrApi } from '@/api/tdm';
import { TdmChckEvidExtr } from '@/types/tdm';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Com01_Lookup_RelateAppr } from '../com/Com01_Lookup_RelateAppr';

const gb = gbFor<TdmChckEvidExtr>();

interface Props {
  open: boolean;
  /** open(keyTable, id, callback) = 'open' / view(keyTable, id, callback) = 'view' */
  mode?: 'open' | 'view';
  /** 연결 테이블명 앞 5자리 ('tdm63' 조치기록, 'tdm52' 이행점검) */
  keyTable: string | null;
  keyTableId: number | null;
  /** callback.execute(): 연결·제거·저장·삭제 뒤와 [닫기] */
  onChanged?: () => void;
  onClose: () => void;
}

export const Tdm00_Lookup_RelateAppr: React.FC<Props> = ({ open, mode = 'open', keyTable, keyTableId, onChanged, onClose }) => {
  const { companyCode } = useLoginUser();
  const readOnly = mode === 'view';
  const viamc = companyCode === 'viamc';
  const changedRef = useRef(onChanged);
  changedRef.current = onChanged;

  const crud = useGridCrud<TdmChckEvidExtr>({
    idField: 'chckEvidExtrId',
    // retrieveExtrEvid() L156-168: tdm.Tdm64_ChckEvidExtr.selectByTargetId(targetId = keyTableId)
    search: useCallback(() => (open && keyTableId != null ? tdmChckEvidExtrApi.search(keyTableId) : Promise.resolve([])), [open, keyTableId]),
    // updateExtrEvid() L178-214: tdm.Tdm64_ChckEvidExtr.update (GridUpdate) → "저장이 완료되었습니다" + callback
    save: rows => tdmChckEvidExtrApi.save(keyTableId as number, rows),
    reloadAfterSave: true,
    // deleteExtrEvid() L216-242: GridDeleteData → callback
    remove: ids => tdmChckEvidExtrApi.remove(keyTableId as number, ids),
    // insertExtrEvid() L170-176: targetId = keyTableId
    newRow: () => ({ targetId: keyTableId, systemName: null, docNo: null, docName: null, docDate: null, note: null }),
    deleteConfirm: n => `${n}건의 문서를 삭제하시겠습니까?`,
    // updateExtrEvid() L184-206: viamc가 아니면 문서명·작성일이 필수 (고친 행마다)
    validate: changed => {
      if (viamc) return undefined;
      for (const r of changed) {
        if (!r.docName) return '문서명을 입력하세요';
        if (!r.docDate) return '문서 작성일을 입력하세요';
      }
      return undefined;
    },
    onChanged: () => changedRef.current?.(),
  });
  const crudRef = useRef(crud);
  crudRef.current = crud;

  // [E0] 화면 열림 (생성자 L50-73) / retrieve() L150-154 → retrieveExtrEvid()
  useEffect(() => {
    if (open) void crud.retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, keyTableId]);

  // [E5] messageBox.DialogHide (L224) — 삭제 확인은 useGridCrud.deleteConfirm
  const columnDefs = useMemo(() => {
    const editor = readOnly ? undefined : 'text' as const;
    return [
      // L127-130: 회사(viamc·kfstest)에서만 보이는 문서보기 아이콘 L106-124
      ...((viamc || companyCode === 'kfstest') ? [iconCell<TdmChckEvidExtr>('view', 'actionCell', 35, ' ', row => {
        if (crudRef.current.hasChanges()) { message.warning('변경사항을 먼저 저장후에 이용 가능합니다'); return; }
        if (row.docNo) {
          // L117-119: 사내 문서 서버(고정 주소)를 새 창으로 연다
          window.open(`http://160.1.15.121:4827/go.html?docno=${row.docNo}`, 'chromewin', 'width=1600, height=1200, menubars=0, toolbars=0, location=0, scrollbars=yes');
        } else {
          message.warning('문서번호가 존재하지않습니다');
        }
      })] : []),
      gb.text('docNo', 150, '문서번호', editor ? { editor } : undefined),  // L132
      gb.text('docName', 300, '문서명', editor ? { editor } : undefined),  // L133
      gb.date('docDate', 100, '작성일', readOnly ? undefined : { editor: 'date' }),  // L134
      gb.text('systemName', 150, '시스템명', editor ? { editor } : undefined),  // L135
      gb.text('note', 130, '비고', editor ? { editor } : undefined),  // L136
    ];
  }, [readOnly, viamc, companyCode]);

  // 부모 조회([조회] 버튼)와 같이 외부보관 증빙자료도 다시 읽는 일은 retrieveExtrEvid 버튼([E1])이 따로 한다
  const extra = (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 'bold', color: '#DD5E5E' }}>※ 외부보관 증빙자료</span>
        {!readOnly && (
          <>
            {/* [E1] retrieveExtrEvidButton[조회].Select (L76) → retrieveExtrEvid() */}
            <Button type="search" onClick={() => void crud.retrieve()}>조회</Button>
            {/* [E2] insertExtrEvidButton[등록].Select (L82) → insertExtrEvid() */}
            <Button type="register" onClick={() => crud.addRow()}>등록</Button>
            {/* [E3] updateExtrEvidButton[저장].Select (L88) → updateExtrEvid() */}
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            {/* [E4] deleteExtrEvidButton[삭제].Select (L94) → deleteExtrEvid() → [E5] messageBox.DialogHide YES (L224) */}
            <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
          </>
        )}
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        {/* setChecked(MULTI) — 삭제용 체크라 행 클릭 선택(rowClick)은 쓰지 않는다 (03 원칙 16 예외) */}
        <CellEditGrid<TdmChckEvidExtr> crud={crud} columnDefs={columnDefs} />
      </div>
    </div>
  );

  return (
    <Com01_Lookup_RelateAppr open={open} mode={mode} keyTable={keyTable} keyTableId={keyTableId} onChanged={onChanged} onClose={onClose} width={1000} extra={extra} />
  );
};
