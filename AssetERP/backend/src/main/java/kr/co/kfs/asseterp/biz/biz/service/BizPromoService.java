package kr.co.kfs.asseterp.biz.biz.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizAccountOptionRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizBuyPromoRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizBuyPromoSaveReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardContentsPrintReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardContentsRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizCodeOptionRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizDocClassRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoAccountReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoCardRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoOtherReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoOtherRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoPrintReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoUpdateReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizProvideListPrintReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizProvideListRes;
import kr.co.kfs.asseterp.biz.biz.mapper.BizPersonMapper;
import kr.co.kfs.asseterp.biz.biz.mapper.BizPromoMapper;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import kr.co.kfs.asseterp.common.dto.PageRes;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * AS-IS Biz01_Tab_Card·Biz01_Edit_Card·Biz01_Lookup_CardManagement → server/biz/Biz01_Promo.java
 * (selectByCard L74 / closeCheck L182 / noteUpdate L641 / modelUpdate L655 / updateAccount L774) + sys.Sys99_Print.insertRdCard L3340
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BizPromoService {

    /** AS-IS Sys99_Print.insertRdCard 의 windowClassName */
    private static final String PRINT_WINDOW = "Biz01_Tab_Card";
    /** 법인카드 사용내역 조회(L04)의 windowClassName — 출력·엑셀이 같은 값 */
    private static final String CONTENTS_WINDOW = "Biz01_Tab_CardContents";
    /** 이익제공 상세현황(L08)의 windowClassName */
    private static final String PROVIDE_LIST_WINDOW = "Biz01_Tab_PriorApproval";

    private final BizPromoMapper mapper;
    private final BizPersonMapper personMapper;

    /** AS-IS selectByCard(companyId, personId = LoginUser) — searchText는 클라이언트가 "%…%"로 감싸 보낸다 */
    public List<BizPromoCardRes> searchByCard(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String searchText) {
        return mapper.selectByCard(user.getCompanyId(), user.getUserId(), startDate, closeDate, like(searchText));
    }

    /** AS-IS closeCheck — 마감된 내역이 하나라도 있으면 true(status -1) */
    public boolean hasClosed(UserPrincipal user, List<Long> promoIds) {
        if (promoIds == null || promoIds.isEmpty()) {
            return false;
        }
        return mapper.countClosed(user.getCompanyId(), promoIds) > 0;
    }

    /** AS-IS Biz01_Promo.modelUpdate (Biz01_Edit_Card.update) */
    @Transactional
    public int update(UserPrincipal user, Long promoId, BizPromoUpdateReq req) {
        return mapper.update(user.getCompanyId(), promoId, req);
    }

    /** AS-IS Biz01_Promo.noteUpdate — 마감된 내역은 비고만 */
    @Transactional
    public int updateNote(UserPrincipal user, Long promoId, String note) {
        return mapper.updateNote(user.getCompanyId(), promoId, note);
    }

    /** AS-IS Biz01_Promo.updateAccount — 고른 내역마다(menuName이 Biz01_Tab_Card면 과세구분 없이). 저장한 건수 */
    @Transactional
    public int updateAccount(UserPrincipal user, BizPromoAccountReq req) {
        int count = 0;
        for (Long promoId : req.promoIds()) {
            count += req.withTax()
                    ? mapper.updateAccountWithTax(user.getCompanyId(), promoId, req.providePurCode(), req.provideContentCode(), req.accountId(), req.taxType(), req.note())
                    : mapper.updateAccount(user.getCompanyId(), promoId, req.providePurCode(), req.provideContentCode(), req.accountId(), req.note());
        }
        return count;
    }

    /** AS-IS sys.Sys00_Common.selectByProvideContentCode */
    public List<BizAccountOptionRes> searchProvideAccounts(UserPrincipal user, String provideContentCode) {
        return mapper.selectProvideAccounts(user.getCompanyId(), provideContentCode);
    }

    /** AS-IS dcr.Dcr30_Link.selectByLinkCode — 한 건이 아니면 없음(null) */
    public BizDocClassRes getDocClass(UserPrincipal user, String linkCode) {
        List<BizDocClassRes> list = mapper.selectDocClassByLinkCode(user.getCompanyId(), linkCode);
        return list.size() == 1 ? list.get(0) : null;
    }

    /**
     * AS-IS sys.Sys99_Print.insertRdCard — ① 내 출력 자료 지움 ② 같은 조건의 조회 결과를 새 그룹 ID로 담음. 돌려주는 값 = 그룹 ID(RD 리포트의 rdGroupId)
     */
    @Transactional
    public String insertRdCard(UserPrincipal user, BizPromoPrintReq req) {
        Long companyId = user.getCompanyId();
        Long personId = user.getUserId();
        long groupId = mapper.selectNextId();

        mapper.deletePrint(companyId, personId, PRINT_WINDOW);

        for (BizPromoCardRes row : mapper.selectByCard(companyId, personId, req.startDate(), req.closeDate(), like(req.searchText()))) {
            mapper.insertPrintCard(mapper.selectNextId(), companyId, personId, PRINT_WINDOW, groupId, row);
        }
        return String.valueOf(groupId);
    }

    /** AS-IS biz.Biz01_Promo.selectByOther(companyId, personId = LoginUser) — 구분이 없으면 전체(%) */
    public List<BizPromoOtherRes> searchByOther(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String provideRcvType) {
        String type = provideRcvType == null || provideRcvType.isBlank() ? "%" : provideRcvType;
        return mapper.selectByOther(user.getCompanyId(), user.getUserId(), startDate, closeDate, type);
    }

    /** AS-IS Biz01_Promo.modelUpdate (새 행 INSERT) — 정산구분 2(현예금)·등록자·회사는 서버가 넣는다. 돌려주는 값 = 내역 ID */
    @Transactional
    public Long createOther(UserPrincipal user, BizPromoOtherReq req) {
        long promoId = mapper.selectNextId();
        mapper.insertOther(promoId, user.getCompanyId(), user.getUserId(), req);
        return promoId;
    }

    /** AS-IS Biz01_Promo.modelUpdate (UPDATE) — 마감 검사 없음(원본에 없다) */
    @Transactional
    public int updateOther(UserPrincipal user, Long promoId, BizPromoOtherReq req) {
        return mapper.updateOther(user.getCompanyId(), promoId, req);
    }

    /** AS-IS Biz01_Promo.delete — 내역마다 인원(biz02_person.delete)을 먼저 지우고 내역을 지운다. 지운 내역 수 */
    @Transactional
    public int deleteOthers(UserPrincipal user, List<Long> promoIds) {
        if (promoIds == null || promoIds.isEmpty()) {
            return 0;
        }
        mapper.deletePersonsByPromoIds(user.getCompanyId(), promoIds);
        return mapper.deletePromos(user.getCompanyId(), promoIds);
    }

    /** AS-IS biz.Biz01_Promo.selectByBuyId(companyId, buyId) — Bmt01_Tab_Buy 아래 목록 */
    public List<BizBuyPromoRes> searchByBuyId(UserPrincipal user, Long buyId) {
        return mapper.selectByBuyId(user.getCompanyId(), buyId);
    }

    /**
     * AS-IS biz.Biz01_Promo.updateAdd — 행마다 거래상대방(biz02_person, 직원 아님)을 없으면 넣고 있으면 이름을 바꾼 뒤
     * 내역(UpdateDataModel)을 저장한다. 새 행(ID ≤ 0)은 서버가 번호를 정한다(원본은 클라이언트가 getSeq로 받아 둔다).
     * 새 행의 내역은 사람보다 먼저 넣는다(원본은 사람이 먼저지만 FK가 없어 결과가 같다). 요청 순서로 다시 읽어 돌려준다
     */
    @Transactional
    public List<BizBuyPromoRes> saveBuyPromos(UserPrincipal user, List<BizBuyPromoSaveReq> rows) {
        List<BizBuyPromoRes> result = new ArrayList<>();
        for (BizBuyPromoSaveReq req : rows) {
            long promoId;
            if (req.promoId() == null || req.promoId() <= 0) {
                promoId = mapper.selectNextId();
                mapper.insertBuyPromo(promoId, user.getCompanyId(), user.getUserId(), req);
            } else {
                promoId = req.promoId();
                if (mapper.updateBuyPromo(user.getCompanyId(), promoId, req) == 0) {
                    throw new BusinessException(ErrorCode.DATA_NOT_FOUND);
                }
            }
            if (personMapper.selectByExternal(user.getCompanyId(), promoId).isEmpty()) {
                personMapper.insertExternal(personMapper.selectNextId(), promoId, req.targetCompanyName(), req.targetEmpName());
            } else {
                personMapper.updateExternal(promoId, req.targetCompanyName(), req.targetEmpName());
            }
            result.add(mapper.selectBuyPromoById(user.getCompanyId(), promoId));
        }
        return result;
    }

    /** AS-IS sys.Sys09_Code.selectByKindCode(ProvidePurCode, 제공(수령)구분 코드%) */
    public List<BizCodeOptionRes> searchProvidePurposes(String rcvType) {
        return mapper.selectProvidePurposes(rcvType + "%");
    }

    /** AS-IS biz.Biz01_Promo.selectCardContentsPaging(Biz01_Tab_CardContents) — 건수와 한 쪽을 함께 */
    public PageRes<BizCardContentsRes> searchCardContents(UserPrincipal user, String dataYm, String managerId, String providePurCode,
                                                          String searchText, long offset, long limit) {
        String manager = all(managerId);
        String purpose = all(providePurCode);
        String text = like(searchText);
        return new PageRes<>(mapper.selectCardContentsTotal(user.getCompanyId(), dataYm, manager, purpose, text),
                mapper.selectCardContentsPaging(user.getCompanyId(), dataYm, manager, purpose, text, offset, limit));
    }

    /** AS-IS biz.Biz01_Promo.selectByAmt — 관리자가 전체(`%`)면 관리자 조건 없음(원본 getManagerId()가 null) */
    public long getCardContentsAmount(UserPrincipal user, String dataYm, String managerId, String providePurCode, String searchText) {
        String manager = all(managerId);
        Long managerNo = "%".equals(manager) ? null : Long.valueOf(manager);
        return mapper.selectCardContentsAmount(user.getCompanyId(), dataYm, managerNo, all(providePurCode), searchText == null ? "" : searchText);
    }

    /** AS-IS sys.Sys00_Common.selectBizCardManager — "전체"는 화면이 붙인다 */
    public List<BizCodeOptionRes> searchCardManagers(UserPrincipal user, String stdYm) {
        return mapper.selectCardManagers(user.getCompanyId(), stdYm);
    }

    /** AS-IS sys.Sys99_Print.insertRdCardContents — ① 내 출력 자료 지움 ② 같은 조건의 조회 결과를 새 그룹 ID로 담음. 돌려주는 값 = 그룹 ID */
    @Transactional
    public String insertRdCardContents(UserPrincipal user, BizCardContentsPrintReq req) {
        long groupId = mapper.selectNextId();
        mapper.deletePrint(user.getCompanyId(), user.getUserId(), CONTENTS_WINDOW);
        mapper.insertPrintCardContents(user.getCompanyId(), user.getUserId(), CONTENTS_WINDOW, groupId,
                req.dataYm(), all(req.managerId()), all(req.providePurCode()), like(req.searchText()));
        return String.valueOf(groupId);
    }

    /** AS-IS sys.Sys99_Print.insertRdCardContentsDownload — 엑셀용(거래상대방 열 포함) */
    @Transactional
    public String insertRdCardContentsDownload(UserPrincipal user, BizCardContentsPrintReq req) {
        long groupId = mapper.selectNextId();
        mapper.deletePrint(user.getCompanyId(), user.getUserId(), CONTENTS_WINDOW);
        mapper.insertPrintCardContentsDownload(user.getCompanyId(), user.getUserId(), CONTENTS_WINDOW, groupId,
                req.dataYm(), all(req.managerId()), all(req.providePurCode()), like(req.searchText()));
        return String.valueOf(groupId);
    }

    /** AS-IS biz.Biz01_Promo.selectProvideList(Biz01_Tab_PriorApproval) — 제공/수령 구분 `1`·`2`, 거래상대방 전체는 `%`, 제공(수령)자 empId는 없으면 조건 없음 */
    public List<BizProvideListRes> searchProvideList(UserPrincipal user, LocalDate startDate, LocalDate endDate,
                                                     String provideRcvType, String crmName, Long empId) {
        return mapper.selectProvideList(user.getCompanyId(), startDate, endDate, all(provideRcvType), all(crmName), empId);
    }

    /** AS-IS sys.Sys99_Print.insertRdProvideList — ① 내 출력 자료 지움 ② 같은 조건의 조회 결과를 새 그룹 ID로 담음. 돌려주는 값 = 그룹 ID */
    @Transactional
    public String insertRdProvideList(UserPrincipal user, BizProvideListPrintReq req) {
        long groupId = mapper.selectNextId();
        mapper.deletePrint(user.getCompanyId(), user.getUserId(), PROVIDE_LIST_WINDOW);
        mapper.insertPrintProvideList(user.getCompanyId(), user.getUserId(), PROVIDE_LIST_WINDOW, groupId,
                req.startDate(), req.endDate(), all(req.provideRcvType()), all(req.crmName()), req.empId());
        return String.valueOf(groupId);
    }

    /** 콤보의 "전체" = `%` (비어 있어도 전체) */
    private static String all(String code) {
        return code == null || code.isBlank() ? "%" : code;
    }

    private static String like(String searchText) {
        return "%" + (searchText == null ? "" : searchText) + "%";
    }
}
