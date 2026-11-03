/**
 * 문서권한관리 두 화면(Dcr03_TabPage_DcrAuth·Dcr03_TabPage_OrgAuth) 아래의 안내 문구 + [문서분류지정] 창 연결
 * AS-IS: settings() — sys.Sys01_Company.selectById(companyId)의 dcrDetailUseYn에 따라 문구가 갈리고, 문구를 누르면 Dcr30_Lookup_Link.open()
 * 문구 전체가 링크(Anchor)이고 "(바로가기)"만 파란색(#0078D7)이다
 */
import React, { useEffect, useState } from 'react';
import { dcrOrgAuthApi } from '@/api/dcr';
import { Dcr30_Lookup_Link } from '@/components/lookup/Dcr30_Lookup_Link';

export const Dcr03_LinkNote: React.FC = () => {
  const [detailUse, setDetailUse] = useState<boolean | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => { void dcrOrgAuthApi.getDetailUse().then(setDetailUse).catch(() => setDetailUse(null)); }, []);

  if (detailUse == null) return null;
  return (
    <>
      <a href="#" onClick={e => { e.preventDefault(); setOpen(true); }} style={{ textDecoration: 'none', color: 'inherit', whiteSpace: 'nowrap' }}>
        {detailUse ? '※ 특정문서분류 지정 ' : '※ 문서분류지정이 설정되어있으면 작성권한은 자동해제됩니다. '}
        <span style={{ color: '#0078D7' }}>(바로가기)</span>
      </a>
      <Dcr30_Lookup_Link open={open} onClose={() => setOpen(false)} />
    </>
  );
};
