package kr.co.kfs.asseterp.biz.batch.service;

import kr.co.kfs.asseterp.biz.batch.dto.BatchFundCode;
import kr.co.kfs.asseterp.biz.batch.dto.BatchFundInfo;
import kr.co.kfs.asseterp.biz.batch.dto.BatchIcamFund;
import kr.co.kfs.asseterp.biz.batch.mapper.BatchFundMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

/**
 * AS-IS BatchMain.assetErpFundInsert (L1481-2035) — ICAM 펀드(icam03)를 Asset-ERP 펀드(fnd01·fnd02)에 반영한다.
 * icamFund(SB13)와 extrFund(SB14)가 함께 쓴다. 트랜잭션은 부르는 쪽(배치 작업)이 건다.
 * <p>
 * 흐름: fnd01이 없으면 새로 만들 준비(insertYn=Y). 있으면 기준일 이전 가장 최근 fnd02와 비교해 하나라도 다르면 insertYn=Y.
 * Y이면 fnd01을 upsert하고 같은 기준일의 fnd02를 지운 뒤 새로 넣는다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AssetErpFundSync {

    private final BatchFundMapper fundMapper;

    public void sync(Long companyId, BatchIcamFund icam, boolean icamYn) {
        String step = "(assetErpFundInsert)1 펀드정보 Insert&Update 실패.." + companyId;
        try {
            boolean insert = false;
            BatchFundCode fnd01;

            step = "(assetErpFundInsert)2 fnd01 Get 실패 - param:{companyId=" + companyId + ", fundCode=" + icam.fundCode() + "}";
            List<BatchFundCode> fnd01List = fundMapper.selectFundCodes(companyId, icam.fundCode());

            if (fnd01List.isEmpty()) {
                insert = true;
                step = "(assetErpFundInsert)2-1 fnd01 번호 채번 실패";
                // 새 펀드: 번호 채번, 상품여부 false, ICAM 관리여부 = 부른 쪽이 준 값
                fnd01 = new BatchFundCode(fundMapper.selectSeq(), null, null, null, null, "false", null, companyId,
                        String.valueOf(icamYn));
            } else {
                fnd01 = fnd01List.get(0);
                step = "(assetErpFundInsert)3 fnd02 Get 실패 - fundCodeId:" + fnd01.fundCodeId();
                BatchFundInfo old = fundMapper.selectFundInfoByWorkDate(fnd01.fundCodeId(), icam.stdDate());
                if (old == null) {
                    // AS-IS는 여기서 NullPointerException으로 실패한다(원본-이상한점 참고) — 같은 결과(롤백)를 낸다
                    throw new IllegalStateException("fnd02 없음: fundCodeId=" + fnd01.fundCodeId() + ", workDate=" + icam.stdDate());
                }
                insert = changed(old, icam);
            }
            log.debug("insertYn[{}]", insert ? "Y" : "N");
            if (!insert) {
                return;
            }

            step = "(assetErpFundInsert)5 fnd01 insertUpdate 실패...fundCode : " + icam.fundCode();
            BatchFundCode toSave = new BatchFundCode(fnd01.fundCodeId(), icam.fundCode(), icam.setDate(), icam.endDate(),
                    icam.endDate() == null ? "false" : "true", fnd01.planYn(), fnd01.realFundId(), fnd01.companyId(),
                    fnd01.icamYn());
            fundMapper.upsertFundCode(toSave);

            // AS-IS: 운용부서명(oprDept)은 icamFund에서 채우지 않아 항상 null이다
            BatchFundInfo info = new BatchFundInfo(fnd01.fundCodeId(), icam.stdDate(), icam.fundName(), icam.fundFullName(),
                    icam.consignmentCode(), icam.officeWorkCode(), icam.oprDept(), icam.kofiaFundCode(), icam.trustCode(),
                    icam.fundTypeCode(), icam.publicCode(), icam.parentCode(), icam.classTypeCode(), icam.fundUnitCode(),
                    icam.charClassCode(), icam.endExpectDate(), icam.trustBankCode(), icam.operator1(), icam.operator2(),
                    icam.cur(), icam.closeDate(), icam.feeDate(), icam.ksdFundCode(), icam.ksdItemCode(),
                    icam.managementRate(), icam.salesRate(), icam.consignmentRate(), icam.officeWorkRate(),
                    icam.setAmt(), icam.nav(), icam.diffDivYn());

            step = "(assetErpFundInsert)7 fnd02 delete 실패...fundCode : " + icam.fundCode();
            fundMapper.deleteFundInfo(info);
            step = "(assetErpFundInsert)7 fnd02 insert 실패...fundCode : " + icam.fundCode();
            fundMapper.insertFundInfo(info);
        } catch (BusinessException e) {
            throw e;
        } catch (RuntimeException e) {
            throw new BusinessException(ErrorCode.INTERNAL_ERROR, step + " / " + e.getMessage(), e);
        }
    }

    /** fnd02(기존)와 ICAM 값 비교 — AS-IS 항목과 순서 그대로. 하나라도 다르면 true */
    private static boolean changed(BatchFundInfo o, BatchIcamFund n) {
        return differs(o.fundName(), n.fundName())
                || differs(o.fundFullName(), n.fundFullName())
                || differs(o.consignmentCode(), n.consignmentCode())
                || differs(o.officeWorkCode(), n.officeWorkCode())
                || differs(o.orgCodeName(), n.oprDept())
                || differs(o.kofiaFundCode(), n.kofiaFundCode())
                || differs(o.kofiaTrustCode(), n.trustCode())
                || differs(o.kofiaFundTypeCode(), n.fundTypeCode())
                || differs(o.kofiaPublicCode(), n.publicCode())
                || differs(o.kofiaParentCode(), n.parentCode())
                || differs(o.kofiaClassTypeCode(), n.classTypeCode())
                || differs(o.kofiaFundUnitCode(), n.fundUnitCode())
                || differs(o.kofiaCharClassCode(), n.charClassCode())
                || differs(o.endExpectDate(), n.endExpectDate())
                || differs(o.trustBankCode(), n.trustBankCode())
                || differs(o.operator1(), n.operator1())
                || differs(o.operator2(), n.operator2())
                || differs(o.cur(), n.cur())
                || differs(o.nextCloseDate(), n.closeDate())
                || differs(o.nextFeeDate(), n.feeDate())
                || differs(o.ksdFundCode(), n.ksdFundCode())
                || differs(o.ksdItemCode(), n.ksdItemCode())
                || differs(o.managementRate(), n.managementRate())
                || differs(o.salesRate(), n.salesRate())
                || differs(o.consignmentRate(), n.consignmentRate())
                || differs(o.officeWorkRate(), n.officeWorkRate())
                || differs(o.seoljAek(), n.setAmt())
                || differs(o.sunjasanAek(), n.nav())
                || differs(o.diffDivYn(), n.diffDivYn());
    }

    /** 둘 다 null이면 같음, 한쪽만 null이면 다름, 숫자는 값으로(2.50 = 2.5), 나머지는 equals */
    private static boolean differs(Object a, Object b) {
        if (a == null || b == null) {
            return a != b;
        }
        if (a instanceof BigDecimal x && b instanceof BigDecimal y) {
            return x.compareTo(y) != 0;
        }
        return !a.equals(b);
    }
}
