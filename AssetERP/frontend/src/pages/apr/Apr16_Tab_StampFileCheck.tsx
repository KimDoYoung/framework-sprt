/**
 * [1350] 경영관리 > 91. 법인서류 > 인감날인본 업로드확인 (T26)
 * AS-IS: myApp/client/vi/apr/Apr16_Tab_StampFileCheck.java (315줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L68-98: center 여백 20, 테두리 박스 = 툴바 50(신청일자 시작 ~ 끝 · 인감선택 칸 250 · "날인본 미첨부 내역만 조회" · [조회][확인][확인취소]) + 체크박스 다중 선택 그리드(행번호, 11열)
 * 1단계: 연관문서 아이콘이 여는 전자결재 편집창 Apr01_Edit_ApprDoc(ApprCallbackResult·retrieveApproval)은 다른 도메인 컴포넌트라 다음 단계 — 안내만 띄운다
 * 스타일: SG (견본 Tdm01_Tab_Hr — docs/page-style.md). 원본이 vlc.setBorders(true)라 SG 견본과 달리 바깥에 테두리를 둔다(03 원칙 12)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 박스 안 여백 = 11 §5(padding 10·gap 8)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message, Modal } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { aprStampDocApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprStamp, AprStampCheck } from '@/types/apr';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { dynamicIconCell } from '@/components/grid/iconCell';
import { LookupInput } from '@/components/lookup/LookupInput';
import { SearchBar } from '@/components/search';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Apr10_Lookup_Stamp } from './Apr10_Lookup_Stamp';

const gb = gbFor<AprStampCheck>();
const DATE = 'YYYY-MM-DD';

export const Apr16_Tab_StampFileCheck: React.FC = () => {
  const user = useLoginUser();
  // settings() L100-139: 신청일자 = 올해 1월 1일 ~ 오늘, 인감선택 칸은 읽기 전용(트리거만, 비면 "전체"), 날인본 미첨부 내역만 조회 = false
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('year'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [stampName, setStampName] = useState('');
  const [checkYn, setCheckYn] = useState(false);
  // 인감을 고른 직후 바로 retrieve()를 부르므로 조건의 최신 값을 ref로도 든다
  const cond = useRef<{ stampId: number | null }>({ stampId: null });
  const state = useRef({ startDate, closeDate, checkYn });
  state.current = { startDate, closeDate, checkYn };
  const [rows, setRows] = useState<AprStampCheck[]>([]);
  const [checked, setChecked] = useState<AprStampCheck[]>([]);
  const [loading, setLoading] = useState(false);
  const [stampOpen, setStampOpen] = useState(false);
  const seq = useRef(0);

  // retrieve() L166-182: apr.Apr16_StampDoc.selectStampCheck(companyId, startDate, closeDate, stampId, notStampFileYn)
  const retrieve = async () => {
    const my = ++seq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const s = state.current;
      const list = await aprStampDocApi.searchStampCheck({
        startDate: s.startDate.format(DATE),
        closeDate: s.closeDate.format(DATE),
        stampId: cond.current.stampId ?? undefined,
        notStampFileYn: s.checkYn,
      });
      if (my !== seq.current) return;
      setRows(list);
      setChecked([]);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === seq.current) setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L68-98) → settings(), retrieve()
  useEffect(() => {
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // findLookupStampSeq() L184-202: Apr10_Lookup_Stamp(flag=true, checkflag=true).open → 고른 인감 이름·ID를 칸에 넣고, "전체보기"는 칸을 비우고 stampId = null. 어느 쪽이든 retrieve()
  const pickStamp = (stamp: AprStamp | null) => {
    if (!stamp) return;
    setStampName(stamp.stampName ?? '');
    cond.current.stampId = stamp.stampId;
    void retrieve();
  };
  const clearStamp = () => {
    setStampName('');
    cond.current.stampId = null;
    void retrieve();
  };

  // [E5] messageBox.DialogHide [YES] (L246) → confirm(check) L258-282: apr.Apr16_StampDoc.updateConfirmDate — 확인이면 확인일자=오늘·확인자=로그인 사원, 취소면 둘 다 비우고 retrieve()
  const confirm = async (check: boolean, targets: AprStampCheck[]) => {
    try {
      await aprStampDocApi.confirm(targets.map(r => r.stampDocId), check);
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E3] confirmButton[확인].Select (L127) → confirmChk(true), [E4] cancelButton[확인취소].Select (L133) → confirmChk(false)  L204-256
  const confirmChk = (check: boolean) => {
    if (checked.length === 0) {
      message.warning('선택된 내역이 없습니다');
      return;
    }
    let acceptChk = 0;
    let cancelChk = 0;
    let confirmerChk = 0;
    for (const r of checked) {
      if (r.confirmDate != null) {
        acceptChk++;
        if (user.userId !== r.confirmerId) confirmerChk++;
      } else {
        cancelChk++;
      }
    }
    if (check) {
      if (acceptChk !== 0) { message.warning('이미 확인 완료된 건이 포함되어 있습니다'); return; }
    } else {
      if (cancelChk !== 0) { message.warning('확인 처리되지 않은 내역이 포함되어 있습니다'); return; }
      if (confirmerChk !== 0) { message.warning('확인자가 본인인 경우에만 취소가 가능합니다'); return; }
    }
    const targets = checked;
    // HtmlMessageBox("확인", n + msg) [예]/[아니오], 폭 350
    Modal.confirm({
      title: '확인',
      content: `${targets.length}${check ? '건의 내역을 확인하시겠습니까?' : '건의 확인내역을 취소하시겠습니까?'}`,
      okText: '예',
      cancelText: '아니오',
      width: 350,
      onOk: () => confirm(check, targets),
    });
  };

  // lookupAppr() L284-306: ApprCallbackResult → Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false, …) — 다른 도메인 컴포넌트라 다음 단계
  const lookupAppr = () => message.info('전자결재 문서 보기 창은 다음 단계에서 연결됩니다');

  // buildGrid() L141-164 (setChecked(MULTI))
  const columnDefs = useMemo(() => [
    gb.date('applDate', 90, '신청일자'),  // L153
    gb.textCenter('applEmpName', 100, '신청자'),  // L154
    gb.text('stampName', 200, '날인인감'),  // L155
    gb.longCenter('stampQty', 70, '날인부수'),  // L156
    gb.text('provideCo', 250, '제출처'),  // L157
    gb.textHtml('purpose', 250, '내용'),  // L158
    dynamicIconCell<AprStampCheck>('view', 'actionCell', 70, '연관문서', lookupAppr, row => row.apprStatusName != null),  // L159 addDynamicCell(…, true)
    gb.date('stampDate', 90, '날인일자'),  // L160
    gb.textCenter('stampFileChk', 70, '날인본<br>첨부여부'),  // L161
    gb.date('confirmDate', 90, '확인일자'),  // L162
    gb.textCenter('confirmerName', 100, '확인자'),  // L163
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] retrieveButton[조회].Select (L121) → retrieve() */}
        <SearchBar
          onSearch={() => void retrieve()}
          loading={loading}
          extra={
            <>
              <Button type="save" onClick={() => confirmChk(true)}>확인</Button>
              <Button type="cancel" onClick={() => confirmChk(false)}>확인취소</Button>
            </>
          }
        >
          <SearchBar.Field label="신청일자">
            <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
            <span>~</span>
            <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} onChange={d => d && setCloseDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="인감선택">
            {/* [E1] stampField.TriggerClick (L115) → findLookupStampSeq() */}
            <LookupInput value={stampName} width={250} placeholder="전체" onOpen={() => setStampOpen(true)} />
          </SearchBar.Field>
          <Checkbox checked={checkYn} onChange={e => setCheckYn(e.target.checked)}>날인본 미첨부 내역만 조회</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<AprStampCheck> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.stampDocId)} loading={loading} onCheckedChange={setChecked} />
        </div>
      </div>
      <Apr10_Lookup_Stamp open={stampOpen} checkflag onResult={pickStamp} onDelete={clearStamp} onClose={() => setStampOpen(false)} />
    </div>
  );
};
