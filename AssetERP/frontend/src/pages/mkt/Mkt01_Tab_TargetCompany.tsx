/**
 * [1405] 커뮤니티 > 03. 업무활동 > 업무활동등록 (Z05)
 * AS-IS: myApp/client/vi/mkt/Mkt01_Tab_TargetCompany.java (89줄) + Mkt01_Grid_TargetCompany.java (387줄) + Mkt03_Grid_History.java (275줄) + Mkt01_Lookup_TargetCompany·SelectCompany·Favorite·FavoriteInsert·ExcelUpload + Mkt05_Lookup_Share + Mkt03_Lookup_History — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L29-63: BorderLayout 왼쪽 260(활동처 구분 목록, 여백 20,-2,22,20) + 가운데(Mkt01_Grid_TargetCompany, 여백 20,20,20,0). 가운데는 erpProductCode가 A1인 회사만 위 40% 활동처 · 아래 60% 업무활동내역(Mkt03_Grid_History), 그 밖은 활동처 목록만
 * 스타일: GG (견본 — docs/page-style.md) — 위·아래 외곽 테두리 박스는 두지 않는다(12-화면우선원칙 2). 왼쪽 구분 목록은 원본에 테두리가 있으나 같은 이유로 그리드 자체 선만 쓴다
 */
import React, { useEffect, useMemo, useState } from 'react';
import { message, Splitter } from 'antd';
import { mktTargetCompanyApi } from '@/api/mkt';
import { errorMessage } from '@/api/client';
import { MktItemType, MktTargetCompany } from '@/types/mkt';
import { SingleGrid, gbFor } from '@/components/grid';
import { Mkt01_Grid_TargetCompany } from './Mkt01_Grid_TargetCompany';
import { Mkt03_Grid_History } from './Mkt03_Grid_History';

const gb = gbFor<MktItemType>();

export const Mkt01_Tab_TargetCompany: React.FC = () => {
  const [itemTypes, setItemTypes] = useState<MktItemType[]>([]);
  const [itemType, setItemType] = useState<string | null>(null);
  // erpProductCode == "A1" (Mkt01_Grid_TargetCompany 생성자 L108) — 확인되기 전(null)에는 그리지 않는다
  const [historyEnabled, setHistoryEnabled] = useState<boolean | null>(null);
  const [target, setTarget] = useState<{ id: number; name: string } | null>(null);
  const [nonce, setNonce] = useState(0);

  // retrieve() L75-88: sys.Sys09_Code.selectByCode(companyId, "CrmItemTypeCode") → 읽은 뒤 첫 행 선택
  const retrieve = async () => {
    try {
      const [types, enabled] = await Promise.all([mktTargetCompanyApi.searchItemTypes(), mktTargetCompanyApi.historyEnabled()]);
      setItemTypes(types);
      setHistoryEnabled(enabled);
      if (types.length > 0) setItemType(types[0].code);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L29-63) → retrieve()
  useEffect(() => { void retrieve(); }, []);

  // buildGrid() L65-73: 행번호 숨김, 구분 이름 한 열(255, 제목 없음)
  const columnDefs = useMemo(() => [gb.textArea('name', 255, '')], []);   // L70

  // 위 목록에서 활동처를 고르면(또는 목록이 비면) 업무활동내역을 다시 읽는다 — retrieveHistory() / historyPage.retrieve()
  const onSelectCompany = React.useCallback((row: MktTargetCompany | null) => {
    setTarget(row ? { id: row.targetCompanyId, name: row.targetCompanyName ?? '' } : null);
    setNonce(n => n + 1);
  }, []);

  const list = <Mkt01_Grid_TargetCompany itemTypeCode={itemType} onSelect={onSelectCompany} />;

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff', display: 'flex', gap: 8 }}>
      <div style={{ width: 260, flex: 'none' }}>
        {/* [E1] itemTypeGrid.Selection (L32) → targetCompany.retrieve(선택한 구분 코드) */}
        <SingleGrid<MktItemType>
          rowData={itemTypes}
          columnDefs={columnDefs}
          rowNumber={false}
          getRowId={p => p.data.code}
          onSelect={row => { if (row) setItemType(row.code); }}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {historyEnabled === null ? null : historyEnabled ? (
          <Splitter layout="vertical" style={{ height: '100%' }}>
            <Splitter.Panel defaultSize="40%" min={120}>{list}</Splitter.Panel>
            <Splitter.Panel defaultSize="60%" min={200}>
              <div style={{ height: '100%', paddingTop: 8, boxSizing: 'border-box' }}>
                <Mkt03_Grid_History itemType={itemType ?? '%'} target={target} nonce={nonce} />
              </div>
            </Splitter.Panel>
          </Splitter>
        ) : list}
      </div>
    </div>
  );
};
