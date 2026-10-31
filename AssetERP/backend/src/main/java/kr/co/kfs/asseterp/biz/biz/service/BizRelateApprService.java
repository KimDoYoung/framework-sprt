package kr.co.kfs.asseterp.biz.biz.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizRelateApprPersonReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizRelateApprRes;
import kr.co.kfs.asseterp.biz.biz.mapper.BizRelateApprMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** AS-IS Biz05_Lookup_RelateAppr·Biz01_Tab_Card(상신 상태) → server/biz/Biz05_RelateAppr.java (selectByPromoId L26 / selectByPersonId L62 / selectByDataYm L48 / selectFileCount L92 / delete L213) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BizRelateApprService {

    private final BizRelateApprMapper mapper;
    private final BizCardExcelService cardExcelService;

    /** AS-IS selectByPersonId(companyId, dataYm, linkCode, personId = LoginUser) — 정확히 한 건일 때만 그 행, 아니면 null(미상신) */
    public BizRelateApprRes getByPerson(UserPrincipal user, String dataYm, String linkCode) {
        List<BizRelateApprRes> list = mapper.selectByPersonId(user.getCompanyId(), dataYm, linkCode, user.getUserId());
        return list.size() == 1 ? list.get(0) : null;
    }

    /** AS-IS selectByDataYm(companyId, dataYm = "%…%", linkCode) — 정확히 한 건일 때만 그 행, 아니면 null(미상신) */
    public BizRelateApprRes getByDataYm(UserPrincipal user, String dataYm, String linkCode) {
        List<BizRelateApprRes> list = mapper.selectByDataYm(user.getCompanyId(), "%" + dataYm + "%", linkCode);
        return list.size() == 1 ? list.get(0) : null;
    }

    public List<BizRelateApprRes> searchByPromo(UserPrincipal user, Long promoId) {
        return mapper.selectByPromoId(user.getCompanyId(), promoId);
    }

    /** AS-IS selectFileCount → 'n건' */
    public String getFileCount(Long promoId) {
        return mapper.selectFileCount(promoId);
    }

    /** AS-IS delete(연결제거) → 지운 건수 */
    @Transactional
    public int delete(UserPrincipal user, List<Long> relateApprIds) {
        return relateApprIds.stream().mapToInt(id -> mapper.deleteById(user.getCompanyId(), id)).sum();
    }

    /**
     * AS-IS Biz05_RelateAppr.insert L124-162 — 그 달(dataYm = yyyy.MM) 상신 연결을 새 문서로 바꾼다(있으면 지우고 넣는다). 반환은 새 연결 ID.
     * 있는지 보는 질의는 `selectByDataYm`(결재문서와 조인, 같은 값만 — LIKE에 % 없이)이다
     */
    @Transactional
    public long insertDataYm(UserPrincipal user, String dataYm, String linkCode, Long apprId) {
        for (BizRelateApprRes old : mapper.selectByDataYm(user.getCompanyId(), dataYm, linkCode)) {
            mapper.deleteById(user.getCompanyId(), old.relateApprId());
        }
        long id = mapper.selectNextId();
        mapper.insertDataYm(id, user.getCompanyId(), dataYm, linkCode, apprId);
        return id;
    }

    /**
     * AS-IS insertPersonId L164-206 — 로그인 사원의 그 달 상신 연결을 새 문서로 바꾼다(있으면 지우고 넣는다). 반환은 새 연결 ID.
     * A41(법인카드)이면 문서 첨부 엑셀 `createCardExcel2`도 만든다(AS-IS는 문서 저장 때, TOBE는 문서 ID가 정해지는 이 때).
     * AS-IS는 기존 연결이 둘 이상이면 selectOne 오류, TOBE는 모두 지운다
     */
    @Transactional
    public long insertPersonId(UserPrincipal user, BizRelateApprPersonReq req) throws java.io.IOException {
        for (BizRelateApprRes old : mapper.selectByPersonId(user.getCompanyId(), req.dataYm(), req.linkCode(), user.getUserId())) {
            mapper.deleteById(user.getCompanyId(), old.relateApprId());
        }
        long id = mapper.selectNextId();
        mapper.insertPersonId(id, user.getCompanyId(), req.dataYm(), req.linkCode(), req.apprId(), user.getUserId());
        if ("A41".equals(req.linkCode()) && req.startDate() != null && req.closeDate() != null) {
            cardExcelService.createCardExcel(user, req.apprId(), req.startDate(), req.closeDate(), req.searchText());
        }
        return id;
    }
}
