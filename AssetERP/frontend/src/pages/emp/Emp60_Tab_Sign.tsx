/**
 * [1501] 문서작성 > 04. 전자결재 > 결재서명관리 (G09)
 * AS-IS: myApp/client/vi/emp/Emp60_Tab_Sign.java (308줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L70-91: center=vlc(테두리, 여백 20) — 툴바 [조회][등록][저장][삭제] + 셀 편집 그리드(행 선택 단일, 4열: 사용 100(체크) · 서명 200(이미지) ·
 *   올리기 25 · 비고 700(큰 글상자)). 서명은 사원 한 명이 여러 장을 올려 두되 사용은 하나만 켤 수 있다
 */
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Modal, message } from 'antd';
import dayjs from 'dayjs';
import type { CustomCellRendererProps } from 'ag-grid-react';
import { empSignApi } from '@/api/emp';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { EmpSign } from '@/types/emp';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<EmpSign>();
/** 행 선택 단일(체크박스 없음, setChecked 없음). 렌더마다 새 객체를 주면 AG Grid가 선택을 지우므로 한 번만 만든다 */
const SINGLE_SELECTION = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;

/** update() L162-213: 목록 전체에서 사용(useYn)이 둘 이상이면 저장하지 않는다 */
const validate = (_changed: EmpSign[], all: EmpSign[]): string | undefined => {
  if (all.filter(m => m.useYn === 'true').length > 1) return '하나의 서명만 사용가능합니다. 사용여부체크를 확인해주세요';  // L206
  return undefined;
};

export const Emp60_Tab_Sign: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadRowRef = useRef<EmpSign | null>(null);
  const imageVerRef = useRef(0);

  const crud = useGridCrud<EmpSign>({
    idField: 'signId',
    // retrieve() L149-160: 서비스 emp.Emp60_Sign.selectByPersonId(personId)
    search: empSignApi.searchSigns,
    // updateFinal() L215-227: GridUpdate → emp.Emp60_Sign.update ("정상적으로 등록완료되었습니다")
    save: empSignApi.saveSigns,
    // deleteRow() L272-293: "삭제"/"선택한 서명을 삭제하시겠습니까?"(폭 300) → [E6] msgBox.DialogHide [YES] (L278) → emp.Emp60_Sign.delete
    remove: empSignApi.deleteSigns,
    deleteConfirm: '선택한 서명을 삭제하시겠습니까?',
    newRow: useCallback(() => ({ useYn: 'true' }), []),
    validate,
  });

  // [E0] 화면 열림 (생성자 L70-91) → settings(), retrieve()
  useEffect(() => {
    void crud.retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E3] insertButton[등록].Select (L114) → insertRow() L229-242: GridInsertRow, 비고 = "yyyy년 MM월 dd일 - 신규서명 추가", 사용 true (둘 다 변경으로 표시)
  const insertRow = () => {
    crud.addRows([{ useYn: 'true', note: `${dayjs().format('YYYY년 MM월 DD일')} - 신규서명 추가` }], true);
  };

  // [E5] deleteButton[삭제].Select (L126) → deleteChk() L244-270: 고른 행이 없으면 아무 일 없음 →
  //   emp.Emp60_Sign.deleteChk(결재선에서 쓴 서명이 있으면 "확인"/"사용중인 서명은 삭제가 불가능합니다") → deleteRow()
  const deleteChk = async () => {
    const selected = crud.gridRef.current?.api?.getSelectedRows() ?? [];  // L245
    if (selected.length === 0) return;
    try {
      if (await empSignApi.isSignUsed(selected.map(r => r.signId).filter(id => id > 0))) {
        Modal.info({ title: '확인', content: '사용중인 서명은 삭제가 불가능합니다' });  // L263
        return;
      }
    } catch (err) {
      message.error(errorMessage(err, '삭제 확인 실패'));
      return;
    }
    crud.deleteChecked();
  };

  // [E1] fileUpdownForm.Change (L95) → FileUpload?fileType=image&parentId={signId} 뒤 update()
  const columnDefs = useMemo(() => [
    gb.boolean('useYn', 100, '사용', { editable: true }),  // L142
    {  // L143 addCell(signId_string, 200, "서명", CustomImageCell) — FileDownload?fileType=image&parentId={signId}
      ...gb.textCenter('signIdString', 200, '서명'),
      autoHeight: true,
      // 올리기 뒤 재조회해도 signIdString은 같아 AG Grid가 셀을 다시 그리지 않으므로, 올린 횟수를 값에 섞어 이미지를 다시 요청하게 한다
      valueGetter: (p: { data?: EmpSign }) => p.data?.signIdString ? `${p.data.signIdString}|${imageVerRef.current}` : '',
      cellRenderer: (p: CustomCellRendererProps<EmpSign>) =>
        p.value ? <img alt="" style={{ height: 50, margin: '5px 5px' }} src={fileApi.imageUrl({ parentId: Number(String(p.value).split('|')[0]) })} /> : null,
    },
    // L144 actionCell01(Upload) → fileUpdownForm.click(). 저장 안 된 새 행은 올릴 ID가 없어 안내한다(원본은 parentId=null로 올려 실패)
    iconCell<EmpSign>('upload', 'actionCell', 25, ' ', row => {
      if (row.signId <= 0) {
        message.warning('변경사항을 먼저 저장 후 진행가능합니다');
        return;
      }
      uploadRowRef.current = row;
      fileInputRef.current?.click();
    }),
    gb.textArea('note', 700, '비고', { editor: 'largeText' }),  // L145
  ], []);

  // [E1] fileUpdownForm.Change (L95): 고른 행의 서명ID로 이미지 올림 → update()
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    const row = uploadRowRef.current;
    if (!file || !row) return;
    try {
      await fileApi.upload(row.signId, file);
      imageVerRef.current += 1;
      if (crud.hasChanges()) await crud.saveRows();
      else await crud.retrieve();
    } catch (err) {
      message.error(errorMessage(err, '파일 올리기 실패'));
    }
  };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, border: '1px solid #d9d9d9', padding: 8, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* [E2] retrieveButton[조회].Select (L108) → retrieve() */}
          <Button type="search" onClick={crud.retrieve}>조회</Button>
          {/* [E3] insertButton[등록].Select (L114) → insertRow() */}
          <Button type="register" onClick={insertRow}>등록</Button>
          {/* [E4] updateButton[저장].Select (L120) → update(). 저장(n)은 UX-03 */}
          <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
          {/* [E5] deleteButton[삭제].Select (L126) → deleteChk() */}
          <Button type="delete" onClick={deleteChk}>삭제</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<EmpSign> crud={crud} columnDefs={columnDefs} rowSelection={SINGLE_SELECTION} />
        </div>
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFileChange} />
    </div>
  );
};
