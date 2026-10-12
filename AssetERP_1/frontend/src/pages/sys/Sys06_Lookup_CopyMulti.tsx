/**
 * 일괄복사 팝업 (A09) — Sys06_Tab_Menu [일괄복사]에서 연다. 고른 매뉴(와 그 상위 매뉴)를 고른 고객사에 일괄 권한부여·삭제
 * AS-IS: myApp/client/vi/sys/Sys06_Lookup_CopyMulti.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * open() L69-117: 제목 "일괄복사", 1200×600, 모달, 닫기(X) 없음. 왼쪽 반 = 매뉴 검색 + grid01, 오른쪽 반 = 고객사 검색 + grid02, 아래 가운데 권한부여·권한삭제·닫기
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, Input, message, Modal, Space, Typography } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { CompanyCopy, MenuCopy } from '@/types/sys';
import { Button } from '@/components/button';
import { CodeSelect } from '@/components/form/CodeSelect';
import { MultiGrid, gbFor } from '@/components/grid';

const gb1 = gbFor<MenuCopy>();
const gb2 = gbFor<CompanyCopy>();

/** AS-IS buildGrid01() L218-225 */
const buildGrid01 = () => [
  gb1.text('parentPathNm', 300, '경로'),  // L222
  gb1.text('menuNoPlusNm', 210, '매뉴명'),  // L223
];

/** AS-IS buildGrid02() L227-238 */
const buildGrid02 = () => [
  gb2.text('companyNm', 290, '고객명'),  // L231
  gb2.textCenter('erpProductCd', 50, '상품'),  // L232
  gb2.booleanYn2('assetYn', 50, '운용'),  // L233
  gb2.booleanYn2('advisYn', 50, '자문'),  // L234
  gb2.textCenter('icamCompanyCd', 80, 'ICAM코드'),  // L236
];

interface Props {
  open: boolean;
  /** [E10] 닫기 → callback.execute() (메인 retrieve) 후 hide() */
  onClose: () => void;
}

export const Sys06_Lookup_CopyMulti: React.FC<Props> = ({ open, onClose }) => {
  const grid01 = useRef<AgGridReact<MenuCopy>>(null);
  const grid02 = useRef<AgGridReact<CompanyCopy>>(null);
  const [menus, setMenus] = useState<MenuCopy[]>([]);
  const [companies, setCompanies] = useState<CompanyCopy[]>([]);
  const [searchText01, setSearchText01] = useState('');
  const [searchText02, setSearchText02] = useState('');
  // settings() L141: menuNameYn 처음 false("매뉴명만 검색")
  const [menuNameYn, setMenuNameYn] = useState(false);
  // L143-145: erpProductComboBox 폭 90, 처음 "전체"(%)
  const [erpProductCd, setErpProductCd] = useState('%');
  const cols01 = useMemo(buildGrid01, []);
  const cols02 = useMemo(buildGrid02, []);

  // retrieve01() L240-252: sys.Sys06_Menu.getAllMenuList(searchText '%값%', menuNameYn)
  const retrieve01 = async (yn = menuNameYn) => {
    try {
      setMenus(await sysApi.searchCopyMenus(searchText01, yn));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // retrieve02() L254-270: sys.Sys01_Company.selectByCopyList(searchText '%값%', erpProductCode 없으면 '%')
  const retrieve02 = async (code = erpProductCd) => {
    try {
      setCompanies(await sysApi.searchCopyCompanies(searchText02, code));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // open() 끝: retrieve01(), retrieve02()
  useEffect(() => {
    if (!open) return;
    retrieve01();
    retrieve02();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // confirm(useYn) L272-312
  const confirm = async (useYn: boolean) => {
    const list01 = grid01.current?.api.getSelectedRows() ?? [];
    const list02 = grid02.current?.api.getSelectedRows() ?? [];
    if (list01.length === 0) return message.warning('매뉴를 선택해주세요');
    if (list02.length === 0) return message.warning('고객사를 선택해주세요');
    try {
      await sysApi.updateCompanyMenuUse(list01.map(m => m.menuId), list02.map(c => c.companyId), useYn);
      message.info(useYn ? '일괄 권한부여가 완료되었습니다' : '일괄 권한삭제가 완료되었습니다');
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  /** [E6]·[E8] 확인창 → [E7]·[E9] DialogHide [YES] → confirm(useYn) */
  const ask = (useYn: boolean) => Modal.confirm({
    title: '확인',
    content: useYn ? '일괄 권한부여를 진행하시겠습니까?' : '일괄 권한삭제를 진행하시겠습니까?',
    okText: '예',
    cancelText: '아니오',
    width: 300,
    onOk: () => confirm(useYn),
  });

  return (
    <Modal
      open={open}
      title="일괄복사"
      width={1200}
      closable={false}
      maskClosable={false}
      keyboard={false}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E6] grantButton[권한부여].Select (L163) */}
            <Button onClick={() => ask(true)}>권한부여</Button>
            {/* [E8] revokeButton[권한삭제].Select (L186) */}
            <Button onClick={() => ask(false)}>권한삭제</Button>
            {/* [E10] closeButton[닫기].Select (L209) → callback.execute(), hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', height: 520 }}>
        <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Space style={{ height: 42 }}>
            <Typography.Text strong>검색</Typography.Text>
            {/* [E1] searchText01.KeyPress [Enter] (L123) → retrieve01() */}
            <Input style={{ width: 200 }} value={searchText01} onChange={e => setSearchText01(e.target.value)} onPressEnter={() => retrieve01()} autoFocus />
            {/* [E4] retrieveButton01[조회].Select (L151) → retrieve01() */}
            <Button type="search" onClick={() => retrieve01()}>조회</Button>
            <Checkbox checked={menuNameYn} onChange={e => setMenuNameYn(e.target.checked)}>매뉴명만 검색</Checkbox>
          </Space>
          <div style={{ flex: 1, minHeight: 0 }}>
            <MultiGrid<MenuCopy> gridRef={grid01} rowData={menus} columnDefs={cols01} getRowId={p => String(p.data.menuId)} />
          </div>
        </div>
        <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Space style={{ height: 42 }}>
            <Typography.Text strong>검색</Typography.Text>
            {/* [E2] searchText02.KeyPress [Enter] (L132) → retrieve02() */}
            <Input style={{ width: 200 }} value={searchText02} onChange={e => setSearchText02(e.target.value)} onPressEnter={() => retrieve02()} />
            {/* [E3] erpProductComboBox[ErpProductCode].Collapse (L145) → retrieve02() */}
            <CodeSelect kindCd="ErpProductCode" altCode={['%', '전체']} style={{ width: 90 }} value={erpProductCd}
              onChange={v => { const code = v ?? '%'; setErpProductCd(code); retrieve02(code); }} />
            {/* [E5] retrieveButton02[조회].Select (L157) → retrieve02() */}
            <Button type="search" onClick={() => retrieve02()}>조회</Button>
          </Space>
          <div style={{ flex: 1, minHeight: 0 }}>
            <MultiGrid<CompanyCopy> gridRef={grid02} rowData={companies} columnDefs={cols02} getRowId={p => String(p.data.companyId)} />
          </div>
        </div>
      </div>
    </Modal>
  );
};
