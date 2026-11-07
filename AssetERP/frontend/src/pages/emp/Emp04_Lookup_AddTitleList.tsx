/**
 * 겸직전환 창 (EE52) — MainFrame 사용자 메뉴의 [겸직전환]이 연다 (AS-IS 사용자 이름 옆 ▼ 단추 addTitleAnchor L670)
 * 로그인 선택 (mode="login") — 로그인 직후 App의 겸직 선택 문이 연다 (AS-IS LoginPage.openFrame3 L741-766)
 * AS-IS: myApp/client/vi/emp/Emp04_Lookup_AddTitleList.java (222줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(callback) L58-62: [확인]을 감추고 [전환][닫기]. 생성자 L64-117: 690×300, 닫기(X) 없음, 머리말 "겸직전환", 단일 선택 그리드
 * login(callback) L50-56: 머리말 "로그인 선택", [전환][닫기]를 감추고 [확인]만. [확인]·더블클릭 → 확인 질문 없이 바로 login() (L72-81, L99-103)
 * 전환(login() L167-194): AS-IS는 클라이언트 세션 교체, TOBE는 POST /api/auth/switch-title 로 새 토큰 쿠키를 받는다 → 호출한 쪽이 화면을 새로 연다(onChanged)
 * 스타일: MG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, Space, message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { authApi } from '@/api/auth';
import { empAddTitleApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { useLoginUser } from '@/hooks/useLoginUser';
import { AddTitleLogin } from '@/types/emp';
import { User } from '@/types/auth';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<AddTitleLogin>();

/** AS-IS buildGrid() L119-130 (setChecked SINGLE) */
const columns = [
  gb.booleanYn2('mainTitleYn', 70, '본업무'),      // L123
  gb.textArea('orgFullName', 250, '부서명'),        // L124
  gb.textCenter('titleName', 110, '직책'),          // L125
  gb.longCenter('outstandingCnt', 100, '미결함'),   // L126
  gb.date('closeDate', 100, '겸직종료일'),          // L127
];

interface Props {
  open: boolean;
  /** open = MainFrame 겸직전환(AS-IS open(callback)), login = 로그인 선택(AS-IS login(callback)) */
  mode?: 'open' | 'login';
  /** AS-IS callback.execute("none") — [닫기] (login 모드에는 [닫기]가 없다) */
  onClose?: () => void;
  /** AS-IS callback.execute("change") — 전환이 끝났다. 다른 사원으로 바꿨으면 새 토큰의 사용자가 온다(본업무를 고르면 undefined). 부르는 쪽이 화면을 다시 연다 */
  onChanged: (user?: User) => void;
}

export const Emp04_Lookup_AddTitleList: React.FC<Props> = ({ open, mode = 'open', onClose, onChanged }) => {
  const isLogin = mode === 'login';
  const user = useLoginUser();
  const gridRef = useRef<AgGridReact<AddTitleLogin>>(null);
  const [rows, setRows] = useState<AddTitleLogin[]>([]);
  const [loading, setLoading] = useState(false);

  // retrieve() L132-136 — emp.Emp04_AddTitle.getAddTitleList (personId = 로그인 사원)
  const retrieve = useCallback(async () => {
    try {
      setRows(await empAddTitleApi.getLoginList());
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (생성자 L64-117) → show(), retrieve()
  useEffect(() => {
    if (!open) return;
    setRows([]);
    setLoading(false);
    void retrieve();
  }, [open, retrieve]);

  const selected = () => gridRef.current?.api.getSelectedRows()[0];

  // login() L167-194 — sys.Sys02_User.getChangeInfo 뒤 LoginUser.setUserModel → callback("change") → 안내 + setMenuList() → hide()
  // login 모드에서 본업무(자기 자신)를 고르면 AS-IS는 같은 사원으로 getChangeInfo 를 다시 부른다 → TOBE는 토큰을 그대로 둔다
  const login = async (row: AddTitleLogin) => {
    if (isLogin && row.addPersonId === user.userId) { onChanged(); return; }
    setLoading(true);
    try {
      const res = await authApi.switchTitle(row.addPersonId);
      // L187-190: 안내는 open 모드에서만 ([확인]이 감춰졌을 때)
      if (!isLogin) message.info(`겸직전환 : [ ${row.orgName} / ${row.titleName} ] 으로 전환되었습니다`);
      onChanged(res.data);
    } catch (err) {
      message.error(errorMessage(err, '겸직전환 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E1] confirmButton[확인].Select (L72-81) — login 모드: 선택이 없으면 안내, 있으면 바로 login()
  const confirm = (picked?: AddTitleLogin) => {
    const row = picked ?? selected();
    if (!row) { message.warning('로그인할 정보를 선택해주세요'); return; }
    void login(row);
  };

  // [E2] loginButton[전환].Select (L83) → loginChk() L138-165 / [E4] grid.CellDoubleClick (L96) → loginChk() ([확인]이 안 보이니까)
  const loginChk = (picked?: AddTitleLogin) => {
    const row = picked ?? selected();
    if (!row) { message.warning('로그인할 정보를 선택해주세요'); return; }
    if (row.addPersonId === user.userId) {
      message.info(`겸직전환 : [ ${row.orgName} / ${row.titleName} ] 으로 로그인 중 입니다`);
      return;
    }
    // [E5] msgBox.DialogHide [YES] (L148) → login()
    Modal.confirm({
      title: '확인', content: '해당 [ 부서 / 직책 ]으로 겸직전환 하시겠습니까?', width: 400,
      okText: '예', cancelText: '아니오', onOk: () => login(row),
    });
  };

  return (
    <LookupModal
      open={open}
      title={isLogin ? '로그인 선택' : '겸직전환'}
      width={770}
      closable={false}
      keyboard={false}
      maskClosable={false}
      onCancel={isLogin ? undefined : onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E1] confirmButton[확인].Select (L72) → login() — open(callback)에서는 감춰진다(L60), login(callback)에서만 보인다 */}
            {isLogin && <Button type="save" loading={loading} onClick={() => confirm()}>확인</Button>}
            {/* [E2] loginButton[전환] / [E3] hideButton[닫기] (L89) → callback("none"), hide() — login(callback)에서는 감춰진다(L53-54) */}
            {!isLogin && <Button type="change" loading={loading} onClick={() => loginChk()}>전환</Button>}
            {!isLogin && <Button type="close" onClick={onClose}>닫기</Button>}
          </Space>
        </div>
      }
    >
      <div style={{ height: 240 }}>
        <SingleGrid<AddTitleLogin>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columns}
          rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
          getRowId={p => String(p.data.addPersonId)}
          onRowDoubleClicked={e => { if (e.data) { if (isLogin) confirm(e.data); else loginChk(e.data); } }}
        />
      </div>
    </LookupModal>
  );
};
