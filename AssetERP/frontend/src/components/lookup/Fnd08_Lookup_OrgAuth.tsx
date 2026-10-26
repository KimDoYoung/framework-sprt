/**
 * 일괄 권한설정 창 (P06) — Fnd08_Tab_OrgAuth의 [일괄 권한설정]이 연다. 고른 펀드 × 고른 부서 모두에 권한을 주거나 지운다
 * AS-IS: myApp/client/vi/fnd/Fnd08_Lookup_OrgAuth.java (331줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L76-121: 모달 1200×700 "일괄 권한설정", 왼쪽 60% 펀드(툴바 [행 추가][행 삭제] + 체크 그리드) / 20 / 오른쪽 40% 부서(같은 모양), 아래 가운데 [권한부여][권한삭제][닫기]
 * 행 추가는 연관펀드(Fnd01_Lookup_SelectMulti.openAdmin)·조직찾기 다중(Org00_Lookup_SelectMulti, 오늘) 조회창으로 고르고, 같은 펀드·부서가 이미 있으면 한 번만 넣는다(getRowId가 유일해야 해서)
 * 삭제용 체크 그리드라 행 클릭 선택(rowClick)은 쓰지 않는다 (03 원칙 16)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Space } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Fnd01_Lookup_SelectMulti } from '@/components/lookup/Fnd01_Lookup_SelectMulti';
import { Org00_Lookup_SelectMulti } from '@/components/lookup/Org00_Lookup_SelectMulti';
import { fndApi } from '@/api/fnd';
import { errorMessage } from '@/api/client';
import { FundMulti } from '@/types/fnd';
import { OrgInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';

interface FundRow { fundCodeId: number; fundCode?: string | null; fundName?: string | null; kofiaFundTypeName?: string | null }
interface OrgRow { codeId: number; korName?: string | null; orgCode?: string | null }

const gb1 = gbFor<FundRow>();
const gb2 = gbFor<OrgRow>();
const BOX: React.CSSProperties = { border: '1px solid #d9d9d9', boxSizing: 'border-box', height: '100%', display: 'flex', flexDirection: 'column' };
const BAR: React.CSSProperties = { height: 50, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px' };

interface Props {
  open: boolean;
  /** 권한을 준(지운) 뒤 callback.execute() — 부르는 쪽이 다시 조회한다. 그다음 창은 스스로 닫힌다 */
  onDone: () => void;
  onClose: () => void;
}

export const Fnd08_Lookup_OrgAuth: React.FC<Props> = ({ open, onDone, onClose }) => {
  const grid01Ref = useRef<AgGridReact<FundRow>>(null);
  const grid02Ref = useRef<AgGridReact<OrgRow>>(null);
  const [funds, setFunds] = useState<FundRow[]>([]);
  const [orgs, setOrgs] = useState<OrgRow[]>([]);
  const [fundOpen, setFundOpen] = useState(false);
  const [orgOpen, setOrgOpen] = useState(false);

  // [E0] 화면 열림 (생성자 L76-121) → settings() L123-167: 두 그리드는 빈 채로 열린다
  useEffect(() => { if (open) { setFunds([]); setOrgs([]); } }, [open]);

  // [E1] insertButton01[행 추가].Select (L124) → insertRow01() L179-205: Fnd01_Lookup_SelectMulti.openAdmin → 고른 펀드마다 새 행
  const insertRow01 = (list: FundMulti[]) => {
    setFunds(prev => {
      const have = new Set(prev.map(r => r.fundCodeId));
      const add = list.filter(f => !have.has(f.fundId)).map<FundRow>(f => ({ fundCodeId: f.fundId, fundCode: f.fundCode, fundName: f.fundName, kofiaFundTypeName: f.kofiaFundTypeName }));
      return [...prev, ...add];  // 03 원칙 17: 맨 아래
    });
    setTimeout(() => { const api = grid01Ref.current?.api; if (api) api.ensureIndexVisible(api.getDisplayedRowCount() - 1); }, 0);
  };

  // [E2] deleteButton01[행 삭제].Select (L130) → deleteRow01() L207-212: 체크한 행을 목록에서 뺀다
  const deleteRow01 = () => {
    const ids = new Set((grid01Ref.current?.api?.getSelectedRows() ?? []).map(r => r.fundCodeId));
    setFunds(prev => prev.filter(r => !ids.has(r.fundCodeId)));
  };

  // [E3] insertButton02[행 추가].Select (L136) → insertRow02() L223-248: Org00_Lookup_SelectMulti(오늘) → 고른 조직마다 새 행 (조직명 = 상위 포함 전체 이름)
  const insertRow02 = (list: OrgInfo[]) => {
    setOrgs(prev => {
      const have = new Set(prev.map(r => r.codeId));
      const add = list.filter(o => !have.has(o.orgCodeId)).map<OrgRow>(o => ({ codeId: o.orgCodeId, korName: o.parentFullNm, orgCode: o.orgCd }));
      return [...prev, ...add];
    });
    setTimeout(() => { const api = grid02Ref.current?.api; if (api) api.ensureIndexVisible(api.getDisplayedRowCount() - 1); }, 0);
  };

  // [E4] deleteButton02[행 삭제].Select (L142) → deleteRow02() L250-255
  const deleteRow02 = () => {
    const ids = new Set((grid02Ref.current?.api?.getSelectedRows() ?? []).map(r => r.codeId));
    setOrgs(prev => prev.filter(r => !ids.has(r.codeId)));
  };

  // [E5] confirmButton[권한부여].Select (L148) → confirm("true") / [E6] cancleButton[권한삭제].Select (L155) → confirm("false") L257-322
  const confirm = (confirmYn: 'true' | 'false') => {
    if (funds.length === 0) { message.warning('선택된 펀드가 없습니다'); return; }
    if (orgs.length === 0) { message.warning('선택된 부서가 없습니다'); return; }
    // [E8] msgBox.DialogHide [YES] (L293) → fnd.Fnd08_OrgAuth.updateAuthYn(list01, list02, confirm) → callback(), hide()
    Modal.confirm({
      title: '확인',
      content: '권한부여(삭제)를 진행하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 350,
      onOk: async () => {
        try {
          await fndApi.updateOrgAuths({ fundCodeIds: funds.map(f => f.fundCodeId), orgCodeIds: orgs.map(o => o.codeId), confirm: confirmYn });
          onDone();
          onClose();
        } catch (err) {
          message.error(errorMessage(err, '저장 실패'));
        }
      },
    });
  };

  // buildGrid01() — 행번호·체크·코드 90(가운데)·펀드명 400·펀드유형 120
  const columns01 = useMemo(() => [
    gb1.textCenter('fundCode', 90, '코드'),
    gb1.text('fundName', 400, '펀드명'),
    gb1.text('kofiaFundTypeName', 120, '펀드유형'),
  ], []);
  // buildGrid02() — 행번호·체크·조직명 300·조직코드 60
  const columns02 = useMemo(() => [
    gb2.text('korName', 300, '조직명'),
    gb2.text('orgCode', 60, '조직코드'),
  ], []);

  return (
    <>
      <LookupModal
        open={open}
        title="일괄 권한설정"
        width={1200}
        maskClosable={false}
        keyboard={false}
        onCancel={onClose}
        destroyOnHidden
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="save" onClick={() => confirm('true')}>권한부여</Button>
              <Button type="delete" onClick={() => confirm('false')}>권한삭제</Button>
              {/* [E7] closeButton[닫기].Select (L161) → hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ height: 520, display: 'flex', gap: 20 }}>
          <div style={{ flex: 6, minWidth: 0 }}>
            <div style={BOX}>
              <div style={BAR}>
                <span style={{ fontWeight: 600 }}>펀드</span>
                <Button type="addRow" onClick={() => setFundOpen(true)}>행 추가</Button>
                <Button type="removeRow" onClick={deleteRow01}>행 삭제</Button>
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <MultiGrid<FundRow> gridRef={grid01Ref} rowData={funds} columnDefs={columns01} getRowId={p => String(p.data.fundCodeId)} />
              </div>
            </div>
          </div>
          <div style={{ flex: 4, minWidth: 0 }}>
            <div style={BOX}>
              <div style={BAR}>
                <span style={{ fontWeight: 600 }}>부서</span>
                <Button type="addRow" onClick={() => setOrgOpen(true)}>행 추가</Button>
                <Button type="removeRow" onClick={deleteRow02}>행 삭제</Button>
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <MultiGrid<OrgRow> gridRef={grid02Ref} rowData={orgs} columnDefs={columns02} getRowId={p => String(p.data.codeId)} />
              </div>
            </div>
          </div>
        </div>
      </LookupModal>
      <Fnd01_Lookup_SelectMulti open={fundOpen} onSelect={insertRow01} onClose={() => setFundOpen(false)} />
      <Org00_Lookup_SelectMulti
        baseDate={orgOpen ? dayjs().format('YYYY-MM-DD') : undefined}
        onSelect={insertRow02}
        onClose={() => setOrgOpen(false)}
      />
    </>
  );
};
