/**
 * 폐쇄계좌 탭 (I02) — Flt03_Tab_AccountReport 아래(south, 40%)에 붙는 폐쇄한 계좌 목록.
 * AS-IS: myApp/client/vi/flt/Flt06_TabPage_AccountClose.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L69-90: 위 [폐쇄취소], 가운데 체크박스 다중 그리드, 아래 "문서분류" 칸(550) + [상신]
 * [상신](전자결재 편집창 Apr01_Edit_ApprDoc, 다른 도메인)·상세보기는 다음 단계 — 편집창이 생길 때 연결한다
 */
import React, { useEffect, useMemo, useState } from 'react';
import { message, Modal } from 'antd';
import { fltApi } from '@/api/flt';
import { errorMessage } from '@/api/client';
import { FltAccountClose } from '@/types/flt';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Dcr30_Move_DcrClass } from '@/components/lookup/Dcr30_Move_DcrClass';

const gb = gbFor<FltAccountClose>();

/** 결재 중(10 상신·20 진행·30 완료)이면 건드릴 수 없다 (반려 40·임시저장 50은 가능) */
const IN_APPROVAL = ['10', '20', '30'];

interface Props {
  /** 값이 바뀔 때마다 다시 읽는다 (AS-IS Flt03_Tab_AccountReport.retrieve() L452 → tabPage.retrieve()) */
  refreshKey: number;
  /** setCallback() L353: [폐쇄취소] 뒤 부른 쪽이 계좌 목록과 이 탭을 다시 읽는다 */
  onChanged: () => void;
}

export const Flt06_TabPage_AccountClose: React.FC<Props> = ({ refreshKey, onChanged }) => {
  const [rows, setRows] = useState<FltAccountClose[]>([]);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState<FltAccountClose[]>([]);
  const [classTree, setClassTree] = useState<{ id: number | null; name: string }>({ id: null, name: '' });
  const [docOpen, setDocOpen] = useState(false);

  // retrieve() L184-195: 서비스 flt.Flt06_AccountClose.selectByPersonId(companyId, personId)
  const retrieve = async () => {
    setLoading(true);
    try {
      setRows(await fltApi.searchAccountCloses());
      setChecked([]);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void retrieve();
  }, [refreshKey]);

  // [E0] 화면 열림 (생성자 L69-90) → settings(), check() L117-133: dcr.Dcr30_Link.selectByLinkCode(companyId, "B06") → 기본 문서분류
  useEffect(() => {
    fltApi.getDocClass('B06').then(c => {
      if (c) setClassTree({ id: c.classTreeId, name: c.classTreeFullName ?? '' });
    }).catch(() => {});
  }, []);

  // actionCell(Detail) L136-165: apr.Apr01_Appr.selectById(apprId) → 있으면 Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false), 없으면 "상신문서가 존재하지 않습니다"
  const viewAppr = (row: FltAccountClose) => {
    if (row.apprId == null) {
      message.warning('상신문서가 존재하지 않습니다');
      return;
    }
    // [생략] 편집창은 다음 단계
    message.info('전자결재 문서 보기 창은 다음 단계에서 연결됩니다');
  };

  // buildGrid() L135-182: setChecked(MULTI). 신고사유 열(L169)과 상신제목 열(L179)은 주석 처리
  const columnDefs = useMemo(() => [
    gb.date('closeDate', 100, '계좌폐쇄일'),  // L168
    gb.text('familyRelateName', 100, '관계'),  // L170
    gb.text('accountName', 150, '계좌명의'),  // L171
    gb.text('accountNoDec', 200, '계좌번호'),  // L172
    gb.text('corpName', 200, '개설기관'),  // L173
    gb.text('corpBranchName', 150, '개설점포'),  // L174
    gb.text('itemTypeName', 150, '종목유형'),  // L175
    gb.date('apprRegDate', 100, '상신일'),  // L176
    gb.text('apprStatusName', 100, '상신상태'),  // L177
    iconCell<FltAccountClose>('view', 'actionCell', 80, '상세보기', viewAppr),  // L178
  ], []);

  // [E1] cancleButton[폐쇄취소].Select (L93) → deleteRow() L197-215 → [E4] msgBox.DialogHide [YES] (L200) → delete() L217-240
  const deleteRow = () => {
    // 선택 없이 삭제하면 경고만(05 §8 ②, 원본은 확인창 뒤 빈 목록으로 서버를 부른다)
    if (checked.length === 0) {
      message.warning('삭제할 행을 선택하세요.');
      return;
    }
    Modal.confirm({
      title: '확인',
      content: `${checked.length}건의 계좌정보를 복구하시겠습니까?`,
      width: 350,
      okText: '예',
      cancelText: '아니오',
      onOk: () => remove(),
    });
  };

  const remove = async () => {
    if (checked.some(m => IN_APPROVAL.includes(m.apprStatusCode ?? ''))) {
      message.warning('상신 중인 정보가 포함되어있습니다');
      return;
    }
    try {
      await fltApi.deleteAccountCloses(checked.map(m => m.accountCloseId));  // flt.Flt06_AccountClose.delete
      message.success(`${checked.length}건 삭제되었습니다.`);
      onChanged();  // callback.execute() L237
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // [E3] apprButton[상신].Select (L109) → insertLinkApproval() L253-289
  const insertLinkApproval = () => {
    if (classTree.id == null) {
      message.warning('문서분류를 먼저 선택해주세요');
      return;
    }
    if (checked.length === 0) {
      message.warning('신고할 계좌정보를 선택해주세요');
      return;
    }
    if (checked.some(m => IN_APPROVAL.includes(m.apprStatusCode ?? ''))) {
      message.warning('결재 중인 문서이거나, 완료된 문서가 포함되어있습니다');
      return;
    }
    // [E3 다음 단계] Apr01_Edit_ApprDoc.insertLinkApprovals(classTreeModel, "B06", param) → 결과 apprModel로 updateApprId() (flt.Flt06_AccountClose.updateApprId)
    message.info('전자결재 상신 창은 다음 단계에서 연결합니다.');
  };

  return (
    <div style={{ height: '100%', padding: '0 20px 20px', boxSizing: 'border-box' }}>
      <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 50, display: 'flex', alignItems: 'center', padding: '0 10px' }}>
          <Button type="close" onClick={deleteRow}>폐쇄취소</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<FltAccountClose>
            rowData={rows}
            columnDefs={columnDefs}
            loading={loading}
            getRowId={p => String(p.data.accountCloseId)}
            onCheckedChange={setChecked}
          />
        </div>
        <div style={{ height: 50, display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px' }}>
          <span style={{ fontSize: 14 }}>문서분류</span>
          {/* [E2] classTreeFullName.TriggerClick (L103) → openLookupDoc() L242-251: Dcr30_Move_DcrClass → 고른 분류 */}
          <LookupInput value={classTree.name} placeholder="문서분류를 선택해주세요" width={550} onOpen={() => setDocOpen(true)} />
          <Button type="register" onClick={insertLinkApproval}>상신</Button>
        </div>
      </div>
      <Dcr30_Move_DcrClass
        open={docOpen}
        onResult={r => { setClassTree({ id: r.classTreeId, name: r.classTreeFullName ?? '' }); setDocOpen(false); }}
        onClose={() => setDocOpen(false)}
      />
    </div>
  );
};
