/**
 * [1020] 문서작성 > 04. 전자결재 > (X)인감대장 (G06, 1단계)
 * AS-IS: myApp/client/vi/apr/Apr01_Tab_StampSeq.java (314줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L79-110: center=vlc, 바깥 여백 20 — 툴바(조회구간 시작 ~ 끝 · 인감선택 칸 200 · [조회]) + 인감대장 그리드(체크박스 단일 선택, 11열)
 * 메뉴명 "(X)"는 메뉴 사용 false라는 뜻이지만 사용자 요청으로 변환한다(01g)
 * 1단계(G01~G04와 같은 사유): [문서확인]이 여는 전자결재 편집창 Apr01_Edit_ApprDoc은 다른 도메인이라 다음 단계에서 연결한다 — 지금은 원본의 사전 검사 메시지까지만 하고 안내를 띄운다.
 * 사원찾기 lookupEmpInfo(L208-221)는 컬럼·툴바에 연결되지 않은 도달 불가 코드라 만들지 않는다
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 박스 안 여백 = 11 §5(padding 10·gap 8)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Modal } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { aprApi } from '@/api/apr';
import { orgApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { AprStamp, AprStampSeq } from '@/types/apr';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Apr10_Lookup_Stamp } from './Apr10_Lookup_Stamp';

const gb = gbFor<AprStampSeq>();
const DATE_FORMAT = 'YYYY-MM-DD';
/** 폐기된 문서의 제목에 들어 있는 표시 (원본 buildGrid editDocCell indexOf) */
const DISPOSED_VIEW = 'style=color:#E33E31;>[폐기]';

export const Apr01_Tab_StampSeq: React.FC = () => {
  // settings() L112-135: 조회구간 = 오늘 -1달 +1일 ~ 오늘, 인감선택 칸은 읽기 전용(트리거만)
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().subtract(1, 'month').add(1, 'day'));
  const [endDate, setEndDate] = useState<Dayjs>(() => dayjs());
  const [stampId, setStampId] = useState(0);  // selectStampId = 0L — 0이면 모든 인감
  const [stampName, setStampName] = useState('');
  const [rows, setRows] = useState<AprStampSeq[]>([]);
  const [loading, setLoading] = useState(false);
  const [stampOpen, setStampOpen] = useState(false);
  // booleanCheck = true → 열 10·11·12(확인자입력·인감확인자·확인일시)를 숨긴다. setGridColmun() 결과로 바뀐다
  const [putSealVisible, setPutSealVisible] = useState(false);
  const seq = useRef(0);

  // retrieve() L276-291: apr.Apr01_Appr.selectByApprDate(startDate, endDate, stampId, companyId)
  const retrieve = async () => {
    const my = ++seq.current;
    setLoading(true);  // grid.mask("loading")
    try {
      const list = await aprApi.searchStampSeq({
        startDate: startDate.format(DATE_FORMAT),
        endDate: endDate.format(DATE_FORMAT),
        stampId: stampId > 0 ? stampId : undefined,
      });
      if (my !== seq.current) return;
      setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === seq.current) setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L79-110) → settings(), setGridColmun() L137-161: org.Org00_OrgInfo.selectByIgnoreStamp("true", 내 조직) 행이 있으면 열 10~12를 보이고, 끝나면 retrieve()
  useEffect(() => {
    void (async () => {
      try {
        setPutSealVisible(await orgApi.hasIgnoreStamp());
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
      await retrieve();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E4] messageBox.DialogHide [YES] (L242) → updatePutSeal() L253-274: apr.Apr01_Appr.updatePutSealEmpId — 인감확인자·확인일시를 채워 그 행을 갱신한다
  const updatePutSeal = async (row: AprStampSeq) => {
    try {
      const res = await aprApi.updatePutSeal(row.apprId);
      setRows(prev => prev.map(r => (r.apprId === row.apprId ? { ...r, putSealEmpName: res.putSealEmpName, putSealDate: res.putSealDate } : r)));
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // updatePutSealConfirm() L239-251: HtmlMessageBox("확인", "해당인감을 확인하겠습니까?") [예]/[아니오]
  const updatePutSealConfirm = (row: AprStampSeq) => {
    Modal.confirm({
      title: '확인',
      content: '해당인감을 확인하겠습니까?',
      okText: '예',
      cancelText: '아니오',
      onOk: () => updatePutSeal(row),
    });
  };

  // [E3] lookupEmpInfo.TriggerClick (L208) → 인라인 L208-221 (사원찾기로 putSealEmpId 변경): 도달 불가 — lookupEmpInfo가 컬럼·툴바에 연결되지 않아 만들지 않는다
  // buildGrid() L163-237 (체크박스 단일 선택)
  const columnDefs = useMemo(() => [
    gb.text('stampSeqText', 70, '대장번호'),  // L224
    gb.date('apprDate', 100, '신청일자'),  // L225
    gb.text('regEmpName', 80, '신청자'),  // L226
    gb.text('apprEmpName', 80, '최종결재자'),  // L227
    gb.textHtml('title', 500, '내용'),  // L228 addTextHtml
    gb.text('stampName', 200, '사용인감'),  // L229
    gb.text('receiveName', 300, '제출처'),  // L230
    // editDocCell(View) → 폐기 문서면 "해당문서는 폐기되어 열람이 불가능합니다", 아니면 ApprCallbackResult(열람권한 없으면 "해당문서의 열람권한이 없습니다") → Apr01_Edit_ApprDoc.retrieveApproval(model, false, callback)
    // [생략] 편집창은 다음 단계
    iconCell<AprStampSeq>('view', 'actionCell', 80, '문서확인', row => {  // L231
      if ((row.title ?? '').includes(DISPOSED_VIEW)) message.warning('해당문서는 폐기되어 열람이 불가능합니다');
      else message.info('전자결재 문서 보기 창은 다음 단계에서 연결됩니다');
    }),
    // L232 updateCell(Edit) → updatePutSealConfirm() — setGridColmun이 보이게 한 경우만
    { ...iconCell<AprStampSeq>('edit', 'actionCell02', 80, '확인자입력', updatePutSealConfirm), hide: !putSealVisible },
    { ...gb.text('putSealEmpName', 80, '인감확인자'), hide: !putSealVisible },  // L233
    { ...gb.dateTime('putSealDate', 160, '확인일시'), hide: !putSealVisible },  // L234
  ], [putSealVisible]);

  // findLookupStampSeq() L293-309: Apr10_Lookup_Stamp(flag=true, checkflag=true).open → [확인]은 인감 이름·ID를 칸에 넣고, [전체]("전체보기")는 칸을 비우고 ID 0
  const pickStamp = (stamp: AprStamp | null) => {
    if (!stamp) return;
    setStampName(stamp.stampName ?? '');
    setStampId(stamp.stampId);
  };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar onSearch={() => void retrieve()} loading={loading}>
          {/* [E2] retrieveButton[조회].Select (L129) → retrieve() */}
          <SearchBar.Field label="조회구간">
            <DatePicker style={{ width: 140 }} allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
            <span>~</span>
            <DatePicker style={{ width: 140 }} allowClear={false} value={endDate} onChange={d => d && setEndDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="인감선택">
            {/* [E1] selectStampField.TriggerClick (L123) → findLookupStampSeq() */}
            <LookupInput value={stampName} width={200} onOpen={() => setStampOpen(true)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<AprStampSeq>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.apprId)}
            loading={loading}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
          />
        </div>
      </div>
      <Apr10_Lookup_Stamp
        open={stampOpen}
        checkflag
        onResult={pickStamp}
        onDelete={() => { setStampName(''); setStampId(0); }}
        onClose={() => setStampOpen(false)}
      />
    </div>
  );
};
