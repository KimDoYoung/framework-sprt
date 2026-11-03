/**
 * [1403] KFS > 11. ERP 계약사관리 > AssetERP 사용료청구 (EE23)
 * AS-IS: myApp/client/vi/biz/Biz55_Tab_ErpFeeCharge.java (901줄) + Biz55_Lookup_ErpFeeCharge(수정창)·Biz55_Lookup_ErpCompany(계약사 조회창)·Dcr01_Lookup_Class·Apr01_Edit_ApprDoc(상신, 링크 A69)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 생성자 L90-120: 가운데(여백 20) = 툴바(청구년월 YYYY.MM [70] · 검색 [200 "계약사"] · [조회][생성][삭제][확정][확정취소][일괄메일발송]) + 그리드(체크 다중, 22열, 헤더 묶음 3)
 * 스타일: SG (견본 — docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 조건이 2개라 넣지 않는다
 * 메일(EE35): [메일보내기] 아이콘 = Dcr10_Lookup_MailSender.erpFeeChargeOpen(메일양식 #{계약사명}·#{청구일}·#{청구금액} 치환), [일괄메일발송] = 선택 행마다 sendMailSessionTest + 이력(진행창 "파일 재생성" E8·E15)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Modal } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { aprDetailApi } from '@/api/apr';
import { bizErpFeeChargeApi, bizErpSetupApi } from '@/api/bizErp';
import { dcrMailSenderApi } from '@/api/dcrMail';
import { errorMessage } from '@/api/client';
import { dcrApi } from '@/api/dcr';
import { BizErpCompany, BizErpFeeCharge } from '@/types/bizErp';
import { Button } from '@/components/button';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';
import { Dcr01_Lookup_Class } from '../dcr/Dcr01_Lookup_Class';
import { Dcr10_Lookup_MailSender, MailSenderTarget } from '../dcr/Dcr10_Lookup_MailSender';
import { Biz55_Lookup_ErpCompany } from './Biz55_Lookup_ErpCompany';
import { Biz55_Lookup_ErpFeeCharge } from './Biz55_Lookup_ErpFeeCharge';

const gb = gbFor<BizErpFeeCharge>();
/** setChecked(MULTI) — 삭제·확정용 체크라 행 클릭이 선택을 바꾸지 않는다 */
const MULTI_CHECK = { mode: 'multiRow', checkboxes: true } as const;
const LINK_CODE = 'A69';

/** createMapping() L846-854 — 값이 없으면 "- " (checkStringNull·checkDateNull "yyyy년 MM월 dd일"·checkLongNull "#,###") */
const mailMapping = (row: BizErpFeeCharge): Record<string, string> => ({
  계약사명: row.corpNm ?? '- ',
  청구일: row.chargeDate ? dayjs(row.chargeDate).format('YYYY년 MM월 DD일') : '- ',
  청구금액: row.chargeAmt == null ? '- ' : row.chargeAmt.toLocaleString('en-US'),
});
/** 메일양식의 #{태그}를 값으로 바꾼다 (AS-IS replaceAll("#{키}", 값)) */
const fillMailForm = (form: string, row: BizErpFeeCharge): string =>
  Object.entries(mailMapping(row)).reduce((text, [key, value]) => text.split(`#{${key}}`).join(value), form);
const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

/** dataYMText 'YYYY.MM'(또는 'YYYY-MM') → 그 달 1일 'yyyy-MM-dd', 틀리면 null (getStartDate L816-820) */
const stdDateOf = (ym: string): string | null => {
  const m = /^(\d{4})[.-](\d{1,2})$/.exec(ym.trim());
  if (!m || Number(m[2]) < 1 || Number(m[2]) > 12) return null;
  return `${m[1]}-${m[2].padStart(2, '0')}-01`;
};

export const Biz55_Tab_ErpFeeCharge: React.FC = () => {
  const gridRef = useRef<AgGridReact<BizErpFeeCharge>>(null);
  // settings() L122-188: 청구년월 폭 70·"YYYY.MM"(오늘), 검색 폭 200·"계약사"
  const [dataYm, setDataYm] = useState(() => dayjs().format('YYYY.MM'));
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<BizErpFeeCharge[]>([]);
  const [loading, setLoading] = useState(false);
  const [editRow, setEditRow] = useState<BizErpFeeCharge | null>(null);
  const [companyOpen, setCompanyOpen] = useState(false);
  // 상신: 문서분류 확인(Dcr01_Lookup_Class) → 결재 문서(Apr01_Edit_ApprDoc)
  const [classOpen, setClassOpen] = useState(false);
  const [defaultClassId, setDefaultClassId] = useState<number | null>(null);
  /** 상신할 청구 행들 (체크한 행들, AS-IS erpFeeChargeList) — 첫 행이 문서의 제목·본문 */
  const [apprRows, setApprRows] = useState<BizErpFeeCharge[]>([]);
  const [linkDoc, setLinkDoc] = useState<{ classTreeId: number; linkCode: string; refId: number } | null>(null);
  const [viewApprId, setViewApprId] = useState<number | null>(null);
  const [mailTarget, setMailTarget] = useState<MailSenderTarget | null>(null);
  /** [일괄메일발송] 진행창 (AS-IS messageBox "파일 재생성" + button01[닫기], E15) */
  const [batch, setBatch] = useState<{ lines: string[]; done: boolean } | null>(null);

  // retrieve() L341-353: biz.Biz55_ErpFeeCharge.selectByStdDate(stdDate = getStartDate(), searchText)
  const retrieve = useCallback(async () => {
    const std = stdDateOf(dataYm);
    if (!std) { message.warning('청구년월을 확인해주세요'); return; }
    setLoading(true);
    try {
      setRows(await bizErpFeeChargeApi.search(std, searchText));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [dataYm, searchText]);

  // [E0] 화면 열림 (생성자 L90-120) → settings(), retrieve()
  useEffect(() => { void retrieve(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const checked = () => gridRef.current?.api?.getSelectedRows() ?? [];

  // [E3] createButton[생성].Select (L151) → create() L376-407: Biz55_Lookup_ErpCompany.open(getDate(), cb) → biz.Biz55_ErpFeeCharge.updateErpCompany(…) → retrieve()
  const onCompanyResult = async (list: BizErpCompany[]) => {
    setCompanyOpen(false);
    try {
      await bizErpFeeChargeApi.create(dataYm, list.map(c => c.erpContCorpId));
    } catch (err) {
      message.error(errorMessage(err, '생성 실패'));
      return;
    }
    await retrieve();
  };

  // [E5] deleteButton[삭제].Select (L163) → deleteRow() L355-374: 선택이 없으면 "삭제할 내용을 선택해주세요", 확인 "삭제" "n건의 정보를 삭제하시겠습니까?"
  //   → [E12] messageBox.DialogHide [YES] (L363) → biz.Biz55_ErpFeeCharge.delete
  const deleteRow = () => {
    const sel = checked();
    if (sel.length < 1) { message.warning('삭제할 내용을 선택해주세요'); return; }
    Modal.confirm({
      title: '삭제',
      content: `${sel.length}건의 정보를 삭제하시겠습니까?`,
      okText: '예', cancelText: '아니오',
      onOk: async () => {
        try {
          await bizErpFeeChargeApi.delete(sel.map(r => r.erpFeeChargeId));
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
          return;
        }
        await retrieve();
      },
    });
  };

  // [E6] confirmButton[확정].Select (L169) · [E7] cancleButton[확정취소].Select (L175) → confirmUpdate(fixYn) L478-589
  const confirmUpdate = (fixYn: boolean) => {
    const sel = checked();
    if (sel.length === 0) { message.warning('선택된 계약사가 없습니다'); return; }
    for (const r of sel) {
      const name = `[${r.corpNm ?? ''}] `;
      if (fixYn && r.fixYn === 'true') { message.warning(`${name}이미 확정 처리되었습니다.`); return; }
      if (!fixYn) {
        if (r.fixYn !== 'true') { message.warning(`${name}아직 확정 처리 안된 계약사가 있습니다.`); return; }
        if (r.apprStatusCd != null) {
          if (['10', '20', '30'].includes(r.apprStatusCd)) { message.warning('결재진행중/완료된 문서가 존재합니다'); return; }
          if (r.apprStatusCd === '99') { message.warning('임시저장된 문서가 있습니다. 삭제후 진행하시길 바랍니다.'); return; }
        }
      }
      if (r.trId != null && !fixYn) { message.warning(`${name}전표가 발생되어 취소할 수 없습니다`); return; }
    }
    // [E13]·[E14] msgBox.DialogHide [YES] (L531·L561) → biz.Biz55_ErpFeeCharge.confirmUpdate → "확정처리되었습니다."/"확정취소처리되었습니다." → retrieve()
    const label = fixYn ? '확정' : '확정취소';
    Modal.confirm({
      title: label,
      content: `${sel.length}건의 항목을 ${label}하시겠습니까?`,
      okText: '예', cancelText: '아니오', width: 330,
      onOk: async () => {
        try {
          await bizErpFeeChargeApi.confirm(sel.map(r => r.erpFeeChargeId), fixYn);
        } catch (err) {
          message.error(errorMessage(err, '처리 실패'));
          return;
        }
        message.success(`${label}처리되었습니다.`);
        await retrieve();
      },
    });
  };

  // ── 결재요청 ──
  // 행의 [결재요청] 아이콘 (actionCell01 L220-289): 확정 전이면 "확정처리후 진행바랍니다.", 문서가 있으면 상태에 따라 안내/재상신 확인, 없으면 바로 searchDcr()
  const apprClick = async (row: BizErpFeeCharge) => {
    if (row.fixYn !== 'true') { message.warning('확정처리후 진행바랍니다.'); return; }
    const sel = checked();
    const list = sel.some(r => r.erpFeeChargeId === row.erpFeeChargeId) ? sel : [row];
    if (row.apprId == null) { await searchDcr(list); return; }
    let statusCode: string | null = null;
    try {
      statusCode = (await aprDetailApi.getDetail(row.apprId)).statusCode;
    } catch {
      statusCode = null;   // Apr01_Appr.selectById 가 비면 문서가 없는 것으로 보고 바로 상신
    }
    if (statusCode == null) { await searchDcr(list); return; }
    if (['10', '20', '30'].includes(statusCode)) { message.warning('결재진행중/완료된 문서가 존재합니다'); return; }
    if (statusCode === '99') { message.warning('임시저장된 문서가 있습니다. 삭제후 상신하시길 바랍니다.'); return; }
    // [E10] msgBox.DialogHide [YES] (L237) → searchDcr()
    Modal.confirm({
      title: '확인', content: '문서상신이 반려된 경우 재상신합니다. 진행하시겠습니까?', okText: '예', cancelText: '아니오', width: 550,
      onOk: () => searchDcr(list),
    });
  };
  // searchDcr() L409-439: dcr.Dcr30_Link.selectByLinkCode(companyId, "A69") → Dcr01_Lookup_Class.open(지정된 분류 또는 null) → insertLinkApproval()
  const searchDcr = async (list: BizErpFeeCharge[]) => {
    try {
      const links = await dcrApi.searchClassTreeByLinkCode(LINK_CODE);
      setDefaultClassId(links.length === 0 ? null : links[0].classTreeId);
      setApprRows(list);
      setClassOpen(true);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };
  // insertLinkApproval(classTreeModel) L441-461: 체크한 행들로 insertLinkApprovals(classTree, "A69", {erpFeeChargeList}, false, cb) — 문서는 첫 행
  const onClassResult = (c: { classTreeId: number }) => {
    setClassOpen(false);
    if (apprRows.length === 0) return;
    setLinkDoc({ classTreeId: c.classTreeId, linkCode: LINK_CODE, refId: apprRows[0].erpFeeChargeId });
  };
  // 문서를 저장·결재요청한 뒤 → updateApprId(apprId, erpFeeChargeList) L464-476 → retrieve()
  const onLinkSaved = async (apprId: number) => {
    try {
      await bizErpFeeChargeApi.updateApprId(apprId, apprRows.map(r => r.erpFeeChargeId));
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
    await retrieve();
  };

  // 행의 [문서보기] 아이콘 (viewCell L291-326): 문서가 없으면 "해당 문서가 없습니다. 결재상태를 확인해주세요."
  const viewDoc = async (row: BizErpFeeCharge) => {
    const none = () => message.warning('해당 문서가 없습니다. 결재상태를 확인해주세요.');
    if (row.apprId == null) { none(); return; }
    try {
      await aprDetailApi.getDetail(row.apprId);
    } catch {
      none();
      return;
    }
    setViewApprId(row.apprId);
  };

  // 행의 [메일보내기] 아이콘 (actionCell02 → sendMail L591-620): 결재 완료(30)가 아니면 "완료되지 않은 문서입니다", 메일양식이 없으면 "메일양식을 등록하고 진행바랍니다."
  //   → 양식의 #{계약사명}·#{청구일}·#{청구금액}을 바꿔 Dcr10_Lookup_MailSender.erpFeeChargeOpen(apprId, 담당자 메일, 상신제목, 양식)
  const sendMail = async (row: BizErpFeeCharge) => {
    if (row.apprStatusCd !== '30') { message.warning('완료되지 않은 문서입니다'); return; }
    try {
      const form = await bizErpSetupApi.mailForm();
      if (!form || !form.mailForm) { message.warning('메일양식을 등록하고 진행바랍니다.'); return; }
      if (row.apprId == null) return;
      setMailTarget({ mode: 'erpFeeCharge', apprId: row.apprId, managerEmail: row.managerEmail, apprTitle: row.apprTitle, mailForm: fillMailForm(form.mailForm, row) });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };
  // [E8] multiSendButton[일괄메일발송].Select (L181) → multiSendMailReady() L622-655 → processSendMail() L657-686
  //   선택이 없으면 "발송할 메일을 해주길 선택바랍니다." / 진행창 "파일 재생성" "파일 생성준비중 ..." → 행마다 "메일 발송 (i/n)" + "메일 발송준비중 [계약사]" (행 사이 0.5초)
  //   각 행(multiSetMailCheck L688-728): 결재 완료(30)가 아니면 건너뜀 · 메일양식 없음 "메일양식 등록 후 진행바랍니다."(멈춤) · 담당자 메일 없음 "수신(메일주소)은 필수입력 항목입니다 [계약사]"(건너뜀)
  //   → fileRetrieve L730-749(첨부 목록) → multiSendMail L751-778(sendMailSessionTest, 개인정보 서명 true) → addLog L780-809(이력, 보낸이 = 메일서버정보)
  const multiSendMailReady = async () => {
    const list = checked();
    if (list.length === 0) { message.warning('발송할 메일을 해주길 선택바랍니다.'); return; }
    setBatch({ lines: ['파일 생성준비중 ...'], done: false });
    const stop = (lines: string[]) => setBatch({ lines, done: true });   // button01[닫기] 켜기
    try {
      const mailInfo = (await dcrMailSenderApi.init(null)).mailInfo ?? '';
      for (let i = 0; i < list.length; i++) {
        const row = list[i];
        const head = `메일 발송 (${i + 1}/${list.length})`;
        setBatch({ lines: [head, `메일 발송준비중 [${row.corpNm}]`], done: false });
        if (row.apprStatusCd === '30') {
          const form = await bizErpSetupApi.mailForm();
          if (!form || !form.mailForm) { stop(['메일양식 등록 후 진행바랍니다.']); return; }
          const content = fillMailForm(form.mailForm, row);
          if (!row.managerEmail) {
            setBatch({ lines: [`수신(메일주소)은 필수입력 항목입니다 [${row.corpNm}]`], done: false });
          } else {
            const fileIds = (await dcrMailSenderApi.init(row.apprId)).files.map(f => f.fileId);
            const res = await dcrMailSenderApi.send({
              apprId: row.apprId, receptor: row.managerEmail, ccReceptor: '', header: row.apprTitle ?? '', content,
              publicCheck: null, privacyInfo: true, testYn: true, fileIds,
            });
            if (!res.ok) {
              message.warning(res.message ?? '메일발송 중 에러가 발생했습니다');
              stop([head, `메일 발송준비중 [${row.corpNm}]`]);
              return;
            }
            await dcrMailSenderApi.saveHistory({
              apprId: row.apprId, senderEmail: mailInfo, receiverEmail: row.managerEmail, referencerEmail: '',
              titleText: row.apprTitle ?? '', bodyText: content, fileIds,
            });
          }
        }
        await sleep(500);
      }
      stop([`${list.length}개의 파일이 전부 재생성이 완료되었습니다.`]);
    } catch (err) {
      message.error(errorMessage(err, '메일 발송 실패'));
      stop(['메일 발송 중 오류가 발생했습니다.']);
    }
  };

  // buildGrid() L190-339
  const columnDefs = useMemo(() => [
    iconCell<BizErpFeeCharge>('edit', 'editCell', 50, '수정', row => setEditRow(row)),   // [E9] editCell → Biz55_Lookup_ErpFeeCharge.edit(선택행)
    gb.booleanYn2('fixYn', 80, '확정여부'),
    gb.textCenter('erpProductCd', 60, '상품코드'),
    gb.text('corpNm', 170, '계약사명'),
    gb.date('chargeDate', 90, '청구일'),
    gb.date('startDate', 90, '사용시작일'),
    gb.date('closeDate', 90, '사용종료일'),
    gb.long('erpFee', 100, '시스템사용료'),
    gb.long('dataFee', 100, 'DATA사용료'),
    gb.group('문자 추가', [gb.long('smsCount', 80, '사용량(건)'), gb.long('addSmsFee', 100, '추가요금')]),
    gb.group('서버 추가', [gb.long('serverUsage', 80, '사용량(GB)'), gb.long('addServerFee', 100, '추가요금')]),
    gb.group('사용자 추가', [gb.long('userCount', 80, '사용인원(명)'), gb.long('addUserFee', 100, '추가요금')]),
    gb.long('chargeAmt', 100, '청구금액'),
    iconCell<BizErpFeeCharge>('edit', 'apprCell', 70, '결재요청', row => { void apprClick(row); }),
    gb.textCenter('apprStatusNm', 90, '결재상태'),
    iconCell<BizErpFeeCharge>('view', 'viewCell', 70, '문서보기', row => { void viewDoc(row); }),   // [E11] viewCell
    iconCell<BizErpFeeCharge>('send', 'mailCell', 80, '메일보내기', row => { void sendMail(row); }),
    gb.textCenter('mailYn', 70, '송신여부'),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] dataYMText.KeyPress [Enter] (L131) · [E2] searchText.KeyPress [Enter] (L142) · [E4] retrieveButton[조회].Select (L157) → retrieve() */}
        <SearchBar
          onSearch={() => retrieve()}
          loading={loading}
          extra={
            <>
              <Button type="generate" onClick={() => setCompanyOpen(true)}>생성</Button>
              <Button type="delete" onClick={deleteRow}>삭제</Button>
              <Button type="save" onClick={() => confirmUpdate(true)}>확정</Button>
              <Button type="cancel" onClick={() => confirmUpdate(false)}>확정취소</Button>
              <Button type="send" onClick={multiSendMailReady}>일괄메일발송</Button>
            </>
          }
        >
          <SearchBar.Field label="청구년월">
            <Input style={{ width: 100 }} placeholder="YYYY.MM" maxLength={7} value={dataYm} onChange={e => setDataYm(e.target.value)} onPressEnter={() => retrieve()} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} placeholder="계약사" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<BizErpFeeCharge>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.erpFeeChargeId)}
            loading={loading}
            rowSelection={MULTI_CHECK}
          />
        </div>
      </div>
      <Biz55_Lookup_ErpFeeCharge target={editRow} onClose={() => setEditRow(null)} onSaved={() => { void retrieve(); }} />
      <Biz55_Lookup_ErpCompany open={companyOpen} stdDate={stdDateOf(dataYm) ?? dayjs().format('YYYY-MM-01')} onResult={list => { void onCompanyResult(list); }} onClose={() => setCompanyOpen(false)} />
      <Dcr01_Lookup_Class open={classOpen} classTreeId={defaultClassId} onResult={onClassResult} onClose={() => { setClassOpen(false); setApprRows([]); }} />
      <Apr01_Edit_ApprDoc
        apprId={viewApprId}
        link={linkDoc}
        onLinkSaved={id => { void onLinkSaved(id); }}
        onClosed={() => { void retrieve(); }}
        onClose={() => { setViewApprId(null); setLinkDoc(null); setApprRows([]); }}
      />
      {/* sendMail() L591-620 → Dcr10_Lookup_MailSender.erpFeeChargeOpen(…) */}
      <Dcr10_Lookup_MailSender target={mailTarget} onClose={() => setMailTarget(null)} />
      {/* [E15] button01[닫기].Select (L643) → messageBox.hide() — 모두 끝나기 전에는 꺼 둔다 */}
      <Modal open={!!batch} title="파일 재생성" width={430} closable={false} maskClosable={false} keyboard={false}
        styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 }, footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 } }}
        footer={<div style={{ textAlign: 'center' }}><Button type="close" disabled={!batch?.done} onClick={() => setBatch(null)}>닫기</Button></div>}>
        <div style={{ padding: '12px 2px', minHeight: 60 }}>
          {batch?.lines.map((line, i) => <div key={i}>{line}</div>)}
        </div>
      </Modal>
    </div>
  );
};
