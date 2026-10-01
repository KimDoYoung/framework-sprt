import React, { useCallback, useState } from 'react';
import { Splitter } from 'antd';
import { sysApi } from '../../api/sys';
import { CompanyMenu, SysCompany } from '../../types/sys';
import { CompanySelectList } from '../../components/sys/CompanySelectList';
import { MenuCheckTree } from '../../components/sys/MenuCheckTree';

/** 회사별 메뉴맵핑 (AS-IS client/vi/sys/Sys03_Tab_CompanyMenu + Sys03_Tree_CompanyMenu). KFS 관리자 전용 */
export const Sys03CompanyMenuView: React.FC = () => {
  const [company, setCompany] = useState<SysCompany>();

  const load = useCallback(() => sysApi.searchCompanyMenus(company!.companyId), [company]);
  const save = useCallback((changed: CompanyMenu[]) => sysApi.updateCompanyMenus(company!.companyId, changed), [company]);

  return (
    <Splitter style={{ height: '100%', background: '#fff' }}>
      <Splitter.Panel defaultSize="35%" min="20%" style={{ padding: 12 }}>
        <CompanySelectList onSelect={setCompany} />
      </Splitter.Panel>
      <Splitter.Panel style={{ padding: 12 }}>
        <MenuCheckTree<CompanyMenu>
          title={`고객별 메뉴조회${company ? ` — ${company.companyNm}` : ''}`}
          load={company ? load : undefined}
          save={save}
          nameField="menuNm"
          checkField="companyMenuYn"
        />
      </Splitter.Panel>
    </Splitter>
  );
};
