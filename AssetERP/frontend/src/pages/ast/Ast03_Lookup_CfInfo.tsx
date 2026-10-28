/**
 * 현금흐름표 관리 모달 (R09) — Ast03_Lookup_CfInfo
 * AS-IS: myApp/client/vi/ast/Ast03_Lookup_CfInfo.java (480줄)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button as AntButton, message, Splitter } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ColDef, RowSelectionOptions } from 'ag-grid-community';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { Ast05_Lookup_TrCode } from '@/components/lookup/Ast05_Lookup_TrCode';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Sys15_Lookup_Corp } from '@/components/lookup/Sys15_Lookup_Corp';
import { useGridCrud } from '@/hooks/useGridCrud';
import { AstCf, AstCfInfo, AstCfInfoSaveReq, AstCfSaveReq, AstClassTree, TrCode } from '@/types/ast';
import { Corp } from '@/types/sys';
import { Ast03_Lookup_CfAutoCreate } from './Ast03_Lookup_CfAutoCreate';

interface Ast03LookupCfInfoProps {
  open: boolean;
  classTreeModel: AstClassTree | null;
  onClose: () => void;
}

const gbInfo = gbFor<AstCfInfo>();
const gbCf = gbFor<AstCf>();

const SINGLE_ROW_SELECTION: RowSelectionOptions<AstCfInfo> = {
  mode: 'singleRow',
  checkboxes: false,
  enableClickSelection: true,
};

export const Ast03_Lookup_CfInfo: React.FC<Ast03LookupCfInfoProps> = ({
  open,
  classTreeModel,
  onClose,
}) => {
  const astClassTreeId = classTreeModel?.classTreeId ?? null;
  const [selectedCfInfo, setSelectedCfInfo] = useState<AstCfInfo | null>(null);
  const selectedCfInfoRef = useRef<AstCfInfo | null>(null);
  selectedCfInfoRef.current = selectedCfInfo;

  const deleteCfInfoList = useRef<number[]>([]);
  const deleteCfList = useRef<number[]>([]);
  const [selectedCfRows, setSelectedCfRows] = useState<AstCf[]>([]);

  // 팝업 상태
  const [autoCreateOpen, setAutoCreateOpen] = useState(false);
  const [trCodeOpen, setTrCodeOpen] = useState(false);
  const [corpOpen, setCorpOpen] = useState(false);
  const targetRowRef = useRef<AstCfInfo | null>(null);

  const cfInfoCrud = useGridCrud<AstCfInfo>({
    idField: 'cfInfoId',
    search: useCallback(async () => {
      if (!astClassTreeId) return [];
      return astApi.getCfInfoList(astClassTreeId);
    }, [astClassTreeId]),
    save: useCallback(
      async (changed: AstCfInfo[]) => {
        if (!astClassTreeId) return [];
        const payload: AstCfInfoSaveReq[] = changed.map((r) => ({
          cfInfoId: r.cfInfoId > 0 ? r.cfInfoId : undefined,
          astClassTreeId,
          cfCode: r.cfCode,
          cfName: r.cfName,
          trCode: r.trCode,
          corpId: r.corpId,
          icamYn: r.icamYn ?? 'false',
          note: r.note,
        }));
        return astApi.saveCfInfoList(payload);
      },
      [astClassTreeId]
    ),
    remove: useCallback(async () => 0, []),
    newRow: useCallback(
      () => ({
        astClassTreeId: astClassTreeId ?? 0,
        cfCode: '',
        cfName: '',
        trCode: '',
        icamYn: 'false',
      }),
      [astClassTreeId]
    ),
    firstEditField: 'cfCode',
    reloadAfterSave: true,
  });

  const cfCrud = useGridCrud<AstCf>({
    idField: 'cfId',
    search: useCallback(async () => {
      const id = selectedCfInfoRef.current?.cfInfoId;
      if (!id || id <= 0) return [];
      return astApi.getCfList(id);
    }, []),
    save: useCallback(async (changed: AstCf[]) => {
      const id = selectedCfInfoRef.current?.cfInfoId;
      if (!id || id <= 0) return [];
      const payload: AstCfSaveReq[] = changed.map((r) => ({
        cfId: r.cfId > 0 ? r.cfId : undefined,
        cfInfoId: id,
        seq: r.seq,
        date: r.date,
        settleDate: r.settleDate,
        settleAmt: r.settleAmt,
        contAmt: r.contAmt,
        tax: r.tax,
        note: r.note,
      }));
      return astApi.saveCfList(payload);
    }, []),
    remove: useCallback(async () => 0, []),
    newRow: useCallback((): Partial<AstCf> => {
      const today = new Date().toISOString().slice(0, 10);
      return {
        cfInfoId: selectedCfInfoRef.current?.cfInfoId ?? 0,
        date: today,
      };
    }, []),
    firstEditField: 'seq',
    reloadAfterSave: true,
  });

  // [E8] retrieveCfButton[조회].Select (L191) & [E1] uploadExcelForm.SubmitComplete (L141) → retrieveCf()
  const retrieveCf = useCallback(
    async (cfInfo?: AstCfInfo | null) => {
      const target = cfInfo !== undefined ? cfInfo : selectedCfInfoRef.current;
      deleteCfList.current = [];
      setSelectedCfRows([]);
      if (!target || !target.cfInfoId || target.cfInfoId <= 0) {
        cfCrud.clear();
        return;
      }
      selectedCfInfoRef.current = target;
      await cfCrud.retrieve();
    },
    [cfCrud.clear, cfCrud.retrieve]
  );

  // [E4] retrieveCfInfoButton[조회].Select (L166) → retrieveCfInfo()
  const retrieveCfInfo = useCallback(async () => {
    if (!astClassTreeId) return;
    deleteCfInfoList.current = [];
    await cfInfoCrud.retrieve();
    setTimeout(() => {
      const firstNode = cfInfoCrud.gridRef.current?.api?.getDisplayedRowAtIndex(0);
      if (firstNode?.data) {
        firstNode.setSelected(true);
      } else {
        setSelectedCfInfo(null);
        selectedCfInfoRef.current = null;
        cfCrud.clear();
      }
    });
  }, [astClassTreeId, cfInfoCrud.retrieve, cfInfoCrud.gridRef, cfCrud.clear]);

  // [E0] 화면 열림 (생성자 L105-135) → show()
  useEffect(() => {
    if (open && astClassTreeId) {
      retrieveCfInfo();
    } else if (!open) {
      cfInfoCrud.clear();
      cfCrud.clear();
      setSelectedCfInfo(null);
      selectedCfInfoRef.current = null;
      deleteCfInfoList.current = [];
      deleteCfList.current = [];
      setSelectedCfRows([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, astClassTreeId]);

  // [E3] cfInfoGrid.Selection (L155) → retrieveCf()
  const handleSelectCfInfo = (row: AstCfInfo | undefined) => {
    const next = row ?? null;
    setSelectedCfInfo(next);
    selectedCfInfoRef.current = next;
    if (next) {
      retrieveCf(next);
    } else {
      cfCrud.clear();
    }
  };

  // [E2] cancleButton[닫기].Select (L148) → callback(), hide()
  const hide = () => {
    onClose();
  };

  // [E6] insertCfInfoButton[행 추가].Select (L178) → insertCfInfoRow()
  const insertCfInfoRow = () => {
    if (!astClassTreeId) return;
    cfInfoCrud.addRow();
  };

  // [E7] deleteCfInfoButton[행 삭제].Select (L184) → deleteCfInfoRow()
  const deleteCfInfoRow = () => {
    const selected = cfInfoCrud.gridRef.current?.api?.getSelectedRows() ?? (selectedCfInfo ? [selectedCfInfo] : []);
    if (selected.length === 0) return;
    for (const model of selected) {
      if (model.cfInfoId > 0) {
        deleteCfInfoList.current.push(model.cfInfoId);
      }
    }
    cfInfoCrud.removeRows(selected.map((r) => r.cfInfoId));
    setSelectedCfInfo(null);
    selectedCfInfoRef.current = null;
    cfCrud.clear();
  };

  // [E5] updateCfInfoButton[저장].Select (L172) → updateCfInfo()
  const updateCfInfo = async () => {
    cfInfoCrud.gridRef.current?.api?.stopEditing();
    const changed = cfInfoCrud.getChanged();
    for (const model of changed) {
      if (!model.cfCode || model.cfCode.length !== 3) {
        message.warning('코드는 3자리로 설정해주세요');
        return;
      }
      if (!model.trCode) {
        message.warning('발생거래를 설정해주세요');
        return;
      }
    }
    try {
      if (changed.length > 0) {
        await cfInfoCrud.saveRows();
        // saveRows는 실패해도 던지지 않고 오류만 알린다 — 저장 안 된 행이 남았으면 삭제로 넘어가지 않는다
        if (cfInfoCrud.hasChanges()) return;
      }
      if (deleteCfInfoList.current.length > 0) {
        for (const id of deleteCfInfoList.current) {
          await astApi.deleteCfInfo(id);
        }
        deleteCfInfoList.current = [];
        await retrieveCfInfo();
      }
    } catch (e) {
      message.error(errorMessage(e));
    }
  };

  // [E10] insertCfButton[행 추가].Select (L208) → insertCfRow()
  const insertCfRow = () => {
    if (!selectedCfInfo || selectedCfInfo.cfInfoId <= 0) {
      message.warning('좌측 구분값을 선택해주세요');
      return;
    }
    cfCrud.addRow();
  };

  // [E11] deleteCfButton[행 삭제].Select (L219) → deleteCfRow()
  const deleteCfRow = () => {
    if (selectedCfRows.length === 0) return;
    for (const model of selectedCfRows) {
      if (model.cfId > 0) {
        deleteCfList.current.push(model.cfId);
      }
    }
    cfCrud.removeRows(selectedCfRows.map((r) => r.cfId));
    setSelectedCfRows([]);
  };

  // [E9] updateCfButton[저장].Select (L202) → updateCf()
  const updateCf = async () => {
    cfCrud.gridRef.current?.api?.stopEditing();
    const changed = cfCrud.getChanged();
    try {
      if (changed.length > 0) {
        await cfCrud.saveRows();
        // saveRows는 실패해도 던지지 않고 오류만 알린다 — 저장 안 된 행이 남았으면 삭제로 넘어가지 않는다
        if (cfCrud.hasChanges()) return;
      }
      if (deleteCfList.current.length > 0) {
        for (const id of deleteCfList.current) {
          await astApi.deleteCf(id);
        }
        deleteCfList.current = [];
        await retrieveCf();
      }
    } catch (e) {
      message.error(errorMessage(e));
    }
  };

  // [E13] batchCfButton[일괄생성].Select (L232) → 메시지 "좌측 구분값을 선택해주세요"
  const openBatchCreate = () => {
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

  const handleSelectTrCode = (tr: TrCode | null) => {
    if (!targetRowRef.current || !tr) return;
    cfInfoCrud.updateRow(targetRowRef.current.cfInfoId, {
      trCode: tr.trCode || '',
      trName: tr.trName || '',
    });
  };

  // [E15] corpLookup.TriggerClick (L292)
  const openCorpLookup = (row: AstCfInfo) => {
    targetRowRef.current = row;
    setCorpOpen(true);
  };

  const handleSelectCorp = (corp: Corp | null) => {
    if (!targetRowRef.current) return;
    if (!corp) {
      cfInfoCrud.updateRow(targetRowRef.current.cfInfoId, {
        corpId: null,
        corpName: null,
      });
    } else {
      cfInfoCrud.updateRow(targetRowRef.current.cfInfoId, {
        corpId: corp.corpId,
        corpName: corp.corpName || '',
      });
    }
  };

  // buildCfInfoGrid 컬럼 (L267-320)
  const cfInfoColumns: ColDef<AstCfInfo>[] = useMemo(
    () => [
      gbInfo.textCenter('cfCode', 50, '코드', { editor: 'text' }),
      gbInfo.text('cfName', 170, '구분', { editor: 'text' }),
      gbInfo.text('trName', 180, '발생거래', {
        cellStyle: { color: '#1677ff' },
        cellRenderer: (p: { data?: AstCfInfo; value?: string }) => (
          <>
            <AntButton
              type="text"
              size="small"
              icon={<SearchOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                if (p.data) openTrCodeLookup(p.data);
              }}
            />
            {p.value}
          </>
        ),
      }),
      gbInfo.text('corpName', 150, '거래처', {
        cellStyle: { color: '#1677ff' },
        cellRenderer: (p: { data?: AstCfInfo; value?: string }) => (
          <>
            <AntButton
              type="text"
              size="small"
              icon={<SearchOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                if (p.data) openCorpLookup(p.data);
              }}
            />
            {p.value}
          </>
        ),
      }),
      gbInfo.boolean('icamYn', 70, 'ICAM사용', { editable: true }),
    ],
    []
  );

  // builCfdGrid 컬럼 (L322-336)
  const cfColumns: ColDef<AstCf>[] = useMemo(
    () => [
      gbCf.longCenter('seq', 50, '회차', { editor: 'number' }),
      gbCf.date('date', 120, '일자', { editor: 'date' }),
      gbCf.date('settleDate', 120, '실수령/지급일', { editor: 'date' }),
      gbCf.long('contAmt', 120, '금액', { editor: 'number' }),
      gbCf.long('tax', 100, '세금', { editor: 'number' }),
      gbCf.long('settleAmt', 120, '실수량/지급액', { editor: 'number' }),
    ],
    []
  );

  return (
    <LookupModal
      open={open}
      title={classTreeModel?.classTreeName ? `${classTreeModel.classTreeName} 현금흐름표` : '현금흐름표'}
      onCancel={hide}
      width={1350}
      footer={[
        // [E2] cancleButton[닫기].Select
        <Button key="close" type="close" onClick={hide}>
          닫기
        </Button>,
      ]}
    >
      <div style={{ height: 550 }}>
        <Splitter style={{ height: '100%' }}>
          {/* 좌측 구분 영역 */}
          <Splitter.Panel
            defaultSize="50%"
            min="35%"
            style={{ display: 'flex', flexDirection: 'column', paddingRight: 8, boxSizing: 'border-box' }}
          >
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
              <CellEditGrid<AstCfInfo>
                crud={cfInfoCrud}
                columnDefs={cfInfoColumns}
                rowSelection={SINGLE_ROW_SELECTION}
                onSelectionChanged={(e) => {
                  const rows = e.api.getSelectedRows();
                  handleSelectCfInfo(rows[0]);
                }}
              />
            </div>
          </Splitter.Panel>

          {/* 우측 일정 영역 */}
          <Splitter.Panel
            defaultSize="50%"
            min="35%"
            style={{ display: 'flex', flexDirection: 'column', paddingLeft: 8, boxSizing: 'border-box' }}
          >
            <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
              {/* [E8] retrieveCfButton[조회].Select */}
              <Button
                type="search"
                onClick={() => {
                  if (!selectedCfInfo) {
                    message.warning('좌측 구분값을 선택해주세요');
                    return;
                  }
                  retrieveCf();
                }}
              >
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
              <Button type="generate" onClick={openBatchCreate}>
                일괄생성
              </Button>
              {/* [E12] excelUploadButton[엑셀업로드].Select (AS-IS cfBar.add 주석처리됨) */}
              <span style={{ display: 'none' }}>
                <Button type="upload" onClick={handleExcelUpload}>
                  엑셀업로드
                </Button>
              </span>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <CellEditGrid<AstCf>
                crud={cfCrud}
                columnDefs={cfColumns}
                rowNumber={false}
                onSelectionChanged={(e) => setSelectedCfRows(e.api.getSelectedRows())}
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
        onSuccess={() => retrieveCf()}
      />

      {/* 발생거래 조회창 */}
      <Ast05_Lookup_TrCode
        open={trCodeOpen}
        mode="edit"
        assetType={classTreeModel?.assetType || '2'}
        onClose={() => setTrCodeOpen(false)}
        onResult={(tr: TrCode | null) => {
          handleSelectTrCode(tr);
          setTrCodeOpen(false);
        }}
      />

      {/* 거래처 조회창 */}
      <Sys15_Lookup_Corp
        open={corpOpen}
        regYn={true}
        onClose={() => setCorpOpen(false)}
        onResult={(corp: Corp | null) => {
          handleSelectCorp(corp);
          setCorpOpen(false);
        }}
      />
    </LookupModal>
  );
};
