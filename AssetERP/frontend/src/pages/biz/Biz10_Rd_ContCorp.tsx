/**
 * 계약사 관리 출력/다운로드 창 (EE20) — Biz10_Tab_ContCorp의 [출력/다운로드]가 연다
 * AS-IS: myApp/client/vi/RDViewer.java openBiz10() L172-197 + retrieveBiz10() L301-325 — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 위 줄: ◉계약일자기준 ◉계약만료일기준(기본) + [닫기], 아래 RD 뷰어(mrd Biz10_Rd_ContCorp). 라디오를 바꾸면 sortType(1 계약일기준 / 2 계약만료일기준)을 바꿔 출력 자료를 다시 만들고 다시 연다
 * 열 때와 라디오를 바꿀 때마다 서비스 sys.Sys99_Print.insertRdContCorp 가 같은 조회 조건으로 출력 자료를 만들어 그룹 ID(rdGroupId)를 돌려준다
 */
import React, { useEffect, useState } from 'react';
import { message, Radio, Space } from 'antd';
import { bizContCorpApi } from '@/api/bizCont';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { BizContSearch } from '@/types/bizCont';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';

interface Props {
  /** 값이 있으면 열린다 — 출력할 때의 조회 조건 */
  cond: BizContSearch | null;
  onClose: () => void;
}

export const Biz10_Rd_ContCorp: React.FC<Props> = ({ cond, onClose }) => {
  const [sortType, setSortType] = useState<'1' | '2'>('2');
  const [url, setUrl] = useState<string | null>(null);

  // [E0] openBiz10(param, rvParam, sys99Param) L172-197 → retrieveBiz10() — rv: rdGroupId (companyId·personId 는 서버가 로그인 값으로 채운다)
  useEffect(() => {
    if (!cond) { setUrl(null); setSortType('2'); return; }
    let alive = true;
    (async () => {
      try {
        const groupId = await bizContCorpApi.rdPrint({ ...cond, sortType });
        const res = await rdApi.buildUrl({ kind: 'viewer', mrd: 'Biz10_Rd_ContCorp', options: '/rhtmlimportopt [2]', rv: { rdGroupId: groupId } });
        if (alive) setUrl(res.url);
      } catch (err) {
        message.error(errorMessage(err, '출력 실패'));
      }
    })();
    return () => { alive = false; };
  }, [cond, sortType]);

  return (
    <LookupModal
      open={cond !== null}
      title="계약사 현황"
      width="90vw"
      style={{ top: 20 }}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 12 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* toggle.ValueChange (L185) → sortType "1"/"2" 를 바꿔 retrieveBiz10() */}
        <Radio.Group value={sortType} onChange={e => setSortType(e.target.value)}>
          <Radio value="1">계약일자기준</Radio>
          <Radio value="2">계약만료일기준</Radio>
        </Radio.Group>
        {url && <iframe title="RD" src={url} style={{ width: '100%', height: '70vh', border: '1px solid #d9d9d9' }} />}
      </div>
    </LookupModal>
  );
};
