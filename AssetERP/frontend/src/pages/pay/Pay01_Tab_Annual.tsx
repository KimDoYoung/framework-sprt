/**
 * 연봉계약관리 (S13) — 경영관리 > 03. 연봉관리 > 연봉계약관리 #1037
 * AS-IS: myApp/client/vi/pay/Pay01_Tab_Annual.java (797줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 getEditor(): 툴바 45(사원명 · 기간 라디오(최근등록내역/년도별 [년도]/전체) · 퇴사자 포함 · [조회][등록][저장][삭제] · [템플릿][엑셀업로드] · [계약서 양식작성])
 *   + 연봉계약 셀 편집 그리드(체크 다중, 2단 헤더 "기본정보"·"연봉 구성"·"월급여 구성") + 아래 70(문서분류 트리거 칸 800 · [상신] 120).
 * 1단계: [상신]의 결재문서 작성 Apr01_Edit_ApprDoc과 상신상태 아이콘의 결재문서 보기(다른 도메인 apr)는 다음 단계 — 상신 검사까지만 하고 안내한다.
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 저장 = 저장(n)(UX-03), 날짜 편집 열 120(UX-08)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button as AntButton, Checkbox, Input, message, Modal, Radio } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { payApi } from '@/api/pay';
import { empApi } from '@/api/emp';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { PayAnnual } from '@/types/pay';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { CellEditGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { Dcr30_Move_DcrClass } from '@/components/lookup/Dcr30_Move_DcrClass';
import { useGridCrud } from '@/hooks/useGridCrud';
import dayjs from 'dayjs';
import { ACT_MAPPING_KEYS, setActMappingKeys } from './pay06Tags';
import { Pay06_Lookup_ActList } from './Pay06_Lookup_ActList';

const gb = gbFor<PayAnnual>();

const IN_APPR = ['10', '20', '30'];
const DOC_EMPTY_TEXT = '미선택시 자동으로 관리자가 지정한 문서분류에 상신이 진행됩니다.';

export const Pay01_Tab_Annual: React.FC = () => {
  const today = dayjs().format('YYYY-MM-DD');
  // settings() L207-: yearText = 올해(비활성), radio01 선택 = 최근등록내역(radioOption 1), 퇴사자 포함 = false
  const [radioOption, setRadioOption] = useState(1);
  const [yearText, setYearText] = useState(dayjs().format('YYYY'));
  const [retireYn, setRetireYn] = useState(false);
  const [personName, setPersonName] = useState('');
  // 조회 함수가 사원을 고른 직후의 값을 바로 쓰도록 ref에도 둔다
  const personIdRef = useRef<number | null>(null);
  const changePerson = (id: number | null) => { personIdRef.current = id; };
  // ValueChange(글자가 바뀐 채로 칸을 벗어남·Enter)를 가르는 마지막 확정 글자
  const committedRef = useRef('');
  const [personLookup, setPersonLookup] = useState<{ searchText: string } | null>(null);
  const [cellLookup, setCellLookup] = useState<PayAnnual | null>(null);
  const [classTree, setClassTree] = useState<{ classTreeId: number | null; classTreeFullName: string } | null>(null);
  const [docOpen, setDocOpen] = useState(false);
  const [docEmpty, setDocEmpty] = useState(DOC_EMPTY_TEXT);
  const [actListOpen, setActListOpen] = useState(false);
  const excelForm = useRef<FileUpdownFormHandle>(null);

  const search = useCallback(() => payApi.searchAnnuals({ personId: personIdRef.current, radioOption, yearStr: yearText, retireYn }),
    [radioOption, yearText, retireYn]);

  const crud = useGridCrud<PayAnnual>({
    idField: 'annualId',
    // retrieve() L565-592: 사원을 안 골랐으면 pay.Pay01_Annual.selectByAll, 골랐으면 selectByPersonId (companyId·radioOption·yearStr·retireYn)
    search,
    // update() L601-633: 상신 중·완료 행이면 "상신중인 문서가 포함되어있습니다…", 종료일 < 시작일이면 "시작일과 종료일을 확인해주세요"(서버도 같은 문구) → 끝나면 retrieve()
    save: useCallback(async (rows: PayAnnual[]) => {
      for (const r of rows) {
        if (r.apprStatusCode && IN_APPR.includes(r.apprStatusCode)) throw new Error('상신중인 문서가 포함되어있습니다. 해당 문서는 저장이 불가능합니다');
        if (r.startDate && r.closeDate && r.closeDate < r.startDate) throw new Error('시작일과 종료일을 확인해주세요');
      }
      return payApi.saveAnnuals(rows);
    }, []),
    remove: useCallback((ids: number[]) => payApi.deleteAnnuals(ids), []),
    // insert() L594-599: companyId만 (서버가 로그인 회사로 넣는다)
    newRow: useCallback(() => ({}), []),
    firstEditField: 'personName',
    reloadAfterSave: true,
    deleteConfirm: '선택한 내용을 삭제하시겠습니까?',
  });
  const { retrieve: retrieveRows } = crud;

  // defaultName() L186-205: dcr.Dcr30_Link.selectByLinkCode("D01") — 한 건이면 그 분류 이름을 칸의 안내 글로, 아니면 미지정 안내
  const defaultName = useCallback(async () => {
    try {
      const list = await dcrApi.searchClassTreeByLinkCode('D01');
      setDocEmpty(list.length === 1 ? list[0].classTreeFullName : '문서분류가 미지정 상태입니다. 관리자에게 문의해주세요');
    } catch {
      setDocEmpty('문서분류가 미지정 상태입니다. 관리자에게 문의해주세요');
    }
  }, []);

  // [E0] 화면 열림 (생성자 L124-184) → settings(), createMapping(), defaultName() (조회는 열 때 하지 않는다)
  useEffect(() => {
    void defaultName();
  }, [defaultName]);

  // [E2] personName.TriggerClick (L245) → openLookupPerson(null)
  // [E3] personName.ValueChange (L251): 비우면 사원 해제 후 retrieve(), 아니면 재직(100) '%글자%'로 찾아 한 명이면 바로 선택·retrieve(), 아니면 openLookupPerson(글자)
  const onPersonCommit = async (text: string) => {
    if (text === committedRef.current) return;
    committedRef.current = text;
    if (text === '') {
      changePerson(null);
      await retrieveRows();
      return;
    }
    try {
      const list = await empApi.searchTransInfos(today, text, '100');
      if (list.length === 1) {
        setPersonName(list[0].korNm ?? '');
        committedRef.current = list[0].korNm ?? '';
        changePerson(list[0].personId);
        await retrieveRows();
      } else {
        setPersonLookup({ searchText: text });
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // openLookupPerson() L476-491: 고르면 이름·ID를 채우고, [전체](null)이면 비운다 (조회는 하지 않는다)
  const onPersonPicked = (row: TransInfo | null) => {
    setPersonLookup(null);
    committedRef.current = row?.korNm ?? '';
    setPersonName(row?.korNm ?? '');
    changePerson(row?.personId ?? null);
  };

  // [E16] lookupEmpInfo.TriggerClick [result != null] (L388) → 인라인 L388-407: 고른 사원의 사번·ID·이름을 그 행에 넣는다. 고르지 않으면(null) 아무것도 안 한다
  const onCellPersonPicked = (row: TransInfo | null) => {
    const target = cellLookup;
    setCellLookup(null);
    if (!row || !target) return;
    crud.updateRow(target.annualId, { personNo: row.empNo ?? '', personId: row.personId, personName: row.korNm ?? '' });
  };

  // [E7] deleteButton[삭제].Select (L300) → delete() L635-655: 상신 중·완료 행이 있으면 막고, 확인("삭제", 300폭) 뒤
  //   [E18] messageBox.DialogHide (L645) → deleteSelectedRow() L657-668 (끝나면 첫 행 선택 — 생략: 체크박스 그리드라 첫 행이 삭제 대상으로 체크돼 다음 삭제를 잘못 부를 수 있다)
  const deleteRows = async () => {
    const selected = (crud.gridRef.current?.api.getSelectedRows() ?? []) as PayAnnual[];
    if (selected.some(r => r.apprStatusCode && IN_APPR.includes(r.apprStatusCode))) {
      message.warning('상신중인 문서가 포함되어있습니다. 해당 문서는 삭제가 불가능합니다');
      return;
    }
    crud.deleteChecked();
  };

  // [E11] tempDownloadButton[템플릿].Select (L332) → downloadForm.submit() (./excelTemplete/Template_연봉계약정보.xlsx)
  const downloadTemplate = async () => {
    try {
      await payApi.downloadAnnualTemplate();
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    }
  };

  // [E12] excelUploadButton[엑셀업로드].Select [YES] (L338) → 확인 창(600폭) → [E13] msgBox.DialogHide [YES] (L343) → excelUpload() L763-779: 파일 선택
  const excelUpload = () => {
    Modal.confirm({
      title: '확인',
      content: '[사번/적용시작일/적용종료일]이 동일한 내역 존재시 기존내역 삭제 후 등록됩니다',
      width: 600,
      okText: '예',
      cancelText: '아니오',
      onOk: () => excelForm.current?.click(),
    });
  };

  // [E19] fileUploadField.Change (L771) → uploadExcelForm.submit() · [E15] uploadExcelForm.SubmitComplete (L375) → retrieve()
  const onExcelFile = async (file?: File) => {
    if (!file) return;
    try {
      const count = await payApi.uploadAnnualsExcel(file);
      message.success(`연봉계약정보를 업로드하였습니다. (${count}건)`);
    } catch (err) {
      message.error(errorMessage(err, '업로드 실패'));
    }
    await retrieveRows();
  };

  // [E10] apprButton[상신].Select (L326) → insertLinkApproval() L493-547: 고른 행 검사 → (1단계) Apr01_Edit_ApprDoc.insertLinkApproval은 다음 단계
  const insertLinkApproval = () => {
    const selected = (crud.gridRef.current?.api.getSelectedRows() ?? [])[0] as PayAnnual | undefined;
    if (!selected) {
      message.warning('상신을 진행할 연봉계약정보를 선택해주세요');
      return;
    }
    if (selected.apprStatusCode === '10' || selected.apprStatusCode === '20') {
      message.warning('이미 상신 중인 연봉계약 정보입니다.');
      return;
    }
    if (selected.apprStatusCode === '30') {
      message.warning('이미 결재가 완료된 정보(문서)입니다.');
      return;
    }
    message.info('전자결재 상신(결재문서 작성)은 다음 단계에서 제공됩니다.');
  };

  // [E14] grid.CellClick (L362) → createMapping() L682-727: 계약서 양식에 쓸 태그(매핑 키) 목록을 정한다
  const createMapping = () => setActMappingKeys(ACT_MAPPING_KEYS);

  // buildGrid() L384-474 — CellEditGrid(Pay01_AnnualModel), 체크 다중. 2단 헤더 3개(기본정보 8열 · 연봉 구성 4열 · 월급여 구성 7열)
  const columnDefs = useMemo(() => [
    gb.group('기본정보', [
      gb.textCenter('posName', 80, '직급'),
      gb.textCenter('personNo', 50, '사번'),
      // lookupEmpInfo(LookupTriggerField): 돋보기를 누르면 사원찾기. 조회창 트리거 열 패턴(11 §1)
      gb.textCenter('personName', 80, '성명', {
        cellStyle: { color: '#1677ff' },
        cellRenderer: (p: { data?: PayAnnual; value?: string }) => (
          <><AntButton type="text" size="small" icon={<SearchOutlined />} onClick={e => { e.stopPropagation(); if (p.data) setCellLookup(p.data); }} />{p.value}</>
        ),
      }),
      gb.date('startDate', 120, '적용시작일', { editor: 'date' }),
      gb.date('closeDate', 120, '적용종료일', { editor: 'date' }),
      gb.textCenter('startTime', 80, '시업시간', { editor: 'text' }),
      gb.textCenter('closeTime', 80, '종업시간', { editor: 'text' }),
      gb.longCenter('monthOtHours', 80, '월연장<br>근로시간', { editor: 'number' }),
    ]),
    gb.group('연봉 구성', [
      gb.long('annualPay', 100, '기본연봉', { editor: 'number' }),
      gb.long('retirePay', 100, '퇴직금', { editor: 'number' }),
      gb.long('yearPay', 100, '총연봉'),
      gb.text('etcAgreement', 100, '기타약정사항', { editor: 'text' }),
    ]),
    gb.group('월급여 구성', [
      gb.long('basicPay', 100, '기본급여', { editor: 'number' }),
      gb.long('mealPay', 100, '중식대', { editor: 'number' }),
      gb.long('carMt', 100, '차량유지비', { editor: 'number' }),
      gb.long('childcareAllowance', 100, '양육수당', { editor: 'number' }),
      gb.long('overPay', 100, '연장근로', { editor: 'number' }),
      gb.long('etc01Pay', 100, '기타급여1', { editor: 'number' }),
      gb.long('etc02Pay', 100, '기타급여2', { editor: 'number' }),
    ]),
    gb.long('monthPay', 100, '합계'),
    gb.textCenter('apprStatusName', 100, '상신상태'),
    // [E17] viewCell (ImageCell).callbackOnCreate (L428) → 인라인 L428-433. viewCell(ImageCell "View") L409-438: 상신문서가 없으면 "상신문서가 없습니다", 있으면 Apr01_Edit_ApprDoc.retrieveApproval (다음 단계)
    iconCell<PayAnnual>('view', 'actionCell', 60, '', row => {
      if (row.apprId == null) { message.warning('상신문서가 없습니다'); return; }
      message.info('결재문서 보기는 다음 단계에서 제공됩니다.');
    }),
  ], []);

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20 }}>
      <div style={{ height: '100%', boxSizing: 'border-box', border: '1px solid #d9d9d9', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E4] retrieveButton[조회].Select (L282) → retrieve() */}
        <SearchBar
          onSearch={() => retrieveRows()}
          loading={crud.loading}
          extra={<>
            {/* [E5] insertButton[등록].Select (L288) → insert() */}
            <Button type="register" onClick={() => crud.addRow()}>등록</Button>
            {/* [E6] updateButton[저장].Select (L294) → update(). 저장(n)은 UX-03 */}
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            <Button type="delete" onClick={deleteRows}>삭제</Button>
            <span style={{ width: 16 }} />
            <Button type="download" onClick={downloadTemplate}>템플릿</Button>
            <Button type="upload" onClick={excelUpload}>엑셀업로드</Button>
            <FileUpdownForm ref={excelForm} accept=".xlsx,.xls" onChange={onExcelFile} />
            <span style={{ width: 16 }} />
            {/* [E8] mappingButton[계약서 양식작성].Select (L306) → Pay06_Lookup_ActList.open("D01", "연봉계약", callback{defaultName()}) */}
            <Button type="register" onClick={() => setActListOpen(true)}>계약서 양식작성</Button>
          </>}
        >
          <SearchBar.Field label="사원명">
            <Input
              style={{ width: 100 }}
              placeholder="전체"
              value={personName}
              allowClear
              suffix={<SearchOutlined style={{ cursor: 'pointer' }} onClick={() => setPersonLookup({ searchText: '' })} />}
              onChange={e => { setPersonName(e.target.value); if (e.target.value === '') void onPersonCommit(''); }}
              onPressEnter={e => void onPersonCommit((e.target as HTMLInputElement).value.trim())}
              onBlur={e => void onPersonCommit(e.target.value.trim())}
            />
          </SearchBar.Field>
          {/* [E1] toggleGroup.ValueChange (L222) → radioOption 1·2·3, 년도별일 때만 년도 입력 */}
          <Radio.Group value={radioOption} onChange={e => setRadioOption(e.target.value)}>
            <Radio value={1}>최근등록내역</Radio>
            <Radio value={2}>년도별</Radio>
            <Input style={{ width: 70 }} placeholder="YYYY" disabled={radioOption !== 2} value={yearText} onChange={e => setYearText(e.target.value)} />
            <Radio value={3} style={{ marginLeft: 8 }}>전체</Radio>
          </Radio.Group>
          <Checkbox checked={retireYn} onChange={e => setRetireYn(e.target.checked)}>퇴사자 포함</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<PayAnnual> crud={crud} columnDefs={columnDefs} onCellClicked={createMapping} />
        </div>
        <div style={{ flex: 'none', height: 70, display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* [E9] classTreeFullName[문서분류].TriggerClick (L320) → openLookupDoc() L671-680 */}
          <span style={{ fontWeight: 'bold', width: 95, textAlign: 'right' }}>문서분류</span>
          <LookupInput value={classTree?.classTreeFullName ?? ''} placeholder={docEmpty} width={800} onOpen={() => setDocOpen(true)} />
          <Button type="register" onClick={insertLinkApproval}>상신</Button>
        </div>
      </div>
      <Emp00_Lookup_SelectSingle open={personLookup != null} separateAddTitle searchText={personLookup?.searchText ?? ''} transDate={today} onResult={onPersonPicked} onClose={() => setPersonLookup(null)} />
      <Emp00_Lookup_SelectSingle open={cellLookup != null} separateAddTitle transDate={today} onResult={onCellPersonPicked} onClose={() => setCellLookup(null)} />
      <Dcr30_Move_DcrClass
        open={docOpen}
        onResult={r => { setDocOpen(false); setClassTree(r.classTreeId == null ? null : { classTreeId: r.classTreeId, classTreeFullName: r.classTreeFullName ?? '' }); }}
        onClose={() => setDocOpen(false)}
      />
      <Pay06_Lookup_ActList open={actListOpen} menuCode="D01" menuName="연봉계약" onClosed={() => void defaultName()} onClose={() => setActListOpen(false)} />
    </div>
  );
};
