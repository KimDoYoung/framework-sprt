/**
 * 문자발송 사원 고르기·발송 (Z14) — Sms03_Tab_GroupSend 오른쪽
 * AS-IS: myApp/client/vi/sms/Sms03_Page_UserList.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L47-59: 위 툴바(조회·발송·그룹) + 재직 사원 그리드(체크박스 다중: 조직 160 · 직책 100 · 사번 80 · 성명 80)
 * 부모가 선택한 단체문자 ID(setGroupSendId)를 prop으로 준다. 없으면 [발송]·[그룹]은 "보내실 내용을 좌측에서 선택해주세요"로 막힌다.
 * 실제 문자 발송은 서버 SmsSender가 하며, 지금은 사용자 지시로 보내지 않는다(서버가 거절 문구를 돌려준다).
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { empApi } from '@/api/emp';
import { smsApi } from '@/api/sms';
import { errorMessage } from '@/api/client';
import { TransInfo, EmpAddrBookSelect } from '@/types/emp';
import { GroupSendTarget } from '@/types/sms';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { Emp57_Lookup_List } from '../emp/Emp57_Lookup_List';

const gb = gbFor<TransInfo>();

interface Props {
  /** AS-IS setGroupSendId(groupSendId) L105-107 */
  groupSendId?: number | null;
}

export const Sms03_Page_UserList: React.FC<Props> = ({ groupSendId }) => {
  const gridRef = useRef<AgGridReact<TransInfo>>(null);
  const [rows, setRows] = useState<TransInfo[]>([]);
  const [checked, setChecked] = useState<TransInfo[]>([]);
  const [groupOpen, setGroupOpen] = useState(false);
  const rowSeq = useRef(0);

  // retrieve() L109-124: 서비스 emp.Emp00_TransInfo.selectByText(companyId = 로그인 회사 — 서버, transDate = 오늘, transCode "100" 재직, searchText "%")
  const retrieve = useCallback(async () => {
    try {
      setRows(await empApi.searchTransInfos(dayjs().format('YYYY-MM-DD'), '%', '100', false));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (생성자 L47-59) → settings(), retrieve()
  useEffect(() => { void retrieve(); }, [retrieve]);

  const toTarget = (r: { personId: number; korName: string | null; mobileTelNo: string | null }): GroupSendTarget => ({
    rowKey: --rowSeq.current, personId: r.personId, companyName: null, orgName: null, posName: null, korName: r.korName, mobileTelNo: r.mobileTelNo,
  });

  // sendMessage() L147-174 / sendMessage(list) L197-224: 서비스 sms.Sms03_GroupSend.sendMessage(companyId, groupSendId, 대상 목록)
  const sendMessage = async (targets: GroupSendTarget[]) => {
    if (groupSendId == null) {
      message.warning('보내실 내용을 좌측에서 선택해주세요');
      return;
    }
    try {
      await smsApi.sendGroupMessage(groupSendId, targets);
      message.success('발송이 완료되었습니다');
    } catch (err) {
      message.error(errorMessage(err, '발송 실패'));
    }
  };

  // [E2] sendButton[발송].Select (L68) → sendCheck() L126-145 → [E5] msgBox.DialogHide [YES] (L129) → sendMessage()
  const sendCheck = () => {
    Modal.confirm({
      title: '확인',
      content: '선택한 사원들에게 해당 내용을 발송하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 300,
      onOk: () => sendMessage(checked.map(r => toTarget({ personId: r.personId, korName: r.korNm ?? null, mobileTelNo: r.mobileTelNo ?? null }))),
    });
  };

  // [E3] groupButton[그룹].Select [result != null] (L74) → Emp57_Lookup_List.open("phone", …) → sendCheck(list) L176-195 → [E4] msgBox.DialogHide [YES] (L179) → sendMessage(list)
  const onGroupResult = (result: string | EmpAddrBookSelect[]) => {
    setGroupOpen(false);
    if (typeof result === 'string') return;
    Modal.confirm({
      title: '확인',
      content: `선택한 그룹( ${result.length}명 )에 해당 내용을 발송하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 420,
      onOk: () => sendMessage(result.map(m => toTarget({ personId: m.relateId, korName: m.contacterName, mobileTelNo: m.mobileTelNo }))),
    });
  };

  // buildGrid() L92-103 (체크박스 다중)
  const columnDefs = useMemo(() => [
    gb.text('orgKorNm', 160, '조직'),   // L97
    gb.text('titleNm', 100, '직책'),    // L98
    gb.text('empNo', 80, '사번'),       // L99
    gb.text('korNm', 80, '성명'),       // L100
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      <div style={{ flex: 'none', height: 50, display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px' }}>
        {/* [E1] retrieveButton[조회].Select (L62) → retrieve() */}
        <Button type="search" onClick={retrieve}>조회</Button>
        <Button type="send" onClick={sendCheck}>발송</Button>
        <Button type="group" onClick={() => setGroupOpen(true)}>그룹</Button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiGrid<TransInfo>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.transId)}
          onCheckedChange={setChecked}
        />
      </div>
      <Emp57_Lookup_List open={groupOpen} actionCode="phone" onSelect={onGroupResult} onClose={() => setGroupOpen(false)} />
    </div>
  );
};
