/**
 * 문서 불러오기 창 (V05) — 상신 편집창의 [불러오기]가 연다. 이미 상신된 문서(내가 볼 수 있는 것)를 골라 제목·본문을 가져온다.
 * AS-IS: myApp/client/vi/apr/Apr05_Lookup_LoadDoc2.java (467줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * init() L133-204: 1700×700 모달 "문서 불러오기", 위 기간(지난달 1일 ~ 오늘)·문서구분(Dcr01_Lookup_DcrClass)·검색 250·[조회], 왼쪽 그리드(등록일 90·상신제목 300·수신처 130·펀드 300·상태 75·상신자 75·문서구분 250·열람권한 75),
 *   오른쪽 620 미리보기(고른 문서의 본문), 푸터 [확인][닫기]
 * 이 호출은 `Apr05_Lookup_LoadDoc2(false, cb)` — 단일 선택, 결재완료 제한 없음, [선택안함] 없음, tdm52 아님.
 * EE34: `Apr05_Lookup_LoadDoc2("MULTI", true, cb)`(증빙자료 연결 Com01_Lookup_RelateAppr) — `multi`면 체크박스 다중 선택(setChecked(MULTI), 행 클릭으로도 선택)이고 [확인]은 고른 문서 목록을 `onSelectedList`로 준다.
 * tdm52: `Apr05_Lookup_LoadDoc2("MULTI", "tdm52", chckManlId, true, cb)`(Com01_Lookup_RelateAppr, 이행점검 증빙) — 원본 2026-10-28 settings() L246-266:
 *   검색 안내 "상신제목/내용/등록자", [연결된 문서분류만 조회] 체크(회사 설정 tdmEvidOnlyRelateDcrYn이면 켜고 잠금·문서구분도 잠금), 5번째 열(체크 열 포함 → 상태) 숨김,
 *   목록은 dcr.Dcr00_DocList.selectNoAuthByText(권한 무관, 열람권한 열). 2026-11-11 연결(DB 복원으로 f_get_apprDcrAuth 생김)
 * [E0] 화면 열림 (생성자 L103-108) → init() · [E1] tdmRelateDcrYn.ValueChange (L215) — tdm52 호출에서만 · [E7] nullButton[선택안함].Select (L306) — [선택안함] 호출에서만
 * 스타일: MH (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Checkbox, DatePicker, message, Modal } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { aprAttachApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprLoadDoc2 } from '@/types/apr';
import { Button } from '@/components/button';
import { MultiGrid, SingleGrid, gbFor } from '@/components/grid';
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
  onResult?: (doc: { title: string; content: string }) => void;
  /** EE34 "MULTI": 체크박스 다중 선택 — [확인]은 `onSelectedList(고른 문서 전체)`를 부른다(onResult·onSelected는 부르지 않는다). 닫기는 부른 쪽이 한다 */
  multi?: boolean;
  onSelectedList?: (docs: AprLoadDoc2[]) => void;
  /** Apr05_Lookup_LoadDoc2(aprStatusYn, callback) L127 (Y08): true면 결재완료(30) 문서만 고를 수 있다("결재완료된 문서만 연결할 수 있습니다", L416-424) — 증빙문서 연결 */
  aprStatusYn?: boolean;
  /** [확인]에서 고른 문서 전체(apprId 포함) — callback.execute(apprModel)의 apprId가 필요한 부르는 쪽용(Y08). onResult 다음에 불린다 */
  onSelected?: (doc: AprLoadDoc2) => void;
  /** Apr05_Lookup_LoadDoc2("SINGLE", nullButtonYn=true, aprStatusYn, callback) L119 (Y11): 값을 주면 [확인] 옆에 [선택안함]이 생긴다 — L306-314 callback.execute(null) 뒤 hide. 부른 쪽이 연결을 비운다 */
  onNull?: () => void;
  /** Apr05_Lookup_LoadDoc2(selectMode, keyTable, keyTableId, aprStatusYn, callback) — 'tdm52'면 이행점검 증빙 목록(selectNoAuthByText) */
  keyTable?: string;
  keyTableId?: number | null;
  onClose: () => void;
}

export const Apr05_Lookup_LoadDoc2: React.FC<Props> = ({ open, onResult, multi = false, onSelectedList, aprStatusYn = false, onSelected, onNull, keyTable, keyTableId, onClose }) => {
  const tdm52 = keyTable === 'tdm52';
  // init() L133-148: 기간 = 지난달 1일 ~ 오늘
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().subtract(1, 'month').startOf('month'));
  const [endDate, setEndDate] = useState<Dayjs>(() => dayjs());
  const [classTreeId, setClassTreeId] = useState<number | null>(null);
  const [classTreeName, setClassTreeName] = useState('');
  const [classOpen, setClassOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<AprLoadDoc2[]>([]);
  const [selected, setSelected] = useState<AprLoadDoc2 | undefined>(undefined);
  const [checked, setChecked] = useState<AprLoadDoc2[]>([]);
  const [loading, setLoading] = useState(false);
  // tdmRelateDcrYn [연결된 문서분류만 조회] — tdm52에서만 보인다. relateLocked: 회사 설정으로 켜고 잠금
  const [relateYn, setRelateYn] = useState(false);
  const [relateLocked, setRelateLocked] = useState(false);

  // retrieve() L351-393: tdm52면 dcr.Dcr00_DocList.selectNoAuthByText, 아니면 selectByText
  const retrieve = useCallback(async (p: { start: Dayjs | null; end: Dayjs | null; classTreeId: number | null; searchText: string; relateYn: boolean }) => {
    if (!p.start) { Modal.info({ title: '확인', content: '조회기간 시작일을 선택하세요', okText: '확인' }); return; }
    if (!p.end) { Modal.info({ title: '확인', content: '조회기간 종료일을 선택하세요', okText: '확인' }); return; }
    setLoading(true);
    try {
      setRows(await aprAttachApi.loadDocs({ classTreeId: p.classTreeId, startDate: p.start.format(FMT), endDate: p.end.format(FMT), searchText: p.searchText,
        keyTable, keyTableId, tdmRelateDcrYn: p.relateYn }));
      setSelected(undefined);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [keyTable, keyTableId]);

  useEffect(() => {
    if (!open) return;
    const start = dayjs().subtract(1, 'month').startOf('month');
    const end = dayjs();
    setStartDate(start); setEndDate(end); setClassTreeId(null); setClassTreeName(''); setSearchText(''); setSelected(undefined); setChecked([]);
    setRelateYn(false); setRelateLocked(false);
    if (!tdm52) { void retrieve({ start, end, classTreeId: null, searchText: '', relateYn: false }); return; }
    // settings() L246-258: 회사 설정 tdmEvidOnlyRelateDcrYn이면 체크를 켜고 잠금(문서구분도 잠금), 아니면 끄고 풂
    void (async () => {
      let only = false;
      try { only = await aprAttachApi.tdmEvidOnlyRelateDcrYn(); } catch (err) { message.error(errorMessage(err, '회사 설정 조회 실패')); }
      setRelateYn(only); setRelateLocked(only);
      void retrieve({ start, end, classTreeId: null, searchText: '', relateYn: only });
    })();
  }, [open, tdm52, retrieve]);

  const search = () => retrieve({ start: startDate, end: endDate, classTreeId, searchText, relateYn });

  // [E1] tdmRelateDcrYn.ValueChange (L215) → 켜면 문서구분 잠금, retrieve()
  const changeRelate = (v: boolean) => {
    setRelateYn(v);
    void retrieve({ start: startDate, end: endDate, classTreeId, searchText, relateYn: v });
  };

  // [E6] insertButton[확인].Select (L300) → insert() L408-442: 고른 문서가 없으면 "문서를 선택해주세요"
  const insert = () => {
    if (multi) {
      if (checked.length === 0) { Modal.info({ title: '확인', content: '문서를 선택해주세요', okText: '확인' }); return; }
      if (aprStatusYn && checked.some(d => d.statusCode !== '30')) { Modal.info({ title: '확인', content: '결재완료된 문서만 연결할 수 있습니다', okText: '확인' }); return; }
      onSelectedList?.(checked);
      return;
    }
    if (!selected) { Modal.info({ title: '확인', content: '문서를 선택해주세요', okText: '확인' }); return; }
    // 완료된 상신문서만 증빙자료로 연결할 수 있음 (L416-424)
    if (aprStatusYn && selected.statusCode !== '30') { Modal.info({ title: '확인', content: '결재완료된 문서만 연결할 수 있습니다', okText: '확인' }); return; }
    onResult?.({ title: selected.title ?? '', content: selected.content ?? '' });
    onSelected?.(selected);
  };

  // buildGrid() L330-349. tdm52면 setHidden(5) — 체크 열이 0번이라 5번은 상태(L262)
  const columnDefs = useMemo(() => [
    gb.date('regDate', 90, '등록일'),  // L331
    gb.text('title', 300, '상신제목'),  // L332
    gb.text('receiveName', 130, '수신처'),  // L333
    gb.text('fundDisplayName', 300, '펀드'),  // L334
    { ...gb.textHtml('statusName', 75, '상태'), hide: tdm52 },  // L342
    gb.textCenter('empName', 75, '상신자'),  // L336
    gb.text('classTreeName', 250, '문서구분'),  // L337
    gb.booleanYn2('authYn', 75, '열람권한'),  // L345
  ], [tdm52]);

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
            {/* [E7] nullButton[선택안함].Select (L306) → callback.execute(null), hide() — nullButtonYn 호출(Y11)에서만 */}
            {onNull && <Button type="delete" onClick={() => { onNull(); onClose(); }}>선택안함</Button>}
            {/* [E8] closeButton[닫기].Select (L315) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* [E4] searchText.KeyPress [Enter] (L286) · [E5] retrieveButton[조회].Select (L294) → retrieve() */}
          <SearchBar onSearch={search} searchText="조회" loading={loading}
            extra={tdm52 && <Checkbox checked={relateYn} disabled={relateLocked} onChange={e => changeRelate(e.target.checked)}>연결된 문서분류만 조회</Checkbox>}>
            <SearchBar.Field label="기간">
              <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
              <span>~</span>
              <DatePicker style={{ width: 130 }} allowClear={false} value={endDate} onChange={d => d && setEndDate(d)} />
            </SearchBar.Field>
            <SearchBar.Field label="문서구분">
              {/* [E2] classTreeName.TriggerClick (L227) → Dcr01_Lookup_DcrClass.open("%", 오늘) — 선택 없이 닫으면 "전체" */}
              <LookupInput value={classTreeName} empty={['', '전체']} placeholder="전체" width={260} disabled={tdm52 && relateYn} onOpen={() => setClassOpen(true)}
                onClear={() => { setClassTreeId(null); setClassTreeName(''); }} />
            </SearchBar.Field>
            <SearchBar.Field label="검색">
              <SearchBar.Input style={{ width: 280 }} placeholder={tdm52 ? '상신제목/내용/등록자' : '상신제목/내용/펀드코드/펀드명/등록자'} value={searchText} onChange={e => setSearchText(e.target.value)} />
            </SearchBar.Field>

          </SearchBar>
          <div style={{ display: 'flex', gap: 8, height: 'min(520px, calc(100vh - 290px))' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              {multi ? (
                <MultiGrid<AprLoadDoc2>
                  rowData={rows}
                  columnDefs={columnDefs}
                  getRowId={p => String(p.data.docId)}
                  loading={loading}
                  rowClick
                  onCheckedChange={list => { setChecked(list); setSelected(list.length > 0 ? list[list.length - 1] : undefined); }}
                />
              ) : (
                <SingleGrid<AprLoadDoc2>
                  rowData={rows}
                  columnDefs={columnDefs}
                  getRowId={p => String(p.data.docId)}
                  loading={loading}
                  rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
                  onSelect={setSelected}
                />
              )}
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
