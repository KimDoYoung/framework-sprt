/**
 * 관리정보 탭 (A15) — Sys01_Tab_Company 아래 탭 1번째.
 * AS-IS: myApp/client/vi/sys/Sys01_TabPage_Info01.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 선택한 회사 1행을 셀 편집 그리드로 보여 주고 저장한다(행번호 숨김, 정렬 없음, 체크박스 없음).
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Space, Button as AntButton } from 'antd';
import { EditOutlined, SearchOutlined } from '@ant-design/icons';
import type { CustomCellRendererProps } from 'ag-grid-react';
import { sysApi } from '@/api/sys';
import { Code, CompanyManage } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import type { CompanyTabProps } from './Sys01_Tab_Company';
import { Sys29_Lookup_PublicIpList } from './Sys29_Lookup_PublicIpList';
import { Sys01_Edit_Note } from './Sys01_Edit_Note';

const gb = gbFor<CompanyManage>();

/** AS-IS ImageCell("View"/"Edit") — 아이콘 버튼 셀 */
const iconCell = (icon: React.ReactNode, onClick: (row: CompanyManage) => void) => ({
  colId: icon === 'view' ? 'actionView' : 'actionEdit',
  width: 30,
  headerName: ' ',
  cellStyle: { padding: 0, textAlign: 'center' as const },
  cellRenderer: (p: CustomCellRendererProps<CompanyManage>) => (
    <AntButton type="text" size="small" icon={icon === 'view' ? <SearchOutlined /> : <EditOutlined />}
      onClick={e => { e.stopPropagation(); if (p.data) onClick(p.data); }} />
  ),
});

/** AS-IS buildGrid() L68-131 */
const buildGrid = (erpProducts: Code[], openPublicIp: (r: CompanyManage) => void, openNote: (r: CompanyManage) => void) => [
  gb.boolean('loginSecureYn', 100, '보안로그인', { editable: true }),  // L110
  iconCell('view', openPublicIp),  // L111 actionCell01 → Sys29_Lookup_PublicIpList
  gb.textCenter('companyNm', 200, '고객명', { editor: 'text' }),  // L112
  gb.textCenter('locNm', 120, '서브도메인', { editor: 'text' }),  // L113
  gb.textCenter('mailInfo', 100, '메일서버', { editor: 'text' }),  // L114
  gb.textCenter('emgrcyPasswd', 100, '회사암호', { editor: 'text' }),  // L115
  // L116 erpProductComboBox(ErpProductCode) — Collapse 시 코드·이름을 같이 바꾼다 (E3 L78-85)
  gb.textCenter('erpProductNm', 120, '적용상품', {
    editor: 'select',
    values: erpProducts.map(c => c.name),
    valueSetter: p => {
      p.data.erpProductNm = p.newValue;
      p.data.erpProductCd = erpProducts.find(c => c.name === p.newValue)?.code ?? null;
      return true;
    },
  }),
  gb.textCenter('contType', 100, '계약유형', { editor: 'text' }),  // L117
  gb.date('noticeDate', 140, '시스템사용<br>시작일', { editor: 'date' }),  // L118
  gb.date('closeDate', 100, '계약종료일', { editor: 'date' }),  // L119
  gb.textCenter('icamCompanyCd', 80, 'ICAM<br>운용사코드', { editor: 'text' }),  // L120
  gb.textCenter('icamAdvisCompanyCd', 80, 'ICAM<br>자문사코드', { editor: 'text' }),  // L121
  gb.boolean('assetYn', 80, '운용사', { editable: true }),  // L122
  gb.boolean('advisYn', 80, '자문사', { editable: true }),  // L123
  gb.boolean('pbsYn', 80, 'PBS', { editable: true }),  // L124
  gb.boolean('useYn', 80, '사용여부', { editable: true }),  // L125
  gb.text('note', 250, '비고'),  // L126
  iconCell('edit', openNote),  // L127 actionCell02 → Sys01_Edit_Note
  gb.long('companyId', 150, 'companyId'),  // L128
];

/** AS-IS copyToClipboard (JSNI): textarea + execCommand('copy') */
const copyToClipboard = (text: string) => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
};

export const Sys01_TabPage_Info01: React.FC<CompanyTabProps> = ({ companyId }) => {
  const [erpProducts, setErpProducts] = useState<Code[]>([]);
  const [publicIpCompanyId, setPublicIpCompanyId] = useState<number>();
  const [noteCompany, setNoteCompany] = useState<CompanyManage>();

  const crud = useGridCrud<CompanyManage>({
    idField: 'companyId',
    // retrieve() L138-142: 서비스 sys.Sys01_Company.selectById(companyId)
    search: useCallback(async () => (companyId ? [await sysApi.getCompanyManage(companyId)] : []), [companyId]),
    // update() L144-147: GridUpdate → sys.Sys01_Company.update
    save: useCallback((rows: CompanyManage[]) => Promise.all(rows.map(sysApi.updateCompanyManage)), []),
    remove: async () => undefined, // 이 탭에는 삭제가 없다
    newRow: () => ({}), // 이 탭에는 행추가가 없다
  });

  // actionCell01 L69-76: 선택한 회사의 공인IP 조회창
  const openPublicIp = useCallback((r: CompanyManage) => setPublicIpCompanyId(r.companyId), []);
  // actionCell02 L86-104: 저장하지 않은 변경이 있으면 막고, 비고 팝업 → 콜백으로 비고만 바꾼다
  const openNote = useCallback((r: CompanyManage) => {
    if (crud.hasChanges()) {
      message.warning('저장 후 시도해주세요');
      return;
    }
    setNoteCompany(r);
  }, [crud]);

  const columnDefs = useMemo(() => buildGrid(erpProducts, openPublicIp, openNote), [erpProducts, openPublicIp, openNote]);

  useEffect(() => { sysApi.searchCodes('ErpProductCode').then(setErpProducts).catch(() => setErpProducts([])); }, []);

  // retrieve(param) L149-152 ← Sys01_Tab_Company.retrieveTabpage (회사 선택·탭 전환)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (companyId) crud.retrieve(); else crud.clear(); }, [companyId]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 8 }}>
      <Space>
        {/* [E1] updateButton[저장].Select (L45) → update() */}
        <Button type="save" onClick={crud.saveRows}>저장</Button>
        {/* [E2] clipBoardButton[회사ID 복사].Select (L51) → copyToClipboard(companyId) */}
        <Button type="change" onClick={() => copyToClipboard(String(companyId ?? ''))}>회사ID 복사</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<CompanyManage>
          crud={crud}
          columnDefs={columnDefs}
          rowNumber={false}
          sortable={false}
          rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
        />
      </div>
      <Sys29_Lookup_PublicIpList companyId={publicIpCompanyId} onClose={() => setPublicIpCompanyId(undefined)} />
      <Sys01_Edit_Note
        company={noteCompany}
        onClose={() => setNoteCompany(undefined)}
        onSaved={() => crud.retrieve()}
      />
    </div>
  );
};
