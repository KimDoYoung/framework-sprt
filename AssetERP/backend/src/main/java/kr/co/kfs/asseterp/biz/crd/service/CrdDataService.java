package kr.co.kfs.asseterp.biz.crd.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.crd.dto.CrdCardManagerRow;
import kr.co.kfs.asseterp.biz.crd.dto.CrdDataAmountRes;
import kr.co.kfs.asseterp.biz.crd.dto.CrdDataCheckRes;
import kr.co.kfs.asseterp.biz.crd.dto.CrdDataRes;
import kr.co.kfs.asseterp.biz.crd.dto.CrdDataSaveReq;
import kr.co.kfs.asseterp.biz.crd.dto.CrdDataTargetReq;
import kr.co.kfs.asseterp.biz.crd.dto.CrdPromoAmtRow;
import kr.co.kfs.asseterp.biz.crd.dto.CrdPromoCountRow;
import kr.co.kfs.asseterp.biz.crd.mapper.CrdDataMapper;
import kr.co.kfs.asseterp.common.dto.PageRes;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * AS-IS server/crd/Crd02_Data.java (selectByPaging L111 / selectByAmt L50 / selectByText L80 / update L183 / copyUpdate L170 / delete L188 / deleteBiz L152)
 * · server/biz/Biz01_Promo.java (targetCheck L197 / targetListCheck L256 / insertList L452). 로그인 회사의 내역만 다룬다
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CrdDataService {

    private static final String CLOSED = "마감내역이 존재합니다. 마감 취소 후 처리가 가능합니다.";

    private final CrdDataMapper mapper;

    /** confirmComboBox 글자 → [confirmCode, stateCode] (Crd02_Tab_DataUpload.retrieve L381-393) */
    private static String[] confirmCodes(String confirm) {
        if (confirm == null) {
            return new String[]{"%", ""};
        }
        return switch (confirm) {
            case "DONE" -> new String[]{"O", ""};
            case "NOT_ALL" -> new String[]{"", ""};
            case "NOT_EXCEPT_CANCEL" -> new String[]{"", "%취소%"};
            default -> new String[]{"%", ""};
        };
    }

    private static String like(String v) {
        return v == null || v.isEmpty() ? "%" : v;
    }

    private static String wrap(String v) {
        return "%" + (v == null ? "" : v) + "%";
    }

    /** crd02_data.selectByTextPaging·selectByTextTotal — 은행·년월이 비면 "%" */
    public PageRes<CrdDataRes> search(UserPrincipal user, String searchText, String dataBankCode, String dataYm, String confirm, long offset, long limit) {
        String[] c = confirmCodes(confirm);
        long total = mapper.selectTotal(user.getCompanyId(), wrap(searchText), like(dataBankCode), like(dataYm), c[0], c[1]);
        List<CrdDataRes> rows = mapper.selectPaging(user.getCompanyId(), wrap(searchText), like(dataBankCode), like(dataYm), c[0], c[1], offset, limit);
        return new PageRes<>(total, rows);
    }

    /** crd02_data.selectByAmt */
    public CrdDataAmountRes amount(UserPrincipal user, String searchText, String dataBankCode, String dataYm, String confirm) {
        String[] c = confirmCodes(confirm);
        return mapper.selectAmount(user.getCompanyId(), wrap(searchText), like(dataBankCode), like(dataYm), c[0], c[1]);
    }

    /** biz.Biz01_Promo.targetCheck — checkType 1 엑셀업로드 / 2 내역확정 / 3 등록. status -1 거절, 0 진행, 1 확인 후 진행 */
    public CrdDataCheckRes targetCheck(UserPrincipal user, String dataYm, String checkType) {
        CrdPromoCountRow n = mapper.countPromoByMonth(user.getCompanyId(), dataYm);
        if (n.closeCount() > 0) {
            return new CrdDataCheckRes(-1, CLOSED, n.dataCount());
        }
        if ("3".equals(checkType)) {
            return new CrdDataCheckRes(0, "등록가능!!", n.dataCount());
        }
        if (n.confirmCount() > 0) {
            return new CrdDataCheckRes(1, "이미 확정된 내역이 존재합니다. 계속 진행하시겠습니까?<br><span style='color:red;'>(데이터가 중복될 수 있습니다.)</span>", n.dataCount());
        }
        if ("2".equals(checkType) && n.dataCount() == 0) {
            return new CrdDataCheckRes(-1, "업로드내역이 존재하지 않습니다.", 0);
        }
        return new CrdDataCheckRes(n.confirmCount(), "에러. Asset-ERP 관리자에게 문의하세요.", n.dataCount());
    }

    /** 고른 내역(ids) 또는 조회조건에 맞는 전체 */
    private List<CrdDataRes> targets(UserPrincipal user, CrdDataTargetReq req) {
        if (req.ids() != null) {
            return req.ids().isEmpty() ? List.of() : mapper.selectByIds(user.getCompanyId(), req.ids());
        }
        String[] c = confirmCodes(req.confirm());
        return mapper.selectByText(user.getCompanyId(), wrap(req.searchText()), like(req.dataBankCode()), like(req.dataYm()), c[0], c[1]);
    }

    private static List<Long> idsOf(List<CrdDataRes> list) {
        return list.stream().map(CrdDataRes::dataId).toList();
    }

    /**
     * biz.Biz01_Promo.targetListCheck — checkType 1 업로드내역 삭제 / 2 내역확정 / 4 저장.
     * 마감 -1, 확정내역 있음 1(4는 2), 확정내역 없음: 1에서 내역이 있으면 1, 2에서 내역이 없으면 -1, 4는 2, 나머지 0.
     * (AS-IS는 먼저 그 달 전체의 마감을 -1로 표시하지만 뒤 분기가 상태를 덮어써서 고른 내역의 마감만 결과에 남는다)
     */
    public CrdDataCheckRes targetListCheck(UserPrincipal user, String checkType, CrdDataTargetReq req) {
        List<CrdDataRes> list = targets(user, req);
        CrdPromoCountRow n = list.isEmpty() ? new CrdPromoCountRow(0, 0, 0) : mapper.countPromoByIds(user.getCompanyId(), idsOf(list));
        int size = list.size();
        if (n.closeCount() > 0) {
            return new CrdDataCheckRes(-1, CLOSED, size);
        }
        if (n.confirmCount() > 0) {
            return "4".equals(checkType)
                    ? new CrdDataCheckRes(2, "저장이 완료되었습니다.", size)
                    : new CrdDataCheckRes(1, "확정내역이 이미 존재합니다. 변경내역을 반영하시겠습니까?", size);
        }
        if ("1".equals(checkType) && size > 0) {
            return new CrdDataCheckRes(1, "해당 전표는 이미 등록되었습니다. 삭제 후 재업로드하시겠습니까?", size);
        }
        if ("2".equals(checkType) && size == 0) {
            return new CrdDataCheckRes(-1, "업로드내역이 존재하지 않습니다.", 0);
        }
        if ("4".equals(checkType)) {
            return new CrdDataCheckRes(2, "저장이 완료되었습니다.", size);
        }
        return new CrdDataCheckRes(n.confirmCount(), null, size);
    }

    /**
     * Crd02_Edit_DataUpload.updateCheck L204 + Crd02_Data.update — 마감된 내역은 저장 불가. dataId가 없거나 0 이하면 새 내역
     * (등록(복사) copyUpdate도 같은 저장). 저장한 내역을 다시 읽어 돌려준다
     */
    @Transactional
    public CrdDataRes save(UserPrincipal user, CrdDataSaveReq req) {
        Long companyId = user.getCompanyId();
        if (req.dataId() != null && req.dataId() > 0) {
            if (mapper.selectById(companyId, req.dataId()) == null) {
                throw new BusinessException(ErrorCode.ACCESS_DENIED);
            }
            if (mapper.countPromoByIds(companyId, List.of(req.dataId())).closeCount() > 0) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, CLOSED);
            }
            mapper.update(companyId, req);
            return mapper.selectById(companyId, req.dataId());
        }
        long newId = mapper.selectNextId();
        mapper.insert(newId, companyId, req);
        return mapper.selectById(companyId, newId);
    }

    /** Crd02_Tab_DataUpload.deleteCheck L540 + Crd02_Data.delete·deleteBiz — 마감된 내역이 있으면 거절, 아니면 내역과 그 이익제공 내역을 지운다 → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }
        if (mapper.countPromoByIds(user.getCompanyId(), ids).closeCount() > 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, CLOSED);
        }
        int n = mapper.deleteByIds(user.getCompanyId(), ids);
        mapper.deletePromoByDataIds(user.getCompanyId(), ids);
        return n;
    }

    /** 선택내역확정(ids)·전체내역확정(조회조건) 전의 확인 — Crd02_Tab_DataUpload.insertCheck L758 · totalInsertCheck L818 (checkType 2) */
    public CrdDataCheckRes confirmCheck(UserPrincipal user, CrdDataTargetReq req) {
        List<CrdDataRes> list = targets(user, req);
        if (req.ids() != null && list.stream().anyMatch(r -> r.dataBankCode() == null)) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "카드회사가 미입력된 정보가 포함되어 있습니다");
        }
        return targetListCheck(user, "2", req);
    }

    /**
     * biz.Biz01_Promo.insertList L452-609 — 내역마다 이익제공 내역(biz01_promo)을 만들거나(없을 때) 고치고(있을 때), 승인취소건은 정상건에 반영한다.
     * 카드·사용자가 하나로 안 잡히는 내역이 있으면 전부 되돌린다 → 확정한 건수
     */
    @Transactional
    public int confirm(UserPrincipal user, CrdDataTargetReq req) {
        Long companyId = user.getCompanyId();
        List<CrdDataRes> list = targets(user, req);
        String taxType = mapper.selectTaxType(companyId);
        List<CrdDataRes> cancels = new ArrayList<>();
        for (CrdDataRes d : list) {
            List<Long> promoIds = mapper.selectPromoIdsByDataId(companyId, d.dataId());
            List<CrdCardManagerRow> cards = mapper.selectCardManager(companyId, d.cardNo(), d.approvalDt());
            if (cards.size() != 1) {
                throw new BusinessException(ErrorCode.INVALID_INPUT, "카드정보가 존재하지 않습니다. 카드번호 및 사용자 등록을 확인하세요");
            }
            boolean cancel = "승인취소".equals(d.stateName());
            Long amount = cancel && d.approvalAmount() > 0 ? -d.approvalAmount() : d.approvalAmount();
            Long tax = cancel && d.surtax() > 0 ? -d.surtax() : d.surtax();
            CrdCardManagerRow card = cards.get(0);
            if (promoIds.isEmpty()) {
                mapper.insertPromo(mapper.selectNextId(), companyId, d, amount, tax, card.cardId(), taxType, card.cardManagerId());
            } else {
                for (Long promoId : promoIds) {
                    mapper.updatePromo(promoId, companyId, d, amount, tax, card.cardId(), taxType);
                }
            }
            if (!"정상".equals(d.stateName()) && d.approvalNo() != null) {
                cancels.add(d);
            }
        }
        for (CrdDataRes c : cancels) {
            CrdPromoAmtRow normal = mapper.selectPromoByApprovalNo(companyId, c.dataYm(), c.approvalNo(), "%정상%");
            if (normal == null) {
                continue;
            }
            mapper.deletePromoByApprovalNo(companyId, c.dataYm(), c.approvalNo(), "%취소%");
            if (c.approvalAmount() + normal.provideAmt() == 0) {
                mapper.deletePromoByApprovalNo(companyId, c.dataYm(), c.approvalNo(), "%정상%");
            } else {
                long cancelAmount = c.approvalAmount() != null && c.approvalAmount() > 0 ? -c.approvalAmount() : c.approvalAmount();
                long cancelSurtax = c.surtax() != null && c.surtax() > 0 ? -c.surtax() : c.surtax();
                mapper.partCancelUpdate(normal.promoId(), normal.provideAmt() + cancelAmount, normal.tax() + cancelSurtax);
            }
        }
        return list.size();
    }
}
