/**
 * 임원 선임/해임 보고서 창 (V41) — Emp31_Tab_Director의 [임원 선임/해임 보고]가 여는 RD 창.
 * AS-IS: myApp/client/vi/RDViewer.java openEmp31 L220-255 (+ buttonSetting "Emp31" L284-288, retrieveEmp31 L361-370, defaultNameEmp31 L372-392,
 *   insertApprovalEmp31 L394-406, insertLinkApprovalEmp31 L408-434) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 툴바 "구분 [선임|해임] [조회]" + RD 보고서(선임 Emp31_Rd_Director / 해임 Emp31_Rd_Director_End) + [상신하기][닫기].
 *   구분을 바꾸면(Collapse)·[조회]를 누르면 보고서를 다시 열고, 그 구분의 문서분류(dcr.Dcr30_Link.selectByLinkCode A44/A62)가 한 건이면 기본 분류로 둔다.
 *   [상신하기]는 기본 분류가 없으면 Dcr01_Lookup_Class로 고르고 Apr01_Edit_ApprDoc.insertLinkApprovals(classTreeModel, "A44"|"A62", {gridList}, …)을 연다.
 *   결재문서를 저장·결재요청하면(callback result != null) 이 창을 닫는다.
 * gridList(고른 임원 행)는 서버가 사원 ID(ids)로 다시 읽는다 — GET apr/apprs/link-seed.
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { message, Select, Space } from 'antd';
import { rdApi } from '@/api/rd';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Dcr01_Lookup_Class } from '../dcr/Dcr01_Lookup_Class';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';

const DIVISIONS = ['선임', '해임'];  // divisionComboBox.getStore().add("선임"), ("해임") L227-228

export interface Emp31RdTarget {
  /** insertRdDirector01 / 02 가 돌려준 출력 자료 묶음 (rv 값) */
  seniorGroupId: string;
  totalGroupId: string;
  /** 고른 임원 행의 사원 ID (AS-IS rvMap.gridList) */
  personIds: number[];
}

interface Props {
  /** 값이 있는 동안 열려 있다 — openEmp31(map, rvMap) */
  target: Emp31RdTarget | null;
  onClose: () => void;
}

export const Emp31_Lookup_RdDirector: React.FC<Props> = ({ target, onClose }) => {
  const [division, setDivision] = useState('선임');
  const [url, setUrl] = useState<string | null>(null);
  const [defaultClassId, setDefaultClassId] = useState<number | null>(null);  // defaultModel (선임 A44 / 해임 A62 문서분류가 한 건일 때)
  const [classPickOpen, setClassPickOpen] = useState(false);
  const [linkDoc, setLinkDoc] = useState<{ classTreeId: number; linkCode: string } | null>(null);
  const targetRef = useRef(target);
  targetRef.current = target;

  // retrieveEmp31() L361-370: 구분에 따라 mrd를 정해 setRd(), 그 다음 defaultNameEmp31()
  const retrieveEmp31 = useCallback(async (div: string) => {
    const t = targetRef.current;
    if (!t) return;
    try {
      const res = await rdApi.buildUrl({
        kind: 'viewer',
        mrd: div === '선임' ? 'Emp31_Rd_Director' : 'Emp31_Rd_Director_End',
        options: '/rhtmlimportopt [2]',
        rv: { seniorGroupId: t.seniorGroupId, totalGroupId: t.totalGroupId },
      });
      setUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    }
    // defaultNameEmp31() L372-392: 한 건일 때만 기본 문서분류
    try {
      const list = await dcrApi.searchClassTreeByLinkCode(div === '선임' ? 'A44' : 'A62');
      setDefaultClassId(list.length === 1 ? list[0].classTreeId : null);
    } catch {
      setDefaultClassId(null);
    }
  }, []);

  // openEmp31() L220-255: 열릴 때 "선임"으로 retrieveEmp31()
  useEffect(() => {
    if (target) {
      setDivision('선임');
      setLinkDoc(null);
      void retrieveEmp31('선임');
    } else {
      setUrl(null);
    }
  }, [target, retrieveEmp31]);

  const linkCode = division === '선임' ? 'A44' : 'A62';

  // insertApprovalEmp31() L394-406: 기본 분류가 없으면 Dcr01_Lookup_Class.open(null, defaultModel, cb)
  const insertApprovalEmp31 = () => {
    if (defaultClassId == null) setClassPickOpen(true);
    else setLinkDoc({ classTreeId: defaultClassId, linkCode });
  };

  return (
    <>
      <LookupModal
        open={target !== null}
        title="임원 선임/해임 보고"
        width="90vw"
        style={{ top: 20 }}
        maskClosable={false}
        onCancel={onClose}
        destroyOnClose
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              {/* apprButton[상신하기] L59, L241-246 */}
              <Button type="register" onClick={insertApprovalEmp31}>상신하기</Button>
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* buttonSetting("Emp31") L284-288: 구분 [콤보] [조회] — 콤보 Collapse L247-252, retrieveButton L235-240 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 40, textAlign: 'right' }}>구분</span>
            <Select
              style={{ width: 70 }}
              value={division}
              options={DIVISIONS.map(d => ({ value: d, label: d }))}
              onChange={v => { setDivision(v); void retrieveEmp31(v); }}
            />
            <Button type="search" onClick={() => retrieveEmp31(division)}>조회</Button>
          </div>
          {url && <iframe title="RD" src={url} style={{ width: '100%', height: '70vh', border: '1px solid #d9d9d9' }} />}
        </div>
      </LookupModal>
      {/* insertApprovalEmp31(): 문서분류가 없을 때 Dcr01_Lookup_Class → insertLinkApprovalEmp31(classTreeModel) */}
      <Dcr01_Lookup_Class
        open={classPickOpen}
        onResult={r => { setClassPickOpen(false); setLinkDoc({ classTreeId: r.classTreeId, linkCode }); }}
        onClose={() => setClassPickOpen(false)}
      />
      {/* insertLinkApprovalEmp31() L408-434: Apr01_Edit_ApprDoc.insertLinkApprovals(classTreeModel, "A44"|"A62", {gridList}, false, callback → result != null 이면 hide()) */}
      <Apr01_Edit_ApprDoc
        apprId={null}
        link={linkDoc && target ? { classTreeId: linkDoc.classTreeId, linkCode: linkDoc.linkCode, args: { ids: target.personIds.join(',') } } : null}
        onLinkSaved={() => onClose()}
        onClose={() => setLinkDoc(null)}
      />
    </>
  );
};
