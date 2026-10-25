/**
 * [1455] 책무 > 04. 책무이행점검 > 이행점검 작업지시 및 보고 (N20, 1단계)
 * AS-IS: myApp/client/vi/tdm/Tdm50_Tab_CheckJob.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L79-117: center = 툴바(점검년월 · [조회][작업정보등록][점검항목생성][알림발송] · [(회사전체 당월)점검마감][마감취소], 높이 50) + 작업 요약 글(높이 50, 테두리) + 보고CEO 직책 탭(Tdm50_TabPage_CheckJob), 여백 20·테두리
 * 1단계: [알림발송]이 여는 문자 발송 창(Sms03_Lookup_SendList, 다른 도메인)은 대상 부서담당자를 읽은 뒤 안내만 한다. 결재요청·문서보기는 TabPage 참고.
 * UX보강(10): 툴바 = Button(UX-01)
 */
import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Tabs, message } from 'antd';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmCheckJob, TdmCheckRole } from '@/types/tdm';
import { Button } from '@/components/button';
import { QuickMoveField, YearMonth } from '@/components/form/QuickMoveField';
import { checkYmOf, firstDayOf, ymOfCheckYm } from './Tdm50_Dashboard_Common';
import { Tdm50_Edit_CheckJob } from './Tdm50_Edit_CheckJob';
import { Tdm50_TabPage_CheckJob } from './Tdm50_TabPage_CheckJob';

const BLUE = '#456EA6';
const RED = '#DD5E5E';

export const Tdm50_Tab_CheckJob: React.FC = () => {
  const now = new Date();
  const [ym, setYm] = useState<YearMonth>({ year: now.getFullYear(), month: now.getMonth() + 1 });
  const [job, setJob] = useState<TdmCheckJob | null>(null);             // chckJobModel
  const [roles, setRoles] = useState<TdmCheckRole[]>([]);
  const [tabNonce, setTabNonce] = useState(0);                          // 조회마다 탭을 새로 만든다 (retrievePanel L234-276)
  const [activeRole, setActiveRole] = useState<number | null>(null);
  const [editJob, setEditJob] = useState<TdmCheckJob | null>(null);     // Tdm50_Edit_CheckJob
  const [loading, setLoading] = useState(false);

  // retrievePanel() L234-276: tdm.Tdm20_Role.getCeoRoleList(companyId, checkYm, baseDate = 그 달 1일) → 직책마다 탭
  // retrieve() L278-299: tdm.Tdm50_ChckJob.selectByCheckYm(companyId, checkYm, defaultYn=true) → 작업 요약 글 → retrievePanel(), setButtonEnable()
  // 값은 호출한 자리에서 막 바꾼 것(월 콤보·◀▶)이라 상태 반영 전이므로 인자로 받는다
  const retrieve = useCallback(async (v: YearMonth) => {
    setLoading(true);
    try {
      const found = await tdmApi.searchCheckJob(checkYmOf(v));
      const list = await tdmApi.searchCheckCeoRoles(checkYmOf(v), firstDayOf(v));
      setJob(found);
      setRoles(list);
      setActiveRole(list.length > 0 ? list[0].roleId : null);
      setTabNonce(n => n + 1);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  // [E0] 화면 열림 (생성자 L79-117) → setDefault() L119-138: tdm.Tdm50_ChckJob.selectRcntChckJob(companyId) — 진행 중인 점검년월(없으면 현재월) → settings(), retrieve()
  useEffect(() => {
    void (async () => {
      let v = ym;
      try {
        const recent = await tdmApi.recentCheckYm();
        if (recent) {
          v = ymOfCheckYm(recent);
          setYm(v);
        }
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
      await retrieve(v);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // [E1] retrieveButton[조회].Select (L141) → retrieve()
  const onRetrieve = () => retrieve(ym);

  // [E4] jobButton[작업정보등록].Select [chckJobModel.getEndYn()] (L165): 마감·결재 상태 점검 뒤 Tdm50_Edit_CheckJob.edit(), 저장하면 retrieve()
  const onJob = () => {
    if (!job) return;
    if (job.endYn) return void message.warning('이행점검이 마감되어 수정할 수 없습니다');
    if (job.apprStatusCode == null || job.apprStatusCode === '40' || job.apprStatusCode === '99') {
      setEditJob(job);
    } else {
      message.warning('이행점검보고서가 결재진행(완료)중이므로 수정할 수 없습니다');
    }
  };

  const startMissing = () => { message.warning('이행점검 작업정보(점검시작일, 점검마감일)를 입력하세요'); };

  // createCheckManl() L414-428: tdm.Tdm50_ChckJob.createCheckManl → retrieve()
  const createCheckManl = async () => {
    if (!job) return;
    try {
      await tdmApi.createCheckItems(job.chckJobId);
    } catch (err) {
      message.warning(errorMessage(err, '처리 실패'));
    }
    await retrieve(ym);
  };

  // deleteChckManl() L401-412: tdm.Tdm50_ChckJob.deleteChckManl → createCheckManl()
  const deleteChckManl = async () => {
    if (!job) return;
    try {
      await tdmApi.deleteCheckItems(job.chckJobId);
    } catch (err) {
      message.warning(errorMessage(err, '처리 실패'));
    }
    await createCheckManl();
  };

  // [E3] messageBox.DialogHide (L153) YES → createListChk() L361-399: tdm.Tdm50_ChckJob.preCreateCheckManl — 1이면 생성, 2이면 확인(500) 뒤 [E9] deleteChckManl(), 그 밖은 안내
  const createListChk = async () => {
    if (!job) return;
    if (job.startDate == null) return startMissing();
    setLoading(true);
    try {
      const pre = await tdmApi.preCreateCheckItems(job.chckJobId);
      setLoading(false);
      if (pre.status === 1) {
        await createCheckManl();
      } else {
        Modal.confirm({
          title: '확인',
          width: 500,
          content: <span dangerouslySetInnerHTML={{ __html: pre.message ?? '' }} />,
          okText: '예',
          cancelText: '아니오',
          onOk: () => deleteChckManl(),                                // [E9] messageBox.DialogHide (L382) YES
        });
      }
    } catch (err) {
      setLoading(false);
      message.warning(errorMessage(err, '처리 실패'));
    }
  };

  // [E2] createButton[점검항목생성].Select (L147) → 확인(350) "{년}년 {월}월 점검항목을 생성하시겠습니까?"
  const onCreate = () => {
    Modal.confirm({
      title: '확인',
      width: 350,
      content: `${ym.year}년 ${ym.month}월 점검항목을 생성하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      onOk: createListChk,
    });
  };

  // [E5] sendButton[알림발송].Select (L188) → sendMessage() L430-459: 마감일 점검 → tdm.Tdm51_ChckOrg.getMessageList → Sms03_Lookup_SendList.open(부서담당자 목록, 문구) — 문자 발송 창은 다음 단계
  const sendMessage = async () => {
    if (!job) return;
    if (job.endDate == null) return void message.warning('마감일을 설정해주세요');
    try {
      const targets = await tdmApi.searchCheckMessageTargets(job.chckJobId, firstDayOf(ym));
      const managers = new Set(targets.map(t => t.orgManagerId).filter(id => id != null));
      message.info(`문자 발송 창(Sms03_Lookup_SendList)은 다음 단계에서 연결됩니다 (대상 부서담당자 ${managers.size}명)`);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E6] endButton[(회사전체 당월)점검마감].Select (L194) → updateEndYnChk(true) / [E7] cancelButton[마감취소].Select (L200) → updateEndYnChk(false) L301-331
  const updateEndYnChk = (endYn: boolean) => {
    if (!job) return;
    if (job.startDate == null) return startMissing();
    if (job.endYn === endYn) return void message.warning('이미 마감되었습니다.');
    Modal.confirm({
      title: '확인',
      width: 300,
      content: endYn ? '점검마감을 진행하시겠습니까?' : '점검마감을 취소하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      onOk: () => updateEndYn(endYn),                                  // [E8] messageBox.DialogHide (L321) YES
    });
  };

  // updateEndYn() L333-359: tdm.Tdm50_ChckJob.updateEndYn(chckJobId, endYn) → retrieve() → 안내
  const updateEndYn = async (endYn: boolean) => {
    if (!job) return;
    try {
      await tdmApi.updateCheckEnd(job.chckJobId, endYn);
    } catch (err) {
      return void message.warning(errorMessage(err, '처리 실패'));
    }
    await retrieve(ym);
    message.info(endYn ? '점검마감이 완료되었습니다' : '점검마감이 취소되었습니다');
  };

  // setButtonEnable() L467-481: 마감이면 작업정보등록·점검항목생성·알림발송·점검마감 비활성 + 마감취소 활성, 아니면 반대
  const ended = job?.endYn ?? false;

  // getDateStr()·getString()·getBooleanStr() L483-501
  const dateStr = (d?: string | null) => (d == null ? <b style={{ color: RED }}>미입력</b> : <b style={{ color: BLUE }}>{d}</b>);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
        <div style={{ flex: 'none', height: 50, display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px', boxSizing: 'border-box' }}>
          <b>점검년월</b>
          <QuickMoveField {...ym} onChange={setYm} onCommit={v => { void retrieve(v); }} />
          <Button type="search" onClick={onRetrieve} disabled={loading}>조회</Button>
          <Button type="register" disabled={ended || !job} onClick={onJob}>작업정보등록</Button>
          <Button type="generate" disabled={ended || !job} onClick={onCreate}>점검항목생성</Button>
          <Button type="send" disabled={ended || !job} onClick={sendMessage}>알림발송</Button>
          <span style={{ width: 5 }} />
          <Button type="save" disabled={ended || !job} onClick={() => updateEndYnChk(true)}>(회사전체 당월)점검마감</Button>
          <Button type="cancel" disabled={!ended} onClick={() => updateEndYnChk(false)}>마감취소</Button>
        </div>
        <div style={{ flex: 'none', height: 50, display: 'flex', alignItems: 'center', padding: '0 15px 0 20px', boxSizing: 'border-box', border: '1px solid #d9d9d9', margin: '0 -1px', fontSize: 14 }}>
          {job && (
            <b>
              {' [ 점검시작일 : '}{dateStr(job.startDate)}
              {' / 점검마감일 : '}{dateStr(job.endDate)}
              {' / 내용 : '}<b style={{ color: BLUE }}>{job.checkName}</b>
              {' / 마감여부 : '}{job.endYn ? <b style={{ color: BLUE }}>완료</b> : <b style={{ color: RED }}>미완료</b>}
              {' ]'}
            </b>
          )}
        </div>
        {/* plainTabPanel — 직책마다 Tdm50_TabPage_CheckJob(roleId, 작업 사본). 조회마다 다시 만들고, 탭은 모두 만들어 두었다가 고른 것만 보인다 */}
        <Tabs
          activeKey={activeRole == null ? undefined : String(activeRole)}
          onChange={k => setActiveRole(Number(k))}
          tabBarStyle={{ margin: 0, paddingLeft: 10 }}
          items={roles.map(r => ({ key: String(r.roleId), label: r.roleName }))}
        />
        {job && roles.map(r => (
          <div key={`${r.roleId}-${tabNonce}`} style={{ flex: 1, minHeight: 0, display: activeRole === r.roleId ? 'block' : 'none' }}>
            <Tdm50_TabPage_CheckJob target={{ roleId: r.roleId, job }} />
          </div>
        ))}
      </div>
      <Tdm50_Edit_CheckJob job={editJob} onSaved={() => { void retrieve(ym); }} onClose={() => setEditJob(null)} />
    </div>
  );
};
