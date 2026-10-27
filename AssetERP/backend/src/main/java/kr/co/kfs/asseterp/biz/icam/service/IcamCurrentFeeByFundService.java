package kr.co.kfs.asseterp.biz.icam.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icam.dto.CurrentFeeByFundPrintReq;
import kr.co.kfs.asseterp.biz.icam.dto.CurrentFeeByFundRes;
import kr.co.kfs.asseterp.biz.icam.mapper.IcamCurrentFeeByFundMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcamCurrentFeeByFundService {

    private static final String WINDOW_CLASS_NAME = "%Icam10%";

    private final IcamCurrentFeeByFundMapper mapper;

    /** AS-IS icam.Icam10_Fee.getCurrentFeeByFund L45 */
    public List<CurrentFeeByFundRes> search(UserPrincipal user, String yearText, String preYearText) {
        String preYear = resolvePreYear(yearText, preYearText);
        return mapper.selectCurrentFeeByFund(user.getCompanyId(), yearText, preYear);
    }

    /**
     * AS-IS sys.Sys99_Print.insertRdCurrentFeeByFund L4984
     * ① 내 출력 자료 정리 ② 같은 조건 조회 결과를 sys99_print에 삽입 ③ 새 groupId 반환
     */
    @Transactional
    public String insertRdCurrentFeeByFund(UserPrincipal user, CurrentFeeByFundPrintReq req) {
        String preYear = resolvePreYear(req.yearText(), req.preYearText());
        long groupId = mapper.selectNextId();
        mapper.deletePrint(user.getCompanyId(), user.getUserId(), WINDOW_CLASS_NAME);
        mapper.insertPrintCurrentFeeByFund(user.getCompanyId(), user.getUserId(), WINDOW_CLASS_NAME, groupId, req.yearText(), preYear);
        return String.valueOf(groupId);
    }

    private String resolvePreYear(String yearText, String preYearText) {
        if (preYearText != null && !preYearText.isBlank()) {
            return preYearText;
        }
        if (yearText != null && !yearText.isBlank()) {
            try {
                return String.valueOf(Integer.parseInt(yearText.trim()) - 1);
            } catch (NumberFormatException ignored) {
            }
        }
        return "";
    }
}
