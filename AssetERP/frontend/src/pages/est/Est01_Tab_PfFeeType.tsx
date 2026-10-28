/**
 * [1375] 펀드관리 > 05. 부동산PF 용역수행 > 부동산PF 수수료 (Q08)
 * AS-IS: myApp/client/vi/est/Est01_Tab_PfFeeType.java (321줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L65-86: 가운데(여백 20, 테두리) = 툴바 50([조회][등록][저장][삭제]) + 셀 편집 그리드(행번호, 체크박스 다중). 열자마자 조회
 * UX보강(10): 저장 = 저장(n)(UX-03), 편집 가능 날짜 열 120(UX-08). 툴바에 검색칸이 없어 SearchBar는 쓰지 않는다(조회 버튼만)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Modal } from 'antd';
import { estApi } from '@/api/est';
import { comApi } from '@/api/com';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { PfFeeType } from '@/types/est';
import { FormMappingMulti } from '@/types/com';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Com11_Lookup_FormMappingMulti } from '../com/Com11_Lookup_FormMappingMulti';

const gb = gbFor<PfFeeType>();
const KIND_CODE = 'EstPfFeeCode';
/** 계획서양식 (용역계약체결) / 결과보고서양식 (용역 결과보고서) */
const LINK_CODE_01 = 'A60';
const LINK_CODE_02 = 'A61';

export const Est01_Tab_PfFeeType: React.FC = () => {
  const [feeCodes, setFeeCodes] = useState<Code[]>([]);
  const [mapping, setMapping] = useState<{ model: FormMappingMulti; linkCode: string } | null>(null);

  const crud = useGridCrud<PfFeeType>({
    idField: 'pfFeeTypeId',
    // retrieve() L188-199: est.Est01_PfFeeType.selectByCompanyId
    search: estApi.searchPfFeeTypes,
    // update() L271-274: GridUpdate → est.Est01_PfFeeType.update (결과 행으로 제자리 교체)
    save: estApi.savePfFeeTypes,
    // [E7] msgBox.DialogHide [YES] (L303) → est.Est01_PfFeeType.delete
    remove: estApi.deletePfFeeTypes,
    deleteConfirm: count => `${count}건을 삭제하시겠습니까?`,
    // insertRow() L201-207: 회사 = 로그인 회사(서버가 채움), 사용시작일 = 오늘
    newRow: useCallback(() => ({ seq: null, feeCode: null, feeName: null, feeDesc: null, startDate: today(), closeDate: null, note: null }), []),
    firstEditField: 'seq',
  });

  // [E0] 화면 열림 (생성자 L65-86) → settings(), retrieve(). 수수료 콤보(EstPfFeeCode)를 읽는다
  useEffect(() => {
    void (async () => {
      try {
        setFeeCodes(await sysApi.searchCodes(KIND_CODE));
      } catch (err) {
        message.error(errorMessage(err, '코드 조회 실패'));
      }
      void crud.retrieve();
    })();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E3] updateButton[저장].Select (L101) → updateChk() L209-269
  const updateChk = async () => {
    if (!crud.hasChanges()) return;
    const changed = crud.getChanged();
    for (const row of changed) {
      if (row.seq == null) { message.warning('조회순서는 필수입력 항목입니다'); return; }
      if (row.feeName == null) { message.warning('수수료항목은 필수선택 항목입니다'); return; }
      if (row.startDate == null) { message.warning('사용시작일은 필수입력 항목입니다'); return; }
    }
    let inUse = 0;
    try {
      inUse = await estApi.countPfFeeTypesInUse(changed.map(r => r.pfFeeTypeId));  // est.Est02_PfContract.checkList
    } catch (err) {
      message.error(errorMessage(err, '확인 실패'));
      return;
    }
    if (inUse > 0) {
      // [E6] msgBox.DialogHide [YES] (L247) → update(), retrieve() / NO·닫기 → retrieve()
      Modal.confirm({
        title: '확인',
        content: '사용중인 수수료항목 값이 있습니다. 수정하시겠습니까?',
        width: 300,
        okText: '예',
        cancelText: '아니오',
        onOk: () => crud.saveRows(),
        onCancel: () => { void crud.retrieve(); },
      });
    } else {
      await crud.saveRows();
    }
  };

  // [E4] deleteButton[삭제].Select (L107) → deleteChk() L276-298: 사용중이면 삭제 불가, 아니면 deleteRow() L300-320
  const deleteChk = async () => {
    const selected = crud.gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.length > 0) {
      try {
        const inUse = await estApi.countPfFeeTypesInUse(selected.map(r => r.pfFeeTypeId));  // est.Est02_PfContract.checkList
        if (inUse > 0) { message.warning('사용중인 수수료항목 값이 존재하여 삭제가 불가능합니다'); return; }
      } catch (err) {
        message.error(errorMessage(err, '확인 실패'));
        return;
      }
    }
    await crud.deleteChecked();
  };

  // 계획서양식·결과보고서양식 아이콘 L126-173: com.Com11_FormMappingMulti.getUpdateModel(회사, EstPfFeeCode, 수수료 코드, A60|A61) → Com11_Lookup_FormMappingMulti.open
  const openMapping = async (row: PfFeeType, linkCode: string) => {
    try {
      const model = await comApi.getFormMappingMulti(KIND_CODE, row.feeCode, linkCode);
      setMapping({ model, linkCode });
    } catch (err) {
      message.error(errorMessage(err, '양식 조회 실패'));
    }
  };

  // buildGrid() L115-186
  const columnDefs = useMemo(() => [
    gb.longCenter('seq', 100, '조회순서', { editor: 'number' }),                                       // L176
    // [E5] feeCodeComboBox[EstPfFeeCode].Collapse (L117-125): 수수료 코드·이름을 바꾸고 정의는 "자동입력"
    gb.text('feeName', 200, '부동산PF 수수료 항목', {                                                   // L177
      editor: 'select',
      values: feeCodes.map(c => c.name),
      valueSetter: p => {
        const name = (p.newValue ?? '') as string;
        const data = p.data as PfFeeType;
        data.feeName = name;
        data.feeCode = feeCodes.find(c => c.name === name)?.code ?? null;
        data.feeDesc = '자동입력';
        return true;
      },
    }),
    gb.textArea('feeDesc', 500, '정의'),                                                              // L178
    gb.date('startDate', 120, '사용시작일', { editor: 'date' }),                                      // L179 (UX-08: 편집 가능 날짜는 120)
    gb.date('closeDate', 120, '사용종료일', { editor: 'date' }),                                      // L180
    gb.text('note', 250, '비고', { editor: 'text' }),                                                // L181
    iconCell<PfFeeType>('edit', 'planForm', 120, '계획서양식', row => { void openMapping(row, LINK_CODE_01); }),        // L182 actionCell01
    iconCell<PfFeeType>('edit', 'resultForm', 120, '결과보고서양식', row => { void openMapping(row, LINK_CODE_02); }),  // L183 actionCell02
  ], [feeCodes]);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8, padding: 10 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {/* [E1] retrieveButton[조회].Select (L89) → retrieve() */}
          <Button type="search" onClick={crud.retrieve}>조회</Button>
          {/* [E2] insertButton[등록].Select (L95) → insertRow() L201-207 */}
          <Button type="register" onClick={crud.addRow}>등록</Button>
          <Button type="save" count={crud.changes} onClick={updateChk}>저장</Button>
          <Button type="delete" onClick={deleteChk}>삭제</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<PfFeeType> crud={crud} columnDefs={columnDefs} />
        </div>
      </div>
      <Com11_Lookup_FormMappingMulti model={mapping?.model ?? null} linkCode={mapping?.linkCode ?? ''} onClose={() => setMapping(null)} />
    </div>
  );
};

/** LoginUser.getToday() — 'yyyy-MM-dd' */
function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
