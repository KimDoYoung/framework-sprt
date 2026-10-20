/**
 * 문서작성 > 01. 문서작성 > 업무별 문서작성 > 오른쪽 문서 목록 (F02, 1단계)
 * AS-IS: myApp/client/vi/apr/Apr01_Grid_DocList.java (321줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 init() L77-139: vlc = 툴바(49: 등록기간 · 검색 · [검색] · [신규문서 작성] · 작성도움말 · 북마크) / 문서 그리드(1) | 회색 칸(10) | Apr03_TabPage_Relate(300)
 * 1단계(F01과 같은 사유): 보기·[신규문서 작성]이 여는 전자결재 편집창 Apr01_Edit_ApprDoc, 북마크 아이콘이 여는 Apr50_Lookup_ApprList, 메일 아이콘이 여는
 *   Dcr10_Lookup_MailSender는 다른 도메인이라 다음 단계에서 연결한다 — 지금은 안내만 띄운다.
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Modal } from 'antd';
import { QuestionCircleFilled, StarFilled } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { aprApi } from '@/api/apr';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { AprDoc } from '@/types/apr';
import { DcrClassLink, DcrWriteTree } from '@/types/dcr';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { Apr03_TabPage_Relate } from './Apr03_TabPage_Relate';

const gb = gbFor<AprDoc>();
const DATE_FORMAT = 'YYYY-MM-DD';

interface Props {
  /** 왼쪽 트리에서 고른 분류 (없으면 툴바 전체 비활성) */
  node: DcrWriteTree | null;
  /** AS-IS Dcr01_Tab_DcrManager.managerYn — 관리자판(#1003)에서만 true. 이 메뉴(#1002)는 false */
  admin?: boolean;
  /** addInsertButton() L141-143: [신규문서 작성] 버튼 표시 (S1 고객사는 숨김) */
  showInsert: boolean;
  /** 안쪽 여백(padding 10·gap 8) — 호출한 화면이 켠다 */
  padded?: boolean;
}

export const Apr01_Grid_DocList: React.FC<Props> = ({ node, showInsert, padded }) => {
  // [E0] 화면 열림 (생성자 L69-71) → init() L77-139, settings() L145-176
  // settings() L145-176: 등록기간 = 올해 1월 1일 ~ 오늘(LoginUser.getToday())
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('year'));
  const [endDate, setEndDate] = useState<Dayjs>(() => dayjs());
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<AprDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [linkModel, setLinkModel] = useState<DcrClassLink | null>(null);
  const [apprId, setApprId] = useState<number | null>(null);
  const seq = useRef(0);

  // private retrieve() L248-277: apr.Apr01_Appr.selectByClassTreeId2 (검색어는 서버가 %…%로)
  const retrieve = async (target: DcrWriteTree | null = node) => {
    if (target == null) return;
    const my = ++seq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await aprApi.searchDocList({
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

  // public retrieve(classTreeModel, isAdmin) L218-246: 목록을 비운다 → 문서분류(C)면 툴바 비활성만, 문서구분(T)이면 dcr.Dcr30_Link.selectByClassTreeId 뒤 툴바 활성 + 조회
  useEffect(() => {
    seq.current++;
    setRows([]);
    setApprId(null);
    setLinkModel(null);
    if (node == null || node.typeCode === 'C') {
      setEnabled(false);
      setLoading(false);
      return;
    }
    const my = seq.current;
    dcrApi.searchLinksByClassTree(node.classTreeId)
      .then(links => {
        if (my !== seq.current) return;
        setLinkModel(links.length > 0 ? links[0] : null);
        setEnabled(true);
        void retrieve(node);
      })
      .catch(err => message.error(errorMessage(err, '조회 실패')));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node]);

  // [E1] helpAnchor.MouseDown (L82): 문서구분(T)일 때만 — 개요(note)가 없으면 "업데이트 예정", 있으면 "작성 Tip"
  const showHelp = () => {
    if (node?.typeCode !== 'T') return;
    if (node.note == null || node.note === ' ') {
      Modal.info({ title: '업데이트 예정', content: '해당문서분류의 팁은 추후 업데이트 될 예정입니다', width: 400 });
    } else {
      Modal.info({ title: '작성 Tip', content: <div style={{ whiteSpace: 'pre-wrap' }}>{node.note}</div>, width: 600 });
    }
  };

  // [E2] bookmarkAnchor.MouseDown (L96) → Apr50_Lookup_ApprList.open()
  // [E2 생략] 북마크 문서 조회창은 다음 단계에서 연결한다
  const openBookmark = () => message.info('북마크 문서 조회창은 다음 단계에서 연결됩니다');

  // [E3] insertButton[신규문서 작성].Select (L120) → insertApproval() L279-306
  // [E3 일부 생략] Apr01_Edit_ApprDoc.insertApproval(classTreeModel, isAdmin, callback: retrieve())는 다음 단계
  const insertApproval = () => {
    if (node == null) {
      message.warning('문서분류를 선택해주세요');
      return;
    }
    if (linkModel != null) {
      message.warning(linkModel.note == null ? '해당문서분류는 Link기능이 설정되어있습니다' : linkModel.note);
      return;
    }
    if (!node.updateYn) {
      message.warning('해당문서분류에 작성권한이 없습니다');
      return;
    }
    message.info('전자결재 문서 작성 창은 다음 단계에서 연결됩니다');
  };

  // buildGrid() L178-216
  const columnDefs = useMemo(() => [
    gb.bookmarkYn('bookmarkYn', 30, ' '),  // L205
    gb.text('title', 290, '상신제목'),  // L206
    gb.textCenter('relateDisplayName', 80, '펀드/일임'),  // L207
    gb.textHtml('statusName', 65, '상태'),  // L208
    // L209 actionCell(Detail): Apr01_Edit_ApprDoc.retrieveApproval(model, isAdmin, callback: retrieve())
    // [L209 생략] 편집창은 다음 단계
    iconCell<AprDoc>('view', 'actionCell', 50, '보기', () => message.info('전자결재 문서 보기 창은 다음 단계에서 연결됩니다')),
    // L210 actionCell(Send) → sendMail() L308-316: 완료(30)가 아니면 "완료되지 않은 문서입니다", 맞으면 Dcr10_Lookup_MailSender.open(apprId)
    // [L210 일부 생략] 메일 보내기 창은 다음 단계
    iconCell<AprDoc>('send', 'actionCell02', 50, '메일', row => {
      if (row.statusCode !== '30') message.warning('완료되지 않은 문서입니다');
      else message.info('메일 보내기 창은 다음 단계에서 연결됩니다');
    }),
    gb.date('regDate', 100, '등록일'),  // L211
    gb.date('effectDate', 100, '시행일'),  // L212
    gb.textCenter('regEmpName', 100, '등록자'),  // L213
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', ...(padded && { boxSizing: 'border-box', padding: 10, gap: 8 }) }}>
      {/* [E4] searchTextField.KeyPress [Enter] (L156)·[E5] retrieveButton[검색].Select (L164) → retrieve() */}
      <SearchBar onSearch={() => void retrieve()} searchText="검색" loading={loading} disabled={!enabled}
        extra={(
          <>
            {showInsert && <Button type="register" disabled={!enabled} onClick={insertApproval}>신규문서 작성</Button>}
            <QuestionCircleFilled title="작성도움말" style={{ color: '#4472C4', fontSize: 18, cursor: 'pointer' }} onClick={showHelp} />
            <StarFilled title="북마크 문서" style={{ color: '#FFCD43', fontSize: 18, cursor: 'pointer' }} onClick={openBookmark} />
          </>
        )}>
        <SearchBar.Field label="등록기간">
          <DatePicker style={{ width: 140 }} allowClear={false} disabled={!enabled} value={startDate} onChange={d => d && setStartDate(d)} />
          <span>~</span>
          <DatePicker style={{ width: 140 }} allowClear={false} disabled={!enabled} value={endDate} onChange={d => d && setEndDate(d)} />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 300 }} disabled={!enabled} placeholder="상신제목/연관펀드/연관일임/등록자/부서" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* [E6] grid.RowClick (L170) → tabPage.retrieve(apprId) */}
          <SingleGrid<AprDoc>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.apprId)}
            loading={loading}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
            onRowClicked={e => e.data && setApprId(e.data.apprId)}
          />
        </div>
        <div style={{ width: 10, background: '#f0f0f0', flex: 'none' }} />
        <div style={{ width: 300, flex: 'none' }}>
          <Apr03_TabPage_Relate apprId={apprId} />
        </div>
      </div>
    </div>
  );
};
