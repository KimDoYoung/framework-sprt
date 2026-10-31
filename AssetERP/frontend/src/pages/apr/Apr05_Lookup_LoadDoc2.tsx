/**
 * 문서 불러오기 창 (V05) — 상신 편집창의 [불러오기]가 연다. 이미 상신된 문서(내가 볼 수 있는 것)를 골라 제목·본문을 가져온다.
 * AS-IS: myApp/client/vi/apr/Apr05_Lookup_LoadDoc2.java (467줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * init() L133-204: 1700×700 모달 "문서 불러오기", 위 기간(지난달 1일 ~ 오늘)·문서구분(Dcr01_Lookup_DcrClass)·검색 250·[조회], 왼쪽 그리드(등록일 90·상신제목 300·수신처 130·펀드 300·상태 75·상신자 75·문서구분 250·열람권한 75),
 *   오른쪽 620 미리보기(고른 문서의 본문), 푸터 [확인][닫기]
 * 이 호출은 `Apr05_Lookup_LoadDoc2(false, cb)` — 단일 선택, 결재완료 제한 없음, [선택안함] 없음, tdm52 아님.
 * [E0] 화면 열림 (생성자 L103-108) → init() · [E1] tdmRelateDcrYn.ValueChange (L215) · [E7] nullButton[선택안함].Select (L306) — tdm52 호출과 [선택안함] 호출에서만 쓰여 이 호출에는 없다
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DatePicker, message, Modal } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { aprAttachApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprLoadDoc2 } from '@/types/apr';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { LookupModal } from '@/components/lookup/LookupModal';
import { HtmlView } from '@/components/form/HtmlView';
import { Dcr01_Lookup_DcrClass } from '@/pages/dcr/Dcr01_Lookup_DcrClass';

const gb = gbFor<AprLoadDoc2>();
const FMT = 'YYYY-MM-DD';

interface Props {
  open: boolean;
  /** [확인] — callback.execute(apprModel): 고른 문서의 제목·본문 */
  onResult: (doc: { title: string; content: string }) => void;
  onClose: () => void;
}

export const Apr05_Lookup_LoadDoc2: React.FC<Props> = ({ open, onResult, onClose }) => {
  // init() L133-148: 기간 = 지난달 1일 ~ 오늘
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().subtract(1, 'month').startOf('month'));
  const [endDate, setEndDate] = useState<Dayjs>(() => dayjs());
  const [classTreeId, setClassTreeId] = useState<number | null>(null);
  const [classTreeName, setClassTreeName] = useState('');
  const [classOpen, setClassOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<AprLoadDoc2[]>([]);
  const [selected, setSelected] = useState<AprLoadDoc2 | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  // retrieve() L344-386: dcr.Dcr00_DocList.selectByText
  const retrieve = useCallback(async (p: { start: Dayjs | null; end: Dayjs | null; classTreeId: number | null; searchText: string }) => {
    if (!p.start) { Modal.info({ title: '확인', content: '조회기간 시작일을 선택하세요', okText: '확인' }); return; }
    if (!p.end) { Modal.info({ title: '확인', content: '조회기간 종료일을 선택하세요', okText: '확인' }); return; }
    setLoading(true);
    try {
      setRows(await aprAttachApi.loadDocs({ classTreeId: p.classTreeId, startDate: p.start.format(FMT), endDate: p.end.format(FMT), searchText: p.searchText }));
      setSelected(undefined);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const start = dayjs().subtract(1, 'month').startOf('month');
    const end = dayjs();
    setStartDate(start); setEndDate(end); setClassTreeId(null); setClassTreeName(''); setSearchText(''); setSelected(undefined);
    void retrieve({ start, end, classTreeId: null, searchText: '' });
  }, [open, retrieve]);

  const search = () => retrieve({ start: startDate, end: endDate, classTreeId, searchText });

  // [E6] insertButton[확인].Select (L300) → insert() L408-442: 고른 문서가 없으면 "문서를 선택해주세요"
  const insert = () => {
    if (!selected) { Modal.info({ title: '확인', content: '문서를 선택해주세요', okText: '확인' }); return; }
    onResult({ title: selected.title ?? '', content: selected.content ?? '' });
  };

  // buildGrid() L323-342 (단일 선택)
  const columnDefs = useMemo(() => [
    gb.date('regDate', 90, '등록일'),  // L331
    gb.text('title', 300, '상신제목'),  // L332
    gb.text('receiveName', 130, '수신처'),  // L333
    gb.text('fundDisplayName', 300, '펀드'),  // L334
    gb.textHtml('statusName', 75, '상태'),  // L335
    gb.textCenter('empName', 75, '상신자'),  // L336
    gb.text('classTreeName', 250, '문서구분'),  // L337
    gb.booleanYn2('authYn', 75, '열람권한'),  // L338
  ], []);

  return (
    <>
      <LookupModal
        open={open}
        title="문서 불러오기"
        width={1700}
        style={{ top: 20, maxWidth: 'calc(100vw - 40px)' }}
        closable={false}
        maskClosable={false}
        onCancel={onClose}
        destroyOnClose
        focusFirst={false}
        styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            <Button type="select" onClick={insert}>확인</Button>
            {/* [E8] closeButton[닫기].Select (L315) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* [E4] searchText.KeyPress [Enter] (L286) · [E5] retrieveButton[조회].Select (L294) → retrieve() */}
          <SearchBar onSearch={search} searchText="조회" loading={loading}>
            <SearchBar.Field label="기간">
              <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
              <span>~</span>
              <DatePicker style={{ width: 130 }} allowClear={false} value={endDate} onChange={d => d && setEndDate(d)} />
            </SearchBar.Field>
            <SearchBar.Field label="문서구분">
              {/* [E2] classTreeName.TriggerClick (L227) → Dcr01_Lookup_DcrClass.open("%", 오늘) — 선택 없이 닫으면 "전체" */}
              <LookupInput value={classTreeName} empty={['', '전체']} placeholder="전체" width={260} onOpen={() => setClassOpen(true)}
                onClear={() => { setClassTreeId(null); setClassTreeName(''); }} />
            </SearchBar.Field>
            <SearchBar.Field label="검색">
              <SearchBar.Input style={{ width: 280 }} placeholder="상신제목/내용/펀드코드/펀드명/등록자" value={searchText} onChange={e => setSearchText(e.target.value)} />
            </SearchBar.Field>
          </SearchBar>
          <div style={{ display: 'flex', gap: 8, height: 'min(520px, calc(100vh - 290px))' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <SingleGrid<AprLoadDoc2>
                rowData={rows}
                columnDefs={columnDefs}
                getRowId={p => String(p.data.docId)}
                loading={loading}
                rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
                onSelect={setSelected}
              />
            </div>
            {/* [E3] grid.SelectionChanged [선택>0] (L277) → setHtml() L388-398: 고른 문서의 본문 (열람권한이 없으면 안내 글) */}
            <div style={{ width: 620, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 12, fontWeight: 'bold' }}> ● 미리보기 화면과 실제 화면은 차이가 있을 수 있습니다 ●</div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <HtmlView html={selected ? (selected.authYn ? (selected.content ?? '') : '<br>&nbsp;&nbsp;&nbsp;&nbsp;(해당문서의 열람권한이 없습니다)') : ''} height="100%" />
              </div>
            </div>
          </div>
        </div>
      </LookupModal>
      <Dcr01_Lookup_DcrClass
        open={classOpen}
        onResult={r => { setClassOpen(false); setClassTreeId(r.classTreeId); setClassTreeName(r.classTreeFullName); }}
        onAll={() => { setClassOpen(false); setClassTreeId(null); setClassTreeName(''); }}
        onClose={() => setClassOpen(false)}
      />
    </>
  );
};
