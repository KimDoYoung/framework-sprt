/**
 * [1328] 경영관리 > 91. 법인서류 > 법인서류 매수관리 (T23)
 * AS-IS: myApp/client/vi/apr/Apr16_Tab_StampDocManager.java (521줄) + Apr16_Lookup_StampDocReg (481줄) + Apr16_Lookup_StampReprCorp (206줄) + Apr15_Lookup_ReprCorp (184줄)
 *   + Apr16_Lookup_GetDocAppl (183줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L92-138: north 170 = 툴바 50(등록일 ~ · 구분 · 인감 및 대표명의 칸 · [조회][등록][저장][삭제] · [출력/다운로드]) + 합계 그리드 800×120(구분·인감 및 대표명의·발급·사용·잔여매수)
 *   + 오른쪽 "신청내역이 존재합니다" 링크, center = 셀 편집 그리드(행번호, 체크박스 다중, 합계 행)
 * 1단계: [문서연결](Apr05_Lookup_LoadDoc2)·[문서보기](Apr01_Edit_ApprDoc, 연관문서 아이콘 포함)는 다른 도메인 컴포넌트라 다음 단계 — 안내만 띄운다
 * 스타일: GG 근사 — 위 합계 그리드 + 아래 그리드(page-style 비교는 결과확인 13)
 * UX보강(10): 툴바 = SearchBar(UX-01·04, 초기화는 원본 버튼이 많아 넣지 않음), 저장 = 저장(n)(UX-03)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, Input, message, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { aprStampDocApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { rdApi } from '@/api/rd';
import { AprStampDoc, AprStampDocLookup, AprStampDocSum } from '@/types/apr';
import { Button } from '@/components/button';
import { CellEditGrid, SingleGrid, gbFor, iconCell } from '@/components/grid';
import { dynamicIconCell } from '@/components/grid/iconCell';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { RdViewer } from '@/components/lookup/RdViewer';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Apr16_Lookup_GetDocAppl } from './Apr16_Lookup_GetDocAppl';
import { Apr16_Lookup_StampDocReg } from './Apr16_Lookup_StampDocReg';
import { Apr16_Lookup_StampReprCorp } from './Apr16_Lookup_StampReprCorp';

const gb = gbFor<AprStampDoc>();
const gbSum = gbFor<AprStampDocSum>();
const DATE = 'YYYY-MM-DD';
/** setChecked(MULTI) — 렌더마다 새 객체를 주면 AG Grid가 선택을 지우므로 한 번만 만든다. 행 클릭은 선택을 바꾸지 않는다(삭제 대상, 03 원칙 16) */
const MULTI_SELECTION = { mode: 'multiRow', checkboxes: true, headerCheckbox: true, enableClickSelection: false } as const;

export const Apr16_Tab_StampDocManager: React.FC = () => {
  // settings() L140-289: 등록일 = 올해 1월 1일 ~ 오늘, 구분 = 전체('%'), 인감 및 대표명의 = 전체(빈칸)
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('year'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [applType, setApplType] = useState<string>('%');
  const [stampReprCorpId, setStampReprCorpId] = useState<number | null>(null);
  const [stampReprCorpName, setStampReprCorpName] = useState('');
  // 콜백 안에서 바로 retrieve()를 부르므로 조건의 최신 값을 ref로도 든다
  const cond = useRef({ startDate, closeDate, applType, stampReprCorpId });
  const setCond = (patch: Partial<typeof cond.current>) => { cond.current = { ...cond.current, ...patch }; };

  const [sumRows, setSumRows] = useState<AprStampDocSum[]>([]);
  const [applExists, setApplExists] = useState(false);
  const [regTarget, setRegTarget] = useState<{ row: AprStampDoc | null } | null>(null);
  const [lookupTarget, setLookupTarget] = useState<{ applType: string | null } | null>(null);
  const [getApplOpen, setGetApplOpen] = useState(false);
  const [rd, setRd] = useState<{ url: string; title: string } | null>(null);
  const [printing, setPrinting] = useState(false);

  const typeParam = () => (cond.current.applType === '%' ? undefined : cond.current.applType);

  const crud = useGridCrud<AprStampDoc>({
    idField: 'stampDocId',
    // retrieve() L345-372: apr.Apr16_StampDoc.selectDocByRegDate(companyId, startDate, closeDate, applType, stampReprCorpId)
    search: useCallback(() => aprStampDocApi.search({
      startDate: cond.current.startDate.format(DATE),
      closeDate: cond.current.closeDate.format(DATE),
      applType: typeParam(),
      stampReprCorpId: cond.current.stampReprCorpId ?? undefined,
    }), []),
    save: async () => [],
    remove: async () => 0,
    newRow: useCallback(() => ({}), []),
  });

  // retrieveTotal() L457-478: apr.Apr16_StampDoc.selectDocGroupSum(companyId, applType, stampReprCorpId)
  const retrieveTotal = useCallback(async () => {
    try {
      setSumRows(await aprStampDocApi.searchSum({ applType: typeParam(), stampReprCorpId: cond.current.stampReprCorpId ?? undefined }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // checkAppl() L374-391: apr.Apr16_StampDoc.selectApplDocByRegDateIsNull(companyId) — 있으면 링크를 보인다
  const checkAppl = useCallback(async () => {
    try {
      setApplExists((await aprStampDocApi.searchAppl()).length > 0);
    } catch {
      setApplExists(false);
    }
  }, []);

  const retrieve = useCallback(async () => {
    void retrieveTotal();
    void checkAppl();
    await crud.retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retrieveTotal, checkAppl, crud.retrieve]);

  // [E0] 화면 열림 (생성자 L92-138) → settings(), retrieve()
  // [E1] applTypeName (CommonComboBoxField).callbackOnCreate (L84) → retrieve() — 열 때의 retrieve()와 같아 한 번만 한다
  useEffect(() => {
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E2] applTypeName[sys.Sys00_Common.selectByKindGroupCode].Collapse (L150) → 인감 및 대표명의를 비우고 retrieve()
  const onApplTypeChange = (code: string | undefined) => {
    const next = code ?? '%';
    setApplType(next);
    setStampReprCorpId(null);
    setStampReprCorpName('');
    setCond({ applType: next, stampReprCorpId: null });
    void retrieve();
  };

  // [E3] stampReprCorpName.TriggerClick (L162) → Apr16_Lookup_StampReprCorp.open(applType, startDate, closeDate, callback) 뒤 retrieve()
  const openStampReprCorp = () => {
    if (cond.current.applType === '%') { message.warning('구분을 선택해주세요'); return; }
    setLookupTarget({ applType: cond.current.applType });
  };
  const onStampReprCorpResult = (r: AprStampDocLookup | null) => {
    if (r == null) {
      setStampReprCorpId(null); setStampReprCorpName(''); setCond({ stampReprCorpId: null });
    } else if (r.applType === '1' || r.applType === '2') {
      const id = r.applType === '1' ? r.stampId ?? null : r.reprCorpId ?? null;
      setStampReprCorpId(id); setStampReprCorpName(r.stampReprCorpName ?? ''); setCond({ stampReprCorpId: id });
    } else {
      message.warning('없는 구분값입니다. 관리자에게 문의하세요.');
      return;
    }
    void retrieve();
  };

  // insert() L393-401: Apr16_Lookup_StampDocReg.openNew(callback → retrieveTotal())
  const insert = () => setRegTarget({ row: null });
  // lookupDetail() L480-488: [수정] 아이콘 → Apr16_Lookup_StampDocReg.open(선택한 행, callback → retrieveTotal())
  const lookupDetail = (row: AprStampDoc) => setRegTarget({ row });
  // 등록 창에서 저장하면 목록과 합계를 다시 읽는다(AS-IS는 그리드 store를 제자리 갱신하고 합계만 다시 읽음)
  const onRegSaved = () => { void crud.retrieve(); void retrieveTotal(); };

  // update() L403-412: GridUpdate → apr.Apr16_StampDoc.update(변경 행: 발급매수·사용매수) → "저장이 완료되었습니다." → retrieveTotal()
  const update = async () => {
    crud.gridRef.current?.api?.stopEditing();
    const changed = crud.getChanged();
    if (changed.length === 0) return;
    try {
      await aprStampDocApi.save(changed.map(r => ({
        stampDocId: r.stampDocId, regDate: r.regDate, applType: r.applType, stampId: r.stampId, reprCorpId: r.reprCorpId,
        docIssueQty: r.docIssueQty, docUseQty: r.docUseQty, provideCo: r.provideCo, purpose: r.purpose, note: r.note, apprId: r.apprId,
      })));
      message.success('저장이 완료되었습니다.');
      await crud.retrieve();
      void retrieveTotal();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // deleteChk() L414-431 → [E10] messageBox.DialogHide (L421) → delete() L433-455: apr.Apr16_StampDoc.deleteReg(선택한 행)
  const deleteChk = () => {
    const selected = crud.gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.length === 0) { message.warning('삭제할 내역을 선택하세요'); return; }
    Modal.confirm({
      title: '확인',
      content: `선택된 ${selected.length}건을 삭제하시겠습니까?`,
      width: 450,
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          await aprStampDocApi.deleteReg(selected.map(r => r.stampDocId));
          message.success('삭제가 완료되었습니다.');
          await retrieve();
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // [E9] downLoadButton[출력/다운로드].Select (L248) → 서비스 sys.Sys99_Print.insertRdStampDocManager(companyId, personId, "Apr16_Tab_StampDocManager", startDate, closeDate)
  //   → 성공이면 RDViewer.viewer(mrd Apr16_Rd_StampDocManager · options "/rhtmlimportopt [2]" · rv rdGroupId·companyId·personId·startDate·closeDate)
  const downLoad = async () => {
    setPrinting(true);
    try {
      const s = cond.current.startDate.format(DATE);
      const c = cond.current.closeDate.format(DATE);
      const groupId = await aprStampDocApi.rdPrint(s, c);
      const res = await rdApi.buildUrl({
        kind: 'viewer',
        mrd: 'Apr16_Rd_StampDocManager',
        options: '/rhtmlimportopt [2]',
        rv: { rdGroupId: groupId, startDate: s, closeDate: c },
      });
      setRd({ url: res.url, title: '법인서류 매수관리' });
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    } finally {
      setPrinting(false);
    }
  };

  // lookupAppr() L490-512: ApprCallbackResult → Apr01_Edit_ApprDoc.retrieveApproval — 다른 도메인 컴포넌트라 다음 단계
  const lookupAppr = () => message.info('연관문서 보기(Apr01_Edit_ApprDoc)는 다음 단계에서 제공됩니다');

  // buildTotalGrid() L291-302 (setRowNumHidden)
  const totalColumnDefs = useMemo(() => [
    gbSum.textCenter('applTypeName', 150, '구분'),  // L295
    gbSum.text('stampReprCorpName', 250, '인감 및 대표명의'),  // L296
    gbSum.longCenter('docIssueQty', 100, '발급매수'),  // L297
    gbSum.longCenter('docUseQty', 100, '사용매수'),  // L298
    gbSum.longCenter('docRemainQty', 100, '잔여매수'),  // L299
  ], []);

  // buildGrid() L304-343
  const columnDefs = useMemo(() => [
    iconCell<AprStampDoc>('edit', 'modiCell', 45, '수정', row => lookupDetail(row)),  // L325 actionCell(Edit) → lookupDetail()
    gb.date('regDate', 90, '등록일'),  // L326
    gb.text('applTypeName', 120, '구분'),  // L327
    gb.text('stampReprCorpName', 200, '인감 및 대표명의'),  // L328
    gb.longCenter('docIssueQty', 70, '발급매수', { editor: 'number', cellStyle: { color: '#0069B4' } }),  // L329
    gb.longCenter('docApplQty', 70, '신청매수'),  // L330
    gb.longCenter('docUseQty', 70, '사용매수', { editor: 'number', cellStyle: { color: '#CE4242' } }),  // L331
    gb.text('provideCo', 200, '제공처'),  // L332
    gb.text('purpose', 200, '목적'),  // L333
    gb.text('requester', 100, '요청자'),  // L334
    gb.text('note', 200, '비고'),  // L335
    gb.date('applDate', 90, '신청일'),  // L336
    gb.textCenter('applEmpName', 100, '신청자'),  // L337
    gb.group('연관문서', [  // L322 addHeaderGroupMap(HeaderGroupConfig "연관문서", 1, 3)
      gb.text('apprName', 250, '문서명'),  // L338
      gb.textStatus('apprStatusName', 70, '상태'),  // L339
      dynamicIconCell<AprStampDoc>('view', 'apprCell', 35, ' ', () => lookupAppr(), row => row.apprStatusName != null),  // L340 addDynamicCell(…, true)
    ]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E5] retrieveButton[조회].Select (L223) → retrieve() */}
        <SearchBar
          onSearch={retrieve}
          extra={
            <>
              {/* [E6] insertButton[등록].Select (L229) → insert() */}
              <Button type="register" onClick={insert}>등록</Button>
              {/* [E7] updateButton[저장].Select (L235) → update(). 저장(n)은 UX-03 */}
              <Button type="save" count={crud.changes} onClick={update}>저장</Button>
              {/* [E8] deleteButton[삭제].Select (L241) → deleteChk() */}
              <Button type="delete" onClick={deleteChk}>삭제</Button>
              <Button type="download" onClick={downLoad} loading={printing}>출력/다운로드</Button>
            </>
          }
        >
          <SearchBar.Field label="등록일">
            <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} onChange={d => { if (d) { setStartDate(d); setCond({ startDate: d }); } }} />
            <span>~</span>
            <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} onChange={d => { if (d) { setCloseDate(d); setCond({ closeDate: d }); } }} />
          </SearchBar.Field>
          <SearchBar.Field label="구분">
            <SystemCodeComboBox kindGroupCd="CorpDocStampApplType001" addCodes={[['%', '전체']]} style={{ width: 120 }} value={applType} onChange={onApplTypeChange} />
          </SearchBar.Field>
          <Input readOnly style={{ width: 300, cursor: 'pointer' }} placeholder="전체" value={stampReprCorpName} suffix={<SearchOutlined />} onClick={openStampReprCorp} />
        </SearchBar>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <div style={{ width: 800, height: 120 }}>
            <SingleGrid<AprStampDocSum> rowData={sumRows} columnDefs={totalColumnDefs} rowNumber={false} getRowId={p => String(p.data.stampDocId)} />
          </div>
          {/* [E4] hiperLink[※ 법인서류 신청내역이 존재합니다. 신청내역 가져오기].Click (L210) → Apr16_Lookup_GetDocAppl.open(callback → retrieve()) */}
          {applExists && (
            <div style={{ width: 400, margin: '30px 20px 0 20px', fontSize: 14, fontWeight: 'bold' }}>
              ※ 법인서류 신청내역이 존재합니다.{' '}
              <a href="#" style={{ color: '#0078D7', textDecoration: 'none' }} onClick={e => { e.preventDefault(); setGetApplOpen(true); }}>신청내역 가져오기</a>
            </div>
          )}
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<AprStampDoc>
          crud={crud}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.stampDocId)}
          rowSelection={MULTI_SELECTION}
          sumRow={{ labelField: 'regDate', label: '합계', sum: ['docIssueQty', 'docUseQty'] }}
        />
      </div>
      <Apr16_Lookup_StampDocReg target={regTarget} onSaved={onRegSaved} onClose={() => setRegTarget(null)} />
      <Apr16_Lookup_StampReprCorp target={lookupTarget} onResult={onStampReprCorpResult} onClose={() => setLookupTarget(null)} />
      <Apr16_Lookup_GetDocAppl open={getApplOpen} onDone={() => { setGetApplOpen(false); void retrieve(); }} />
      <RdViewer url={rd?.url ?? null} title={rd?.title ?? ''} onClose={() => setRd(null)} />
    </div>
  );
};
