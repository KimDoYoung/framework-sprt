/**
 * [1425] 준법감시 > 90. 기타 > 준감인 사전확인대장 (M05)
 * AS-IS: myApp/client/vi/ics/Ics40_Tab_DcrPreConfirm.java (468줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃: 툴바(조회기간 ~ · 대장분류 콤보 · 검색 · [조회][엑셀다운로드][승인][취소][대장분류설정]) + 그리드(행번호, 체크박스 다중). 열 구성은 ics40Columns.tsx
 * 함께 쓰는 창: Ics41_Lookup_DcrType(대장분류설정) · Ics40_Edit_Msg(의견)
 * 1단계(F·I·M01과 같은 방침): [문서확인]이 여는 전자결재 편집창 Apr01_Edit_ApprDoc은 다른 도메인 — 안내만 띄운다(다음 단계).
 *   [알림설정] noticeButton(Emp93_Lookup_SmsNoticeTarget)은 원본도 툴바에 붙이지 않은 도달 불가 버튼이라 만들지 않는다
 * UX보강(10): 툴바 = SearchBar(UX-01 조회 로딩·Enter). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Modal, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { rdApi } from '@/api/rd';
import { rdDownload } from '@/utils/rdDownload';
import { IcsDcrPreconfirm, IcsDcrTypeOption } from '@/types/ics';
import { MultiGrid } from '@/components/grid';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { ics40Columns } from './ics40Columns';
import { Ics40_Edit_Msg, Ics40_Edit_MsgTarget } from './Ics40_Edit_Msg';
import { Ics41_Lookup_DcrType } from './Ics41_Lookup_DcrType';

const ALL = '%';

export const Ics40_Tab_DcrPreConfirm: React.FC = () => {
  const [rows, setRows] = useState<IcsDcrPreconfirm[]>([]);
  const [skipYn, setSkipYn] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  // settings() L121-221: 조회기간 = 이번 달 1일 ~ 오늘, 대장분류 "전체"(%)
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('month'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [dcrTypeCode, setDcrTypeCode] = useState(ALL);
  const [searchText, setSearchText] = useState('');
  const [typeOptions, setTypeOptions] = useState<IcsDcrTypeOption[]>([]);
  const [msgTarget, setMsgTarget] = useState<Ics40_Edit_MsgTarget | null>(null);
  const [typeOpen, setTypeOpen] = useState(false);
  const checkedRef = useRef<IcsDcrPreconfirm[]>([]);

  // retrieve() L276-291: 서비스 ics.Ics40_DcrPreconfirm.selectByConfirm(companyId, startDate, closeDate, dcrTypeCode, "%"+searchText+"%")
  const retrieve = useCallback(async (code: string = dcrTypeCode) => {
    try {
      setRows(await icsApi.searchDcrPreconfirms(false, startDate.format('YYYY-MM-DD'), closeDate.format('YYYY-MM-DD'), code, searchText));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [startDate, closeDate, dcrTypeCode, searchText]);

  // [E0] 화면 열림 (생성자 L82-119) → settings(): 대장분류 콤보(sys.Sys00_Common.selectIcs41DcrType)를 읽은 뒤 "전체"로 두고 retrieve()
  useEffect(() => {
    (async () => {
      try {
        const [skip, options] = await Promise.all([icsApi.getDcrPreconfirmSkipYn(), icsApi.getDcrTypeOptions()]);
        setSkipYn(skip);
        setTypeOptions(options);
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
        setSkipYn(false);
      }
      void retrieve(ALL);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // viewAppr() L372-395: ApprCallbackResult(apprId) → Apr01_Edit_ApprDoc.retrieveApproval(model, false), 없으면 "해당문서의 열람권한이 없습니다"
  const viewAppr = (row: IcsDcrPreconfirm) => {
    // [E생략] 전자결재 편집창 Apr01_Edit_ApprDoc은 다른 도메인 — 다음 단계
    void row;
    message.info('전자결재 문서보기는 아직 연결되지 않았습니다 (다음 단계)');
  };

  const columnDefs = useMemo(() => ics40Columns({
    skipYn: skipYn === true,
    onViewAppr: viewAppr,
    msgIcon: 'edit',
    // buildGrid actionCell(Edit) L225-236: Ics40_Edit_Msg.editConfirmMsg(선택 행, callback → retrieve())
    onMsg: row => setMsgTarget({ row, mode: 'edit' }),
  }), [skipYn]);

  // [E4] excelDownloadButton[엑셀다운로드].Select (L161) → 전체(%)면 downLoad(true), 아니면 ics.Ics41_DcrType.adYnCheck(dcrTypeCode, companyId) → downLoad(adYn)
  //   downLoad() L397-463: 서비스 sys.Sys99_Print.insertRdDcrPreConfirm → RDUtil.download(page CommonInvokerDownload.jsp · mrd Ics40_Rd_DcrPreConfirm · options "/rxlsopt [100]" · 파일 "사전확인대장(시작 ~ 종료).xlsx" · rv rdGroupId·companyId·personId·startDate·closeDate·adYn·dcrpreconfirmSkipYn)
  const downLoad = async () => {
    setBusy(true);
    try {
      let adYn = true;
      if (dcrTypeCode !== ALL) {
        const type = await icsApi.checkDcrTypeAdYn(dcrTypeCode);
        if (!type) { message.info('검색되지 않는 대장분류입니다. 관리자에게 문의 바랍니다.'); return; }
        adYn = type.adYn;
      }
      const start = startDate.format('YYYY-MM-DD');
      const close = closeDate.format('YYYY-MM-DD');
      const groupId = await icsApi.rdDownloadDcrPreconfirm(start, close, dcrTypeCode, searchText);
      const res = await rdApi.buildUrl({
        kind: 'download',
        mrd: 'Ics40_Rd_DcrPreConfirm',
        options: '/rxlsopt [100]',
        exportType: 'xlsx',
        fileName: `사전확인대장(${start} ~ ${close}).xlsx`,
        rv: { rdGroupId: groupId, startDate: start, closeDate: close, adYn: String(adYn), dcrpreconfirmSkipYn: String(skipYn === true) },
      });
      await rdDownload(res);
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    } finally {
      setBusy(false);
    }
  };

  // [E8 생략] noticeButton[알림설정].Select (L214) → Emp93_Lookup_SmsNoticeTarget.open("B01") — 원본도 툴바에 안 붙인 도달 불가 버튼(생성자 이벤트 연결만 있다)
  // [E5] confirmButton[승인] (L195) / [E6] cancelButton[취소] (L201) → updateChk(true/false) L293-335
  const updateChk = (confirmYn: boolean) => {
    const selected = checkedRef.current;
    for (const m of selected) {
      if (confirmYn) {
        if (m.statusCode === '20') { message.info('이미 승인처리된 내용이 포함되어있습니다'); return; }
      } else if (m.statusCode == null || m.statusCode === '10') {
        message.info('취소처리할 내용이 존재하지 않거나 이미 취소처리된 내용이 포함되어있습니다');
        return;
      }
    }
    const statusCode = confirmYn ? '20' : '10';
    // 미선택이면 AS-IS는 "0건을 승인하시겠습니까?"까지 간 뒤 update()에서 막는다 → 확인 창은 AS-IS와 같이 띄운다
    Modal.confirm({
      title: '확인',
      content: `${selected.length}건을 ${confirmYn ? '승인' : '취소'}하시겠습니까?`,
      width: 220,
      okText: '예',
      cancelText: '아니오',
      // [E9] msgBox.DialogHide [YES] (L320) → update() L337-370: 신청일 오름차순으로 정렬해 ics.Ics40_DcrPreconfirm.updateByStatus(statusCode, confirmerId = 로그인 사원)
      onOk: async () => {
        const sorted = [...selected].sort((a, b) => {
          if (a.regDate == null && b.regDate == null) return 0;
          if (a.regDate == null) return -1;
          if (b.regDate == null) return 1;
          return a.regDate < b.regDate ? -1 : a.regDate > b.regDate ? 1 : 0;
        });
        try {
          await icsApi.updateDcrPreconfirmStatus(statusCode, sorted.map(m => ({ dcrPreconfirmId: m.dcrPreconfirmId, dcrTypeCode: m.dcrTypeCode, apprNo: m.apprNo })));
          await retrieve();
        } catch (err) {
          Modal.error({ title: '알림', content: errorMessage(err, '처리 실패') });
        }
      },
    });
  };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ overflowX: 'auto' }}>
        {/* [E3] retrieveButton[조회].Select (L155) → retrieve() / [E2] searchText.KeyPress [Enter] (L146) → retrieve() */}
        <SearchBar
          onSearch={() => retrieve()}
          loading={busy}
          style={{ flexWrap: 'nowrap', minWidth: 'max-content' }}
          extra={
            <>
              <Button type="download" onClick={downLoad}>엑셀다운로드</Button>
              <Button type="save" onClick={() => updateChk(true)}>승인</Button>
              <Button type="cancel" onClick={() => updateChk(false)}>취소</Button>
              {/* [E7] settingButton[대장분류설정].Select (L207) → Ics41_Lookup_DcrType.open() */}
              <Button type="register" onClick={() => setTypeOpen(true)}>대장분류설정</Button>
            </>
          }
        >
          <SearchBar.Field label="조회기간">
            <DatePicker allowClear={false} style={{ width: 130 }} value={startDate} onChange={d => d && setStartDate(d)} />
            <span style={{ margin: '0 4px' }}>~</span>
            <DatePicker allowClear={false} style={{ width: 130 }} value={closeDate} onChange={d => d && setCloseDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="대장분류">
            {/* [E1] dcrTypeComboBox[sys.Sys00_Common.selectIcs41DcrType].Collapse (L137) → retrieve() — 고르면 바로 조회 */}
            <Select
              style={{ width: 120 }}
              value={dcrTypeCode}
              options={[{ value: ALL, label: '전체' }, ...typeOptions.map(o => ({ value: o.code, label: o.name }))]}
              onChange={v => { setDcrTypeCode(v); void retrieve(v); }}
            />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 300 }} placeholder="심사필번호/제공처/내용/신청자/대장분류" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        {skipYn != null && (
          <MultiGrid<IcsDcrPreconfirm>
            key={String(skipYn)}
            selectionColumnDef={{ pinned: 'left' }}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.dcrPreconfirmId)}
            onCheckedChange={r => { checkedRef.current = r; }}
          />
        )}
      </div>
      <Ics41_Lookup_DcrType open={typeOpen} onClose={() => setTypeOpen(false)} />
      <Ics40_Edit_Msg target={msgTarget} onCallback={() => void retrieve()} onClose={() => setMsgTarget(null)} />
    </div>
  );
};
