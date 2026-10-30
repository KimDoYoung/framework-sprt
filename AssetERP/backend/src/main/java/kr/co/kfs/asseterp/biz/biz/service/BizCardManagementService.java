package kr.co.kfs.asseterp.biz.biz.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardCloseReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardCompareRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardManagementPrintReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardManagementRes;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardManagementUpdateReq;
import kr.co.kfs.asseterp.biz.biz.dto.BizCardMessageReq;
import kr.co.kfs.asseterp.biz.biz.mapper.BizCardManagementMapper;
import kr.co.kfs.asseterp.biz.sms.service.SmsSender;
import kr.co.kfs.asseterp.common.dto.PageRes;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * AS-IS Biz01_Tab_CardManagement·Biz01_Edit_Account·Biz01_Lookup_Message·Biz01_Lookup_CardManagementDownload → server/biz/Biz01_Promo.java
 * (selectByPaging L95 / compareCheck L336 / modelUpdate L655 / cardClose L683 / sendMessage L820) + sys.Sys99_Print.insertRdCardManagement L1465
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BizCardManagementService {

    /** AS-IS Sys99_Print.insertRdCardManagement 의 windowClassName */
    private static final String PRINT_WINDOW = "Biz01_Tab_CardManagement";
    private static final String ALL = "%";

    private final BizCardManagementMapper mapper;
    private final SmsSender smsSender;

    /** AS-IS biz.Biz01_Promo.selectByPaging — 건수와 한 쪽을 함께. 관리자 `%`(전체)는 조건 없음 */
    public PageRes<BizCardManagementRes> search(UserPrincipal user, String dataYm, String managerId, String providePurCode,
                                                String searchText, long offset, long limit) {
        Long manager = manager(managerId);
        String purpose = all(providePurCode);
        String text = searchText == null ? "" : searchText;
        return new PageRes<>(mapper.selectTotal(user.getCompanyId(), dataYm, null, null, manager, purpose, text),
                mapper.selectPaging(user.getCompanyId(), dataYm, null, null, manager, purpose, text, offset, limit));
    }

    /** AS-IS LoginUser.getCompanyModel().getCardRealUserYn() — 폼에 실사용자 칸을 보일지 */
    public boolean isCardRealUser(UserPrincipal user) {
        return mapper.selectCardRealUser(user.getCompanyId());
    }

    /** AS-IS crd02_data.selectByCompareAmt — 비어 있으면 업로드 내역과 내역관리가 같다(compareCheck status 0) */
    public List<BizCardCompareRes> compare(UserPrincipal user, String dataYm) {
        return mapper.selectCompare(user.getCompanyId(), dataYm);
    }

    /** AS-IS biz.Biz01_Promo.cardClose — procType P(마감)/C(취소). 실패는 AS-IS 메시지 그대로 */
    @Transactional
    public void close(UserPrincipal user, BizCardCloseReq req) {
        boolean process = "P".equals(req.procType());
        if (!process && !"C".equals(req.procType())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        Long companyId = user.getCompanyId();
        long closed = mapper.countCardClosed(companyId, req.dataYm());
        if (process && closed > 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "법인카드내역이 이미 마감되었습니다. 취소 후 마감 가능합니다.");
        }
        if (!process && closed == 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "아직 마감 전 입니다.");
        }
        if (mapper.countLedgerClosed(companyId, req.dataYm()) > 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "회계마감 되었습니다.");
        }
        if (process && mapper.countWithoutAccount(companyId, req.dataYm(), null, null, null, ALL) > 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "계정과목이 없는 내역이 존재합니다.");
        }
        if (!process && mapper.countWithJournal(companyId, req.dataYm(), null, null, null, ALL) > 0) {
            throw new BusinessException(ErrorCode.INVALID_INPUT, "전표가 존재합니다. 전표삭제 후 취소하세요.");
        }
        mapper.updateCardClose(companyId, req.dataYm(), req.procType());
    }

    /** AS-IS Biz01_Promo.modelUpdate (Biz01_Edit_Account.update) — 저장한 건수 */
    @Transactional
    public int update(UserPrincipal user, Long promoId, BizCardManagementUpdateReq req) {
        return mapper.update(user.getCompanyId(), promoId, req);
    }

    /**
     * AS-IS sys.Sys99_Print.insertRdCardManagement — ① 내 출력 자료 지움 ② 같은 조건의 조회 결과를 새 그룹 ID로 담음. 돌려주는 값 = 그룹 ID(RD 리포트의 rdGroupId)
     */
    @Transactional
    public String insertRd(UserPrincipal user, BizCardManagementPrintReq req) {
        long groupId = mapper.selectNextId();
        mapper.deletePrint(user.getCompanyId(), user.getUserId(), PRINT_WINDOW);
        mapper.insertPrint(user.getCompanyId(), user.getUserId(), PRINT_WINDOW, groupId, null, req.startYm(), req.closeYm(),
                manager(req.managerId()), all(req.providePurCode()), like(req.searchText()));
        return String.valueOf(groupId);
    }

    /**
     * AS-IS biz.Biz01_Promo.sendMessage — 고른 사용자의 휴대폰으로 마감 알림을 보낸다. 휴대폰번호가 없는 사용자는 건너뛴다(원본은 NPE를 삼킴).
     * 발송 연동(SmsSender)이 없으면 SmsSender가 거절한다
     */
    public void sendMessage(UserPrincipal user, BizCardMessageReq req) {
        if (req.personIds() == null || req.personIds().isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT);
        }
        String content = "[Asset-ERP] 법인카드 사용내역 (" + req.dataYm() + ")이 마감되었습니다.";
        for (Long personId : req.personIds()) {
            String phone = mapper.selectMobileTelNo(personId);
            if (phone == null || phone.isBlank()) {
                continue;
            }
            smsSender.send(user.getCompanyId(), null, phone, content, String.valueOf(personId));
        }
    }

    /** 관리자 `%`(전체)는 조건 없음(원본 getManagerId()가 null) */
    private static Long manager(String managerId) {
        String id = all(managerId);
        return ALL.equals(id) ? null : Long.valueOf(id);
    }

    private static String all(String code) {
        return code == null || code.isBlank() ? ALL : code;
    }

    /** 감싸기 전 글자가 비면 조건 없음(null) */
    private static String like(String searchText) {
        return searchText == null ? "" : searchText;
    }
}
