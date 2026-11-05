/**
 * [1510] 신청 > 90. 기타신청 > 구)법인서류 및 날인 신청 (U2-02)
 * AS-IS: myApp/client/vi/apr/Apr17_Tab_CorpDocApp.java (409줄) + Apr19_Grid_RelateStamp(오른쪽 인감날인) + 연관문서 Apr18_Lookup_RelateAppr — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L93-133: west 1200(여백 20,0,22,20, 테두리) = 툴바 50(신청일자 ~ · 검색 230 "제공처/목적" · ☑ 미처리만 조회 · [조회][등록(복사)][등록][저장][삭제]) + 신청 그리드(체크박스 다중, 9열),
 *   center(여백 20,20,20,-2) = Apr19_Grid_RelateStamp
 * 스타일: GG 계열 좌우 분할(GGH) — 툴바가 왼쪽 칸 안에 있다 (docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message, Splitter } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { aprCorpDocManageApi } from '@/api/apr';
import { AprCorpDocRow } from '@/types/apr';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Apr18_Lookup_RelateAppr, AprCorpDocRelateTarget } from './Apr18_Lookup_RelateAppr';
import { Apr19_Grid_RelateStamp } from './Apr19_Grid_RelateStamp';

const gb = gbFor<AprCorpDocRow>();
const FORMAT = 'YYYY-MM-DD';

export const Apr17_Tab_CorpDocApp: React.FC = () => {
  // settings() L135-197: 신청일자 = 올해 1월 1일 ~ 오늘, 검색 230(빈칸 "제공처/목적"), 미처리만 조회 = 체크
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('year'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [searchText, setSearchText] = useState('');
  const [procResult, setProcResult] = useState(true);
  const cond = useRef({ startDate, closeDate, searchText, procResult });
  cond.current = { startDate, closeDate, searchText, procResult };

  const [stampCorpDocId, setStampCorpDocId] = useState<number | null>(null);
  const [stampNonce, setStampNonce] = useState(0);
  const [relate, setRelate] = useState<AprCorpDocRelateTarget | null>(null);
  /** 마지막으로 고른 행 (AS-IS grid.getSelectionModel().getSelectedItem()) */
  const lastIds = useRef<number[]>([]);
  const lastRow = useRef<AprCorpDocRow | null>(null);

  const crud = useGridCrud<AprCorpDocRow>({
    idField: 'corpDocId',
    // retrieve() L237-261: apr.Apr17_CorpDoc.selectByAppDate(searchText "%…%", startDate, closeDate, companyId, personId, procResult)
    search: () => {
      const c = cond.current;
      return aprCorpDocManageApi.searchApplications(c.startDate.format(FORMAT), c.closeDate.format(FORMAT), c.searchText, c.procResult);
    },
    // update() L272-310: GridUpdate → apr.Apr17_CorpDoc.update 뒤 retrieve()
    save: aprCorpDocManageApi.saveApplications,
    reloadAfterSave: true,
    // delete() L390-394: GridDeleteData → apr.Apr17_CorpDoc.delete
    remove: aprCorpDocManageApi.deleteApplications,
    // deleteChk() L312-347: "삭제"/"n건의 항목을 삭제하시겠습니까?"(폭 300) → [E10] msgBox.DialogHide [YES] (L332) → delete()
    deleteConfirm: n => `${n}건의 항목을 삭제하시겠습니까?`,
    // insert() L263-270: 신청일자 = 오늘, 회사·신청사원 = 로그인(서버)
    newRow: useCallback(() => ({ callDate: dayjs().format(FORMAT) }), []),
    firstEditField: 'callDate',
    // update() L282-295: 수정한 줄마다 접수된 항목 → 날인일자가 등록된 항목 순으로 막는다
    validate: changed => {
      for (const m of changed) {
        if (m.regDate != null) return '접수된 항목이 포함되어있습니다.';
        if (m.stampDateYn) return '날인일자가 등록된 항목은 수정이 불가능합니다.';
      }
      return undefined;
    },
  });
  const crudRef = useRef(crud);
  crudRef.current = crud;

  // [E0] 화면 열림 (생성자 L93-133) → settings(), retrieve()
  useEffect(() => { void crud.retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E2] grid.SelectionChanged [corpDocModel != null] (L146) → relateStampList.retrieve(corpDocId): 고른 법인서류의 인감날인을 읽는다(고른 것이 없으면 그대로 둔다)
  const onSelectionChanged = (rows: AprCorpDocRow[]) => {
    const ids = rows.map(r => r.corpDocId);
    const added = ids.filter(id => !lastIds.current.includes(id));
    lastIds.current = ids;
    const cur = added.length > 0 ? rows.find(r => r.corpDocId === added[added.length - 1]) : (lastRow.current && ids.includes(lastRow.current.corpDocId) ? lastRow.current : rows[rows.length - 1]);
    lastRow.current = cur ?? null;
    if (cur) {
      setStampCorpDocId(cur.corpDocId);
      setStampNonce(n => n + 1);
    }
  };

  // [E1] relateStampList (Apr19_Grid_RelateStamp).callbackOnCreate (L62) → update(): 인감날인을 읽은 뒤 신청 그리드에 고친 줄이 있으면 저장한다
  const onStampRetrieved = () => {
    if (crudRef.current.hasChanges()) void crudRef.current.saveRows();
  };

  // [E5] copyButton[등록(복사)].Select (L173) → copyInsertRow() L349-375 → copyUpdateRow() L377: 고른 줄(마지막)의 제공처·목적·비고·요청자·신청매수를 복사한 새 신청을 바로 저장
  const copyInsertRow = async () => {
    const checked = crud.gridRef.current?.api.getSelectedRows() ?? [];
    if (checked.length === 0) { message.warning('복사할 대상을 선택해주세요.'); return; }
    const source = lastRow.current ?? checked[checked.length - 1];
    try {
      await aprCorpDocManageApi.copyApplication(source);
      await crud.retrieve();
    } catch (err) {
      message.error(err instanceof Error ? err.message : '복사 실패');
    }
  };

  // [E8] deleteButton[삭제].Select (L191) → deleteChk() L312-347
  const deleteChk = () => {
    const checked = crud.gridRef.current?.api.getSelectedRows() ?? [];
    if (checked.length === 0) { message.warning('삭제할 정보를 먼저 선택해주세요'); return; }
    for (const m of checked) {
      if (m.regDate != null) { message.warning('처리된 항목은 삭제 불가능합니다.'); return; }
      if (m.stampDateYn) { message.warning('날인일자가 등록된 항목은 수정이 불가능합니다.'); return; }
    }
    void crud.deleteChecked();
  };

  // buildGrid() L199-235
  const columnDefs = useMemo(() => [
    gb.date('callDate', 100, '신청일자', { editor: 'date' }),  // L224
    gb.text('provideCo', 200, '제공처', { editor: 'text' }),  // L225
    gb.text('purpose', 200, '목적', { editor: 'text' }),  // L226
    gb.text('note', 200, '비고<br>(날인요청서류)', { editor: 'text' }),  // L227
    gb.text('requester', 100, '요청자', { editor: 'text' }),  // L228
    gb.longCenter('stampCertCallCnt', 100, '법인인감증명서<br>신청매수', { editor: 'number' }),  // L229
    gb.longCenter('corpRegCallCnt', 100, '법인등기부등본<br>신청매수', { editor: 'number' }),  // L230
    gb.textCenter('apprCntStr', 60, '연관문서'),  // L231
    // actionCell L232 (ImageCell "View", L205) → 연관문서 창 Apr18_Lookup_RelateAppr, 닫으면 그 줄을 selectById로 다시 읽는다
    iconCell<AprCorpDocRow>('view', 'relateCell', 25, ' ', row => setRelate({ title: '연관문서', relateId: row.corpDocId })),
  ], []);

  // 연관문서 창 callback (L205 이후): apr.Apr17_CorpDoc.selectById → grid.store.update
  const onRelateClosed = async () => {
    const id = relate?.relateId;
    if (id == null) return;
    try {
      crud.replaceRow(id, await aprCorpDocManageApi.get(id));
    } catch (err) {
      message.error(err instanceof Error ? err.message : '조회 실패');
    }
  };

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter style={{ height: '100%' }}>
        <Splitter.Panel defaultSize={1200} min={600}>
          <div style={{ height: '100%', padding: '20px 0 22px 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* [E3] searchText.KeyPress [Enter] (L158) → retrieve() · [E4] retrieveButton[조회].Select (L167) → retrieve() */}
              <SearchBar
                onSearch={crud.retrieve}
                extra={
                  <>
                    <Button type="register" onClick={copyInsertRow}>등록(복사)</Button>
                    {/* [E6] insertButton[등록].Select (L179) → insert() */}
                    <Button type="register" onClick={() => crud.addRow()}>등록</Button>
                    {/* [E7] updateButton[저장].Select (L185) → update() */}
                    <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
                    <Button type="delete" onClick={deleteChk}>삭제</Button>
                  </>
                }
              >
                <SearchBar.Field label="신청일자">
                  <DatePicker style={{ width: 120 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
                  <span>~</span>
                  <DatePicker style={{ width: 120 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
                </SearchBar.Field>
                <SearchBar.Field label="검색">
                  <SearchBar.Input style={{ width: 230 }} placeholder="제공처/목적" value={searchText} onChange={e => setSearchText(e.target.value)} />
                </SearchBar.Field>
                <Checkbox checked={procResult} onChange={e => setProcResult(e.target.checked)}>미처리만 조회</Checkbox>
              </SearchBar>
              <div style={{ flex: 1, minHeight: 0 }}>
                <CellEditGrid<AprCorpDocRow>
                  crud={crud}
                  columnDefs={columnDefs}
                  onSelectionChanged={e => onSelectionChanged(e.api.getSelectedRows())}
                />
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel min={300}>
          <div style={{ height: '100%', padding: '20px 20px 20px 10px', boxSizing: 'border-box' }}>
            <Apr19_Grid_RelateStamp corpDocId={stampCorpDocId} nonce={stampNonce} onRetrieved={onStampRetrieved} />
          </div>
        </Splitter.Panel>
      </Splitter>
      <Apr18_Lookup_RelateAppr target={relate} onClosed={() => void onRelateClosed()} onClose={() => setRelate(null)} />
    </div>
  );
};
