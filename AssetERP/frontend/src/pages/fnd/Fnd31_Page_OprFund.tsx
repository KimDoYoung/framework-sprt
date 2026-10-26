/**
 * 공모주청약 펀드별 배정 목록 (Q06, 본 화면 Fnd30_Tab_Opr 아래 400)
 * AS-IS: myApp/client/vi/fnd/Fnd31_Page_OprFund.java (262줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L59-115: 위 툴바 50([등록][삭제] · [템플릿][엑셀업로드]) + 그리드(체크 다중, 펀드코드 100 · 펀드명 400 · 배정수량 100 · 단가 100 · 배정금액 100 · 수수료 100 · 납입금액 100 · 수정 아이콘 80, 맨 아래 합계 행)
 * 수요예측 쪽(Fnd31_Page_DemandOprFund)과 달리 [등록]·[엑셀업로드]는 결재상태를 검사하지 않는다(원본 그대로) — 수정·삭제만 검사한다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import { fndApi } from '@/api/fnd';
import { errorMessage } from '@/api/client';
import { OprFund } from '@/types/fnd';
import { Button } from '@/components/button';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { MultiGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { AgGridReact } from 'ag-grid-react';
import { Fnd31_Edit_OprFund, OprFundTarget } from './Fnd31_Edit_OprFund';

const gb = gbFor<OprFund>();

interface Props {
  /** 위 목록에서 고른 공모주청약 — 바뀌면 곧바로 조회한다(AS-IS retrieve(oprId)), null이면 비운다 */
  oprId: number | null;
}

export const Fnd31_Page_OprFund: React.FC<Props> = ({ oprId }) => {
  const gridRef = useRef<AgGridReact<OprFund>>(null);
  const excelForm = useRef<FileUpdownFormHandle>(null);
  const [rows, setRows] = useState<OprFund[]>([]);
  const [target, setTarget] = useState<OprFundTarget | null>(null);

  // [E0] 화면 열림 (생성자 L59-115) → 툴바·그리드 구성. 조회는 위 목록이 청약을 고르면(oprId가 바뀌면) 한다
  // retrieve(oprId) L169-179: oprId가 없으면 목록을 비우고, 있으면 fnd.Fnd31_OprFund.selectByOprId
  const retrieve = useCallback(async () => {
    if (oprId == null) { setRows([]); return; }
    try {
      setRows(await fndApi.searchOprFunds(oprId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [oprId]);

  useEffect(() => { void retrieve(); }, [retrieve]);

  // [E1] insertButton[등록].Select (L60) → oprId가 없으면 안내, 있으면 insertRow() L181-189
  const insertRow = () => {
    if (oprId == null) { message.warning('상단의 종목을 먼저 선택해주세요'); return; }
    setTarget({ mode: 'insert', oprId });
  };

  // [E2] deleteButton[삭제].Select (L71) → deleteCheck() L191-230: fnd.Fnd30_Opr.selectById로 결재상태를 읽어 완료(30)·진행(10·20)이면 막고, 아니면 확인("삭제", 300폭) → [E7] YES → deleteRow() L232-241
  // (원본은 고른 행이 없으면 getSelectedItem()이 null이라 아무 일도 안 일어난다 → 안내만 한다)
  const deleteCheck = async () => {
    const selected = gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.length === 0) { message.warning('삭제대상을 선택하세요'); return; }
    try {
      const opr = await fndApi.getOpr(selected[0].oprId);
      if (opr.apprStatusCode === '30') { message.warning('결재완료된 문서가 존재합니다'); return; }
      if (opr.apprStatusCode === '10' || opr.apprStatusCode === '20') { message.warning('결재진행 중인 문서가 존재합니다'); return; }
    } catch (err) {
      message.warning(errorMessage(err, '조회 실패'));
      return;
    }
    Modal.confirm({
      title: '삭제',
      content: `${selected.length}건의 정보를 삭제하시겠습니까?`,
      width: 300,
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          await fndApi.deleteOprFunds(oprId as number, selected.map(r => r.oprFundId));
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
          return;
        }
        await retrieve();
      },
    });
  };

  // [E3] tempDownloadButton[템플릿].Select (L77) → downloadForm.submit() (./excelTemplete/Template_공모주청약 펀드배분.xlsx)
  const downloadTemplate = async () => {
    try {
      await fndApi.downloadOprFundTemplate(true);
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    }
  };

  // [E4] excelUploadButton[엑셀업로드].Select (L83) → excelUpload() L243-261: 파일 선택 (원본은 결재상태를 검사하지 않는다)
  const excelUpload = () => {
    if (oprId == null) { message.warning('상단의 종목을 먼저 선택해주세요'); return; }
    excelForm.current?.click();
  };

  // [E8] fileUploadField.Change (L253) → uploadExcelForm.submit() · [E5] uploadExcelForm.SubmitComplete (L106) → retrieve()
  const onExcelFile = async (file?: File) => {
    if (!file) return;
    try {
      await fndApi.uploadOprFundsExcel(oprId as number, file);
    } catch (err) {
      message.error(errorMessage(err, '업로드 실패'));
    }
    await retrieve();
  };

  // [E6] editCell (ImageCell) (L118) → fnd.Fnd30_Opr.selectById: 결재완료·진행(10·20·30)이면 수정 불가 안내
  const editRow = async (row: OprFund) => {
    try {
      const opr = await fndApi.getOpr(oprId as number);
      if (opr.apprStatusCode === '10' || opr.apprStatusCode === '20' || opr.apprStatusCode === '30') {
        message.warning('결재진행 중인 정보는 수정이 불가능합니다');
        return;
      }
    } catch (err) {
      message.warning(errorMessage(err, '조회 실패'));
      return;
    }
    setTarget({ mode: 'edit', oprId: oprId as number, row });
  };

  // buildGrid() L117-163: getSumGrid("합계", 3, 4, 8, "5") — 합계 라벨은 펀드명 열, 합은 배정수량·배정금액·수수료·납입금액(단가 열 5는 뺀다)
  const columnDefs = useMemo(() => [
    gb.text('fundCode', 100, '펀드코드'),
    gb.text('fundName', 400, '펀드명'),
    gb.long('qty', 100, '배정수량'),
    gb.long('price', 100, '단가'),
    gb.long('contAmt', 100, '배정금액'),
    gb.long('fee', 100, '수수료'),
    gb.long('settleAmt', 100, '납입금액'),
    iconCell<OprFund>('edit', 'editAction', 80, '수정', row => void editRow(row)),
  ], [oprId]);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 50, flex: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px' }}>
        <Button type="register" onClick={insertRow}>등록</Button>
        <Button type="delete" onClick={deleteCheck}>삭제</Button>
        <span style={{ width: 16 }} />
        <Button type="download" onClick={downloadTemplate}>템플릿</Button>
        <Button type="upload" onClick={excelUpload}>엑셀업로드</Button>
        <FileUpdownForm ref={excelForm} accept=".xlsx,.xls" onChange={onExcelFile} />
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiGrid<OprFund>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.oprFundId)}
          sumRow={{ labelField: 'fundName', label: '합계', sum: ['qty', 'contAmt', 'fee', 'settleAmt'] }}
        />
      </div>
      <Fnd31_Edit_OprFund target={target} onSaved={() => void retrieve()} onClose={() => setTarget(null)} />
    </div>
  );
};
