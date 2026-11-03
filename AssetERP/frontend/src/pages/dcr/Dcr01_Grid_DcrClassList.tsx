/**
 * 관리자 > 03. 문서관리 > 문서이동 — 오른쪽 문서 목록 (EE05, 1단계)
 * AS-IS: myApp/client/vi/dcr/Dcr01_Grid_DcrClassList.java (246줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 init() L70-86: vlc = 툴바(49: 등록기간 · 검색 · [검색] · [변경]) / 문서 그리드(체크박스 다중)
 * 1단계: 보기 아이콘이 여는 전자결재 편집창 Apr01_Edit_ApprDoc은 다른 도메인이라 다음 단계에서 연결한다 — 지금은 안내만 띄운다.
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, Modal, message } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import dayjs, { Dayjs } from 'dayjs';
import { aprApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprDoc } from '@/types/apr';
import { DcrClassTree } from '@/types/dcr';
import { MultiGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { Dcr01_Move_DcrClass } from './Dcr01_Move_DcrClass';

const gb = gbFor<AprDoc>();
const DATE_FORMAT = 'YYYY-MM-DD';

interface Props {
  /** 트리에서 고른 분류 — public retrieve(classTreeModel, isAdmin)의 인자 (관리자판이라 isAdmin = true) */
  node: DcrClassTree | null;
}

export const Dcr01_Grid_DcrClassList: React.FC<Props> = ({ node }) => {
  // [E0] 화면 열림 (생성자 L62-64) → init() L70-86, settings() L88-119: 등록기간 = 오늘 12개월 전 ~ 오늘, 검색어 안내 "상신제목/연관펀드/연관일임/등록자/부서"
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().subtract(12, 'month'));
  const [endDate, setEndDate] = useState<Dayjs>(() => dayjs());
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<AprDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [moveRows, setMoveRows] = useState<AprDoc[] | null>(null);
  const gridRef = useRef<AgGridReact<AprDoc>>(null);
  const seq = useRef(0);
  const enabled = node != null && node.typeCode !== 'C';

  // private retrieve() L212-241: apr.Apr01_Appr.selectByClassTreeId2 (admin = true, 검색어는 서버가 %…%로)
  const retrieve = async (target: DcrClassTree | null = node) => {
    if (target == null) return;
    const my = ++seq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await aprApi.searchDocListAdmin({
        classTreeId: target.classTreeId,
        startDate: startDate.format(DATE_FORMAT),
        endDate: endDate.format(DATE_FORMAT),
        searchText,
      });
      if (my !== seq.current) return;
      setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === seq.current) setLoading(false);
    }
  };

  // public retrieve(classTreeModel, isAdmin) L189-210: 목록을 비운다 → 문서분류(C)면 툴바 비활성만, 문서구분(T)이면 툴바 활성 + 조회
  useEffect(() => {
    seq.current++;
    setRows([]);
    if (node == null || node.typeCode === 'C') {
      setLoading(false);
      return;
    }
    void retrieve(node);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node]);

  // [E3] moveButton[변경].Select (L113) → moveChk() L154-172: 확인창 "이동" / "N건의 문서를 이동하시겠습니까?" (폭 300)
  // [E5] msgBox.DialogHide [YES] (L157) → moveDcrClass() L174-187: 문서분류 변경 창을 연다. 닫히면 retrieve()
  // [E3 보정] 원본은 선택이 0건이어도 확인창과 변경 창이 열린다(getSelectedItems가 빈 목록이라 "문서를 선택해주세요"는 닿지 않는다) — 0건이면 그 메시지를 보인다(05 §8 선례)
  const moveChk = () => {
    const selected = gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.length === 0) {
      message.warning('문서를 선택해주세요');
      return;
    }
    Modal.confirm({
      title: '이동',
      content: `${selected.length}건의 문서를 이동하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 300,
      onOk: () => setMoveRows(selected),
    });
  };

  // buildGrid() L121-152
  const columnDefs = useMemo(() => [
    gb.bookmarkYn('bookmarkYn', 30, ' '),  // L141
    gb.text('title', 280, '상신제목'),  // L143
    gb.textCenter('relateDisplayName', 80, '펀드/일임'),  // L144
    gb.textHtml('statusName', 65, '상태'),  // L145
    // [E4] detailCell (ImageCell).callbackOnCreate (L129) → Apr01_Edit_ApprDoc.retrieveApproval(model, true, callback: retrieve()) — L146 actionCell
    // [E4 생략] 문서 조회·편집창은 다음 단계
    iconCell<AprDoc>('view', 'actionCell', 50, '보기', () => message.info('전자결재 문서 보기 창은 다음 단계에서 연결됩니다')),
    gb.date('regDate', 100, '등록일'),  // L147
    gb.date('effectDate', 100, '시행일'),  // L148
    gb.textCenter('regEmpName', 100, '등록자'),  // L149
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* [E1] searchTextField.KeyPress [Enter] (L99)·[E2] retrieveButton[검색].Select (L107) → retrieve() */}
      <SearchBar onSearch={() => void retrieve()} searchText="검색" loading={loading} disabled={!enabled}
        extra={<Button type="change" disabled={!enabled} onClick={moveChk}>변경</Button>}>
        <SearchBar.Field label="등록기간">
          <DatePicker style={{ width: 140 }} allowClear={false} disabled={!enabled} value={startDate} onChange={d => d && setStartDate(d)} />
          <span>~</span>
          <DatePicker style={{ width: 140 }} allowClear={false} disabled={!enabled} value={endDate} onChange={d => d && setEndDate(d)} />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 300 }} disabled={!enabled} placeholder="상신제목/연관펀드/연관일임/등록자/부서" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiGrid<AprDoc>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.apprId)}
          loading={loading}
        />
      </div>
      <Dcr01_Move_DcrClass apprList={moveRows} onMoved={() => void retrieve()} onClose={() => setMoveRows(null)} />
    </div>
  );
};
