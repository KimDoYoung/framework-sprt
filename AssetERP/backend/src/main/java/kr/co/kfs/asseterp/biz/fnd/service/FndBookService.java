package kr.co.kfs.asseterp.biz.fnd.service;

import kr.co.kfs.asseterp.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.biz.emp.service.EmpTransInfoService;
import kr.co.kfs.asseterp.biz.fnd.dto.BookRelateAstRes;
import kr.co.kfs.asseterp.biz.fnd.dto.BookRelateFndRes;
import kr.co.kfs.asseterp.biz.fnd.mapper.FndBookMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/fnd/Fnd10_Book.java (P09·P10 펀드별 운용자산) */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FndBookService {

    private final FndBookMapper mapper;
    private final EmpTransInfoService transInfoService;

    /** AS-IS selectByRelateAst L22 (P09). 회사는 로그인 회사 */
    public List<BookRelateAstRes> searchRelateAst(UserPrincipal user, Long fundCodeId, LocalDate stdDate) {
        return mapper.selectByRelateAst(user.getCompanyId(), fundCodeId, stdDate);
    }

    /** AS-IS selectByRelateFnd L28 (P10). 조직은 LoginUser.getOrgCodeId() — 회사관리자(userId < 0)는 0 */
    public List<BookRelateFndRes> searchRelateFnd(UserPrincipal user, Long astClassTreeId, LocalDate stdDate) {
        Long orgId = user.getUserId() < 0 ? 0L : transInfoService.getCurrentTransInfo(user, user.getUserId()).orgCodeId();
        return mapper.selectByRelateFnd(user.getCompanyId(), orgId, astClassTreeId, stdDate);
    }
}
