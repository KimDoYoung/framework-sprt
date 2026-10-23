package kr.co.kfs.asseterp.biz.biz.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizAccountOptionRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizDocClassRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoAccountReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoCardRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoPrintReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizPromoUpdateReq;
import kr.co.kfs.asseterp.biz.biz.mapper.BizPromoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
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

    private final BizPromoMapper mapper;

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

    private static String like(String searchText) {
        return "%" + (searchText == null ? "" : searchText) + "%";
    }
}
