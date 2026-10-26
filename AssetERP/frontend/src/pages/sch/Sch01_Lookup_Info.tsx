/**
 * 업무일정 등록·수정 창 (O01) — Sch01_Tab_Info의 [등록](new)·수정 아이콘(edit)에서 연다
 * AS-IS: myApp/client/vi/sch/Sch01_Lookup_Info.java (1040줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 생성자 L167-251·getEditor() L533-623: 모달 850×820 "업무일정 등록"(수정은 "업무일정 수정"), 닫기(X) 없음, 라벨 폭 80, 스크롤. 행: 분류(콤보 300 + [분류추가] 140 + 데일리 체크리스트)
 *   · 일정명 · 상세내용(150) · 첨부파일(Sch01_Grid_RelateFile) · 기한(툴바 + 그리드 140) · 일정공유(비공개 체크 + 툴바 + 그리드 130 + 우측 [알람설정]) · 사용여부(사용/미사용), 아래 가운데 [저장][닫기]
 * [생략] 보고처(report)·문서분류(dcrClassTreeName)·법규(relateIcsGrid)·담당자 트리거(managerName)는 getEditor()에서 주석 처리되었거나 화면에 안 붙는다(E1 도달 불가)
 * new 모드: 열 때 이미 서버에 만들어 둔 행(Sch01_Tab_Info.insertRow → update01)으로 열고, [닫기]는 그 행을 되돌린다(newDataRollback)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, Input, Modal, Radio, Select, Space, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import type { AgGridReact } from 'ag-grid-react';
import { schApi } from '@/api/sch';
import { errorMessage } from '@/api/client';
import { Sch01Info, Sch02Share, Sch03Deadline, Sch03DeadlineTemplate, Sch08ClassCombo } from '@/types/sch';
import { OrgInfo, TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Emp00_Lookup_SelectMulti } from '@/components/lookup/Emp00_Lookup_SelectMulti';
import { Org00_Lookup_SelectMulti } from '@/components/lookup/Org00_Lookup_SelectMulti';
import { Sch03_Lookup_Cycle } from '@/components/lookup/Sch03_Lookup_Cycle';
import { Sch03_Lookup_Short } from '@/components/lookup/Sch03_Lookup_Short';
import { Sch06_Lookup_AlarmSetup } from '@/components/lookup/Sch06_Lookup_AlarmSetup';
import { Sch01_Grid_RelateFile } from './Sch01_Grid_RelateFile';
import { Sch08_Lookup_Class } from './Sch08_Lookup_Class';

const gbShare = gbFor<Sch02Share>();
const gbDeadline = gbFor<Sch03Deadline>();
const SCHEDULE_CODE = '1';  // 스케줄 구분 1 = 스케줄관리 (shortInsert()·cycleInsert()·load()·수정 아이콘 모두 "1")

export interface InfoWindowTarget {
  /** AS-IS openNew(grid, insertModel, callback) / open(model, "edit", callback) */
  mode: 'new' | 'edit';
  info: Sch01Info;
}

interface Props {
  /** 값이 있으면 열린다 */
  target: InfoWindowTarget | null;
  /** 저장(updateEnd)이면 저장한 행, [닫기]면 null (callback.execute) */
  onResult: (row: Sch01Info | null) => void;
  /** hide() */
  onClose: () => void;
}

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const Sch01_Lookup_Info: React.FC<Props> = ({ target, onResult, onClose }) => {
  const info = target?.info ?? null;
  const infoId = info?.infoId ?? null;
  const isNew = target?.mode === 'new';

  const [classes, setClasses] = useState<Sch08ClassCombo[]>([]);
  const [classId, setClassId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [dailyYn, setDailyYn] = useState(false);
  const [privateYn, setPrivateYn] = useState(false);
  const [useYn, setUseYn] = useState(true);
  const [shares, setShares] = useState<Sch02Share[]>([]);
  const deleteList02 = useRef<number[]>([]);   // deleteList02: 화면에서 뺀 기존 공유 — [저장]에서 서버에서 지운다
  const tempSeq = useRef(0);
  const [shareKind, setShareKind] = useState<'emp' | 'org'>('org');   // radio01 직원 / radio02 부서(기본)
  const [deadlines, setDeadlines] = useState<Sch03Deadline[]>([]);
  const [templates, setTemplates] = useState<Sch03DeadlineTemplate[]>([]);
  const [templateId, setTemplateId] = useState<string | undefined>(undefined);
  const [lookupEmp, setLookupEmp] = useState(false);
  const [lookupOrg, setLookupOrg] = useState(false);
  const [deadlineTarget, setDeadlineTarget] = useState<{ kind: 'short' | 'cycle'; deadline: Sch03Deadline | null } | null>(null);
  const [alarmOpen, setAlarmOpen] = useState(false);
  const [classOpen, setClassOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const shareGridRef = useRef<AgGridReact<Sch02Share>>(null);
  const deadlineGridRef = useRef<AgGridReact<Sch03Deadline>>(null);

  // retrieve02() L792-804: 서비스 sch.Sch02_Share.selectByInfoId — deleteList02.clear() 뒤
  const retrieve02 = useCallback(async () => {
    if (infoId == null) return;
    deleteList02.current = [];
    try {
      setShares(await schApi.searchInfoShares(infoId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [infoId]);

  // retrieve03() L806-816: 서비스 sch.Sch03_Deadline.selectByInfoId
  const retrieve03 = useCallback(async () => {
    if (infoId == null) return;
    try {
      setDeadlines(await schApi.searchDeadlines(infoId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [infoId]);

  const loadClasses = useCallback(async () => {
    try {
      setClasses(await schApi.searchClassCombo());
    } catch {
      setClasses([]);
    }
  }, []);

  // [E0] 화면 열림 (생성자 L167-251, open() L259-296) → getEditor(), settings(), show(). edit면 retrieve02(), retrieve03(), 사용여부 라디오·공유 활성
  useEffect(() => {
    if (!info) return;
    setClassId(info.classId != null ? String(info.classId) : '');
    setTitle(info.title ?? '');
    setContent(info.content ?? '');
    setDailyYn(info.dailyYn === true);
    setPrivateYn(info.privateYn === true);
    setUseYn(isNew ? true : info.useYn === true);
    setShares([]);
    setDeadlines([]);
    setTemplateId(undefined);
    setShareKind('org');
    deleteList02.current = [];
    void loadClasses();
    schApi.searchDeadlineTemplates().then(setTemplates).catch(() => setTemplates([]));
    if (!isNew) {
      void retrieve02();
      void retrieve03();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  // [E1 생략] managerName.TriggerClick (L183) → openLookupManagerInfo() — 담당자 칸이 getEditor()에 붙지 않아 원본에서 도달 불가(담당자는 등록 때 로그인 사용자)
  // [E4] className[sys.Sys00_Common.selectScheduleClass].ValueChange (L229) → classId 바꾸기 (<선택안함>이면 null)
  const classOptions = useMemo(() => {
    const options = [{ value: '', label: '<선택안함>' }, ...classes.map(c => ({ value: c.code, label: c.name }))];
    // 지금은 쓰지 않는 분류라 콤보 목록에 없어도 일정에 걸린 분류는 그대로 보여 준다
    if (info?.classId != null && !classes.some(c => c.code === String(info.classId))) {
      options.push({ value: String(info.classId), label: info.className ?? String(info.classId) });
    }
    return options;
  }, [classes, info]);

  // ===== 일정공유 =====
  // setShareEnabled() L473-479: 라디오 둘·[행 추가]·[행 삭제]·그리드 활성/비활성
  const shareEnabled = !privateYn;

  // deleteRow02All() L781-790: 모든 공유 행을 deleteList02에 담고 화면에서 뺀다
  const deleteRow02All = () => {
    deleteList02.current = [...deleteList02.current, ...shares.filter(s => s.shareId > 0).map(s => s.shareId)];
    setShares([]);
  };

  // [E6] privateYn[비공개 스케줄].ValueChange (L319) → 공유내역이 있으면 확인 "비공개 스케줄 전환시 공유내역을 삭제합니다.<br> 진행하시겠습니까?"(폭 400)
  //   [YES] [E7] messageBox.DialogHide (L326) → setShareEnabled(false), deleteRow02All(), [NO] privateYn = false. 없으면 비활성만. 체크 해제는 활성
  const onPrivateChange = (checked: boolean) => {
    if (!checked) {
      setPrivateYn(false);
      return;
    }
    if (shares.length === 0) {
      setPrivateYn(true);
      return;
    }
    Modal.confirm({
      title: '확인',
      content: <span>비공개 스케줄 전환시 공유내역을 삭제합니다.<br /> 진행하시겠습니까?</span>,
      width: 400,
      okText: '예',
      cancelText: '아니오',
      onOk: () => { setPrivateYn(true); deleteRow02All(); },
    });
  };

  const newShare = (init: Partial<Sch02Share>): Sch02Share => {
    tempSeq.current -= 1;
    return { shareId: tempSeq.current, infoId, companyId: info?.companyId ?? null, ...init };
  };

  // [E10] insertButton02[행 추가].Select (L377) → insertRow02() L734-742: 직원이면 openLookupEmpInfo(), 부서면 openLookupOrgInfo()
  const insertRow02 = () => {
    if (shareKind === 'emp') setLookupEmp(true);
    else setLookupOrg(true);
  };

  // openLookupOrgInfo() L637-663: 고른 부서마다 행 추가 — 구분 "부서"(shareCode 2), 부서 id·이름
  const onOrgSelect = (orgs: OrgInfo[]) => {
    setLookupOrg(false);
    if (!orgs || orgs.length === 0) return;
    setShares(prev => [...prev, ...orgs.map(o => newShare({ shareCode: '2', shareName: '부서', orgId: o.orgCodeId, orgName: o.parentFullNm ?? null }))]);
  };

  // openLookupEmpInfo() L665-694: 고른 사원마다 행 추가 — 구분 "직원"(shareCode 1), 부서·성명
  const onEmpResult = (list: TransInfo[]) => {
    setLookupEmp(false);
    if (!list || list.length === 0) return;
    setShares(prev => [...prev, ...list.map(t => newShare({
      shareCode: '1', shareName: '직원', orgId: t.orgCodeId ?? null, orgName: t.parentFullNm ?? null, personId: t.personId, personName: t.korNm ?? null,
    }))]);
  };

  // [E11] deleteButton02[행 삭제].Select (L383) → deleteRow02() L773-779: 선택한 행을 deleteList02에 담고 화면에서 뺀다
  const deleteRow02 = () => {
    const selected = shareGridRef.current?.api.getSelectedRows() ?? [];
    if (selected.length === 0) return;
    deleteList02.current = [...deleteList02.current, ...selected.filter(s => s.shareId > 0).map(s => s.shareId)];
    setShares(prev => prev.filter(s => !selected.some(x => x.shareId === s.shareId)));
  };

  // ===== 기한 =====
  // [E12] loadButton[선택].Select (L405) → load() L978-1000: 콤보를 안 골랐으면 안내, 골랐으면 sch.Sch03_Deadline.updateModel(기본 기한 복사, 스케줄 구분 "1") → retrieve03()
  const load = async () => {
    if (templateId == null || infoId == null) {
      message.warning('상단 메뉴바의 좌측구분값을 선택해주세요');
      return;
    }
    try {
      await schApi.copyDeadline(Number(templateId), infoId, SCHEDULE_CODE);
      await retrieve03();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E13] deleteButton[삭제].Select (L411) → deleteRow() L878-893: 확인 "선택한 정보를 삭제하시겠습니까?"(제목 삭제) → [E18] sch.Sch03_Deadline.delete
  const deleteRow = () => {
    const checked = deadlineGridRef.current?.api.getSelectedRows() ?? [];
    Modal.confirm({
      title: '삭제',
      content: '선택한 정보를 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        if (checked.length === 0) return;
        try {
          await schApi.deleteDeadlines(checked.map(r => r.deadlineId));
          setDeadlines(prev => prev.filter(r => !checked.some(c => c.deadlineId === r.deadlineId)));
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // ===== 저장·닫기 =====
  // [E2] updateButton[저장].Select (L199) → update() L938-956: sch.Sch01_Info.update → update02() L744-771(공유 저장·삭제) → updateEnd() L958-976:
  //   selectById → "저장이 완료되었습니다." → callback.execute(저장한 행); hide()
  const update = async () => {
    if (infoId == null) return;
    setSaving(true);
    try {
      await schApi.updateInfo(infoId, { classId: classId ? Number(classId) : null, title, content, dailyYn, privateYn, useYn });
      const newRows = shares.filter(s => s.shareId <= 0);
      if (newRows.length > 0) await schApi.saveInfoShares(infoId, newRows);
      if (deleteList02.current.length > 0) await schApi.deleteInfoShares(infoId, deleteList02.current);
      const saved = await schApi.getInfo(infoId);
      message.success('저장이 완료되었습니다.');
      onResult(saved);
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  // [E3] closeButton[닫기].Select [callback != null] (L205) → new면 newDataRollback() L921-936(sch.Sch01_Info.deleteByInfoId), callback.execute(null); hide()
  const closeWindow = async () => {
    if (infoId == null) return;
    if (isNew) {
      try {
        await schApi.rollbackInfo(infoId);
      } catch (err) {
        message.error(errorMessage(err, '삭제 실패'));
        return;
      }
    }
    onResult(null);
    onClose();
  };

  // shareGrid() L481-488
  const shareColumns = useMemo(() => [
    gbShare.textCenter('shareName', 100, '구분'),
    gbShare.textCenter('orgName', 380, '부서'),
    gbShare.textCenter('personName', 180, '성명'),
  ], []);

  // deadlinedGrid() L490-523: 수정 아이콘 → 주기 "99"면 Sch03_Lookup_Short(수정), 아니면 Sch03_Lookup_Cycle(수정)
  const deadlineColumns = useMemo(() => [
    gbDeadline.textCenter('cycleName', 120, '주기구분'),
    gbDeadline.text('deadlineFullName', 300, '처리일 정보'),
    gbDeadline.date('startDate', 90, '시작일'),   // UX-08: 읽기 전용 날짜 열은 90 (원본 100)
    gbDeadline.date('closeDate', 90, '종료일'),
    iconCell<Sch03Deadline>('edit', 'actionCell', 50, '수정', row => setDeadlineTarget({ kind: row.cycleCode === '99' ? 'short' : 'cycle', deadline: row })),
  ], []);

  const labelCol: React.CSSProperties = { width: 80, flex: 'none', paddingTop: 5 };
  const rowStyle: React.CSSProperties = { display: 'flex', gap: 8, margin: '0 0 14px' };

  return (
    <>
      <LookupModal
        open={target != null}
        title={isNew ? '업무일정 등록' : '업무일정 수정'}
        width={850}
        closable={false}
        maskClosable={false}
        keyboard={false}
        styles={{ body: { maxHeight: 'calc(100vh - 240px)', overflowY: 'auto', paddingRight: 8 } }}
        footer={(
          <div style={{ textAlign: 'center' }}>
            <Button type="save" onClick={update} loading={saving}>저장</Button>
            <Button type="close" onClick={closeWindow}>닫기</Button>
          </div>
        )}
      >
        {/* row00 분류 */}
        <div style={rowStyle}>
          <div style={labelCol}>분류</div>
          <Space style={{ flex: 1 }} size={10}>
            <Select style={{ width: 300 }} placeholder="분류를 선택해주세요" value={classId} onChange={setClassId} options={classOptions} />
            {/* [E17] addClassButton[분류추가].Select (L435) → Sch08_Lookup_Class.open(callback → className.retrieve()) */}
            <Button type="addRow" onClick={() => setClassOpen(true)}>분류추가</Button>
            <Checkbox style={{ marginLeft: 100 }} checked={dailyYn} onChange={e => setDailyYn(e.target.checked)}>데일리 체크리스트</Checkbox>
          </Space>
        </div>
        {/* row01 일정명 */}
        <div style={rowStyle}>
          <div style={labelCol}>일정명</div>
          <Input style={{ flex: 1 }} placeholder="내용을 입력해주세요" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        {/* row02 상세내용 */}
        <div style={rowStyle}>
          <div style={labelCol}>상세내용</div>
          <Input.TextArea style={{ flex: 1, height: 150, resize: 'none' }} placeholder="내용을 입력해주세요" value={content} onChange={e => setContent(e.target.value)} />
        </div>
        {/* row03 첨부파일 */}
        <div style={rowStyle}>
          <div style={labelCol}>첨부파일</div>
          <div style={{ flex: 1, height: 185 }}>
            <Sch01_Grid_RelateFile parentId={infoId} />
          </div>
        </div>
        {/* row05 기한 */}
        <div style={rowStyle}>
          <div style={labelCol}>기한</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Select style={{ width: 250 }} placeholder="선택하세요" value={templateId} onChange={setTemplateId}
                options={templates.map(t => ({ value: t.code, label: t.name }))} />
              <Button type="select" onClick={load}>선택</Button>
              {/* [E14] shortButton[일회성조건].Select (L417) → shortInsert() L1002-1009: Sch03_Lookup_Short(infoId, "1") → retrieve03() */}
              <Button type="addRow" onClick={() => setDeadlineTarget({ kind: 'short', deadline: null })}>일회성조건</Button>
              {/* [E15] cycleButton[반복주기조건].Select (L423) → cycleInsert() L1011-1018: Sch03_Lookup_Cycle(infoId, "1") */}
              <Button type="addRow" onClick={() => setDeadlineTarget({ kind: 'cycle', deadline: null })}>반복주기조건</Button>
              <Button type="delete" onClick={deleteRow}>삭제</Button>
              {/* [E9] anchor03.MouseDown (L356) → retrieve03() */}
              <ReloadOutlined style={{ cursor: 'pointer' }} onMouseDown={() => void retrieve03()} />
            </div>
            <div style={{ height: 150 }}>
              <SingleGrid<Sch03Deadline>
                gridRef={deadlineGridRef}
                rowData={deadlines}
                columnDefs={deadlineColumns}
                getRowId={p => String(p.data.deadlineId)}
                rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
              />
            </div>
          </div>
        </div>
        {/* row06 일정공유 */}
        <div style={rowStyle}>
          <div style={labelCol}>일정공유</div>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 6 }}>
              <Checkbox checked={privateYn} onChange={e => onPrivateChange(e.target.checked)}>비공개 스케줄</Checkbox>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Radio.Group value={shareKind} disabled={!shareEnabled} onChange={e => setShareKind(e.target.value)}>
                <Radio value="emp">직원</Radio>
                <Radio value="org">부서</Radio>
              </Radio.Group>
              <Button type="addRow" disabled={!shareEnabled} onClick={insertRow02}>행 추가</Button>
              <Button type="removeRow" disabled={!shareEnabled} onClick={deleteRow02}>행 삭제</Button>
              {/* [E8] anchor02.MouseDown (L349) → retrieve02() */}
              <ReloadOutlined style={{ cursor: 'pointer' }} onMouseDown={() => void retrieve02()} />
              <div style={{ flex: 1 }} />
              {/* [E16] alarmButton[알람설정].Select (L429) → lookupAlarm() L1020-1027: Sch06_Lookup_AlarmSetup.open("SCH", infoId) */}
              <Button type="view" onClick={() => setAlarmOpen(true)}>알람설정</Button>
            </div>
            <div style={{ height: 130, opacity: shareEnabled ? 1 : 0.5, pointerEvents: shareEnabled ? 'auto' : 'none' }}>
              <SingleGrid<Sch02Share>
                gridRef={shareGridRef}
                rowData={shares}
                columnDefs={shareColumns}
                getRowId={p => String(p.data.shareId)}
                rowSelection={{ mode: 'multiRow', checkboxes: false, enableClickSelection: true }}
              />
            </div>
          </div>
        </div>
        {/* row09 사용여부 */}
        <div style={{ ...rowStyle, marginTop: 30 }}>
          <div style={labelCol}>사용여부</div>
          {/* [E5] useToggleGroup.ValueChange (L305) → useYn */}
          <Radio.Group value={useYn} onChange={e => setUseYn(e.target.value)}>
            <Radio value={true}>사용</Radio>
            <Radio value={false}>미사용</Radio>
          </Radio.Group>
        </div>
      </LookupModal>
      <Emp00_Lookup_SelectMulti open={lookupEmp} transDate={today()} onResult={onEmpResult} onClose={() => setLookupEmp(false)} />
      <Org00_Lookup_SelectMulti baseDate={lookupOrg ? today() : undefined} onSelect={onOrgSelect} onClose={() => setLookupOrg(false)} />
      {infoId != null && deadlineTarget?.kind === 'short' && (
        <Sch03_Lookup_Short deadline={deadlineTarget.deadline} classTreeId={infoId} scheduleCode={SCHEDULE_CODE}
          onSaved={() => void retrieve03()} onClose={() => setDeadlineTarget(null)} />
      )}
      {infoId != null && deadlineTarget?.kind === 'cycle' && (
        <Sch03_Lookup_Cycle deadline={deadlineTarget.deadline} classTreeId={infoId} scheduleCode={SCHEDULE_CODE}
          onSaved={() => void retrieve03()} onClose={() => setDeadlineTarget(null)} />
      )}
      <Sch06_Lookup_AlarmSetup target={alarmOpen && infoId != null ? { targetCode: 'SCH', targetId: infoId } : null} onClose={() => setAlarmOpen(false)} />
      <Sch08_Lookup_Class open={classOpen} onSaved={() => void loadClasses()} onClose={() => setClassOpen(false)} />
    </>
  );
};
