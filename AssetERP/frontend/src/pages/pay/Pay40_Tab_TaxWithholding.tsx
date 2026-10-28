/**
 * 갑근세확인서 발급 (S23) — 경영관리 > 04. 급여관리 > 갑근세확인서 발급 #1364
 * AS-IS: myApp/client/vi/pay/Pay40_Tab_TaxWithholding.java (459줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 Pay40_Tab_TaxWithholding(): 툴바 50(기준연도 50 · [조회][등록][저장][삭제]) + 셀 편집 그리드(체크 다중). 문서분류 칸은 원본도 툴바에 넣지 않는다(L91-93 주석 처리).
 * 1단계: [결재요청] 아이콘의 결재문서 작성(Apr01_Edit_ApprDoc.insertLinkApproval, sys.Sys99_Print.getIncomeTaxWithholding, updateApprId)과
 *        [상세보기] 아이콘의 결재문서 보기(Apr01_Appr.selectById, retrieveApproval)는 다음 단계 — 검사까지만 하고 안내한다.
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 저장 = 저장(n)(UX-03), 날짜 편집 열 120(UX-08)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button as AntButton, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { payApi } from '@/api/pay';
import { dcrApi } from '@/api/dcr';
import { sysApi } from '@/api/sys';
import { PayTaxWithholding } from '@/types/pay';
import { Code } from '@/types/sys';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { CellEditGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<PayTaxWithholding>();

const IN_APPR = ['10', '20', '30'];
const inAppr = (r: PayTaxWithholding) => r.apprId != null && r.statusCode != null && IN_APPR.includes(r.statusCode);

export const Pay40_Tab_TaxWithholding: React.FC = () => {
  // settings() L112: stdYearText = 올해
  const [stdYear, setStdYear] = useState(dayjs().format('YYYY'));
  // 조회·새 행이 Enter 직후의 값을 바로 쓰도록 ref에도 둔다
  const stdYearRef = useRef(stdYear);
  stdYearRef.current = stdYear;
  const [purUseCodes, setPurUseCodes] = useState<Code[]>([]);
  const [classTreeId, setClassTreeId] = useState<number | null>(null);
  const [empRow, setEmpRow] = useState<PayTaxWithholding | null>(null);

  const crud = useGridCrud<PayTaxWithholding>({
    idField: 'incomeTaxWithholdingId',
    // retrieve() L320-336: pay.Pay40_IncomeTaxWithholding.selectByCompanyId(companyId, stdYear)
    search: useCallback(() => payApi.searchTaxWithholdings(stdYearRef.current), []),
    // update() L348-401: 바뀐 행마다 필수 검사 5개 → 상신 중·완료 행이면 막고 → pay.Pay40_IncomeTaxWithholding.updateList → 끝나면 retrieve()
    save: useCallback(async (rows: PayTaxWithholding[]) => {
      for (const r of rows) {
        if (!r.regDate) throw new Error('발급신청일은 필수선택 항목입니다');
        if (!r.personName) throw new Error('사원명은 필수선택 항목입니다');
        if (!r.purUseName) throw new Error('용도는 필수선택 항목입니다');
        if (!r.submitTo) throw new Error('제출처는 필수입력 항목입니다');
        if (r.cnt == null) throw new Error('소요수량(통)은 필수입력 항목입니다');
        if (inAppr(r)) throw new Error('이미 결재가 진행 중이거나 완료된 문서는 수정이 불가능합니다');
      }
      return payApi.saveTaxWithholdings(rows);
    }, []),
    remove: useCallback((ids: number[]) => payApi.deleteTaxWithholdings(ids), []),
    // insertRow() L338-346: 발급신청일 = 오늘, 기준연도 = 기준연도 칸
    newRow: useCallback(() => ({ regDate: dayjs().format('YYYY-MM-DD'), stdYear: stdYearRef.current }), []),
    firstEditField: 'regDate',
    reloadAfterSave: true,
    deleteConfirm: (n: number) => `${n}건의 정보를 삭제하시겠습니까?`,
  });
  const { retrieve: retrieveRows } = crud;
  // 열 정의가 렌더마다 새로 만들어지지 않도록 아이콘 콜백은 ref로 crud를 본다
  const crudRef = useRef(crud);
  crudRef.current = crud;

  // defaultName() L160-180: dcr.Dcr30_Link.selectByLinkCode("X01") — 한 건이면 그 문서분류를 기본으로 쓴다(툴바에 칸이 없어 화면에는 안 보인다)
  useEffect(() => {
    dcrApi.searchClassTreeByLinkCode('X01')
      .then(list => setClassTreeId(list.length === 1 ? list[0].classTreeId : null))
      .catch(() => setClassTreeId(null));
    // 용도 콤보(ComboBoxField "CertUseCode")
    sysApi.searchCodes('CertUseCode').then(setPurUseCodes).catch(() => {});
  }, []);

  // [E0] 화면 열림 (생성자 L81-110) → settings(), defaultName(), retrieve()
  useEffect(() => {
    void retrieveRows();
  }, [retrieveRows]);

  // [E7] lookupEmpInfo.TriggerClick (L184) → openLookupEmpInfo() L294-306: 고른 사원의 ID·이름을 그 행에 넣는다
  const onEmpPicked = (row: TransInfo | null) => {
    const target = empRow;
    setEmpRow(null);
    if (!row || !target) return;
    crud.updateRow(target.incomeTaxWithholdingId, { personId: row.personId, personName: row.korNm ?? '' });
  };

  // [E5] deleteButton[삭제].Select (L143) → delete() L403-438: 선택이 없으면 안내, 결재 중·완료 행이 있으면 막고, 확인 뒤 [E10] msgBox.DialogHide [YES] (L420) → 삭제
  const deleteRows = () => {
    const selected = (crud.gridRef.current?.api.getSelectedRows() ?? []) as PayTaxWithholding[];
    if (selected.length === 0) {
      message.warning('삭제할 항목을 선택해주세요');
      return;
    }
    if (selected.some(inAppr)) {
      message.warning('결재 중이거나 완료된 문서가 포함된 정보는 삭제할 수 없습니다');
      return;
    }
    crud.deleteChecked();
  };

  // buildGrid() L182-292 [E9] actionCell2 (ImageCell "View").callbackOnCreate (L268) → 인라인 L268-273: 상신문서가 있으면 Apr01_Edit_ApprDoc.retrieveApproval (다음 단계)
  const viewAppr = (row: PayTaxWithholding) => {
    if (row.apprId == null) return;
    message.info('결재문서 보기는 다음 단계에서 제공됩니다.');
  };

  // actionCell1 (ImageCell "Edit") L211-266: 저장 안 한 변경이 있으면 막고, 문서분류가 없거나 이미 결재 중·완료면 안내 → (1단계) 결재문서 작성은 다음 단계
  const requestAppr = (row: PayTaxWithholding) => {
    if (crudRef.current.hasChanges()) {
      message.warning('저장 후 다시 시도해 주세요');
      return;
    }
    if (classTreeId == null) {
      message.warning('문서 분류가 지정되지 않았습니다. 관리자에게 문의해 주세요');
      return;
    }
    if (inAppr(row)) {
      message.warning('이미 결재 중이거나 완료된 문서입니다');
      return;
    }
    message.info('전자결재 상신(결재문서 작성)은 다음 단계에서 제공됩니다.');
  };

  const columnDefs = useMemo(() => [
    gb.date('regDate', 120, '발급신청일', { editor: 'date' }),
    // lookupEmpInfo(LookupTriggerField): 돋보기를 누르면 사원찾기. 조회창 트리거 열 패턴(11 §1)
    gb.textCenter('personName', 100, '사원명', {
      cellStyle: { color: '#1677ff' },
      cellRenderer: (p: { data?: PayTaxWithholding; value?: string }) => (
        <><AntButton type="text" size="small" icon={<SearchOutlined />} onClick={e => { e.stopPropagation(); if (p.data) setEmpRow(p.data); }} />{p.value}</>
      ),
    }),
    // [E8] purUseComboBox[CertUseCode].Collapse (L191) → 인라인 L191-199: 고른 용도의 코드·이름을 그 행에 넣는다
    gb.text('purUseName', 250, '용도', {
      editor: 'select',
      values: purUseCodes.map(c => c.name),
      valueSetter: p => {
        p.data.purUseName = p.newValue;
        p.data.purUseCode = purUseCodes.find(c => c.name === p.newValue)?.code ?? p.data.purUseCode;
        return true;
      },
    }),
    gb.text('submitTo', 250, '제출처', { editor: 'text' }),
    gb.long('cnt', 120, '소요수량(통)', { editor: 'number' }),
    gb.long('issueNo', 100, '발급번호'),
    iconCell<PayTaxWithholding>('edit', 'actionCell1', 100, '결재요청', requestAppr),
    gb.textCenter('statusName', 100, '결재상태'),
    iconCell<PayTaxWithholding>('view', 'actionCell2', 100, '상세보기', viewAppr),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [purUseCodes, classTreeId]);

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20 }}>
      <div style={{ height: '100%', boxSizing: 'border-box', border: '1px solid #d9d9d9', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] stdYearText.KeyPress [Enter] (L117) → retrieve() · [E2] retrieveButton[조회].Select (L125) → retrieve() */}
        <SearchBar
          onSearch={() => retrieveRows()}
          loading={crud.loading}
          extra={<>
            {/* [E3] insertButton[등록].Select (L131) → insertRow() */}
            <Button type="register" onClick={() => crud.addRow()}>등록</Button>
            {/* [E4] updateButton[저장].Select (L137) → update(). 저장(n)은 UX-03 */}
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            <Button type="delete" onClick={deleteRows}>삭제</Button>
          </>}
        >
          <SearchBar.Field label="기준연도">
            <SearchBar.Input style={{ width: 70 }} placeholder="YYYY" value={stdYear} onChange={e => setStdYear(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<PayTaxWithholding> crud={crud} columnDefs={columnDefs} />
        </div>
      </div>
      <Emp00_Lookup_SelectSingle open={empRow != null} noneLabel={null} transDate={dayjs().format('YYYY-MM-DD')} onResult={onEmpPicked} onClose={() => setEmpRow(null)} />
    </div>
  );
};
