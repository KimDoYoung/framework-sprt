package kr.co.kfs.asseterp.biz.icam.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.icam.dto.FundPricePrintReq;
import kr.co.kfs.asseterp.biz.icam.dto.FundPriceRes;
import kr.co.kfs.asseterp.biz.icam.mapper.IcamFundPriceMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IcamFundPriceService {

    private static final String WINDOW_CLASS_NAME = "Icam01";

    private final IcamFundPriceMapper mapper;

    /** AS-IS icam.Icam06_FundBook.selectIcamFundPrice L26 */
    public List<FundPriceRes> search(UserPrincipal user, LocalDate stdDate) {
        return mapper.selectFundPrice(user.getCompanyId(), stdDate);
    }

    /**
     * AS-IS sys.Sys99_Print.insertRdFundPrice L5056
     * ① 내 출력 자료 정리 ② 같은 조건 조회 결과를 sys99_print에 삽입 ③ 새 groupId 반환
     */
    @Transactional
    public String insertRdFundPrice(UserPrincipal user, FundPricePrintReq req) {
        long groupId = mapper.selectNextId();
        mapper.deletePrint(user.getCompanyId(), user.getUserId(), WINDOW_CLASS_NAME);
        mapper.insertPrintFundPrice(user.getCompanyId(), user.getUserId(), WINDOW_CLASS_NAME, groupId, req.stdDate());
        return String.valueOf(groupId);
    }
}
