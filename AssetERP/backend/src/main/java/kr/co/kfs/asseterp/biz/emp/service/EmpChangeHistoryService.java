package kr.co.kfs.asseterp.biz.emp.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.dto.ChangeHistoryLicenseRes;
import kr.co.kfs.asseterp.biz.emp.dto.ChangeHistoryPrintReq;
import kr.co.kfs.asseterp.biz.emp.dto.ChangeHistoryRewardRes;
import kr.co.kfs.asseterp.biz.emp.dto.ChangeHistoryTransRes;
import kr.co.kfs.asseterp.biz.emp.mapper.EmpChangeHistoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** 사원정보 변경조회 (AS-IS Emp00_Tab_ChangeHistory → emp.Emp03_Trans·Emp08_License·Emp11_Reward.selectByHistory, sys.Sys99_Print.insertRdEmp03/08/11History) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmpChangeHistoryService {

    /** AS-IS 가 windowClassName 으로 "%" + "Emp00" + "%" 를 지우기(LIKE)와 넣기에 그대로 쓴다 */
    private static final String WINDOW_CLASS_NAME = "%Emp00%";
    /** 자격사항 [전체] 의 transCode (AS-IS retrieve02 L370, 출력은 transCode 를 안 보내 같은 가지를 탄다) */
    private static final String TRANS_CODE_ALL = "000";

    private final EmpChangeHistoryMapper mapper;

    /** AS-IS emp.Emp03_Trans.selectByHistory — empTransCode 가 비면 전체 */
    public List<ChangeHistoryTransRes> searchTrans(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String searchText, String empTransCode) {
        return mapper.selectTransHistory(user.getCompanyId(), startDate, closeDate, like(searchText), blankToNull(empTransCode));
    }

    /** AS-IS emp.Emp08_License.selectByHistory */
    public List<ChangeHistoryLicenseRes> searchLicenses(UserPrincipal user, LocalDate startDate, String searchText, String transCode) {
        return mapper.selectLicenseHistory(user.getCompanyId(), startDate, like(searchText), blankToDefault(transCode));
    }

    /** AS-IS emp.Emp11_Reward.selectByHistory */
    public List<ChangeHistoryRewardRes> searchRewards(UserPrincipal user, LocalDate startDate, LocalDate closeDate, String searchText) {
        return mapper.selectRewardHistory(user.getCompanyId(), startDate, closeDate, like(searchText));
    }

    /** AS-IS sys.Sys99_Print.insertRdEmp03History L4779: ① 내 출력 자료 정리 ② 같은 조건 조회 결과를 sys99_print 에 삽입 ③ 새 groupId 반환 */
    @Transactional
    public String insertRdTrans(UserPrincipal user, ChangeHistoryPrintReq req) {
        long groupId = mapper.selectNextId();
        mapper.deletePrint(user.getCompanyId(), user.getUserId(), WINDOW_CLASS_NAME);
        mapper.insertPrintTrans(user.getCompanyId(), user.getUserId(), WINDOW_CLASS_NAME, groupId,
                req.startDate(), req.closeDate(), like(req.searchText()), blankToNull(req.empTransCode()));
        return String.valueOf(groupId);
    }

    /** AS-IS sys.Sys99_Print.insertRdEmp08History L4847 (기준일·검색어만 받는다 — 재직구분은 넘기지 않아 전체) */
    @Transactional
    public String insertRdLicense(UserPrincipal user, ChangeHistoryPrintReq req) {
        long groupId = mapper.selectNextId();
        mapper.deletePrint(user.getCompanyId(), user.getUserId(), WINDOW_CLASS_NAME);
        mapper.insertPrintLicense(user.getCompanyId(), user.getUserId(), WINDOW_CLASS_NAME, groupId,
                req.startDate(), like(req.searchText()), TRANS_CODE_ALL);
        return String.valueOf(groupId);
    }

    /** AS-IS sys.Sys99_Print.insertRdEmp11History L4897 */
    @Transactional
    public String insertRdReward(UserPrincipal user, ChangeHistoryPrintReq req) {
        long groupId = mapper.selectNextId();
        mapper.deletePrint(user.getCompanyId(), user.getUserId(), WINDOW_CLASS_NAME);
        mapper.insertPrintReward(user.getCompanyId(), user.getUserId(), WINDOW_CLASS_NAME, groupId,
                req.startDate(), req.closeDate(), like(req.searchText()));
        return String.valueOf(groupId);
    }

    private static String like(String text) {
        return "%" + (text == null ? "" : text) + "%";
    }

    private static String blankToNull(String s) {
        return s == null || s.isBlank() ? null : s;
    }

    private static String blankToDefault(String s) {
        return s == null || s.isBlank() ? TRANS_CODE_ALL : s;
    }
}
