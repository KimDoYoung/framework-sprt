/**
 * 현금흐름표 관리 모달 (R09) — Ast03_Lookup_CfInfo
 * AS-IS: myApp/client/vi/ast/Ast03_Lookup_CfInfo.java (481줄)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Splitter } from 'antd';
import type { ColDef } from 'ag-grid-community';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, CheckCell } from '@/components/grid';
import { AstCf, AstCfInfo, AstCfInfoSaveReq, AstCfSaveReq, TrCode } from '@/types/ast';
import { Corp } from '@/types/sys';
import { Ast05_Lookup_TrCode } from '@/components/lookup/Ast05_Lookup_TrCode';
import { Sys15_Lookup_Corp } from '@/components/lookup/Sys15_Lookup_Corp';
import { Ast03_Lookup_CfAutoCreate } from './Ast03_Lookup_CfAutoCreate';

interface Ast03LookupCfInfoProps {
  open: boolean;
  astClassTreeId: number | null;
  onClose: () => void;
}

const gbInfo = gbFor<AstCfInfo>();
const gbCf = gbFor<AstCf>();

export const Ast03_Lookup_CfInfo: React.FC<Ast03LookupCfInfoProps> = ({
  open,
  astClassTreeId,
  onClose,
}) => {
  // 좌측 구분 그리드 상태
  const [cfInfoList, setCfInfoList] = useState<AstCfInfo[]>([]);
  const [selectedCfInfo, setSelectedCfInfo] = useState<AstCfInfo | null>(null);
  const [cfInfoLoading, setCfInfoLoading] = useState(false);

  // 우측 일정 그리드 상태
  const [cfList, setCfList] = useState<AstCf[]>([]);
  const [cfLoading, setCfLoading] = useState(false);

  // 팝업 상태
  const [autoCreateOpen, setAutoCreateOpen] = useState(false);
  const [trCodeOpen, setTrCodeOpen] = useState(false);
  const [corpOpen, setCorpOpen] = useState(false);
  const targetRowRef = useRef<AstCfInfo | null>(null);

  // [E4] retrieveCfInfoButton[조회].Select (L166) → retrieveCfInfo()
  const retrieveCfInfo = useCallback(async () => {
    if (!astClassTreeId) return;
    setCfInfoLoading(true);
    try {
      const data = await astApi.getCfInfoList(astClassTreeId);
      setCfInfoList(data);
      if (data.length > 0) {
        setSelectedCfInfo(data[0]);
      } else {
        setSelectedCfInfo(null);
        setCfList([]);
      }
    } catch (e) {
      message.error(errorMessage(e));
    } finally {
      setCfInfoLoading(false);
    }
  }, [astClassTreeId]);

  // [E8] retrieveCfButton[조회].Select (L191) & [E1] uploadExcelForm.SubmitComplete (L141) → retrieveCf()
  const retrieveCf = useCallback(async (cfInfoId?: number) => {
    const id = cfInfoId ?? selectedCfInfo?.cfInfoId;
    if (!id || id <= 0) {
      setCfList([]);
      return;
    }
    setCfLoading(true);
    try {
      const data = await astApi.getCfList(id);
      setCfList(data);
    } catch (e) {
      message.error(errorMessage(e));
    } finally {
      setCfLoading(false);
    }
  }, [selectedCfInfo]);

  // [E0] 화면 열림 (생성자 L105-135) → show()
  useEffect(() => {
    if (open && astClassTreeId) {
      retrieveCfInfo();
    } else if (!open) {
      setCfInfoList([]);
      setSelectedCfInfo(null);
      setCfList([]);
    }
  }, [open, astClassTreeId, retrieveCfInfo]);

  // [E3] cfInfoGrid.Selection (L155) → retrieveCf()
  useEffect(() => {
    if (selectedCfInfo?.cfInfoId) {
      retrieveCf(selectedCfInfo.cfInfoId);
    }
  }, [selectedCfInfo, retrieveCf]);

  // [E2] cancleButton[닫기].Select (L148) → callback(), hide()
  const hide = () => {
    onClose();
  };

  // [E6] insertCfInfoButton[행 추가].Select (L178) → insertCfInfoRow()
  const insertCfInfoRow = () => {
    if (!astClassTreeId) return;
    const newRow: AstCfInfo = {
      cfInfoId: -Date.now(),
      astClassTreeId,
      cfCd: '',
      cfNm: '',
      trCd: '',
      icamYn: 'false',
    };
    setCfInfoList((prev) => [...prev, newRow]);
    setSelectedCfInfo(newRow);
  };

  // [E7] deleteCfInfoButton[행 삭제].Select (L184) → deleteCfInfoRow()
  const deleteCfInfoRow = async () => {
    if (!selectedCfInfo) {
      message.warning('삭제할 항목을 선택해주세요.');
      return;
    }
    if (selectedCfInfo.cfInfoId > 0) {
      try {
        await astApi.deleteCfInfo(selectedCfInfo.cfInfoId);
        message.success('삭제되었습니다.');
        retrieveCfInfo();
      } catch (e) {
        message.error(errorMessage(e));
      }
    } else {
      setCfInfoList((prev) => prev.filter((r) => r.cfInfoId !== selectedCfInfo.cfInfoId));
      setSelectedCfInfo(null);
      setCfList([]);
    }
  };

  // [E5] updateCfInfoButton[저장].Select (L172) → updateCfInfo()
  const updateCfInfo = async () => {
    if (!astClassTreeId) return;
    try {
      const rows: AstCfInfoSaveReq[] = cfInfoList.map((r) => ({
        cfInfoId: r.cfInfoId > 0 ? r.cfInfoId : undefined,
        astClassTreeId,
        cfCd: r.cfCd,
        cfNm: r.cfNm,
        trCd: r.trCd,
        corpId: r.corpId,
        icamYn: r.icamYn,
        note: r.note,
      }));
      await astApi.saveCfInfoList(rows);
      message.success('저장되었습니다.');
      retrieveCfInfo();
    } catch (e) {
      message.error(errorMessage(e));
    }
  };

  // [E10] insertCfButton[행 추가].Select (L208) → insertCfRow()
  const insertCfRow = () => {
    if (!selectedCfInfo || selectedCfInfo.cfInfoId <= 0) {
      message.warning('구분을 먼저 저장해주세요.');
      return;
    }
    const today = new Date().toISOString().substring(0, 10);
    const newRow: AstCf = {
      cfId: -Date.now(),
      cfInfoId: selectedCfInfo.cfInfoId,
      seq: cfList.length + 1,
      date: today,
      settleDate: today,
      settleAmt: 0,
      contAmt: 0,
      tax: 0,
    };
    setCfList((prev) => [...prev, newRow]);
  };

  // [E11] deleteCfButton[행 삭제].Select (L219) → deleteCfRow()
  const deleteCfRow = async () => {
    if (cfList.length === 0) return;
    const target = cfList[cfList.length - 1];
    if (target.cfId > 0) {
      try {
        await astApi.deleteCf(target.cfId);
        message.success('삭제되었습니다.');
        retrieveCf();
      } catch (e) {
        message.error(errorMessage(e));
      }
    } else {
      setCfList((prev) => prev.slice(0, -1));
    }
  };

  // [E9] updateCfButton[저장].Select (L202) → updateCf()
  const updateCf = async () => {
    if (!selectedCfInfo || selectedCfInfo.cfInfoId <= 0) return;
    try {
      const rows: AstCfSaveReq[] = cfList.map((r) => ({
        cfId: r.cfId > 0 ? r.cfId : undefined,
        cfInfoId: selectedCfInfo.cfInfoId,
        seq: r.seq,
        date: r.date,
        settleDate: r.settleDate,
        settleAmt: r.settleAmt,
        contAmt: r.contAmt,
        tax: r.tax,
        note: r.note,
      }));
      await astApi.saveCfList(rows);
      message.success('저장되었습니다.');
      retrieveCf();
    } catch (e) {
      message.error(errorMessage(e));
    }
  };

  // [E13] batchCfButton[일괄생성].Select (L232) → 메시지 "좌측 구분값을 선택해주세요"
  const handleBatchClick = () => {
    if (!selectedCfInfo || selectedCfInfo.cfInfoId <= 0) {
      message.warning('좌측 구분값을 선택해주세요');
      return;
    }
    setAutoCreateOpen(true);
  };

  // [E12] excelUploadButton[엑셀업로드].Select (L225) → 메시지 "개발 중"
  const handleExcelUpload = () => {
    message.info('개발 중');
  };

  // [E14] trLookup.TriggerClick (L273)
  const openTrCodeLookup = (row: AstCfInfo) => {
    targetRowRef.current = row;
    setTrCodeOpen(true);
  };

  const handleSelectTrCode = (tr: TrCode) => {
    if (!targetRowRef.current) return;
    const targetId = targetRowRef.current.cfInfoId;
    setCfInfoList((prev) =>
      prev.map((r) => (r.cfInfoId === targetId ? { ...r, trCd: tr.trCode || '', trNm: tr.trName || '' } : r))
    );
  };

  // [E15] corpLookup.TriggerClick (L292)
  const openCorpLookup = (row: AstCfInfo) => {
    targetRowRef.current = row;
    setCorpOpen(true);
  };

  const handleSelectCorp = (corp: Corp) => {
    if (!targetRowRef.current) return;
    const targetId = targetRowRef.current.cfInfoId;
    setCfInfoList((prev) =>
      prev.map((r) => (r.cfInfoId === targetId ? { ...r, corpId: corp.corpId, corpNm: corp.corpName || '' } : r))
    );
  };

  // buildCfInfoGrid 컬럼 (L313-317)
  const cfInfoColumns: ColDef<AstCfInfo>[] = useMemo(
    () => [
      gbInfo.textCenter('cfCd', 50, '코드', { editable: true }),
      gbInfo.text('cfNm', 170, '구분', { editable: true }),
      {
        ...gbInfo.text('trNm', 180, '발생거래'),
        onCellDoubleClicked: (params) => {
          if (params.data) openTrCodeLookup(params.data);
        },
      },
      {
        ...gbInfo.text('corpNm', 150, '거래처'),
        onCellDoubleClicked: (params) => {
          if (params.data) openCorpLookup(params.data);
        },
      },
      {
        ...gbInfo.boolean('icamYn', 70, 'ICAM사용'),
        cellRenderer: CheckCell,
      },
    ],
    []
  );

  // builCfdGrid 컬럼 (L328-333)
  const cfColumns: ColDef<AstCf>[] = useMemo(
    () => [
      gbCf.longCenter('seq', 50, '회차', { editable: true }),
      gbCf.date('date', 120, '일자', { editable: true }),
      gbCf.date('settleDate', 120, '실수령/지급일', { editable: true }),
      gbCf.long('contAmt', 120, '금액', { editable: true }),
      gbCf.long('tax', 100, '세금', { editable: true }),
      gbCf.long('settleAmt', 120, '실수량/지급액', { editable: true }),
    ],
    []
  );

  return (
    <Modal
      open={open}
      title="현금흐름표 관리"
      onCancel={hide}
      width={1100}
      footer={[
        // [E2] cancleButton[닫기].Select
        <Button key="close" type="close" onClick={hide}>
          닫기
        </Button>,
      ]}
    >
      <div style={{ height: 500 }}>
        <Splitter>
          {/* 좌측 구분 영역 */}
          <Splitter.Panel defaultSize="45%" min="35%" style={{ display: 'flex', flexDirection: 'column', paddingRight: 8 }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
              {/* [E4] retrieveCfInfoButton[조회].Select */}
              <Button type="search" onClick={retrieveCfInfo}>
                조회
              </Button>
              {/* [E5] updateCfInfoButton[저장].Select */}
              <Button type="save" onClick={updateCfInfo}>
                저장
              </Button>
              {/* [E6] insertCfInfoButton[행 추가].Select */}
              <Button type="addRow" onClick={insertCfInfoRow}>
                행 추가
              </Button>
              {/* [E7] deleteCfInfoButton[행 삭제].Select */}
              <Button type="removeRow" onClick={deleteCfInfoRow}>
                행 삭제
              </Button>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <SingleGrid<AstCfInfo>
                columnDefs={cfInfoColumns}
                rowData={cfInfoList}
                loading={cfInfoLoading}
                onSelect={(row) => setSelectedCfInfo(row ?? null)}
                getRowId={(params) => String(params.data.cfInfoId)}
              />
            </div>
          </Splitter.Panel>

          {/* 우측 일정 영역 */}
          <Splitter.Panel defaultSize="55%" min="40%" style={{ display: 'flex', flexDirection: 'column', paddingLeft: 8 }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
              {/* [E8] retrieveCfButton[조회].Select */}
              <Button type="search" onClick={() => retrieveCf()}>
                조회
              </Button>
              {/* [E9] updateCfButton[저장].Select */}
              <Button type="save" onClick={updateCf}>
                저장
              </Button>
              {/* [E10] insertCfButton[행 추가].Select */}
              <Button type="addRow" onClick={insertCfRow}>
                행 추가
              </Button>
              {/* [E11] deleteCfButton[행 삭제].Select */}
              <Button type="removeRow" onClick={deleteCfRow}>
                행 삭제
              </Button>
              {/* [E13] batchCfButton[일괄생성].Select */}
              <Button type="generate" onClick={handleBatchClick}>
                일괄생성
              </Button>
              {/* [E12] excelUploadButton[엑셀업로드].Select */}
              <Button type="upload" onClick={handleExcelUpload}>
                엑셀업로드
              </Button>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <SingleGrid<AstCf>
                columnDefs={cfColumns}
                rowData={cfList}
                loading={cfLoading}
                getRowId={(params) => String(params.data.cfId)}
              />
            </div>
          </Splitter.Panel>
        </Splitter>
      </div>

      {/* 일괄생성 모달 */}
      <Ast03_Lookup_CfAutoCreate
        open={autoCreateOpen}
        cfInfo={selectedCfInfo}
        onClose={() => setAutoCreateOpen(false)}
        onSuccess={(cfs) => setCfList(cfs)}
      />

      {/* 발생거래 모달 */}
      <Ast05_Lookup_TrCode
        open={trCodeOpen}
        mode="view"
        assetType="1"
        onResult={(tr) => {
          if (tr) handleSelectTrCode(tr);
          setTrCodeOpen(false);
        }}
        onClose={() => setTrCodeOpen(false)}
      />

      {/* 거래처 모달 */}
      <Sys15_Lookup_Corp
        open={corpOpen}
        onResult={(corp) => {
          if (corp) handleSelectCorp(corp);
          setCorpOpen(false);
        }}
        onClose={() => setCorpOpen(false)}
      />
    </Modal>
  );
};
