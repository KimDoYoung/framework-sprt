/**
 * 임직원매매 기본설정 조회창 — [보고주기 변경 및 서약서 서명]이 연다 (Flt00_Tab_Info·Flt03_Tab_AccountReport·Flt10_Tab_BuyReport·Flt10_Tab_SellReport)
 * AS-IS: myApp/client/vi/flt/Flt02_Lookup_Emp.java (603줄) — 메서드 이름·줄 번호는 원본(IDMS-IC)
 * open() L116-179: 모달 960×750 "임직원매매 기본설정", 위에서 아래로
 *   1. 임직원 금융투자상품 매매 법규준수서약서 — 문서분류 칸(550) · 상신상태(250) · [상신](120)
 *   2. 연간투자한도 및 보고주기 설정 — [조회][등록][저장][삭제] + 체크박스 다중 셀 편집 그리드(적용시작일자 120 · 연간추가 투자한도 300 · 보고주기 120) + 안내 두 줄
 *   3. 가족 금융거래정보 이용동의서 — 안내 · [파일업로드] + 체크 단일 파일 그리드(첨부파일 690 · 보기 50 · 받기 50 · 삭제 50) + [닫기]
 * 서약서 상신은 전자결재 편집창(Apr01_Edit_ApprDoc)을 링크코드 A06으로 연다. 닫기는 callback.execute() 뒤 hide()
 * 스타일: MFG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Modal } from 'antd';
import { fltApi, fltEmpSettingApi } from '@/api/flt';
import { fileApi, FILE_DELETE_STATUS } from '@/api/file';
import { errorMessage } from '@/api/client';
import { sysApi } from '@/api/sys';
import { FltEmpOath, FltEmpSetting } from '@/types/flt';
import { Code, FileInfo } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, SingleGrid, gbFor, iconCell } from '@/components/grid';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';
import { LookupInput } from '@/components/lookup/LookupInput';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Dcr30_Move_DcrClass } from '@/components/lookup/Dcr30_Move_DcrClass';
import { Sys10_Lookup_FileViewer } from '@/pages/sys/Sys10_Lookup_FileViewer';
import { Apr01_Edit_ApprDoc } from '@/pages/apr/Apr01_Edit_ApprDoc';

const gb = gbFor<FltEmpSetting>();
const fgb = gbFor<FileInfo>();

/** setChecked(SINGLE) — 렌더마다 새 객체를 주면 AG Grid가 선택을 지우므로 한 번만 만든다 */
const SINGLE_CHECKED = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

const LABEL: React.CSSProperties = { fontSize: 14, fontWeight: 'bold' };
const NOTE: React.CSSProperties = { fontSize: 12 };

interface Props {
  open: boolean;
  /** [닫기] — AS-IS callback.execute() 뒤 hide() (부르는 쪽이 보고주기·서약서 상태를 다시 읽는다) */
  onClose: () => void;
}

export const Flt02_Lookup_Emp: React.FC<Props> = ({ open, onClose }) => {
  const user = useLoginUser();
  const [cycles, setCycles] = useState<Code[]>([]);
  // 서약서 (1번 칸): 문서분류 = 기본 문서분류(Dcr30_Link A06)가 처음 값, 상신상태 = flt04_oath
  const [defaultClass, setDefaultClass] = useState<{ id: number; name: string } | null>(null);
  const [classTree, setClassTree] = useState<{ id: number | null; name: string }>({ id: null, name: '' });
  const [classPlaceholder, setClassPlaceholder] = useState('미선택시 자동으로 관리자가 지정한 문서분류에 상신이 진행됩니다.');
  const [docOpen, setDocOpen] = useState(false);
  const [oath, setOath] = useState<FltEmpOath | null>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [viewApprId, setViewApprId] = useState<number | null>(null);
  // 가족동의서 파일 (3번 칸)
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);
  const fileUpload = useRef<FileUpdownFormHandle>(null);

  const crud = useGridCrud<FltEmpSetting>({
    idField: 'empId',
    // retrieve() L483-495: flt.Flt02_Emp.selectByPersonId(회사, 로그인 사원)
    search: useCallback(() => fltEmpSettingApi.search(), []),
    // update() L509-529: flt.Flt02_Emp.update (GridUpdate)
    save: rows => fltEmpSettingApi.save(rows),
    // delete() L559-563: GridDeleteData flt.Flt02_Emp.delete(체크된 행 목록)
    remove: ids => fltEmpSettingApi.remove(ids),
    // insertRow() L531-537: 회사·사원은 서버가 로그인 사용자로 채운다
    newRow: () => ({ startDate: null, yearInvestLimit: null, checkCycle: null, checkCycleName: null }),
    firstEditField: 'startDate',
    // update() L517-524: 바뀐 행마다 순서대로 검사
    validate: changed => {
      for (const m of changed) {
        if (!m.startDate) return '적용시작일자를 입력하세요';
        if (!m.checkCycle) return '보고주기를 선택하세요';
      }
      return undefined;
    },
    // deleteRow() L539-557: "삭제" / "선택한 정보를 삭제하시겠습니까?"
    deleteConfirm: '선택한 정보를 삭제하시겠습니까?',
    reloadAfterSave: false,
  });

  // fileRetrieve() L497-507: sys.Sys10_File.selectByFamilyConsentId(로그인 사원)
  const fileRetrieve = useCallback(async () => {
    try {
      setFiles(await fltApi.searchFamilyConsentFiles(user.userId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [user.userId]);

  // retrieveApprStep() L441-481: flt.Flt04_Oath.selectByPersonId(로그인 사원) → 상신상태·버튼 문구
  const retrieveApprStep = useCallback(async () => {
    try {
      setOath(await fltEmpSettingApi.getOath());
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // defaultName() L270-290: dcr.Dcr30_Link.selectByLinkCode(회사, "A06" 법규준수서약서) — 하나일 때만 기본 문서분류
  const defaultName = useCallback(async () => {
    try {
      const doc = await fltApi.getDocClass('A06');
      if (doc) {
        const d = { id: doc.classTreeId, name: doc.classTreeFullName ?? '' };
        setDefaultClass(d);
        setClassTree({ id: d.id, name: '' });  // classTreeModel = defaultModel, 칸에는 비어 있고 안내(emptyText)로 보인다
        setClassPlaceholder(d.name);
      } else {
        setDefaultClass(null);
        setClassTree({ id: null, name: '' });
        setClassPlaceholder('문서분류가 미지정 상태입니다. 관리자에게 문의해주세요');
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (open L116-179) → settings(), defaultName(), retrieve(), retrieveApprStep(), fileRetrieve()
  useEffect(() => {
    if (!open) return;
    setClassTree({ id: null, name: '' });
    setClassPlaceholder('미선택시 자동으로 관리자가 지정한 문서분류에 상신이 진행됩니다.');
    setOath(null);
    setFiles([]);
    sysApi.searchCodes('FloorTrCheckCycle').then(setCycles).catch(() => {});  // buildGrid() L296 보고주기 콤보
    void defaultName();
    void crud.retrieve();
    void retrieveApprStep();
    void fileRetrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E1] retrieveButton[조회].Select (L182) → retrieve(), fileRetrieve()
  const retrieveAll = () => {
    void crud.retrieve();
    void fileRetrieve();
  };

  // [E9] classTreeFullName[문서분류].TriggerClick (L248) → openLookupDoc() L372-381: Dcr30_Move_DcrClass.open(defaultModel, …) → 고른 분류
  const onClassResult = (r: { classTreeId: number | null; classTreeFullName: string | null }) => {
    setClassTree({ id: r.classTreeId, name: r.classTreeFullName ?? '' });
    setDocOpen(false);
  };

  const stepName = oath?.statusName ?? '미상신';
  // retrieveApprStep() L464-472: 반려(40)는 [상신] 그대로, 그 밖에 상태가 있으면 [보기]
  const apprButtonText = oath?.statusName != null && oath.statusCode !== '40' ? '보기' : '상신';

  // [E10] apprButton[상신].Select (L254) → insertLinkApproval() L383-423
  const insertLinkApproval = () => {
    if (stepName === '미상신' || stepName === '반려') {
      if (classTree.id == null) {
        message.warning('문서분류를 먼저 선택해주세요');
        return;
      }
      setLinkOpen(true);  // Apr01_Edit_ApprDoc.insertLinkApproval(classTreeModel, "A06", null, isAdmin, cb)
    } else if (oath?.apprId != null) {
      setViewApprId(oath.apprId);  // apr.Apr01_Appr.selectById → Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false, cb → retrieveApprStep())
    }
  };

  // updateApprId(apprModel) L425-439: flt.Flt04_Oath.updateApprId → retrieveApprStep()
  const updateApprId = async (apprId: number) => {
    try {
      await fltEmpSettingApi.updateOathApprId(apprId);
    } catch (err) {
      message.error(errorMessage(err, '결재문서 ID를 기록하지 못했습니다'));
    }
    await retrieveApprStep();
  };

  // [E5] fileUploadButton[파일업로드].Select (L207) → fileUpload.click(), [E7] fileUpload.Change (L223) → FileUpload?mode=flt07, [E8] fileUploadForm.SubmitComplete (L239) → fileRetrieve()
  const onFileChange = async (file: File | undefined) => {
    if (!file) return;
    try {
      await fltEmpSettingApi.uploadFamilyConsent(file);
    } catch (err) {
      message.error(errorMessage(err, '파일 올리기 실패'));
    }
    await fileRetrieve();
  };

  // deleteCell L335-361: "삭제" / "선택한 파일을 삭제하시겠습니까?" [E13] YES → flt.Flt07_FamilyConsent.deleteByFamilyConsentId(parentId) → checkFileDelete() L565-590
  const deleteFile = (row: FileInfo) => {
    Modal.confirm({
      title: '삭제',
      content: '선택한 파일을 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          await fltEmpSettingApi.deleteFamilyConsent(row.parentId);
          // sys.Sys11_RelateFile.checkFileDelete(fileId, parentId): 1 연결만 지움 → retrieve(), 2 메시지, 3 FileDelete → [E6] fileDeleteForm.SubmitComplete → fileRetrieve()
          const result = await fileApi.checkFileDeleteResult(row.fileId, row.parentId);
          if (result.status === FILE_DELETE_STATUS.IN_USE) {
            message.warning(result.message ?? '삭제할 수 없는 파일입니다');
            return;
          }
          if (result.status === FILE_DELETE_STATUS.DELETABLE) await fileApi.deleteFile(row.fileId);
          void crud.retrieve();
          await fileRetrieve();
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // buildGrid() L292-312: 보고주기 콤보 [E12] FloorTrCheckCycleComboBox.Collapse (L297) → checkCycle/checkCycleName 동기화
  const columnDefs = useMemo(() => [
    gb.date('startDate', 120, '적용시작일자', { editor: 'date' }),  // L307
    gb.long('yearInvestLimit', 300, '연간추가 투자한도 (연봉한도)', { editor: 'number' }),  // L308
    gb.text('checkCycleName', 120, '보고주기', {  // L309
      editor: 'select',
      values: cycles.map(c => c.name),
      valueSetter: p => {
        p.data.checkCycleName = p.newValue;
        p.data.checkCycle = cycles.find(c => c.name === p.newValue)?.code ?? null;
        return true;
      },
    }),
  ], [cycles]);

  // buildFileGrid() L314-369
  const fileColumnDefs = useMemo(() => [
    fgb.text('fileNm', 690, '첨부파일'),  // L363
    iconCell<FileInfo>('view', 'viewCell', 50, '보기', setViewFile),  // L364 viewCell → Sys10_Lookup_FileViewer.open(fileId)
    iconCell<FileInfo>('down', 'downloadCell', 50, '받기', row => {  // L365 downloadCell → FileDownload?fileType=file&fileId=
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    iconCell<FileInfo>('delete', 'deleteCell', 50, '삭제', deleteFile),  // L366 deleteCell
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  return (
    <>
      {/* 가장 넓은 파일 그리드: 열 폭 합계 690+50+50+50 = 840 + 행번호·체크 60 + 여백 130 = 1030 (03 원칙 21, AS-IS 960보다 작지 않게) */}
      <LookupModal open={open} title="임직원매매 기본설정" width={1030} style={{ top: 20 }} maskClosable={false} onCancel={onClose} destroyOnHidden
        styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
        footer={
          <div style={{ textAlign: 'center' }}>
            {/* [E11] closeButton[닫기].Select (L261) → callback.execute(), hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* 1. 법규준수서약서 (label03 + hlc01) */}
          <div style={LABEL}>1. 임직원 금융투자상품 매매 법규준수서약서</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 10 }}>
            <span>문서분류</span>
            {/* [E9] classTreeFullName.TriggerClick (L248) → openLookupDoc() */}
            <LookupInput value={classTree.name} placeholder={classPlaceholder} width={500} onOpen={() => setDocOpen(true)} />
            <span style={{ marginLeft: 8 }}>상신상태</span>
            <Input readOnly value={stepName} style={{ width: 180 }} />
            {/* [E10] apprButton[상신].Select (L254) → insertLinkApproval() */}
            <Button type="register" onClick={insertLinkApproval}>{apprButtonText}</Button>
          </div>

          {/* 2. 연간투자한도 및 보고주기 설정 (label05 + buttonBar01 + grid + label01·02) */}
          <div style={{ ...LABEL, marginTop: 8 }}>2. 연간투자한도 및 보고주기 설정</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Button type="search" onClick={retrieveAll}>조회</Button>
            {/* [E2] insertButton[등록].Select (L189) → insertRow() */}
            <Button type="register" onClick={crud.addRow}>등록</Button>
            {/* [E3] updateButton[저장].Select (L195) → update() */}
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            {/* [E4] deleteButton[삭제].Select (L201) → deleteRow() → [E14] msgBox.DialogHide [YES] (L542) → delete() */}
            <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
          </div>
          <div style={{ height: 150 }}>
            {/* setChecked(MULTI) L306 — 삭제·저장용 체크라 행 클릭 선택(rowClick)은 쓰지 않는다 (03 원칙 16 예외) */}
            <CellEditGrid<FltEmpSetting> crud={crud} columnDefs={columnDefs} />
          </div>
          <div style={NOTE}>* 연간 추가 투자한도 : 연봉한도</div>
          <div style={NOTE}>* 보고주기 : 조사분석인력 및 투자운용인력은 월별점검 대상입니다</div>

          {/* 3. 가족 금융거래정보 이용동의서 (label04 + label06 + buttonBar02 + fileGrid) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
            <span style={LABEL}>3. 가족 금융거래정보 이용동의서</span>
            <span style={{ fontSize: 12, color: '#005A9E', fontWeight: 'bold', flex: 1 }}> (가족계좌를 신고한 경우 동의서를 업로드하세요)</span>
            <Button type="upload" onClick={() => fileUpload.current?.click()}>파일업로드</Button>
            <FileUpdownForm ref={fileUpload} onChange={file => void onFileChange(file)} />
          </div>
          <div style={{ height: 155 }}>
            {/* setChecked(SINGLE) L362 */}
            <SingleGrid<FileInfo>
              rowData={files}
              columnDefs={fileColumnDefs}
              getRowId={p => String(p.data.fileId)}
              rowSelection={SINGLE_CHECKED}
            />
          </div>
        </div>
      </LookupModal>
      <Dcr30_Move_DcrClass open={docOpen} authCheck defaultClassTreeId={defaultClass?.id ?? null} onResult={onClassResult} onClose={() => setDocOpen(false)} />
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
      {/* insertLinkApproval(): 새 법규준수서약서 상신(A06) / 상신된 문서 보기 */}
      <Apr01_Edit_ApprDoc
        apprId={viewApprId}
        link={linkOpen && classTree.id != null ? { classTreeId: classTree.id, linkCode: 'A06' } : null}
        onLinkSaved={id => void updateApprId(id)}
        onClosed={() => void retrieveApprStep()}
        onClose={() => { setViewApprId(null); setLinkOpen(false); void retrieveApprStep(); }}
      />
    </>
  );
};
