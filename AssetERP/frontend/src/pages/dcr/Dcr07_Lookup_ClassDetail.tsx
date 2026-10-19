/**
 * 문서분류 세부분류 창 (E16) — Dcr01_Grid_DocType의 "세부분류" 칸 아이콘에서 연다
 * AS-IS: myApp/client/vi/dcr/Dcr07_Lookup_ClassDetail.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L60-113: 모달 1280×500 (제목 "문서분류 : {문서분류 전체 경로}"), 위 툴바([조회][등록][저장][삭제]) + 셀 편집 그리드(세부분류 350 · 키워드 350 · 작성요령 270 · 조회순서 80 · 특정화면 연결여부 80 · 사용여부 80), 아래 가운데 [닫기]
 */
import React, { useCallback, useEffect, useMemo } from 'react';
import { Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { dcrApi } from '@/api/dcr';
import { DcrClassDetail } from '@/types/dcr';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<DcrClassDetail>();

interface Props {
  /** open(model) L54 — 문서구분 (값이 있으면 열린다) */
  model: { classTreeId: number; classTreeFullName?: string | null } | null;
  /** 저장·삭제가 끝났을 때 — 필요한 쪽만 쓴다 */
  onChanged?: () => void;
  onClose: () => void;
}

export const Dcr07_Lookup_ClassDetail: React.FC<Props> = ({ model, onChanged, onClose }) => {
  const classTreeId = model?.classTreeId ?? null;

  // buildGrid() L115-125 (체크박스 없음 — 행을 눌러 고른다)
  const columnDefs = useMemo(() => [
    gb.text('classDetailName', 350, '세부분류<br>(상신제목)', { editor: 'text' }),  // L117
    gb.text('keyword', 350, '키워드<br>(비고)', { editor: 'text' }),  // L118
    gb.textArea('guide', 270, '작성요령', { editor: 'largeText' }),  // L119 (모델 속성 이름은 guid)
    gb.longCenter('seq', 80, '조회순서', { editor: 'number' }),  // L120
    gb.boolean('linkYn', 80, '특정화면<br>연결여부', { editable: true }),  // L121
    gb.boolean('useYn', 80, '사용여부', { editable: true }),  // L122
  ], []);

  const crud = useGridCrud<DcrClassDetail>({
    idField: 'classDetailId',
    // retrieve() L128-132: 서비스 dcr.Dcr07_ClassDetail.selectByClassTreeId(classTreeId)
    search: useCallback(() => (classTreeId == null ? Promise.resolve([]) : dcrApi.searchClassDetails(classTreeId)), [classTreeId]),
    // update() L135-158: GridUpdate → dcr.Dcr07_ClassDetail.update
    save: dcrApi.saveClassDetails,
    remove: dcrApi.deleteClassDetails,
    // insertRow() L161-168: 문서분류 ID·사용 true (조회순서는 비워 둔다 — L165 주석)
    newRow: useCallback(() => ({ classTreeId: classTreeId ?? 0, useYn: 'true' }), [classTreeId]),
    firstEditField: 'classDetailName',
    // 수정·삭제 확인 문구 (deleteRow() L171-192, 폭 400)
    deleteConfirm: '선택한 정보를 삭제하시겠습니까?',
    // update() L137-155: 바뀐 행마다 세부분류·조회순서가 필수
    validate: changed => {
      for (const r of changed) {
        if (!r.classDetailName) return '세부분류는 필수입력 항목입니다';
        if (r.seq == null) return '조회순서는 필수입력 항목입니다';
      }
      return undefined;
    },
    onChanged,
  });

  // [E0] 화면 열림 (생성자 L60-113) → show() / open() L54-58 → retrieve()
  useEffect(() => {
    if (classTreeId == null) return;
    void crud.retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classTreeId]);

  return (
    <LookupModal
      open={model != null}
      title={`문서분류 : ${model?.classTreeFullName ?? ''}`}
      width={1280}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E5] cancleButton[닫기].Select (L90) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 340, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space style={{ height: 42, flex: 'none' }}>
          {/* [E1] retrieveButton[조회].Select (L66) → retrieve() */}
          <Button type="search" onClick={() => crud.retrieve()}>조회</Button>
          {/* [E2] insertButton[등록].Select (L72) → insertRow() */}
          <Button type="register" onClick={crud.addRow}>등록</Button>
          {/* [E4] updateButton[저장].Select (L84) → update(). 저장(n)은 UX-03 */}
          <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
          {/* [E3] deleteButton[삭제].Select (L78) → deleteRow(), [E6] msgBox.DialogHide [YES] (L174) → dcr.Dcr07_ClassDetail.delete */}
          <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<DcrClassDetail> crud={crud} columnDefs={columnDefs}
            rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }} />
        </div>
      </div>
    </LookupModal>
  );
};
