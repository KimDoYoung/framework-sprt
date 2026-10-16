/**
 * [1409] 관리자 > 01. 화면권한관리 > 특정화면 사용요청 (A27)
 * AS-IS: myApp/client/vi/sys/Sys53_Tab_SpecificMenuRequest.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L67-95: 툴바(구분·특정업무구분 콤보·조회·등록·저장·삭제) + 셀 편집 그리드(행번호, 체크박스 단일)
 * 결재요청 아이콘이 여는 전자결재(Apr01_Edit_ApprDoc)·분류선택(Dcr01_Lookup_Class)은 다른 도메인이라 이 단계에서 제외 — 작업기록 "의존"
 * UX보강(10) B12-2: 툴바 = SearchBar(UX-01·02, 조건 2개 콤보 → 초기화는 전체·전체, 자동 조회 없음), 저장 = 저장(n)(UX-03). 1410과 같은 패턴
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { sysApi } from '@/api/sys';
import { Code, SpecificMenuRequest } from '@/types/sys';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { CellEditGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar, useSearchParams } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';

type Row = SpecificMenuRequest;
const gb = gbFor<Row>();

/** AS-IS buildGrid() L129-183 */
const buildGrid = (works: Code[], requestApproval: (r: Row) => void) => [
  gb.date('regDate', 100, '신청일'),
  gb.text('personNm', 200, '신청자'),
  // [E5] specificWorkComboBox[SpecificWorkCode].Collapse (L131) → addChange(specificWorkCode, getCode()) + addChange(specificWorkName, getName())
  gb.text('specificWorkNm', 120, '특정업무', {
    editor: 'select',
    values: works.map(c => c.name),
    valueSetter: p => {
      p.data.specificWorkNm = p.newValue;
      p.data.specificWorkCd = works.find(c => c.name === p.newValue)?.code ?? null;
      return true;
    },
  }),
  iconCell<Row>('edit', 'actionCell', 80, '결재요청', requestApproval),  // L145-173 actionCell
  gb.textStatus('aprStatusNm', 100, '문서상태'),
  gb.text('confirmNm', 200, '처리담당자'),
  gb.textStatus('stateNm', 100, '처리상태'),
];

export const Sys53_Tab_SpecificMenuRequest: React.FC = () => {
  const [works, setWorks] = useState<Code[]>([]);
  // specificStateComboBoxField ComboBoxField("SpecificStateCode", "%", "전체"), specificWorkComboBoxField ComboBoxField("SpecificWorkCode", "%", "전체")
  const sp = useSearchParams(() => ({ stateCd: '%', specificWorkCd: '%' }));
  const { stateCd, specificWorkCd } = sp.values;
  const [defaults, setDefaults] = useState<Partial<Row>>({}); // insertRow() L266-274: 신청자·신청일

  const crud = useGridCrud<Row>({
    idField: 'specificMenuRequestId',
    // retrieve() L251-264: companyId, stateCode, specificWorkCode → sys.Sys53_SpecificMenuRequest.selectByText
    search: useCallback(() => sysApi.searchSpecificMenuRequests(stateCd, specificWorkCd), [stateCd, specificWorkCd]),
    // update() L276-295: GridUpdate → sys.Sys53_SpecificMenuRequest.update
    save: sysApi.updateSpecificMenuRequests,
    remove: sysApi.deleteSpecificMenuRequests,
    // insertRow() L266-274: personId·personName·companyId·regDate를 채운 빈 행 — 아무것도 안 고치고 저장하면 저장 안 됨
    newRow: useCallback(() => defaults, [defaults]),
    firstEditField: 'specificWorkNm',
    // update() L276-295: 변경 행마다 특정업무 필수, 결재문서가 진행중(10·20·30)이면 막는다
    validate: changed => {
      for (const r of changed) {
        if (!r.specificWorkCd) return '특정업무 구분은 필수선택 항목입니다';
        if (r.aprStatusCd === '10' || r.aprStatusCd === '20' || r.aprStatusCd === '30') {
          return '진행중인 문서가 포함되어있습니다. 취소 후 진행해주세요';
        }
      }
      return undefined;
    },
    // deleteChk() L297-326 → [E6] messageBox.DialogHide [YES] (L311) → deleteRow() L328-337
    deleteConfirm: '선택한 내용을 삭제하시겠습니까?',
  });

  // 결재요청 아이콘 (buildGrid L131-173): 특정업무가 없으면 막는다. apr.Apr01_Appr.selectById 결과에 따라
  // 결재문서가 있으면 Apr01_Edit_ApprDoc.retrieveApproval, 없으면 checkdcr() L185-217 → Dcr01_Lookup_Class → insertLinkApproval() L219-230
  // → updateApprId() L232-249 (sys.Sys53_SpecificMenuRequest.update 후 retrieve). 전자결재·분류선택은 다른 도메인이라 아직 없음
  const requestApproval = useCallback((r: Row) => {
    if (!r.specificWorkCd) {
      message.warning('저장 후에 결재요청을 진행해주세요');
      return;
    }
    message.info('전자결재 화면(Apr01_Edit_ApprDoc)은 아직 변환 전입니다');
  }, []);

  const columnDefs = useMemo(() => buildGrid(works, requestApproval), [works, requestApproval]);

  // [E4] deleteButton[삭제].Select (L121) → deleteChk() L297-326
  const deleteChk = () => {
    const selected = crud.gridRef.current?.api?.getSelectedRows()[0];
    if (!selected) {
      message.warning('내용을 선택해주세요');
      return;
    }
    if (selected.stateCd === '20') {
      message.warning('완료처리된 내용은 삭제가 불가능합니다');
      return;
    }
    if (selected.aprStatusCd != null && selected.aprStatusCd !== '40' && selected.aprStatusCd !== '99') {
      message.warning('진행중인 문서가 포함되어있어 삭제가 불가능합니다');
      return;
    }
    crud.deleteChecked();
  };

  useEffect(() => {
    sysApi.searchCodes('SpecificWorkCode').then(setWorks).catch(() => setWorks([]));
    sysApi.newSpecificMenuRequestRow()
      .then(r => setDefaults({ companyId: r.companyId, personId: r.personId, personNm: r.personNm, regDate: r.regDate }))
      .catch(() => setDefaults({}));
  }, []);

  // [E0] 화면 열림 (생성자 L67-95) → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void crud.retrieve(); }, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 8, boxSizing: 'border-box' }}>
      {/* [E1] retrieveButton[조회].Select (L103) → retrieve(). 초기화는 UX-02 */}
      <SearchBar onSearch={crud.retrieve} onReset={sp.reset} loading={crud.loading} extra={<>
        {/* [E2] insertButton[등록].Select (L109) → insertRow() L266-274 */}
        <Button type="register" onClick={crud.addRow}>등록</Button>
        {/* [E3] updateButton[저장].Select (L115) → update() L276-295. 저장(n)은 UX-03 */}
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
        <Button type="delete" onClick={deleteChk}>삭제</Button>
      </>}>
        <SearchBar.Field label="구분:">
          <SystemCodeComboBox kindCd="SpecificStateCode" altCode={['%', '전체']} style={{ width: 100 }} value={stateCd}
            onChange={v => sp.set('stateCd', v ?? '%')} />
        </SearchBar.Field>
        <SearchBar.Field label="특정업무구분:">
          <SystemCodeComboBox kindCd="SpecificWorkCode" altCode={['%', '전체']} style={{ width: 150 }} value={specificWorkCd}
            onChange={v => sp.set('specificWorkCd', v ?? '%')} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        {/* setChecked(SINGLE) = 체크박스 단일 선택 */}
        <CellEditGrid<Row> crud={crud} columnDefs={columnDefs} sortable={false}
          rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: false }} />
      </div>
    </div>
  );
};
