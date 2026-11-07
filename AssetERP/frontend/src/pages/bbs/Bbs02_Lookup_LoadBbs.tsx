/**
 * 공지 불러오기 창 (Z02) — Bbs02_Edit_Notice의 [불러오기]가 연다 (골라서 제목·내용을 편집창에 가져온다)
 * AS-IS: myApp/client/vi/bbs/Bbs02_Lookup_LoadBbs.java (321줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L84-142: 모달 "불러오기" 1500×600, 왼쪽 900 = 툴바(공지구분 120 · 구분상세 200 · 검색 250 "제목" · [조회]) + 공지 그리드(체크박스 단일) + 페이징 50,
 *   가운데 = 선택한 공지의 내용(HTML), 아래 가운데 [확인][닫기]
 * 스타일: MH (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Select, Space, message } from 'antd';
import { bbsNoticeApi } from '@/api/bbs';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { BbsNoticeMng } from '@/types/bbs';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { HtmlView } from '@/components/form/HtmlView';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { PagingToolBar, SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SearchBar } from '@/components/search';

const gb = gbFor<BbsNoticeMng>();
const LIMIT = 50;  // gridToolBar.setToolBar(50)
const SINGLE_SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Props {
  open: boolean;
  /** AS-IS callback.execute(고른 공지) — 호출 뒤 hide() */
  onSelect: (notice: BbsNoticeMng) => void;
  onClose: () => void;
}

export const Bbs02_Lookup_LoadBbs: React.FC<Props> = ({ open, onSelect, onClose }) => {
  const [noticeType, setNoticeType] = useState('%');
  const [detailCodes, setDetailCodes] = useState<Code[]>([]);
  const [noticeDetail, setNoticeDetail] = useState('%');
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<BbsNoticeMng[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<BbsNoticeMng | null>(null);
  const paramRef = useRef<{ noticeType: string; noticeDetail: string; searchText: string } | undefined>(undefined);
  const allDetailRef = useRef<Code[]>([]);

  const getPaging = async (p: number) => {
    if (!paramRef.current) return;
    setLoading(true);
    try {
      const res = await bbsNoticeApi.searchNoticeManage({ ...paramRef.current, systemNoticeYn: true, offset: (p - 1) * LIMIT, limit: LIMIT });
      setRows(res.rows);
      setTotal(res.total);
      setPage(p);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // retrieve() L286-308: 조건(systemNoticeYn true — 시스템공지 포함)을 만들어 1페이지부터 다시 읽는다
  const retrieve = (over?: { noticeType?: string; noticeDetail?: string }) => {
    paramRef.current = { noticeType: over?.noticeType ?? noticeType, noticeDetail: over?.noticeDetail ?? noticeDetail, searchText };
    return getPaging(1);
  };

  // [E0] 열림 (생성자 L84-142) → settings(): 구분상세 목록을 읽고 첫 조회
  const retrieveRef = useRef(retrieve);
  retrieveRef.current = retrieve;
  useEffect(() => {
    if (!open) return;
    setNoticeType('%'); setNoticeDetail('%'); setDetailCodes([]); setSearchText(''); setSelected(null);
    sysApi.searchCodes('NoticeDetailCode')
      .then(list => { allDetailRef.current = list; })
      .catch(err => message.error(errorMessage(err, '공지구분 조회 실패')))
      .finally(() => { void retrieveRef.current({ noticeType: '%', noticeDetail: '%' }); });
  }, [open]);

  // [E2] noticeTypeCombo[NoticeType003].Collapse (L157): 전체면 구분상세를 끄고 조회, 아니면 켜고 selectByCode3(구분+"%") 뒤 조회
  const onTypeChange = (code: string | undefined) => {
    const v = code && code !== '' ? code : '%';
    setNoticeType(v);
    setNoticeDetail('%');
    setDetailCodes(v === '%' ? [] : allDetailRef.current.filter(c => c.code.startsWith(v)));
    void retrieve({ noticeType: v, noticeDetail: '%' });
  };

  // buildGrid() L244-253
  const columnDefs = useMemo(() => [
    gb.date('fromDate', 100, '공지일'),  // L248
    gb.textCenter('noticeNo', 100, '공지번호'),  // L249
    gb.text('noticeDetailFullName', 200, '공지구분'),  // L250
    gb.text('title', 500, '제목'),  // L251
  ], []);

  // insert() L268-275: 고른 공지가 없으면 "문서를 선택해주세요"
  const insert = () => {
    if (!selected) { message.warning('문서를 선택해주세요'); return; }
    onSelect(selected);
    onClose();
  };

  return (
    <LookupModal
      open={open}
      title="불러오기"
      width={1500}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E8] insertButton[확인].Select (L230) → insert() L268-275 */}
            <Button type="save" onClick={insert}>확인</Button>
            {/* [E9] closeButton[닫기].Select (L236) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 460, display: 'flex' }}>
        <div style={{ width: 900, flex: 'none', display: 'flex', flexDirection: 'column', gap: 8, paddingRight: 8, boxSizing: 'border-box' }}>
          {/* [E7] retrieveButton[조회].Select (L224) → retrieve() */}
          <SearchBar onSearch={() => void retrieve()} loading={loading}>
            <SearchBar.Field label="공지구분">
              {/* [E1] noticeTypeCombo.callbackOnCreate (L149) → "전체" / [E2] 위 onTypeChange */}
              <SystemCodeComboBox kindGroupCd="NoticeType003" altCode={['%', '전체']} style={{ width: 120 }} value={noticeType} onChange={onTypeChange} />
              {/* [E3] noticeDetailCombo.callbackOnCreate (L188) → "전체"·꺼짐, retrieve() / [E4] noticeDetailCombo.Collapse (L198) → retrieve() */}
              <Select
                style={{ width: 200 }}
                disabled={noticeType === '%'}
                value={noticeDetail}
                onChange={v => { setNoticeDetail(v); void retrieve({ noticeDetail: v }); }}
                options={[{ value: '%', label: '전체' }, ...detailCodes.map(c => ({ value: c.code, label: c.name }))]}
              />
            </SearchBar.Field>
            <SearchBar.Field label="검색">
              {/* [E5] searchText.KeyPress [Enter] (L206) → retrieve() */}
              <SearchBar.Input style={{ width: 250 }} placeholder="제목" value={searchText} onChange={e => setSearchText(e.target.value)} />
            </SearchBar.Field>
          </SearchBar>
          <div style={{ flex: 1, minHeight: 0 }}>
            <SingleGrid<BbsNoticeMng>
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.noticeId)}
              loading={loading}
              rowSelection={SINGLE_SELECTION}
              // [E6] grid.CellClick (L214) → setHtml(선택한 공지의 내용)
              onSelect={row => setSelected(row ?? null)}
            />
          </div>
          <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={getPaging} />
        </div>
        <div style={{ flex: 1, minWidth: 0, border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
          <HtmlView html={selected?.notice} height="100%" />
        </div>
      </div>
    </LookupModal>
  );
};
