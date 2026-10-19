/**
 * 문서작성 > 01. 문서작성 > 폐기문서 신청현황 (F04, 1단계)
 * AS-IS: myApp/client/vi/apr/Apr90_Tab_DisposalList.java (166줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 getEditor() L1-166: vlc = 툴바(50: 조회기간 [시작] ~ [끝] · [조회]) / 폐기문서 그리드(체크박스 단일, 행번호 표시)
 * 1단계(F01~F03과 같은 사유): 상세보기 아이콘이 여는 전자결재 편집창 Apr01_Edit_ApprDoc은 다른 도메인이라 다음 단계에서 연결한다 — 지금은 안내만 띄운다.
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { aprApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprDisposalList } from '@/types/apr';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';

const gb = gbFor<AprDisposalList>();
const DATE_FORMAT = 'YYYY-MM-DD';

export const Apr90_Tab_DisposalList: React.FC = () => {
  // [E0] 화면 열림 (생성자 L48-71) → settings() L73-85: 시작일 = 올해 1월 1일, 종료일 = 오늘(LoginUser.getToday()) → retrieve()
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('year'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [rows, setRows] = useState<AprDisposalList[]>([]);
  const [loading, setLoading] = useState(false);
  const seq = useRef(0);

  // [E1] retrieveButton[조회].Select (L79) → retrieve() L138-161: apr.Apr90_DisposalList.selectByPersonId (personId는 서버가 세션에서)
  // [E1 생략] 시작일·종료일 null 검사("조회조건의 시작일은 필수값입니다" 등) — 날짜 칸이 지우기 불가라 비는 경우가 없다
  const retrieve = async () => {
    const my = ++seq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await aprApi.searchDisposalListMine({
        startDate: startDate.format(DATE_FORMAT),
        closeDate: closeDate.format(DATE_FORMAT),
      });
      if (my !== seq.current) return;
      setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === seq.current) setLoading(false);
    }
  };

  useEffect(() => {
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // buildGrid() L87-136
  const columnDefs = useMemo(() => [
    gb.date('regDate', 100, '신청일'),  // L121
    gb.text('title', 400, '문서명'),  // L123
    // L124 actionCell(Detail): apr.Apr01_Appr.selectById → 0건이면 "해당 문서는 폐기된 문서입니다." / 있으면 Apr01_Edit_ApprDoc.retrieveApproval(model, false)
    // [L124 생략] 문서 조회·편집창은 다음 단계
    iconCell<AprDisposalList>('view', 'actionCell', 45, ' ', () => message.info('전자결재 문서 보기 창은 다음 단계에서 연결됩니다')),
    gb.textCenter('statusName', 100, '문서상태'),  // L125
    gb.textArea('reason', 400, '사유'),  // L126
    gb.booleanYn('confirmYn', 100, '승인여부'),  // L127
    gb.textCenter('confirmEmpName', 100, '승인(반려)자'),  // L128
    gb.date('confirmDate', 100, '승인(반려)일'),  // L129
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <SearchBar onSearch={() => void retrieve()} searchText="조회" loading={loading}>
        <SearchBar.Field label="조회기간">
          <DatePicker style={{ width: 140 }} allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
          <span>~</span>
          <DatePicker style={{ width: 140 }} allowClear={false} value={closeDate} onChange={d => d && setCloseDate(d)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<AprDisposalList>
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.disposalListId)}
          loading={loading}
          rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
        />
      </div>
    </div>
  );
};
