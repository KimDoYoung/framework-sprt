/**
 * [1402] KFS > 11. ERP 계약사관리 > AssetERP 계약사관리 (EE22)
 * AS-IS: myApp/client/vi/biz/Biz51_Tab_ErpContCorp.java (292줄) + Biz51_Edit_ErpContCorp(편집창)·Biz52_Lookup_ErpFee(사용료)·Biz50_Lookup_ErpSetup(기본설정)
 *   ·Biz50_Lookup_MailMapping(메일양식)·Sys15_Lookup_Corp·Sys01_Lookup_Company — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L58-84: 바깥 여백 20, 위 툴바 50 = 검색 [200 "계약사명/비고"] · ☑계약건만 보기(기본 켜짐) · [조회][등록][삭제] [기본설정], 아래 그리드(체크 다중, 18열)
 * 스타일: SGP (견본 — docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 조건이 2개라 넣지 않는다
 * 미완(다음 단계 EE34): [증빙자료] 아이콘이 여는 Com01_Lookup_RelateAppr(증빙자료 창) — 안내만
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, message, Modal } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { bizErpContCorpApi } from '@/api/bizErp';
import { errorMessage } from '@/api/client';
import { BizErpContCorp } from '@/types/bizErp';
import { Button } from '@/components/button';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Biz50_Lookup_ErpSetup } from './Biz50_Lookup_ErpSetup';
import { Biz51_Edit_ErpContCorp, BizErpContCorpEditTarget } from './Biz51_Edit_ErpContCorp';
import { Biz52_Lookup_ErpFee } from './Biz52_Lookup_ErpFee';

const gb = gbFor<BizErpContCorp>();
/** setChecked(MULTI) — 삭제용 체크라 행 클릭이 선택을 바꾸지 않는다 */
const MULTI_CHECK = { mode: 'multiRow', checkboxes: true } as const;

export const Biz51_Tab_ErpContCorp: React.FC = () => {
  const gridRef = useRef<AgGridReact<BizErpContCorp>>(null);
  // settings() L86-99: 검색 폭 200 · "계약건만 보기" 기본 켜짐
  const [searchText, setSearchText] = useState('');
  const [statusCheck, setStatusCheck] = useState(true);
  const [rows, setRows] = useState<BizErpContCorp[]>([]);
  const [loading, setLoading] = useState(false);
  const [editTarget, setEditTarget] = useState<BizErpContCorpEditTarget | null>(null);
  const [feeId, setFeeId] = useState<number | null>(null);
  const [setupOpen, setSetupOpen] = useState(false);

  // retrieve() L200-219: biz.Biz51_ErpContCorp.selectByContStatusCode(contStatusCode = 체크면 "1" 아니면 null, searchText)
  const retrieve = useCallback(async (over?: { check?: boolean }) => {
    setLoading(true);
    try {
      setRows(await bizErpContCorpApi.search((over?.check ?? statusCheck) ? '1' : null, searchText));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [statusCheck, searchText]);

  // [E0] 화면 열림 (생성자 L58-84) → settings(), retrieve()
  useEffect(() => { void retrieve(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // lookupEnd(erpContCorpId) L254-265: biz.Biz51_ErpContCorp.selectById → 그 행만 grid.getStore().update(...)
  const lookupEnd = async (id: number) => {
    try {
      const row = await bizErpContCorpApi.get(id);
      setRows(prev => prev.map(r => (r.erpContCorpId === id ? row : r)));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E4] deleteButton[삭제].Select (L113) → deleteRow() L221-252: 선택이 없으면 "삭제할 내용을 선택해주세요", 확인 "삭제" "n건의 정보를 삭제하시겠습니까?"
  //   → [E9] messageBox.DialogHide [YES] (L229) → biz.Biz51_ErpContCorp.deleteList → retrieve()
  const deleteRow = () => {
    const sel = gridRef.current?.api?.getSelectedRows() ?? [];
    if (sel.length < 1) { message.warning('삭제할 내용을 선택해주세요'); return; }
    Modal.confirm({
      title: '삭제',
      content: `${sel.length}건의 정보를 삭제하시겠습니까?`,
      okText: '예', cancelText: '아니오',
      onOk: async () => {
        try {
          await bizErpContCorpApi.delete(sel.map(r => r.erpContCorpId));
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
        await retrieve();
      },
    });
  };

  // buildGrid() L128-197
  const columnDefs = useMemo(() => [
    iconCell<BizErpContCorp>('edit', 'editCell', 50, '수정', row => setEditTarget({ mode: 'edit', row })),  // L177 [E6] editCell → Biz51_Edit_ErpContCorp(선택행) → 저장하면 retrieve()
    gb.textCenter('erpProductCd', 60, '상품코드'),  // L178
    gb.text('corpNm', 170, '계약사명'),  // L179
    gb.textCenter('contStatusNm', 60, '계약상태'),  // L180
    gb.textCenter('serviceTypeNm', 70, '서비스종류'),  // L181
    gb.date('firstContDate', 90, '최초계약일'),  // L182
    gb.date('contDate', 90, '(재)계약일'),  // L183
    gb.date('contEndDate', 90, '계약종료일'),  // L184
    gb.date('erpStartDate', 90, '시스템<br>사용시작일'),  // L185
    gb.date('erpEndDate', 90, '시스템<br>사용종료일'),  // L186
    gb.text('erpFeeNm', 300, '사용료'),  // L187
    iconCell<BizErpContCorp>('edit', 'feeCell', 40, '', row => setFeeId(row.erpContCorpId)),  // L188 [E7] feeCell → Biz52_Lookup_ErpFee.open(행, 닫으면 lookupEnd(id))
    gb.textCenter('managerNm', 90, '담당자'),  // L189
    gb.textCenter('managerTel', 120, '담당자<br>연락처'),  // L190
    gb.textArea('note', 200, '비고'),  // L191
    gb.text('locationNm', 90, '서브도메인'),  // L192
    gb.textCenter('fileCountStr', 60, '증빙자료'),  // L193
    // [E8 생략] dataCell → Com01_Lookup_RelateAppr.open("biz51", id, …) (L159-173): 증빙자료 창은 다른 도메인 공통 컴포넌트라 EE34로 분리 — 지금은 안내만
    iconCell<BizErpContCorp>('view', 'dataCell', 40, '', () => { message.info('증빙자료 창(Com01_Lookup_RelateAppr)은 다음 단계(EE34)에서 변환합니다.'); }),  // L194
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E1] searchText.KeyPress [Enter] (L92) · [E2] retrieveButton[조회].Select (L101) → retrieve() */}
      <SearchBar
        onSearch={() => retrieve()}
        loading={loading}
        extra={
          <>
            {/* [E3] insertButton[등록].Select (L107) → insert() L267-274: Biz51_Edit_ErpContCorp(callback → retrieve()) */}
            <Button type="register" onClick={() => setEditTarget({ mode: 'new' })}>등록</Button>
            <Button type="delete" onClick={deleteRow}>삭제</Button>
            {/* [E5] settingButton[기본설정].Select (L119) → setting() L276-283: Biz50_Lookup_ErpSetup.open(닫으면 retrieve()) */}
            <Button type="settings" onClick={() => setSetupOpen(true)}>기본설정</Button>
          </>
        }
      >
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 200 }} placeholder="계약사명/비고" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
        <SearchBar.Field label={null}>
          <Checkbox checked={statusCheck} onChange={e => setStatusCheck(e.target.checked)}>계약건만 보기</Checkbox>
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiGrid<BizErpContCorp>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.erpContCorpId)}
          loading={loading}
          rowSelection={MULTI_CHECK}
        />
      </div>
      <Biz51_Edit_ErpContCorp target={editTarget} onClose={() => setEditTarget(null)} onSaved={() => { void retrieve(); }} />
      <Biz52_Lookup_ErpFee erpContCorpId={feeId} onClose={() => { const id = feeId; setFeeId(null); if (id != null) void lookupEnd(id); }} />
      <Biz50_Lookup_ErpSetup open={setupOpen} onClose={() => { setSetupOpen(false); void retrieve(); }} />
    </div>
  );
};
