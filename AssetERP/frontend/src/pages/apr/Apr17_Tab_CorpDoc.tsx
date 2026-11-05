/**
 * [1507] 경영관리 > 91. 법인서류 > 구)법인서류 매수관리 (U2-02)
 * AS-IS: myApp/client/vi/apr/Apr17_Tab_CorpDoc.java (421줄) + 신청내역 Apr17_Lookup_CorpDoc(EE92) · 연관문서 Apr18_Lookup_RelateAppr(EE93) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L77-120: north 161(여백 20,20,0,20) = 툴바 50(조회구간 ~ · [조회][등록][저장][삭제] · [출력/다운로드]) + 합계 그리드 500×110(구분 150 · 발급 · 사용 · 잔여매수, 행번호 없음) + 신청내역 안내 링크,
 *   center(여백 0,20,20,20) = 법인서류 그리드(체크박스 다중, 묶음 머리글 법인인감증명서·법인등기부등본, 15열)
 * 스타일: GG (견본 — docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Splitter } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { aprCorpDocApi, aprCorpDocManageApi } from '@/api/apr';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { AprCorpDocRow, AprCorpDocTotal } from '@/types/apr';
import { Button } from '@/components/button';
import { CellEditGrid, SingleGrid, gbFor, iconCell } from '@/components/grid';
import { RdViewer } from '@/components/lookup/RdViewer';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Apr17_Lookup_CorpDoc } from './Apr17_Lookup_CorpDoc';
import { Apr18_Lookup_RelateAppr, AprCorpDocRelateTarget } from './Apr18_Lookup_RelateAppr';

const gb = gbFor<AprCorpDocRow>();
const gbTotal = gbFor<AprCorpDocTotal>();
const FORMAT = 'YYYY-MM-DD';
const ISSUE = { color: '#0069B4' };
const CALL = { color: '#000000' };
const USE = { color: '#CE4242' };

export const Apr17_Tab_CorpDoc: React.FC = () => {
  // settings() L122-212: 조회구간 = 올해 1월 1일 ~ 오늘 (폭 100)
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('year'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const cond = useRef({ startDate, closeDate });
  cond.current = { startDate, closeDate };

  const [totals, setTotals] = useState<AprCorpDocTotal[]>([]);
  const [hasApplication, setHasApplication] = useState(false);
  const [lookupOpen, setLookupOpen] = useState(false);
  const [relate, setRelate] = useState<AprCorpDocRelateTarget | null>(null);
  const [rdUrl, setRdUrl] = useState<string | null>(null);

  const crud = useGridCrud<AprCorpDocRow>({
    idField: 'corpDocId',
    // retrieve() L296-310: apr.Apr17_CorpDoc.selectByCorpRegDate(startDate, closeDate, companyId) 뒤 retrieveTotal() L399-412: selectByRegDate
    search: async () => {
      const c = cond.current;
      const rows = await aprCorpDocManageApi.searchRegistered(c.startDate.format(FORMAT), c.closeDate.format(FORMAT));
      aprCorpDocManageApi.searchTotals().then(setTotals).catch(err => message.error(errorMessage(err, '합계 조회 실패')));
      return rows;
    },
    // update() L312-325: GridUpdate → apr.Apr17_CorpDoc.update 뒤 check()
    save: aprCorpDocManageApi.saveRegistered,
    // delete() L335-397: "삭제"/"n건의 항목을 삭제하시겠습니까?"(폭 330) → [E8] msgBox.DialogHide [YES] (L371) → check().
    //   신청일이 없는 줄은 apr.Apr17_CorpDoc.regDelete(줄 삭제), 나머지는 regDateUpdate(등록일 비움)
    remove: aprCorpDocManageApi.deleteRegistered,
    deleteConfirm: n => `${n}건의 항목을 삭제하시겠습니까?`,
    // insert() L327-333: 등록일 = 오늘, 회사 = 로그인(서버)
    newRow: useCallback(() => ({ regDate: dayjs().format(FORMAT) }), []),
    firstEditField: 'regDate',
    onChanged: () => void check(),
  });

  // check() L276-294: apr.Apr17_CorpDoc.selectByCompanyId — 등록 전 신청내역이 있으면 안내 링크를 보이고, 어느 쪽이든 retrieve()
  const check = async () => {
    try {
      setHasApplication((await aprCorpDocApi.search()).length > 0);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
    await crud.retrieve();
  };
  const checkRef = useRef(check);
  checkRef.current = check;

  // [E0] 화면 열림 (생성자 L77-120) → settings() → check()
  useEffect(() => { void checkRef.current(); }, []);

  // [E5] deleteButton[삭제].Select (L162) → delete() L335: 미선택 "선택된 항목이 없습니다"
  const deleteRows = () => {
    if ((crud.gridRef.current?.api.getSelectedRows() ?? []).length === 0) { message.warning('선택된 항목이 없습니다'); return; }
    void crud.deleteChecked();
  };

  // [E6] downLoadButton[출력/다운로드].Select (L169) → 서비스 sys.Sys99_Print.insertRdCorpDoc(companyId, personId, windowClassName, startDate, closeDate)
  //   → RDViewer.viewer(dns admin · CommonViewer.html · mrd Apr17_Rd_CorpDoc · options "/rhtmlimportopt [2]" · rv rdGroupId·companyId·personId·startDate·closeDate)
  const downLoad = async () => {
    const s = startDate.format(FORMAT);
    const c = closeDate.format(FORMAT);
    try {
      const groupId = await aprCorpDocManageApi.rdPrint(s, c);
      const res = await rdApi.buildUrl({ kind: 'viewer', mrd: 'Apr17_Rd_CorpDoc', options: '/rhtmlimportopt [2]', rv: { rdGroupId: groupId, startDate: s, closeDate: c } });
      setRdUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    }
  };

  // buildTotalGrid() L214-224 (행번호 숨김)
  const totalColumns = useMemo(() => [
    gbTotal.textCenter('typeName', 150, '구분'),  // L218
    gbTotal.longCenter('issueSum', 100, '발급매수'),  // L219
    gbTotal.longCenter('useSum', 100, '사용매수'),  // L220
    gbTotal.longCenter('remain', 100, '잔여매수'),  // L221
  ], []);

  // buildGrid() L226-274: 묶음 머리글 "법인인감증명서"(발급·신청·사용) · "법인등기부등본"(발급·신청·사용)
  const columnDefs = useMemo(() => [
    gb.date('regDate', 100, '등록일', { editor: 'date' }),  // L257
    gb.group('법인인감증명서', [
      gb.longCenter('stampCertIssueCnt', 80, '발급매수', { editor: 'number', cellStyle: ISSUE }),  // L258
      gb.longCenter('stampCertCallCnt', 80, '신청매수', { editor: 'number', cellStyle: CALL }),  // L259
      gb.longCenter('stampCertUseCnt', 80, '사용매수', { editor: 'number', cellStyle: USE }),  // L260
    ]),
    gb.group('법인등기부등본', [
      gb.longCenter('corpRegIssueCnt', 80, '발급매수', { editor: 'number', cellStyle: ISSUE }),  // L261
      gb.longCenter('corpRegCallCnt', 80, '신청매수', { editor: 'number', cellStyle: CALL }),  // L262
      gb.longCenter('corpRegUseCnt', 80, '사용매수', { editor: 'number', cellStyle: USE }),  // L263
    ]),
    gb.text('provideCo', 150, '제공처', { editor: 'text' }),  // L264
    gb.text('purpose', 200, '목적', { editor: 'text' }),  // L265
    gb.text('requester', 100, '요청자', { editor: 'text' }),  // L266
    gb.text('note', 200, '비고', { editor: 'text' }),  // L267
    gb.date('callDate', 90, '신청일'),  // L268
    gb.textCenter('callEmpName', 100, '신청자'),  // L269
    gb.text('apprCntStr', 55, '연관문서'),  // L270
    // actionCell L271 (ImageCell "View", L226) → 연관문서 창 Apr18_Lookup_RelateAppr, 닫으면 그 줄을 apr.Apr17_CorpDoc.selectById로 다시 읽는다
    iconCell<AprCorpDocRow>('view', 'relateCell', 25, ' ', row => setRelate({ title: '연관문서', relateId: row.corpDocId })),
  ], []);

  const onRelateClosed = async () => {
    const id = relate?.relateId;
    if (id == null) return;
    try {
      crud.replaceRow(id, await aprCorpDocManageApi.get(id));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel defaultSize={190} min={120}>
          <div style={{ height: '100%', padding: '20px 20px 0 20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* [E2] retrieveButton[조회].Select (L144) → check() · [E3] insertButton[등록].Select (L150) → insert() · [E4] updateButton[저장].Select (L156) → update() */}
            <SearchBar
              onSearch={check}
              extra={
                <>
                  <Button type="register" onClick={() => crud.addRow()}>등록</Button>
                  <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
                  <Button type="delete" onClick={deleteRows}>삭제</Button>
                  <Button type="download" onClick={downLoad}>출력/다운로드</Button>
                </>
              }
            >
              <SearchBar.Field label="조회구간">
                <DatePicker style={{ width: 120 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
                <span>~</span>
                <DatePicker style={{ width: 120 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
              </SearchBar.Field>
            </SearchBar>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flex: 1, minHeight: 0 }}>
              <div style={{ width: 500, height: 110, flex: 'none' }}>
                <SingleGrid<AprCorpDocTotal>
                  rowData={totals}
                  columnDefs={totalColumns}
                  rowNumber={false}
                  getRowId={p => String(p.data.id)}
                />
              </div>
              {/* [E1] hiperLink[※ 법인서류 신청내역이 존재합니다. 신청내역 가져오기].Click (L131) → 신청내역 창 Apr17_Lookup_CorpDoc → 닫히면 check() */}
              {hasApplication && (
                <div style={{ width: 400, marginTop: 30, fontSize: 14, fontWeight: 'bold' }}>
                  ※ 법인서류 신청내역이 존재합니다.{' '}
                  <a href="#" style={{ color: '#0078D7', textDecoration: 'none' }} onClick={e => { e.preventDefault(); setLookupOpen(true); }}>신청내역 가져오기</a>
                </div>
              )}
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel min={200}>
          <div style={{ height: '100%', padding: '0 20px 20px 20px', boxSizing: 'border-box' }}>
            <CellEditGrid<AprCorpDocRow> crud={crud} columnDefs={columnDefs} />
          </div>
        </Splitter.Panel>
      </Splitter>
      <Apr17_Lookup_CorpDoc open={lookupOpen} onResult={() => void check()} onClose={() => setLookupOpen(false)} />
      <Apr18_Lookup_RelateAppr target={relate} onClosed={() => void onRelateClosed()} onClose={() => setRelate(null)} />
      <RdViewer url={rdUrl} title="법인서류 매수관리" onClose={() => setRdUrl(null)} />
    </div>
  );
};
