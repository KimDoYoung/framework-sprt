/**
 * [1254] 커뮤니티 > 03. 업무활동 > 업무공유 (Z07)
 * AS-IS: myApp/client/vi/bbs/Bbs10_Tab_BizShare.java (247줄) + Bbs10_Edit_BizShare (193줄, 등록/수정 창) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L65-97: north = 툴바 50(조회기간 ~ · 구분 180 · 검색 250 "업무내용/등록자/비고/키워드" · [조회][등록][삭제]), center = 업무공유 그리드(행번호, 체크박스 다중)
 * 스타일: SGP (견본 — docs/page-style/SGP/Chk02_Tab_DailyList.tsx, 편집 팝업 Bbs10_Edit_BizShare)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 조건이 3개지만 원본 툴바 버튼이 많아 넣지 않는다(공간)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Modal } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { bbsBizShareApi } from '@/api/bbs';
import { errorMessage } from '@/api/client';
import { BbsBizShare } from '@/types/bbs';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar, useSearchParams } from '@/components/search';
import { Bbs10_Edit_BizShare, BbsBizShareEdit } from './Bbs10_Edit_BizShare';

const gb = gbFor<BbsBizShare>();
const DATE = 'YYYY-MM-DD';

export const Bbs10_Tab_BizShare: React.FC = () => {
  const user = useLoginUser();
  const gridRef = useRef<AgGridReact<BbsBizShare>>(null);
  const [rows, setRows] = useState<BbsBizShare[]>([]);
  const [editTarget, setEditTarget] = useState<BbsBizShareEdit | null>(null);

  // settings() L99-159: 조회기간 = 올해 1월 1일 ~ 오늘, 구분 "전체"(코드 없음), 검색어 빈칸("업무내용/등록자/비고/키워드")
  const sp = useSearchParams(() => ({ startDate: dayjs().startOf('year'), closeDate: dayjs(), bizShareType: undefined as string | undefined, searchText: '' }));
  const { startDate, closeDate, bizShareType, searchText } = sp.values;

  // retrieve() L192-215: 서비스 bbs.Bbs10_BizShare.selectByText(companyId(서버), startDate, closeDate, bizShareType(없으면 %), "%검색어%")
  const retrieve = useCallback(async () => {
    const v = sp.current.current;
    try {
      setRows(await bbsBizShareApi.search(v.startDate.format(DATE), v.closeDate.format(DATE), v.bizShareType, v.searchText));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [sp]);

  // [E0] 화면 열림 (생성자 L59-63) → init(), settings(), retrieve()
  useEffect(() => {
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E4] insertButton[등록].Select (L130) → insertRow() L217-225: Bbs10_Edit_BizShare.insert(): 등록일 오늘 · 저장하면 retrieve()
  const insertRow = () => setEditTarget({ date: dayjs().format(DATE) });

  // [E5] deleteButton[삭제].Select [YES] (L136) → "n건의 내용을 삭제하시겠습니까?"(제목 "확인", 폭 310)
  //   → [E6] msgBox.DialogHide [YES] (L141) → deleteRow() L227-242: 선택 없으면 "대상을 먼저 선택해주세요", 관리자이거나 남의 글이 있으면 "등록자만 삭제가능합니다."
  const deleteChk = () => {
    const checked = gridRef.current?.api?.getSelectedRows() ?? [];
    Modal.confirm({
      title: '확인',
      content: `${checked.length}건의 내용을 삭제하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 310,
      onOk: async () => {
        const sel = gridRef.current?.api?.getSelectedRows() ?? [];
        if (sel.length === 0) { message.warning('대상을 먼저 선택해주세요'); return; }
        // LoginUser.getIsManager() = 회사관리자(세션 사용자 ID 음수)
        if (sel.some(r => user.userId < 0 || r.personId !== user.userId)) { message.warning('등록자만 삭제가능합니다.'); return; }
        try {
          await bbsBizShareApi.delete(sel.map(r => r.bizShareId));
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
        await retrieve();
      },
    });
  };

  // buildGrid() L161-190
  const columnDefs = useMemo(() => [
    gb.date('date', 90, '등록일'),  // L181
    gb.text('bizShareTypeName', 180, '구분'),  // L182
    gb.textArea('content', 570, '업무내용'),  // L183
    gb.text('keyword', 200, '키워드'),  // L184
    gb.textArea('note', 340, '비고'),  // L185
    gb.textCenter('personName', 80, '등록자'),  // L186
    // [E7] editCell (ImageCell "Edit").callbackOnCreate (L168) → Bbs10_Edit_BizShare.edit(선택 행, callback → retrieve())
    iconCell<BbsBizShare>('edit', 'actionCell', 45, '수정', row => setEditTarget(row)),  // L187
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E3] retrieveButton[조회].Select (L124) → retrieve(), [E2] searchText.KeyPress [Enter] (L116) → retrieve() */}
      <SearchBar
        onSearch={() => retrieve()}
        extra={
          <>
            <Button type="register" onClick={insertRow}>등록</Button>
            <Button type="delete" onClick={deleteChk}>삭제</Button>
          </>
        }
      >
        <SearchBar.Field label="조회기간">
          <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} onChange={d => d && sp.set('startDate', d)} />
          <span>~</span>
          <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} onChange={d => d && sp.set('closeDate', d)} />
        </SearchBar.Field>
        <SearchBar.Field label="구분">
          {/* [E1] bizShareComboBox[BizShareType].Collapse (L107) → retrieve() — 값이 바뀐 상태로 조회 */}
          <SystemCodeComboBox kindCd="BizShareType" style={{ width: 180 }} allowClear placeholder="전체" value={bizShareType}
            onChange={c => { sp.set('bizShareType', c); setTimeout(() => { void retrieve(); }, 0); }} />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 250 }} placeholder="업무내용/등록자/비고/키워드" value={searchText} onChange={e => sp.set('searchText', e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiGrid<BbsBizShare>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.bizShareId)}
        />
      </div>
      <Bbs10_Edit_BizShare model={editTarget} onClose={() => setEditTarget(null)} onDone={() => { void retrieve(); }} />
    </div>
  );
};
