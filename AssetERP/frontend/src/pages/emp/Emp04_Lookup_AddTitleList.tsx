/**
 * 겸직전환 창 (EE52) — MainFrame 사용자 메뉴의 [겸직전환]이 연다 (AS-IS 사용자 이름 옆 ▼ 단추 addTitleAnchor L670)
 * AS-IS: myApp/client/vi/emp/Emp04_Lookup_AddTitleList.java (222줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(callback) L58-62: [확인]을 감추고 [전환][닫기]. 생성자 L64-117: 690×300, 닫기(X) 없음, 머리말 "겸직전환", 단일 선택 그리드
 * login(callback) L50-56(LoginPage의 로그인 선택: [확인]만 보임)은 TOBE 로그인 화면이 겸직 선택을 아직 하지 않아 만들지 않았다(다음 단계, 팝업-미변환목록 G-3)
 * 전환(login() L167-194): AS-IS는 클라이언트 세션 교체, TOBE는 POST /api/auth/switch-title 로 새 토큰 쿠키를 받는다 → 호출한 쪽이 화면을 새로 연다(onChanged)
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, Space, message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { authApi } from '@/api/auth';
import { empAddTitleApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { useLoginUser } from '@/hooks/useLoginUser';
import { AddTitleLogin } from '@/types/emp';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<AddTitleLogin>();

/** AS-IS buildGrid() L119-130 (setChecked SINGLE) */
const columns = [
  gb.booleanYn2('mainTitleYn', 50, '본업무'),      // L123
  gb.textArea('orgFullName', 250, '부서명'),        // L124
  gb.textCenter('titleName', 110, '직책'),          // L125
  gb.longCenter('outstandingCnt', 100, '미결함'),   // L126
  gb.date('closeDate', 100, '겸직종료일'),          // L127
];

interface Props {
  open: boolean;
  /** AS-IS callback.execute("none") — [닫기] */
  onClose: () => void;
  /** AS-IS callback.execute("change") — 전환이 끝나 새 토큰을 받았다. 부르는 쪽이 화면(메뉴·MyPage·로그인 사용자)을 다시 읽는다 */
  onChanged: () => void;
}

export const Emp04_Lookup_AddTitleList: React.FC<Props> = ({ open, onClose, onChanged }) => {
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
  const login = async (row: AddTitleLogin) => {
    setLoading(true);
    try {
      await authApi.switchTitle(row.addPersonId);
      message.info(`겸직전환 : [ ${row.orgName} / ${row.titleName} ] 으로 전환되었습니다`);
      onChanged();
    } catch (err) {
      message.error(errorMessage(err, '겸직전환 실패'));
    } finally {
      setLoading(false);
    }
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
      title="겸직전환"
      width={800}
      closable={false}
      keyboard={false}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E1] confirmButton[확인].Select (L72) → login() — open(callback)에서는 감춰진다(L60 confirmButton.setVisible(false)) */}
            <Button type="change" loading={loading} onClick={() => loginChk()}>전환</Button>
            {/* [E3] hideButton[닫기].Select (L89) → callback("none"), hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
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
          onRowDoubleClicked={e => { if (e.data) loginChk(e.data); }}
        />
      </div>
    </LookupModal>
  );
};
