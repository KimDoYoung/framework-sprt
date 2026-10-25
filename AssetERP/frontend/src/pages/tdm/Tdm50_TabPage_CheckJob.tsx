/**
 * 이행점검 작업 및 보고 — 보고CEO 직책 한 탭 (N20)
 * AS-IS: myApp/client/vi/tdm/Tdm50_TabPage_CheckJob.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L99-138: 위 = 툴바(왼쪽 [잠금][잠금해제], 오른쪽 결재상태 글 + [결재요청][문서보기], 높이 50) + 아래 = 임원 승인현황 그리드(650) | 부서 점검현황 그리드(나머지)
 * 1단계: 결재요청(dcrChk → Dcr30_Link.selectByLinkCode("A94") → Apr01_Edit_ApprDoc.insertLinkApprovals → insertApprId)·문서보기(Apr01_Lookup_ApprLink·Apr01_Edit_ApprDoc.retrieveApproval)는
 *        다른 도메인(apr·dcr) 전자결재 창이라 점검까지만 하고 안내한다. 이행점검보고서 PDF 생성은 서버 CheckExctPdfMaker(RD 연동)가 한다.
 * UX보강(10): 툴바 = Button(UX-01)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { errorMessage } from '@/api/client';
import { fileApi } from '@/api/file';
import { rdApi } from '@/api/rd';
import { tdmApi } from '@/api/tdm';
import { FileInfo } from '@/types/sys';
import { TdmCheckAppr, TdmCheckExct, TdmCheckJob, TdmChckOrg } from '@/types/tdm';
import { Button } from '@/components/button';
import { MultiGrid, SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { RdViewer } from '@/components/lookup/RdViewer';
import { Sys10_Lookup_FileViewer } from '../sys/Sys10_Lookup_FileViewer';
import { dynamicViewCell } from './tdmGridCells';
import { Tdm55_Lookup_ChckRecord } from './Tdm55_Lookup_ChckRecord';

const gb01 = gbFor<TdmCheckExct>();
const gb02 = gbFor<TdmChckOrg>();

const RD_MRD = 'Tdm50_Rd_CheckJob';
const RD_OPTIONS = '/rpdflinebreak [1] /rwordbreakopt [1] /rsaveopt [2049]';
const SUM01 = { labelField: 'roleName', label: '계', sum: ['chckManlCnt'] };                                     // getSumGrid("계", 2, 4, 4)
const SUM02 = { labelField: 'orgManagerName', label: '계', sum: ['dutyCnt', 'manlCnt', 'monthManlCnt', 'monthManlDoneCnt', 'monthManlUndoneCnt'] };  // getSumGrid("계", 2, 3, 7)

export interface CheckJobTabTarget {
  /** 이 탭의 보고CEO 직책 */
  roleId: number;
  /** 부르는 쪽이 조회한 작업 — AS-IS newChckJobModel(roleId·endYn·chckJobId·companyId·checkYm·startDate·endDate) */
  job: TdmCheckJob;
}

interface Props {
  target: CheckJobTabTarget;
}

export const Tdm50_TabPage_CheckJob: React.FC<Props> = ({ target }) => {
  const { roleId, job } = target;
  const [excts, setExcts] = useState<TdmCheckExct[]>([]);
  const [orgs, setOrgs] = useState<TdmChckOrg[]>([]);
  const [apprStatus, setApprStatus] = useState<TdmCheckAppr | null>(null);   // chckRelateApprModel
  const [loading01, setLoading01] = useState(false);
  const [loading02, setLoading02] = useState(false);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);
  const [rdUrl, setRdUrl] = useState<string | null>(null);
  const [recordOrgId, setRecordOrgId] = useState<number | null>(null);
  const [progress, setProgress] = useState<{ text: React.ReactNode; done: boolean } | null>(null);   // messageBox "파일 생성"
  const grid01Ref = useRef<AgGridReact<TdmCheckExct>>(null);

  // settings() L140-184: 마감됐으면 [잠금][잠금해제] 비활성
  const lockDisabled = job.endYn;

  // getApprStatus() L352-410: 결재상태 글. 결재요청은 상태가 없거나 40(반려)일 때만 켜져 있다
  const getApprStatus = useCallback(async () => {
    try {
      setApprStatus(await tdmApi.searchCheckApprStatus(job.chckJobId, roleId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [job.chckJobId, roleId]);

  // retrieve02() L263-282: tdm.Tdm51_ChckOrg.selectByRoleId(companyId, checkYm, stdDate = 점검시작일, roleId = 고른 임원의 직책)
  const retrieve02 = useCallback(async (selectModel: TdmCheckExct | undefined) => {
    if (!selectModel) return;
    setLoading02(true);
    try {
      setOrgs(await tdmApi.searchCheckOrgs(job.chckJobId, selectModel.roleId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading02(false);
    }
  }, [job.chckJobId]);

  // retrieve01() L241-261: clear02() → tdm.Tdm53_ChckExct.selectByChckJobId(chckJobId, ceoRoleId) → 첫 행 선택 → getApprStatus()
  const retrieve01 = useCallback(async () => {
    setOrgs([]);
    setLoading01(true);
    try {
      const list = await tdmApi.searchCheckExcts(job.chckJobId, roleId);
      setExcts(list);
      if (list.length > 0) setTimeout(() => grid01Ref.current?.api.getDisplayedRowAtIndex(0)?.setSelected(true), 0);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading01(false);
    }
    await getApprStatus();
  }, [job.chckJobId, roleId, getApprStatus]);

  // [E0] 화면 열림 (생성자 L99-138) → settings(), retrieve01()
  useEffect(() => { void retrieve01(); }, [retrieve01]);

  const selectedRows = () => (grid01Ref.current?.api?.getSelectedRows() ?? []) as TdmCheckExct[];

  // [E1] lockButton[잠금].Select (L152) → updateLockYn(true) / [E2] unLockButton[잠금해제].Select (L158) → updateLockYn(false) L284-350
  const updateLockYn = async (isLock: boolean) => {
    const code = apprStatus?.apprStatusCode;
    if (code && code !== '40' && code !== '99') return void message.warning('상신문서가 진행중(또는 결재완료)입니다');

    const selectList = selectedRows();
    if (selectList.length === 0) return void message.warning('직책(임원)을 선택하세요');

    const updateList: TdmCheckExct[] = [];
    for (const m of selectList) {
      if (isLock) {
        if (!m.exctApprYn) return void message.warning('승인 완료되지 않은 경우 잠금설정 할 수 없습니다');
        if (!m.lockYn) updateList.push(m);
      } else if (m.lockYn) {
        updateList.push(m);
      }
    }
    if (updateList.length === 0) {
      return void message.warning(isLock
        ? '대상 직책(임원)을 선택하세요. 이미 잠금설정된 직책(임원)은 해당되지 않습니다'
        : '대상 직책(임원)을 선택하세요. 잠금설정이 안된 직책(임원)은 해당되지 않습니다');
    }

    try {
      await tdmApi.updateCheckExctLock(isLock, updateList.map(m => m.chckExctId));
    } catch (err) {
      return void message.warning(errorMessage(err, '처리 실패'));
    }
    if (isLock) {
      await readyRd(selectList);                                      // 원본은 고른 행 전체(selectList)를 넘긴다 — 이미 잠긴 행 포함
    } else {
      await deleteRdFile(selectList);
    }
    await retrieve01();
  };

  // deleteRdFile() L855-877: tdm.Tdm53_ChckExct.deleteList → "잠금이 해제되었습니다"
  const deleteRdFile = async (selectList: TdmCheckExct[]) => {
    try {
      await tdmApi.deleteCheckExctFiles(selectList.map(m => m.chckExctId));
      message.info('잠금이 해제되었습니다');
    } catch (err) {
      message.warning(errorMessage(err, '처리 실패'));
    }
  };

  // readyRd() L566-594 → processCreate() L596-627 → createRd() L629-706 → setRdFile() L708-746 → lockRollBack() L748-777
  // 진행 창 "파일 생성"(430): 한 건씩 파일 생성. RD 실패면 그 임원 잠금을 되돌리고 다음 건으로, 파일 확인 실패면 멈춘다. 끝나면 (실패가 있어도) "N개의 파일이 전부 잠금 및 생성이 완료되었습니다."
  const readyRd = async (selectList: TdmCheckExct[]) => {
    setProgress({ text: '파일 생성준비중 ...', done: false });
    for (let i = 0; i < selectList.length; i++) {
      const m = selectList[i];
      const who = `${m.roleName ?? ''} ${m.exctName ?? ''}`;
      const head = <>파일 생성 ({i + 1}/{selectList.length})<br /></>;
      setProgress({ text: <>{head}파일 생성준비중 [{who}]</>, done: false });
      try {
        const outcome = await tdmApi.recreateCheckExct(m.chckExctId);
        if (outcome === 'OK') {
          setProgress({ text: <>{head}파일생성 완료 [{who}]</>, done: false });
        } else if (outcome === 'RD_FAILED') {
          setProgress({ text: <>{head}파일 생성실패로 잠금 해제중 [{who}]</>, done: false });
          await tdmApi.updateCheckExctLock(false, [m.chckExctId]);    // lockRollBack()
          setProgress({ text: <>{head}파일 생성실패 [{who}]</>, done: false });
        } else {
          setProgress({ text: <>파일 생성실패 [{who}]</>, done: true });   // 파일 확인 실패: 잠금은 그대로 두고 멈춘다
          return;
        }
      } catch (err) {
        setProgress({
          text: <>파일 생성실패 [{who}]<div style={{ color: '#888', marginTop: 4 }}>{errorMessage(err, '파일 생성 실패')}</div></>,
          done: true,
        });
        return;
      }
    }
    setProgress({ text: `${selectList.length}개의 파일이 전부 잠금 및 생성이 완료되었습니다.`, done: true });
  };

  // [E3] apprInsertButton[결재요청].Select (L164) → insertApprChk() L412-445
  const insertApprChk = () => {
    if (job.startDate == null) return void message.warning('점검시작일을 지정 후 결재요청이 가능합니다');
    if (job.endDate == null) return void message.warning('점검마감일을 지정 후 결재요청이 가능합니다');
    if (!job.endYn) return void message.warning('점검마감 후 결재요청이 가능합니다');
    // updateChk() — grid01은 편집 그리드가 아니라 바뀐 행이 없다("저장 후 진행해주세요"는 나올 수 없다)
    const code = apprStatus?.apprStatusCode;
    if (code == null || code === '40') {
      message.info('전자결재 상신 창은 다음 단계에서 연결됩니다');   // dcrChk() L447-471 → insertLinkApproval() L473-498 → insertApprId() L500-514
    } else if (code === '99') {
      message.warning('임시저장된 문서가 존재합니다');
    } else {
      message.warning('결재 중인 문서가 존재합니다');
    }
  };

  // [E4] apprViewButton[문서보기].Select (L170) → viewAppr() L516-564: tdm.Tdm56_ChckRelateAppr.selectByCeoRoleId
  const viewAppr = async () => {
    try {
      const list = await tdmApi.searchCheckApprs(job.chckJobId, roleId);
      if (list.length === 0) message.warning('문서가 존재하지않습니다');
      else if (list.length > 1) message.info('상신문서 선택 창(Apr01_Lookup_ApprLink)은 다음 단계에서 연결됩니다');
      else message.info('전자결재 문서 보기 창은 다음 단계에서 연결됩니다');   // ApprCallbackResult + Apr01_Edit_ApprDoc.retrieveApproval
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // viewRd() L779-831: Sys99_Print.CreateTdmCheckJob → RDViewer.viewer(Tdm50_Rd_CheckJob, rv groupId·YYYYMM·roleName·exctName)
  const viewRd = async (row: TdmCheckExct) => {
    try {
      const print = await tdmApi.rdPrintCheckExct(row.chckExctId);
      const res = await rdApi.buildUrl({
        kind: 'viewer',
        mrd: RD_MRD,
        options: RD_OPTIONS,
        rv: { groupId: String(print.groupId), YYYYMM: print.yyyymm, roleName: print.roleName, exctName: print.exctName },
      });
      setRdUrl(res.url);
    } catch (err) {
      message.warning(errorMessage(err, 'RD 뷰어를 열 수 없습니다'));
    }
  };

  // viewFile() L833-853: sys.Sys10_File.selectByParentId(chckExctId) 첫 건을 Sys10_Lookup_FileViewer로, 없으면 "파일생성실패로인한 RD뷰어호출" 후 viewRd()
  // buildGrid01() actionCell(ImageCell "View") L187-203: 잠금이 아니면 안내
  const onViewReport = async (row: TdmCheckExct) => {
    if (!row.lockYn) return void message.info('이행점검보고서가 존재하지 않습니다 (보고서는 잠금 후에 생성됩니다)');
    try {
      const files = await fileApi.searchByParentId(row.chckExctId);
      if (files.length > 0) {
        setViewFile(files[0]);
      } else {
        message.info('파일생성실패로인한 RD뷰어호출');
        await viewRd(row);                                            // 혹시나 파일생성 안됬을시 RD뷰어 호출
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // buildGrid01() L186-215 (setChecked(MULTI), addDynamicCell(buttonEnable, 70, "이행점검<br>보고서", actionCell, true))
  const columns01 = useMemo(() => [
    gb01.text('roleName', 200, '직책'),  // L206
    gb01.textCenter('exctName', 100, '임원'),  // L207
    gb01.long('chckManlCnt', 70, '당월점검'),  // L208
    gb01.booleanYn2('exctApprYn', 70, '제출완료'),  // L209
    gb01.booleanYn2('lockYn', 60, '잠금'),  // L210
    dynamicViewCell<TdmCheckExct>('buttonEnable', 'buttonEnable', 70, '이행점검<br>보고서', row => { void onViewReport(row); }),  // L212
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  // buildGrid02() L217-239: 묶음 헤더 "당월 점검항목" HeaderGroupMap(0, 6, HeaderGroupConfig(…, 1, 3)) — 6번 열(완료)부터 3칸(완료·미완료·진행상태)
  const columns02 = useMemo(() => [
    gb02.text('orgName', 200, '점검부서'),  // L228
    gb02.textCenter('orgManagerName', 80, '담당자'),  // L229
    gb02.long('dutyCnt', 80, '관리의무'),  // L230
    gb02.long('manlCnt', 80, '점검항목'),  // L231
    gb02.long('monthManlCnt', 80, '대상'),  // L232
    {
      ...gb02.group('당월 점검항목', [
        gb02.long('monthManlDoneCnt', 80, '완료'),  // L233
        gb02.long('monthManlUndoneCnt', 80, '미완료'),  // L234
        gb02.textStatus('orgStatusName', 80, '진행상태'),  // L235
      ]),
    },
    iconCell<TdmChckOrg>('view', 'actionCell', 75, '승인이력', row => setRecordOrgId(row.chckOrgId)),  // L236 → Tdm55_Lookup_ChckRecord.open(chckOrgId, "TDM51")
  ], []);

  const apprLabel = (() => {
    const s = apprStatus;
    if (!s || s.apprStatusCode == null) return <b>없음</b>;
    return s.apprStatusCode === '40'
      ? <b style={{ color: '#DD5E5E' }}>{s.apprStatusName}</b>
      : <b style={{ color: '#456EA6' }}>{s.apprStatusName}</b>;
  })();
  const apprInsertDisabled = apprStatus != null && apprStatus.apprStatusCode != null && apprStatus.apprStatusCode !== '40';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', border: '1px solid #d9d9d9', background: '#fff' }}>
      <div style={{ flex: 'none', height: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', boxSizing: 'border-box' }}>
        <span style={{ display: 'flex', gap: 4 }}>
          <Button type="save" disabled={lockDisabled} onClick={() => updateLockYn(true)}>잠금</Button>
          <Button type="cancel" disabled={lockDisabled} onClick={() => updateLockYn(false)}>잠금해제</Button>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13 }}><b>결재상태 : </b>{apprLabel}</span>
          <Button type="register" disabled={apprInsertDisabled} onClick={insertApprChk}>결재요청</Button>
          <Button type="search" onClick={viewAppr}>문서보기</Button>
        </span>
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', borderTop: '1px solid #d9d9d9' }}>
        <div style={{ flex: 'none', width: 650, minWidth: 0 }}>
          {/* [E5] grid01.SelectionChanged [선택>0] (L176) → retrieve02() */}
          <MultiGrid<TdmCheckExct>
            gridRef={grid01Ref}
            rowData={excts}
            columnDefs={columns01}
            getRowId={p => String(p.data.chckExctId)}
            sumRow={SUM01}
            loading={loading01}
            onCheckedChange={rows => { if (rows.length > 0) void retrieve02(rows[0]); }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0, borderLeft: '1px solid #d9d9d9' }}>
          <SingleGrid<TdmChckOrg>
            rowData={orgs}
            columnDefs={columns02}
            getRowId={p => String(p.data.chckOrgId)}
            sumRow={SUM02}
            loading={loading02}
          />
        </div>
      </div>
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
      <RdViewer url={rdUrl} title="이행점검보고서" onClose={() => setRdUrl(null)} />
      <Tdm55_Lookup_ChckRecord chckOrgId={recordOrgId} onClose={() => setRecordOrgId(null)} />
      {/* messageBox "파일 생성" (L566-594): 430×170, 진행 중 닫을 수 없고 끝나면 [닫기] — [E6] button01[닫기].Select (L582) → messageBox.hide() */}
      <Modal
        open={progress !== null}
        title="파일 생성"
        width={430}
        closable={false}
        maskClosable={false}
        keyboard={false}
        footer={<Button type="close" disabled={!progress?.done} onClick={() => setProgress(null)}>닫기</Button>}
      >
        {progress?.text}
      </Modal>
    </div>
  );
};
