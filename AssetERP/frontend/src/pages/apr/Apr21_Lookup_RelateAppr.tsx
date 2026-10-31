/**
 * 연관문서 설정 창 (V13) — 상신 문서창의 연관문서 탭 [등록]이 연다. 이미 상신된 문서(내가 볼 수 있는 것)를 여러 개 골라 연관문서에 더한다.
 * AS-IS: myApp/client/vi/apr/Apr21_Lookup_RelateAppr.java (258줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * init() L83-128: 1100×600 모달 "연관문서", 위 등록기간(한 달 전 ~ 오늘)·문서구분(Dcr01_Lookup_DcrClass)·검색 250·[조회], 체크박스 다중 그리드
 *   (등록일 100·문서구분 300·상신제목 300·펀드 250·등록자 55), 푸터 [확인][닫기]. 열 때 자동 조회는 없다(init()이 retrieve()를 부르지 않는다).
 * 조회는 Apr05_Lookup_LoadDoc2와 같은 dcr.Dcr00_DocList.selectByText(`GET apr/doc-picks`)다.
 */
import React, { useMemo, useState } from 'react';
import { DatePicker, message, Modal } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { aprAttachApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprLoadDoc2 } from '@/types/apr';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Dcr01_Lookup_DcrClass } from '@/pages/dcr/Dcr01_Lookup_DcrClass';

const gb = gbFor<AprLoadDoc2>();
const FMT = 'YYYY-MM-DD';

interface Props {
  open: boolean;
  /** insert() L222-249: 고른 문서마다 연관문서 한 줄 — 부른 쪽이 맨 아래에 더한다 */
  onResult: (docs: AprLoadDoc2[]) => void;
  onClose: () => void;
}

export const Apr21_Lookup_RelateAppr: React.FC<Props> = ({ open, onResult, onClose }) => {
  // init() L83-128: regDate = 오늘에서 한 달 전, endRegDate = 오늘
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().subtract(1, 'month'));
  const [endDate, setEndDate] = useState<Dayjs>(() => dayjs());
  const [classTreeId, setClassTreeId] = useState<number | null>(null);
  const [classTreeName, setClassTreeName] = useState('');
  const [classOpen, setClassOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<AprLoadDoc2[]>([]);
  const [checked, setChecked] = useState<AprLoadDoc2[]>([]);
  const [loading, setLoading] = useState(false);

  // 창을 열 때마다 처음 값으로 (생성자가 매번 new)
  const [wasOpen, setWasOpen] = useState(false);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setStartDate(dayjs().subtract(1, 'month')); setEndDate(dayjs()); setClassTreeId(null); setClassTreeName(''); setSearchText('');
      setRows([]); setChecked([]);
    }
  }

  // [E2] searchText.KeyPress [Enter] (L159)·[E3] retrieveButton[조회].Select (L167) → retrieve() L202-220: dcr.Dcr00_DocList.selectByText
  const retrieve = async () => {
    setLoading(true);  // grid.mask("Loading")
    try {
      setRows(await aprAttachApi.loadDocs({ classTreeId, startDate: startDate.format(FMT), endDate: endDate.format(FMT), searchText }));
      setChecked([]);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E4] insertButton[확인].Select (L173) → insert() L222-249
  const insert = () => {
    if (checked.length === 0) { Modal.info({ title: '확인', content: '연관문서를 선택해주세요', okText: '확인' }); return; }
    onResult(checked);
  };

  // buildGrid: 등록일 100 · 문서구분 300 · 상신제목 300 · 펀드 250 · 등록자 55
  const columnDefs = useMemo(() => [
    gb.date('regDate', 100, '등록일'),
    gb.text('classTreeName', 300, '문서구분'),
    gb.text('title', 300, '상신제목'),
    gb.text('fundDisplayName', 250, '펀드'),
    gb.text('empName', 55, '등록자'),
  ], []);

  return (
    <>
      <LookupModal
        open={open}
        title="연관문서"
        width={1100}
        style={{ top: 20, maxWidth: 'calc(100vw - 40px)' }}
        closable={false}
        maskClosable={false}
        onCancel={onClose}
        destroyOnClose
        focusFirst={false}
        styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            <Button type="save" onClick={insert}>확인</Button>
            {/* [E5] closeButton[닫기].Select (L179) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <SearchBar onSearch={retrieve} searchText="조회" loading={loading}>
            <SearchBar.Field label="등록기간">
              <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
              <span>~</span>
              <DatePicker style={{ width: 130 }} allowClear={false} value={endDate} onChange={d => d && setEndDate(d)} />
            </SearchBar.Field>
            <SearchBar.Field label="문서구분">
              {/* [E1] classTreeName.TriggerClick (L139) → Dcr01_Lookup_DcrClass.open("%", 오늘) — 선택 없이 닫으면 "전체" */}
              <LookupInput value={classTreeName} empty={['', '전체']} placeholder="전체" width={250} onOpen={() => setClassOpen(true)}
                onClear={() => { setClassTreeId(null); setClassTreeName(''); }} />
            </SearchBar.Field>
            <SearchBar.Field label="검색">
              <SearchBar.Input style={{ width: 250 }} placeholder="상신제목/펀드코드/펀드명/등록자/부서명" value={searchText} onChange={e => setSearchText(e.target.value)} />
            </SearchBar.Field>
          </SearchBar>
          <div style={{ height: 'min(440px, calc(100vh - 290px))' }}>
            <MultiGrid<AprLoadDoc2>
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.docId)}
              loading={loading}
              rowClick
              onCheckedChange={setChecked}
            />
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
