/**
 * [1349] 신청 > 80. 사업비 신청 > 여비교통비 신청 (Y07)
 * AS-IS: myApp/client/vi/emp/Emp50_Tab_TransportExpense.java (987줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L121-332: 가운데(여백 20) = 툴바 50(기준년월 년 45 + 월 콤보 60 · [조회][등록][등록(복사)][저장][삭제] · 마감 안내) + 셀 편집 그리드(체크 다중, 헤더 묶음 행선지·시간·영수증, 합계 행 "계")
 *   + 폼 70(문서분류 800 · 상신상태 250 · [상신][문서보기]). 영수증 파일은 행의 [등록]·[삭제] 아이콘, "여부"를 누르면 파일보기.
 * 상신 = 전자결재 편집창 Apr01_Edit_ApprDoc 링크코드 A42(여비교통비 신청서) — insertLinkApproval() L710-813, 결재문서 ID는 emp.Emp51_RelateAppr.updateApprId.
 * 스타일: CG (견본 Apr10_Tab_Stamp + SG 견본 Tdm01_Tab_Hr — 바깥 여백 20, 안쪽 padding 10, 테두리 없음, 툴바-그리드 간격 8, 아래 폼 줄 flex:none 70). 조건이 있는 셀 편집 그리드라 SearchBar + extra. AS-IS 판별기는 SG(셀 편집 그리드를 보지 못함)
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 저장(n) UX-03
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Modal } from 'antd';
import dayjs from 'dayjs';
import { dcrApi } from '@/api/dcr';
import { empMyTransportApi } from '@/api/emp';
import { fileApi, FILE_DELETE_STATUS } from '@/api/file';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { MyTransport } from '@/types/emp';
import { FileInfo } from '@/types/sys';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Dcr30_Move_DcrClass, Dcr30ClassResult } from '@/components/lookup/Dcr30_Move_DcrClass';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';
import { Sys10_Lookup_FileViewer } from '../sys/Sys10_Lookup_FileViewer';

const gb = gbFor<MyTransport>();
const NO_CLASS_TEXT = '문서분류가 미지정 상태입니다. 관리자에게 문의해주세요';
const ACTIVE = ['10', '20', '30'];   // 상신 중·결재 중·완료

export const Emp50_Tab_TransportExpense: React.FC = () => {
  // 생성자 L124-146: 기준년월의 기본값은 이번 달
  const [year, setYear] = useState(() => dayjs().format('YYYY'));
  const [month, setMonth] = useState(() => dayjs().format('MM'));
  const [transportCodes, setTransportCodes] = useState<Code[]>([]);
  const [closed, setClosed] = useState(false);    // notice "※ 신청이 마감되었습니다. 다음달에 신청하세요"
  const [classTree, setClassTree] = useState<{ id: number | null; name: string }>({ id: null, name: '' });
  const [classText, setClassText] = useState('');
  const [classHint, setClassHint] = useState('');
  const [apprStep, setApprStep] = useState({ code: '00', name: '미상신' });
  const [apprId, setApprId] = useState<number | null>(null);
  const [apprEnabled, setApprEnabled] = useState(true);
  const [apprViewEnabled, setApprViewEnabled] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const [viewApprId, setViewApprId] = useState<number | null>(null);
  const [linkDoc, setLinkDoc] = useState<{ relateApprId: number; regNo: string; yyyymm: string; ids: number[] } | null>(null);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);
  const committedYear = useRef(year);
  const fileInput = useRef<HTMLInputElement>(null);
  const uploadTarget = useRef<MyTransport | null>(null);
  const ym = useRef('');
  ym.current = `${year.trim()}.${month}`;
  const getYYYYMM = () => ym.current;

  // retrieve() L381-397: emp.Emp50_TransportExpense.selectByYearMonth(yyyymm) → 끝나면 apprChk(), closeChk()
  const search = useCallback(() => empMyTransportApi.search(ym.current), []);
  const save = useCallback((rows: MyTransport[]) => empMyTransportApi.save(rows), []);
  const remove = useCallback((ids: number[]) => empMyTransportApi.deleteMine(ids), []);
  // insertRow() L589-602: 회사·사원·기준년월·일자 = 그 달 1일·교통수단 01 택시
  const newRow = useCallback((): Partial<MyTransport> => ({
    yyyymm: ym.current, date: dayjs(`${ym.current.replace('.', '-')}-01`).format('YYYY-MM-DD'), transportCode: '01', transportName: '택시',
  }), []);
  const crud = useGridCrud<MyTransport>({
    idField: 'transportExpenseId', search, save, remove, newRow, firstEditField: 'date', reloadAfterSave: true,
    deleteConfirm: n => `${n}건을 삭제하시겠습니까?`,
  });
  const { retrieve: crudRetrieve } = crud;

  // apprChk() L399-447: 기준년월의 상신 상태 → 상신/문서보기 단추 활성
  const apprChk = useCallback(async () => {
    try {
      const st = await empMyTransportApi.getAppr(ym.current);
      if (st == null || st.statusCode == null) {
        setApprStep({ code: '00', name: '미상신' }); setApprId(null); setApprEnabled(true); setApprViewEnabled(false);
      } else if (st.statusCode === '40') {
        setApprStep({ code: st.statusCode, name: st.statusName ?? '' }); setApprId(st.apprId); setApprEnabled(true); setApprViewEnabled(true);
      } else {
        setApprStep({ code: st.statusCode, name: st.statusName ?? '' }); setApprId(st.apprId); setApprEnabled(false); setApprViewEnabled(true);
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);
  // closeChk() L449-469: 마감된 달이면 안내를 보인다
  const closeChk = useCallback(async () => {
    try { setClosed(await empMyTransportApi.isClosed(ym.current)); } catch (err) { message.error(errorMessage(err, '조회 실패')); }
  }, []);

  const retrieve = useCallback(async () => {
    committedYear.current = year;
    await crudRetrieve();
    await apprChk();   // 상신체크
    await closeChk();  // 마감체크
  }, [crudRetrieve, apprChk, closeChk, year]);

  // [E0] 화면 열림 (생성자 L121-332) → retrieve(), defaultName()
  useEffect(() => {
    sysApi.searchCodes('TransportCode').then(setTransportCodes).catch(() => {});
    void retrieve();
    // defaultName() L689-708: 연결코드 A42의 문서분류 — 한 건이면 모델에 넣고 칸에 흐린 글씨로, 아니면 안내
    void (async () => {
      try {
        const trees = await dcrApi.searchClassTreeByLinkCode('A42');
        if (trees.length === 1) {
          setClassTree({ id: trees[0].classTreeId, name: trees[0].classTreeFullName });
          setClassHint(trees[0].classTreeFullName);
        } else {
          setClassHint(NO_CLASS_TEXT);
        }
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAppr = () => ACTIVE.includes(apprStep.code);   // checkAppr() L815-822
  const checkClose = async () => {                          // checkClose() L824-847
    try { return await empMyTransportApi.isClosed(getYYYYMM()); } catch { return false; }
  };

  // preCheck() L471-519: 상신 체크 → 마감 체크 → 동작
  const preCheck = async (action: 'update' | 'insertRow' | 'copyInsertRow' | 'delete') => {
    if (checkAppr()) {
      if (action === 'update' || action === 'delete') message.warning('이미 상신된 문서입니다.');
      else message.warning('이미 상신된 문서입니다. 다음달에 등록하세요');
      return;
    }
    if (await checkClose()) { message.warning('이미 마감된 달입니다. 다음달에 신청해주세요'); return; }
    if (action === 'update') update();
    else if (action === 'insertRow') crud.addRow();
    else if (action === 'copyInsertRow') await copyInsertRow();
    else deleteChk();
  };

  // update() L521-587: 수정한 줄 중 선택한 달이 아닌 일자가 있으면 확인 → emp.Emp50_TransportExpense.update
  const update = () => {
    const changed = crud.getChanged();
    const differentCount = changed.filter(r => r.date != null && dayjs(r.date).format('MM') !== month).length;
    for (const r of crud.rows) {
      if (r.date == null) { message.warning('일자는 필수 입력항목입니다.'); return; }
      if (!r.startPoint) { message.warning('출발지는 필수 입력항목입니다.'); return; }
      if (!r.closePoint) { message.warning('도착지는 필수 입력항목입니다.'); return; }
      if (!r.startTime) { message.warning('출발시간은 필수 입력항목입니다.'); return; }
      if (!r.closeTime) { message.warning('도착시간은 필수 입력항목입니다.'); return; }
      if (r.amt == null) { message.warning('금액은 필수 입력항목입니다.'); return; }
    }
    if (differentCount !== 0) {
      // [E17] msgBox.DialogHide [YES] (L566) → emp.Emp50_TransportExpense.update
      Modal.confirm({ title: '저장', content: '당월이 아닌 일자가 포함되어 있습니다. 저장하시겠습니까?', okText: '예', cancelText: '아니오', width: 330,
        onOk: () => crud.saveRows() });
    } else {
      void crud.saveRows();
    }
  };

  // [E18] msgBox.DialogHide [YES] (L628) → deleteRow() L946-950: emp.Emp50_TransportExpense.delete(체크된 행)
  const deleteChk = () => { void crud.deleteChecked(); };

  // copyInsertRow() L864-895 + copyUpdateRow() L897-909: 고른 줄(첫 번째)과 같은 값의 새 줄을 바로 저장한다
  const copyInsertRow = async () => {
    const list = crud.gridRef.current?.api?.getSelectedRows() ?? [];
    if (list.length === 0) { message.warning('복사할 대상을 선택해주세요.'); return; }
    if (crud.hasChanges()) { message.warning('저장되지 않은 내역이 있습니다. 저장 후 복사해 주세요'); return; }   // 복사 뒤 목록을 다시 읽으므로 고친 내용이 사라지지 않게 막는다
    const src = list[0];
    try {
      await empMyTransportApi.save([{ ...src, transportExpenseId: 0, receiptStr: null, fileId: null }]);
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '복사 실패'));
    }
  };

  // fileUploadChk() L604-623 → fileUpdownForm.click() → [E4] fileUpdownForm.Change (L173): FileUpload?fileType=file&parentId=행 ID → retrieve()
  const fileUploadChk = (row: MyTransport) => {
    if (checkAppr()) { message.warning('이미 상신된 데이터는 수정할 수 없습니다.'); return; }
    if (row.transportExpenseId <= 0) { message.warning('저장 후 영수증을 등록하세요'); return; }
    if (row.receiptStr === 'O') { message.warning('이미 등록되어있습니다. 삭제 후 재등록하시길 바랍니다.'); return; }
    uploadTarget.current = row;
    fileInput.current?.click();
  };
  const onFilePicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    const row = uploadTarget.current;
    if (!file || !row) return;
    try {
      await fileApi.upload(row.transportExpenseId, file);
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '업로드 실패'));
    }
  };

  // fileDeleteChk() L645-675 → [E19] msgBox.DialogHide [YES] (L657) → fileDelete() L919-944: sys.Sys11_RelateFile.checkFileDelete(fileId, parentId)
  const fileDeleteChk = (row: MyTransport) => {
    if (checkAppr()) { message.warning('상신중인 데이터는 삭제할 수 없습니다.'); return; }
    if (row.fileId == null) { message.warning('삭제할 영수증이 없습니다.'); return; }
    Modal.confirm({
      title: '삭제', content: '영수증을 삭제하시겠습니까?', okText: '예', cancelText: '아니오', width: 300,
      onOk: async () => {
        try {
          const r = await fileApi.checkFileDeleteResult(row.fileId!, row.transportExpenseId);
          if (r.status === FILE_DELETE_STATUS.IN_USE) { message.warning(r.message ?? '해당 파일은 사용중인 파일이므로 삭제할 수 없습니다'); return; }
          if (r.status === FILE_DELETE_STATUS.DELETABLE) await fileApi.deleteFile(row.fileId!);   // 3: FileDelete?fileId=
          await retrieve();                                                                        // 1·3 모두 [E3] SubmitComplete → retrieve()
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // [E15] grid.CellClick [event.getCellIndex() == 9] (L286) → 인라인 L286-299: 영수증이 있으면 Sys10_Lookup_FileViewer.open(fileId)
  const openReceipt = async (row: MyTransport) => {
    if (!row.receiptStr || row.fileId == null) return;
    try {
      const files = await fileApi.searchByParentId(row.transportExpenseId);
      setViewFile(files.find(f => f.fileId === row.fileId) ?? { fileId: row.fileId, parentId: row.transportExpenseId, fileNm: '영수증' });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // insertLinkApproval() L710-813
  const insertLinkApproval = async () => {
    if (crud.rows.length === 0) { message.warning('상신할 내용이 없습니다.'); return; }
    if (classTree.id == null) { message.warning('문서분류를 선택해주세요.'); return; }
    try {
      if (ACTIVE.includes(apprStep.code)) {
        // 상신 중이면 emp.Emp51_RelateAppr.selectApprId → apr.Apr01_Appr.selectById → retrieveApproval(닫으면 retrieve())
        setViewApprId(await empMyTransportApi.getApprId(getYYYYMM()));
        return;
      }
      if (await checkClose()) { message.warning('이미 마감된 달입니다. 다음달에 신청해주세요'); void retrieve(); return; }
      const total = crud.rows.reduce((s, r) => s + (r.amt ?? 0), 0);   // getTotalAmt() L968-974
      const created = await empMyTransportApi.createAppr(getYYYYMM(), total);   // emp.Emp51_RelateAppr.insert
      setLinkDoc({ relateApprId: created.relateApprId, regNo: created.regNo, yyyymm: getYYYYMM(), ids: crud.rows.map(r => r.transportExpenseId) });
    } catch (err) {
      message.error(errorMessage(err, '상신 실패'));
    }
  };

  // updateApprId() L850-862: emp.Emp51_RelateAppr.updateApprId(relateApprId, apprId) → retrieve(). 영수증 파일은 결재문서 첨부로 연결(V36)
  const updateApprId = async (id: number) => {
    if (!linkDoc) return;
    try {
      await empMyTransportApi.updateApprId(linkDoc.relateApprId, id);
      await empMyTransportApi.linkReceiptFiles(linkDoc.ids, id);
    } catch (err) {
      message.error(errorMessage(err, '결재문서 ID를 기록하지 못했습니다'));
    }
    void retrieve();
  };

  // [E12] apprButton[상신].Select (L242): 저장하지 않은 내용이 있으면 안내 → insertLinkApproval()
  const onAppr = () => {
    if (crud.hasChanges()) { message.warning('저장되지 않은 내역이 있습니다. 저장 후 상신해 주세요'); return; }
    void insertLinkApproval();
  };

  // [E14] classTreeFullName[문서분류].TriggerClick (L279) → openLookupDoc() L678-687: Dcr30_Move_DcrClass.open(callback) → 고른 분류를 칸에 넣는다
  const onClassResult = (r: Dcr30ClassResult) => {
    setClassTree({ id: r.classTreeId, name: r.classTreeFullName ?? '' });
    setClassText(r.classTreeFullName ?? '');
    setMoveOpen(false);
  };

  // buildGrid() L334-379 (setChecked MULTI, 헤더 묶음 3개, getSumGrid("계", 1, 7, 7))
  const columnDefs = useMemo(() => [
    gb.date('date', 100, '일자', { editor: 'date' }),                                          // L366
    gb.group('행선지', [
      gb.text('startPoint', 150, '출발지', { editor: 'text' }),                                 // L367
      gb.text('closePoint', 150, '도착지', { editor: 'text' }),                                 // L368
    ]),
    gb.group('시간', [
      gb.textCenter('startTime', 100, '출발', { editor: 'text' }),                              // L369
      gb.textCenter('closeTime', 100, '도착', { editor: 'text' }),                              // L370
    ]),
    gb.long('amt', 150, '금액', { editor: 'number' }),                                          // L371
    // [E16] transportCodeComboBox[TransportCode].Collapse (L338) → 인라인 L338-345: 고른 교통수단 이름의 코드를 transportCode 변경으로 기록
    gb.text('transportName', 100, '교통수단', {                                                 // L372
      editor: 'select',
      values: transportCodes.map(c => c.name),
      valueSetter: p => {
        p.data.transportName = p.newValue;
        p.data.transportCode = transportCodes.find(c => c.name === p.newValue)?.code ?? p.data.transportCode;
        return true;
      },
    }),
    gb.group('영수증', [
      gb.textCenter('receiptStr', 60, '여부', {                                                 // L373 addTextCenterCursor
        cellStyle: { cursor: 'pointer', textAlign: 'center' },
        onCellClicked: p => { if (p.data) void openReceipt(p.data); },
      }),
      iconCell<MyTransport>('upload', 'fileUpCell', 60, '등록', fileUploadChk),                      // L374 ImageCell "Upload"
      iconCell<MyTransport>('delete', 'fileDeleteCell', 60, '삭제', fileDeleteChk),             // L375 ImageCell "Delete"
    ]),
    gb.text('note', 200, '비고<br>(비밀번호)', { editor: 'text' }),                               // L376
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [transportCodes, apprStep.code]);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E7] retrieveButton[조회].Select (L209) → retrieve() */}
        <SearchBar
          onSearch={() => void retrieve()}
          loading={crud.loading}
          extra={
            <>
              {/* [E8] insertButton[등록].Select (L216) → preCheck("insertRow") */}
              <Button type="register" onClick={() => void preCheck('insertRow')}>등록</Button>
              {/* [E11] copyButton[등록(복사)].Select (L235) → preCheck("copyInsertRow") */}
              <Button type="register" onClick={() => void preCheck('copyInsertRow')}>등록(복사)</Button>
              {/* [E9] updateButton[저장].Select (L223) → preCheck("update") */}
              <Button type="save" count={crud.changes} onClick={() => void preCheck('update')}>저장</Button>
              {/* [E10] deleteButton[삭제].Select (L229) → preCheck("delete") */}
              <Button type="delete" disabled={!crud.hasChecked} onClick={() => void preCheck('delete')}>삭제</Button>
              {closed && <span style={{ color: '#0078D7', fontSize: 13, marginLeft: 8 }}>※ 신청이 마감되었습니다. 다음달에 신청하세요</span>}
            </>
          }
        >
          <SearchBar.Field label="기준년월">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              {/* [E1] yyyyText.ValueChange (L130) → retrieve(), [E5] yyyyText.KeyPress [Enter] (L193) → retrieve() */}
              <Input style={{ width: 55 }} value={year} onChange={e => setYear(e.target.value)}
                onBlur={() => { if (year !== committedYear.current) void retrieve(); }} onPressEnter={() => void retrieve()} />
              {/* [E2] periodComboBox[MonthsCode].Collapse (L141) → retrieve(), [E6] periodComboBox.ValueChange (L202) → retrieve() */}
              <SystemCodeComboBox kindCd="MonthsCode" allowClear={false} style={{ width: 70 }} value={month}
                onChange={v => { if (!v) return; ym.current = `${year.trim()}.${v}`; setMonth(v); void retrieve(); }} />
            </span>
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<MyTransport> crud={crud} columnDefs={columnDefs} getRowId={p => String(p.data.transportExpenseId)}
            sumRow={{ labelField: 'date', label: '계', sum: ['amt'] }} />
        </div>
        {/* 폼 70 (L301-322, 원본은 테두리 패널이지만 SG는 테두리를 두지 않는다): 문서분류 800 · 상신상태 250 · [상신] 120 · [문서보기] 120, 라벨 폭 105 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 70, flex: 'none' }}>
          <span style={{ width: 105, textAlign: 'right', paddingRight: 10 }}>문서분류</span>
          <div style={{ width: 800, maxWidth: '50%' }}>
            <LookupInput value={classText} placeholder={classHint} width={800} onOpen={() => setMoveOpen(true)} />
          </div>
          <span style={{ width: 105, textAlign: 'right', paddingRight: 10 }}>상신상태</span>
          <Input style={{ width: 140 }} readOnly value={apprStep.name} />
          <Button type="register" disabled={!apprEnabled} onClick={onAppr}>상신</Button>
          {/* [E13] apprViewButton[문서보기].Select (L253) → apr.Apr01_Appr.selectById(apprId) → Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false, 닫으면 apprChk()) */}
          <Button type="search" disabled={!apprViewEnabled} onClick={() => { if (apprId != null) setViewApprId(apprId); }}>문서보기</Button>
        </div>
      </div>
      <input ref={fileInput} type="file" style={{ display: 'none' }} onChange={e => void onFilePicked(e)} />
      <Dcr30_Move_DcrClass open={moveOpen} hideNull onResult={onClassResult} onClose={() => setMoveOpen(false)} />
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
      {/* insertLinkApprovals(classTreeModel, "A42", {gridList, regNo, regDate}) — 본문은 서버가 만든다 `GET apr/apprs/link-seed`(args ids·regNo·regDate) */}
      <Apr01_Edit_ApprDoc
        apprId={viewApprId}
        link={linkDoc && classTree.id != null
          ? { classTreeId: classTree.id, linkCode: 'A42', args: { ids: linkDoc.ids.join(','), regNo: linkDoc.regNo, regDate: linkDoc.yyyymm } } : null}
        onLinkSaved={id => void updateApprId(id)}
        onClosed={() => void retrieve()}
        onClose={() => { setViewApprId(null); setLinkDoc(null); void retrieve(); }}
      />
    </div>
  );
};
