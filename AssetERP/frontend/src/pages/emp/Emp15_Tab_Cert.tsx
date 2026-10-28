/**
 * [1115] 경영관리 > 01. 조직 및 사원관리 > 증명서 발급 (S05)
 * AS-IS: myApp/client/vi/emp/Emp15_Tab_Cert.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 레이아웃(init() L87-182, SG): 가운데 테두리 박스 = 툴바(조회기간 · [조회][생성][삭제] · [문서분류지정](문서관리자만) · 신청내역 안내) + 증명서 그리드
 * 1단계: 전자결재 상신(checkAppr·checkDcr·apprView·insertLinkApproval·updateApprId — Apr01_Edit_ApprDoc·Dcr01_Lookup_Class)과
 *        메일보내기(Dcr10_Lookup_MailSender)는 다음 단계 — 아이콘 열은 그리고, 눌렀을 때 원본의 조건 검사까지만 한다
 */
import React, { useEffect, useRef, useState } from 'react';
import { DatePicker, message, Modal } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { bbsApplicationApi } from '@/api/bbs';
import { dcrApi } from '@/api/dcr';
import { empCertApi } from '@/api/emp';
import { schApi } from '@/api/sch';
import { errorMessage } from '@/api/client';
import { BbsApplication } from '@/types/bbs';
import { Cert } from '@/types/emp';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { Dcr30_Lookup_Link } from '@/components/lookup/Dcr30_Lookup_Link';
import { Emp15_Lookup_Cert } from './Emp15_Lookup_Cert';
import { Emp15_Lookup_GetCert } from './Emp15_Lookup_GetCert';
import { Emp15_Lookup_StampDocCert } from './Emp15_Lookup_StampDocCert';

const gb = gbFor<Cert>();

/** 단일 체크 선택 (setChecked(SINGLE)) */
const ROW_SELECTION = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

/** addTextColor: 삭제·반려는 굵은 빨강, 그 밖은 검정 (GridBuilder L2473-2494) */
const statusStyle = (p: { value?: string | null }): Record<string, string> =>
  (p.value === '삭제' || p.value === '반려' ? { color: '#D50303', fontWeight: 'bold' } : { color: 'black' });

export const Emp15_Tab_Cert: React.FC = () => {
  const gridRef = useRef<AgGridReact<Cert>>(null);
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().startOf('year')); // L91-93: 올해 1월 1일
  const [closeDate, setCloseDate] = useState<Dayjs>(dayjs()); // L94: 오늘
  const [rows, setRows] = useState<Cert[]>([]);
  const [hasApplication, setHasApplication] = useState(false); // checkStampDoc() L392-416: 신청내역 안내 표시
  const [userManager, setUserManager] = useState(false); // LoginUser.getIsUserManager() L112
  const [certOpen, setCertOpen] = useState(false);
  const [getOpen, setGetOpen] = useState(false);
  const [application, setApplication] = useState<BbsApplication | null>(null);
  const [linkOpen, setLinkOpen] = useState(false);

  // [E1] retrieveButton[조회].Select (L119) / [E5] hiperLink 저장 뒤 → retrieve() L214-228: 서비스 emp.Emp15_Cert.selectByCompanyId(companyId, startDate, closeDate) → checkStampDoc()
  const retrieve = async () => {
    try {
      setRows(await empCertApi.searchCerts(startDate.format('YYYY-MM-DD'), closeDate.format('YYYY-MM-DD')));
    } catch (err) {
      setRows([]);
      message.error(errorMessage(err, '조회 실패'));
    }
    // checkStampDoc(): 서비스 bbs.Bbs11_Application.selectByAppStatus(companyId, "10") — 한 건이라도 있으면 안내와 [신청내역 가져오기]
    try {
      setHasApplication((await bbsApplicationApi.searchByAppStatus('10')).length > 0);
    } catch {
      setHasApplication(false);
    }
  };

  // [E0] 화면 열림 (생성자 L82-85) → init(), retrieve()
  useEffect(() => {
    void retrieve();
    schApi.isUserManager().then(setUserManager).catch(() => setUserManager(false));
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E3] deleteButton[삭제].Select (L131) → deleteRow() L230-253
  const deleteRow = () => {
    const sel = gridRef.current?.api?.getSelectedRows()[0];
    if (!sel) return message.warning('삭제할 항목을 선택해주세요'); // 원본은 선택 없이 누르면 오류 — 안내만 더한다
    if (sel.apprStatusName !== '') return message.warning('해당 항목은 삭제불가능합니다');
    Modal.confirm({
      title: '삭제',
      content: '선택한 정보를 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      // [E6] messageBox.DialogHide [YES] (L240) → 서비스 emp.Emp15_Cert.delete
      onOk: async () => {
        try {
          await empCertApi.deleteCert(sel.certId);
          setRows(prev => prev.filter(r => r.certId !== sel.certId));
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // 다음 단계: 결재 문서 작성·보기(Apr01_Edit_ApprDoc)
  const apprNext = () => message.info('전자결재 상신·결재문서 보기(Apr01_Edit_ApprDoc)는 아직 변환 전입니다.');

  // checkDcr() L329-357: 서비스 dcr.Dcr30_Link.selectByLinkCode — 문서분류가 없으면 Dcr01_Lookup_Class로 고르고, 있으면 그 분류로 insertLinkApproval(결재 문서 작성)
  const checkDcr = async (row: Cert) => {
    try {
      await dcrApi.searchClassTreeByLinkCode(row.linkCode ?? '');
      apprNext();
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E7] msgBox.DialogHide [YES] (L284) → checkDcr(), apprView() / checkAppr() L275-305 (결재요청 아이콘)
  const checkAppr = (row: Cert) => {
    gridRef.current?.api?.getRowNode(String(row.certId))?.setSelected(true, true);
    if (row.apprStatusName === '') {
      void checkDcr(row);
    } else if (row.apprStatusName === '반려') {
      Modal.confirm({
        title: '확인',
        content: '새로운 결재요청을 진행하시겠습니까?',
        okText: '예',
        cancelText: '아니오',
        width: 450,
        onOk: () => checkDcr(row),
        onCancel: apprNext, // NO → apprView(selectModel.getApprId())
      });
    } else {
      apprNext(); // apprView(selectModel.getApprId()) L307-327: 서비스 apr.Apr01_Appr.selectById → Apr01_Edit_ApprDoc 열기
    }
  };

  // sendMail() L265-273 (메일보내기 아이콘): 완료된 문서만 Dcr10_Lookup_MailSender.certOpen(apprId, 사원 e-mail)
  const sendMail = (row: Cert) => {
    gridRef.current?.api?.getRowNode(String(row.certId))?.setSelected(true, true);
    if (row.apprStatusName !== '완료') return message.warning('완료되지 않은 문서입니다');
    message.info('메일 보내기(Dcr10_Lookup_MailSender)는 아직 변환 전입니다.');
  };

  // buildGrid() L184-212 — setChecked(SINGLE), 행번호 있음
  const columnDefs = [
    gb.date('issueDate', 90, '발급신청일'), // L201 (읽기 전용 날짜 UX-08)
    gb.text('linkName', 120, '증명서종류'), // L202
    gb.textCenter('personNo', 80, '사원번호'), // L203
    gb.textCenter('personName', 100, '사원명'), // L204
    gb.text('certUseName', 400, '용도'), // L205
    gb.textCenter('stampSeqText', 250, '발급번호'), // L206
    gb.text('apprStatusName', 80, '결재상태', { cellStyle: statusStyle }), // L207 addTextColor
    iconCell<Cert>('edit', 'actionCell', 100, '결재요청', checkAppr), // L208 ImageCell("Edit") → checkAppr()
    iconCell<Cert>('send', 'sendMailCell', 80, '메일보내기', sendMail), // L209 ImageCell("Send") → sendMail()
  ];

  return (
    <div style={{ height: '100%', padding: 20, background: '#fff', boxSizing: 'border-box' }}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 10, border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
        <SearchBar
          onSearch={retrieve}
          extra={<>
            {/* [E2] insertButton[생성].Select (L125) → insertCert() L255-263: Emp15_Lookup_Cert.insert(callback → retrieve()) */}
            <Button type="generate" onClick={() => setCertOpen(true)}>생성</Button>
            <Button type="delete" onClick={deleteRow}>삭제</Button>
            {/* [E4] dcrLinkButton[문서분류지정].Select (L138) → Dcr30_Lookup_Link.open("LinkCode0003", callback{}) — 문서관리자만(L112) */}
            {userManager && <Button type="save" onClick={() => setLinkOpen(true)}>문서분류지정</Button>}
            {hasApplication && (
              <span style={{ marginLeft: 16, whiteSpace: 'nowrap' }}>
                <b style={{ fontSize: 14 }}>※ 증명서 신청내역이 존재합니다.</b>
                {/* [E5] hiperLink[신청내역 가져오기].Click (L151) → Emp15_Lookup_GetCert.open → Emp15_Lookup_StampDocCert.insert(신청내역, callback → retrieve()) */}
                <a style={{ marginLeft: 10, fontSize: 14, fontWeight: 'bold', color: '#0078D7', textDecoration: 'underline', cursor: 'pointer' }}
                  onClick={() => setGetOpen(true)}>신청내역 가져오기</a>
              </span>
            )}
          </>}
        >
          <SearchBar.Field label="조회기간">
            <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} />
            <span>~</span>
            <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} onChange={d => d && setCloseDate(d)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<Cert>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            rowSelection={ROW_SELECTION}
            getRowId={p => String(p.data.certId)}
          />
        </div>
      </div>
      <Emp15_Lookup_Cert open={certOpen} onSaved={retrieve} onClose={() => setCertOpen(false)} />
      <Emp15_Lookup_GetCert open={getOpen} onResult={setApplication} onClose={() => setGetOpen(false)} />
      <Emp15_Lookup_StampDocCert application={application} onSaved={retrieve} onClose={() => setApplication(null)} />
      <Dcr30_Lookup_Link open={linkOpen} linkCodeList="LinkCode0003" onClose={() => setLinkOpen(false)} />
    </div>
  );
};
