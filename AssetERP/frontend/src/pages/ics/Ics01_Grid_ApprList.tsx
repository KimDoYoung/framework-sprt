/**
 * 문서작성 > 01. 문서작성 > 법규별 문서작성 > 오른쪽 문서 목록 (F03, 1단계)
 * AS-IS: myApp/client/vi/ics/Ics01_Grid_ApprList.java (254줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L62-95: vlc = 툴바(49: 등록기간 · 검색 · [검색] · [신규문서 작성] · 작성도움말) / 문서 그리드(1, 체크박스 단일, 행번호 표시)
 * 1단계(F01·F02와 같은 사유): [신규문서 작성]이 여는 문서분류 조회창 Dcr01_Lookup_Class → 전자결재 편집창 Apr01_Edit_ApprDoc, 상세보기 아이콘이 여는
 *   Apr01_Edit_ApprDoc은 다른 도메인이라 다음 단계에서 연결한다 — 지금은 안내만 띄운다.
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Modal } from 'antd';
import { QuestionCircleFilled } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { aprApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprIcsDoc } from '@/types/apr';
import { IcsWriteTreeNode } from '@/types/ics';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';

const gb = gbFor<AprIcsDocRow>();
const DATE_FORMAT = 'YYYY-MM-DD';

/** 원본 행 key(relateFundId)는 사원 이력 조인으로 겹칠 수 있어 순번을 붙여 그리드 key로 쓴다 */
type AprIcsDocRow = AprIcsDoc & { rowKey: string };

interface Props {
  /** 왼쪽 트리에서 고른 분류 (없으면 툴바 전체 비활성) */
  node: IcsWriteTreeNode | null;
}

export const Ics01_Grid_ApprList: React.FC<Props> = ({ node }) => {
  // [E0] 화면 열림 (생성자 L62-95) → settings() L97-128: 등록기간 = 오늘 -12개월 ~ 오늘(LoginUser.getToday())
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().subtract(12, 'month'));
  const [endDate, setEndDate] = useState<Dayjs>(() => dayjs());
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<AprIcsDocRow[]>([]);
  const [loading, setLoading] = useState(false);
  const seq = useRef(0);

  // private retrieve() L180-209 / public retrieve(icsClassTreeModel) L211-249: apr.Apr03_RelateFund.selectByIcsClassTreeId (검색어는 서버가 %…%로)
  const retrieve = async (target: IcsWriteTreeNode | null = node) => {
    if (target == null) return;
    const my = ++seq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await aprApi.searchIcsDocList({
        classTreeId: target.classTreeId,
        startDate: startDate.format(DATE_FORMAT),
        endDate: endDate.format(DATE_FORMAT),
        searchText,
      });
      if (my !== seq.current) return;
      setRows(list.map((r, i) => ({ ...r, rowKey: `${r.relateFundId}-${i}` })));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === seq.current) setLoading(false);
    }
  };

  // public retrieve(icsClassTreeModel) L211-249: 목록을 비운다 → 법규분류(IC)면 툴바 비활성만, 그 밖(IT 법규구분)이면 툴바 활성 + 조회
  const enabled = node != null && node.typeCode !== 'IC';
  useEffect(() => {
    seq.current++;
    setRows([]);
    setLoading(false);
    if (node != null && node.typeCode !== 'IC') void retrieve(node);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node]);

  // [E1] helpAnchor.MouseDown (L67): 법규구분(IT)일 때만 — 상세내용(content)이 없으면 "업데이트 예정", 있으면 "작성 Tip"
  const showHelp = () => {
    if (node?.typeCode !== 'IT') return;
    if (node.content == null || node.content === ' ') {
      Modal.info({ title: '업데이트 예정', content: '해당법규분류의 팁은 추후 업데이트 될 예정입니다', width: 400 });
    } else {
      Modal.info({ title: '작성 Tip', content: <div style={{ whiteSpace: 'pre-wrap' }}>{node.content}</div>, width: 600 });
    }
  };

  // [E4] insertButton[신규문서 작성].Select (L122) → insertIcsApproval() L156-178
  // [E4 일부 생략] Dcr01_Lookup_Class.open() → Apr01_Edit_ApprDoc.insertIcsApproval(classTreeModel, icsClassTreeModel, false, callback: retrieve())는 다음 단계
  const insertIcsApproval = () => {
    if (node == null) {
      message.warning('문서분류를 선택해주세요');
      return;
    }
    message.info('전자결재 문서 작성 창은 다음 단계에서 연결됩니다');
  };

  // buildGrid() L130-154
  const columnDefs = useMemo(() => [
    gb.date('regDate', 100, '등록일'),  // L147
    gb.date('effectDate', 100, '시행일'),  // L148
    gb.text('regEmpName', 100, '등록자'),  // L149
    gb.text('title', 700, '상신제목'),  // L150
    // L151 actionCell(Detail): Apr01_Edit_ApprDoc.retrieveApproval(model, isAdmin=false, callback: 없음)
    // [L151 생략] 편집창은 다음 단계
    iconCell<AprIcsDocRow>('view', 'actionCell', 70, '상세보기', () => message.info('전자결재 문서 보기 창은 다음 단계에서 연결됩니다')),
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* [E2] searchTextField.KeyPress [Enter] (L108)·[E3] retrieveButton[검색].Select (L116) → retrieve() */}
      <SearchBar onSearch={() => void retrieve()} searchText="검색" loading={loading} disabled={!enabled}
        extra={(
          <>
            <Button type="register" disabled={!enabled} onClick={insertIcsApproval}>신규문서 작성</Button>
            <QuestionCircleFilled title="작성도움말" style={{ color: '#4472C4', fontSize: 18, cursor: enabled ? 'pointer' : 'default' }} onClick={enabled ? showHelp : undefined} />
          </>
        )}>
        <SearchBar.Field label="등록기간">
          <DatePicker style={{ width: 140 }} allowClear={false} disabled={!enabled} value={startDate} onChange={d => d && setStartDate(d)} />
          <span>~</span>
          <DatePicker style={{ width: 140 }} allowClear={false} disabled={!enabled} value={endDate} onChange={d => d && setEndDate(d)} />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 300 }} disabled={!enabled} placeholder="등록자/부서/상신제목" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<AprIcsDocRow>
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => p.data.rowKey}
          loading={loading}
          rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
        />
      </div>
    </div>
  );
};
